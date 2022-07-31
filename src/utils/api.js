function getBaseUrl() {
  return window.__wooclap.API_BASE_URL;
}

function getToken() {
  return window.__wooclap.authToken;
}

function getAuthHeader() {
  return { Authorization: `bearer ${getToken()}` };
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
    headers: { ...getAuthHeader() },
  });

  if (res.status >= 400) {
    return false;
  }

  return await res.json();
}

export async function pushAnswer(questionId, payload) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}api/questions/${questionId}/push_answer`;
  const res = await fetch(url, {
    method: "POST",
    headers: { ...getAuthHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return await res.json();
}
