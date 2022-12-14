import { Realtime } from "ably";

export default class SocketController {
  constructor() {
    //This array contains all the events we're currently listening to
    this.subscribeEvents = [];

    //This object contains the number of active objects listening to that event
    this.subscribeEventsCounts = {};

    this.connected = false;

    const { clientConfig } = window.__wooclap;

    this.socket = new Realtime({
      key: clientConfig.ablyKey,
      tls: true,
      transports: ["web_socket"],
    });

    this.encryptionKey = clientConfig.ablyEncryptionKey;
    this.encryptionKeyLength = clientConfig.ablyEncryptionKeyLength;
    this.encryptionAlgorithm = clientConfig.ablyEncryptionAlgorithm;
    this.encryptionMode = clientConfig.ablyEncryptionMode;

    this.socket.connection.on("connected", () => {
      this.connected = true;

      if (!this.reconnected) {
        this.reconnected = true;
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  base64ToCharCodeArray(base64) {
    // Note: Base64 character set sorted by index in encoding
    const base64CharSet =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    return (
      base64
        // Note: Remove "=" padding
        .replace(/(==?)$/, "")
        // Note: Split into array of base64 characters
        .split("")
        .map((char) =>
          // Note: Convert base64 character to 6 bit 0-padded binary strings
          `${new Array(6).fill("0").join("")}${base64CharSet
            .indexOf(char)
            .toString(2)}`.slice(-6)
        )
        // Note: Concatenate into a single binary string
        .join("")
        // Note: Split into 8 bit (1 byte) chunks
        .match(/[01]{8}/g)
        // Note: Map unsigned integer based on byte value
        .map((byte) => parseInt(byte, 2))
    );
  }

  // eslint-disable-next-line class-methods-use-this
  charCodeArrayToBase64(charCodeArray) {
    // Note: Base64 character set sorted by index in encoding
    const base64CharSet =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    return (
      charCodeArray
        // Note: Convert unsigned integers to 8 bit 0-padded binary strings
        .map((charCode) => `00000000${charCode.toString(2)}`.slice(-8))
        // Note: Base64 has a character set of 64 = 2^6 = 6 bits of information
        // Note: Add 0-padding to make the string length be a multiple of 6
        .concat(
          new Array(
            (charCodeArray.length * 8) % 6 > 0
              ? 6 - ((charCodeArray.length * 8) % 6)
              : 0
          ).fill("0")
        )
        // Note: Concatenate into a single binary string
        .join("")
        // Note: Split into 6 bit chunks
        .match(/[01]{6}/g)
        // Note: Map base64 character based on the numeric value of the 6 bits
        .map((byte) => base64CharSet[parseInt(byte, 2)])
        // Note: 24 is a common multiple of 6 (4 * 6 = 24) and 8 (3 * 8 = 24)
        // Note: 6 being the number of bits represented by a base64 character
        // Note: 8 being the number of bits in a byte
        // Note: Add "=" padding to make the string length be a multiple of 24 bits (4 chars)
        .concat(
          new Array(
            Math.ceil((charCodeArray.length * 8) / 6) % 4 > 0
              ? 4 - (Math.ceil((charCodeArray.length * 8) / 6) % 4)
              : 0
          ).fill("=")
        )
        // Note: Concatenate into a single base64 string
        .join("")
    );
  }

  getChannel(channelId) {
    return this.socket.channels.get(channelId, {
      cipher: {
        key: this.charCodeArrayToBase64(
          this.base64ToCharCodeArray(this.encryptionKey).map(
            // Note: XOR char code of the channelId with the numeric
            // value of the secret key byte in the same position
            // eslint-disable-next-line no-bitwise
            (byte, i) => (channelId[i] || "0").charCodeAt(0) ^ byte
          )
        ).slice(
          0,
          // Note: Slice buffer to key length size converted from bits to base64 chars (6 bits each)
          // Note: Base64 strings are padded to be a multiple of 4 bytes
          // Note: m = encryption key length in bits
          // Note: n = (m bits / 8 bits), to get a byte length
          // Note: o = CEIL(n bytes / 3 bytes), minimum amount of 24 bit chunks
          // Note: p = o * 4, round back to multiple of 4 chars (24 bits)
          Math.ceil(this.encryptionKeyLength / 8 / 3) * 4
        ),
        algorithm: this.encryptionAlgorithm,
        keyLength: this.encryptionKeyLength,
        mode: this.encryptionMode,
      },
    });
  }

  subscribeToEvent(eventId, callback) {
    //Only subscribe to the channel if we're not currently listening to it
    if (!this.subscribeEvents.includes(eventId)) {
      this.getChannel(eventId).subscribe(
        ({ data: { messageType, modelId, modelName, payload } }) => {
          const name = `${messageType}:${modelName}:${modelId}`;
          callback(name, payload);
        }
      );

      this.subscribeEvents = [...this.subscribeEvents, eventId];
    }

    //One more active listener
    this.subscribeEventsCounts[eventId] =
      (this.subscribeEventsCounts[eventId] || 0) + 1;
  }

  unsubscribeFromEvent(eventId, model) {
    if (!eventId) {
      console.error(`No event id for ${model.modelName}-${model.getId()}`); //eslint-disable-line no-console
    }

    //One less active listener
    this.subscribeEventsCounts[eventId] =
      (this.subscribeEventsCounts[eventId] || 0) - 1;

    //If there are no more active listeners, unsubscribe from channel
    if (this.subscribeEventsCounts[eventId] === 0) {
      this.getChannel(eventId).unsubscribe();

      this.subscribeEvents = this.subscribeEvents.filter(
        (id) => id !== eventId
      );
    }
  }

  close() {
    return this.socket.close();
  }
}
