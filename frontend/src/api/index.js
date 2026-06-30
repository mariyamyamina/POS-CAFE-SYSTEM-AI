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

// ── Token-refresh state ───────────────────────────────────────────────────────
// Prevents multiple simultaneous refresh calls (only one in-flight at a time).
let _refreshPromise = null;

const _doRefresh = async () => {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    // Refresh token itself has expired — force logout
    clearSession();
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  const data = await response.json();
  // Save only the new access token (refresh token stays the same)
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, data.access_token);
  return data.access_token;
};

const refreshAccessToken = () => {
  if (!_refreshPromise) {
    _refreshPromise = _doRefresh().finally(() => {
      _refreshPromise = null;
    });
  }
  return _refreshPromise;
};

// ── Core request function ─────────────────────────────────────────────────────
const request = async (path, { method = 'GET', body, headers = {}, auth = true, _retry = false } = {}) => {
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

  // ── Auto-refresh on 401 ───────────────────────────────────────────────────
  // If the access token is expired, transparently refresh it and retry once.
  if (response.status === 401 && auth && !_retry) {
    try {
      await refreshAccessToken();
      // Retry the original request with the new token
      return request(path, { method, body, headers, auth, _retry: true });
    } catch {
      // Refresh failed — clearSession already called inside _doRefresh
      throw new Error('Session expired. Please log in again.');
    }
  }

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

export const rolesApi = {
  getRoles: () => request('/auth/roles'),
  createRole: (payload) => request('/auth/roles', { method: 'POST', body: payload }),
  updateRole: (roleId, payload) => request(`/auth/roles/${roleId}`, { method: 'PUT', body: payload }),
  deleteRole: (roleId) => request(`/auth/roles/${roleId}`, { method: 'DELETE' }),
};

export const settingsApi = {
  getSettings: () => request('/api/settings'),
  updateSettings: (payload) => request('/api/settings', { method: 'PUT', body: payload }),
};

export const categoriesApi = {
  getCategories: () => request('/api/categories'),
  getCategory: (categoryId) => request(`/api/categories/${categoryId}`),
  createCategory: (payload) => request('/api/categories', { method: 'POST', body: payload }),
  updateCategory: (categoryId, payload) => request(`/api/categories/${categoryId}`, { method: 'PUT', body: payload }),
  deleteCategory: (categoryId) => request(`/api/categories/${categoryId}`, { method: 'DELETE' }),
};

// Builds a FormData payload from a plain fields object.
// Skips undefined/null values so partial updates don't overwrite existing
// backend values with empty strings. Used because inventory create/update
// sends an optional image file alongside regular fields (multipart, not JSON).
const buildInventoryFormData = (fields = {}, imageFile) => {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    formData.append(key, value);
  });

  if (imageFile) {
    formData.append('image', imageFile);
  }

  return formData;
};

export const inventoryApi = {
  getItems: () => request('/api/inventory'),
  getItem: (itemId) => request(`/api/inventory/${itemId}`),
  createItem: (fields, imageFile) =>
    request('/api/inventory', { method: 'POST', body: buildInventoryFormData(fields, imageFile) }),
  updateItem: (itemId, fields, imageFile) =>
    request(`/api/inventory/${itemId}`, { method: 'PUT', body: buildInventoryFormData(fields, imageFile) }),
  deleteItem: (itemId) => request(`/api/inventory/${itemId}`, { method: 'DELETE' }),
};

export { API_BASE_URL, getStoredToken, getStoredRefreshToken, getStoredUser, saveSession, clearSession, request };
export default request;

// ── Append this block to api/index.js, right after inventoryApi ──

export const salesApi = {
  createSale: (payload) => request('/api/sales', { method: 'POST', body: payload }),
  getSale: (saleId) => request(`/api/sales/${saleId}`),
  getSales: () => request('/api/sales'),
  // params: { date_from, date_to, item_name } — all optional, passed as query string
  getSalesReport: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    return request(`/api/sales-report${query ? `?${query}` : ''}`);
  },
};

export const dashboardApi = {
  getDashboardData: () => request('/api/dashboard'),
};


export const itemRequestApi = {
  getRequests: () => request('/api/item-requests'),
  getRequest: (requestId) => request(`/api/item-requests/${requestId}`),
  saveRequest: (payload) =>
    request('/api/item-requests/save', {
      method: 'POST',
      body: payload,
    }),
  submitRequest: (payload) =>
    request('/api/item-requests/submit', {
      method: 'POST',
      body: payload,
    }),
  updateRequest: (requestId, payload) =>
    request(`/api/item-requests/${requestId}`, {
      method: 'PUT',
      body: payload,
    }),
  deleteRequest: (requestId) =>
    request(`/api/item-requests/${requestId}`, {
      method: 'DELETE',
    }),
    receiveRequest(id) {
    return request(`/item-requests/${id}/receive`, {
        method: "PUT",
    });
},
};
