const SESSION_KEY = "session";

export function loadSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
