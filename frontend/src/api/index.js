const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const ACCESS_TOKEN_STORAGE_KEY = 'pos_cafe_access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'pos_cafe_refresh_token';
const USER_STORAGE_KEY = 'pos_cafe_user';

const getStoredToken = () => localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
const getStoredRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
const getStoredUser = () => {
  const rawUser = localStorage.getItem(USER_STORAGE_KEY);
  return rawUser ? JSON.parse(rawUser) : null;
};

const saveSession = (payload = {}) => {
  if (payload.access_token) {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, payload.access_token);
  }

  if (payload.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, payload.refresh_token);
  }

  if (payload.user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(payload.user));
  }
};

const clearSession = () => {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};

const request = async (path, { method = 'GET', body, headers = {}, auth = true } = {}) => {
  const requestHeaders = { ...headers };

  if (body && typeof body !== 'string' && !(body instanceof FormData) && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getStoredToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body && typeof body !== 'string' && !(body instanceof FormData) ? JSON.stringify(body) : body,
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text();

  if (!response.ok) {
    throw new Error(payload?.detail || payload?.message || 'Request failed');
  }

  return payload;
};

export const authApi = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  getMe: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),
  refresh: (refreshToken) => request('/auth/refresh', {
    method: 'POST',
    body: { refresh_token: refreshToken },
  }),
  getUsers: () => request('/auth/users'),
  createUser: (payload) => request('/auth/users', { method: 'POST', body: payload }),
  updateUser: (userId, payload) => request(`/auth/users/${userId}`, { method: 'PUT', body: payload }),
  deleteUser: (userId) => request(`/auth/users/${userId}`, { method: 'DELETE' }),
};

export { API_BASE_URL, getStoredToken, getStoredRefreshToken, getStoredUser, saveSession, clearSession, request };
export default request;
