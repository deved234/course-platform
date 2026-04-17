// TODO: replace with httpOnly cookie set by the backend in production

const TOKEN_KEY = "cp_token";
const USER_KEY = "cp_user";
const COOKIE_NAME = "cp_token";
const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 7;

function setSessionCookie(token) {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(token);
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE_SEC}; SameSite=Lax`;
}

function clearSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

export function saveAuth(token, user) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  setSessionCookie(token);
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  clearSessionCookie();
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getRole() {
  const user = getUser();
  return user?.role ?? null;
}

export function isLoggedIn() {
  return Boolean(getToken());
}
