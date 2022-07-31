# miniclap

🪶 A lightweight clone of the [Wooclap](https://app.wooclap.com/public) participant experience, by Tchap

💔 Very WIP

👀 Available at:
https://miniclap.vercel.app (currently broken)

## How to run?

It's not so easy because the Wooclap API is protected by 👹 CORS 👹 ... 🙀.

So you need to run Wooclap locally on the same domain (localhost).
You can also hack your local Wooclap to allow certain domains, such as

```javascript
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://your-domain.tchap");
  res.header("Access-Control-Allow-Headers", "Authorization");
  next();
});
```

All of these options assume you have access to the private Wooclap repo 🤐
