function getBaseUrl() {
  return window.__wooclap.API_BASE_URL;
}

function getToken() {
  return window.__wooclap.authToken;
}

export async function getConfig() {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}api/config`;
  const res = await fetch(url);

  if (res.status >= 400) {
    alert(`Could not load config from ${baseUrl}`);
  }

  return await res.json();
}

export async function getEvent(eventCode) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}api/events/${eventCode}?isParticipant=true`;
  const res = await fetch(url, {
    headers: { Authorization: `bearer ${getToken()}` },
  });

  if (res.status >= 400) {
    return false;
  }

  return await res.json();
}
