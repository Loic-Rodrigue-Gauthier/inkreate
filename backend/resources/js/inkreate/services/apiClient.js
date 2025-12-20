const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const API_BASE_URL = RAW_API_URL.replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export async function apiFetch(path, options = {}) {
  const { method = 'GET', body, params, token, headers: customHeaders = {} } = options;

  const url = new URL(path, API_BASE_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || value === 'any') return;
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined && item !== null && item !== '') url.searchParams.append(key, item);
        });
        return;
      }
      url.searchParams.append(key, value);
    });
  }

  const headers = new Headers(customHeaders);
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');

  let payload = body;
  if (body !== undefined && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
    payload = JSON.stringify(body);
  }

  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(url, { method, headers, body: payload });
  const contentType = response.headers.get('content-type') || '';
  const responseBody = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (typeof responseBody === 'object' && responseBody !== null && responseBody.message) ||
      extractFirstError(responseBody) ||
      'An error occurred. Please try again.';

    throw new ApiError(message, response.status, responseBody);
  }

  return responseBody;
}

function extractFirstError(payload) {
  if (typeof payload !== 'object' || payload === null) return typeof payload === 'string' ? payload : null;
  if (payload.errors) {
    const firstKey = Object.keys(payload.errors)[0];
    if (firstKey && payload.errors[firstKey]?.length) return payload.errors[firstKey][0];
  }
  if (payload.message) return payload.message;
  return null;
}

export const resourceData = (payload) =>
  Array.isArray(payload?.data) ? payload.data : payload?.data ?? payload ?? [];

export { API_BASE_URL };

export const ensureAbsoluteUrl = (value) => {
  if (!value) return null;
  if (typeof value !== 'string') return null;
  if (value.startsWith('http')) return value;
  let path = value.replace(/^\/+/, '');
  if (path.startsWith('storage/')) {
    // keep
  } else if (path.startsWith('uploads/')) {
    path = `storage/${path}`;
  } else {
    path = `storage/uploads/${path}`;
  }
  return `${API_BASE_URL.replace(/\/+$/, '')}/${path}`;
};

export const api = {
  login: (payload) => apiFetch('/api/auth/login', { method: 'POST', body: payload }),
  register: (payload) => apiFetch('/api/auth/register', { method: 'POST', body: payload }),
  profile: (token) => apiFetch('/api/auth/profile', { token }),
  updateProfile: (token, payload) => apiFetch('/api/auth/profile', { method: 'PUT', token, body: payload }),
  deleteAccount: (token) => apiFetch('/api/auth/profile', { method: 'DELETE', token }),
  stories: (params) => apiFetch('/api/stories', { params }),
  story: (id, params) => apiFetch(`/api/stories/${id}`, { params }),
  createStory: (token, payload) => apiFetch('/api/stories', { method: 'POST', token, body: payload }),
  favorites: (token) => apiFetch('/api/stories/favorites', { token }),
  readLater: (token) => apiFetch('/api/stories/read-later', { token }),
  favoriteStory: (token, storyId) => apiFetch(`/api/stories/${storyId}/favorite`, { method: 'POST', token }),
  unfavoriteStory: (token, storyId) => apiFetch(`/api/stories/${storyId}/favorite`, { method: 'DELETE', token }),
  markReadLater: (token, storyId) => apiFetch(`/api/stories/${storyId}/read-later`, { method: 'POST', token }),
  removeReadLater: (token, storyId) => apiFetch(`/api/stories/${storyId}/read-later`, { method: 'DELETE', token }),
  segment: (id, token) => apiFetch(`/api/segments/${id}`, { token }),
  createSegment: (token, storyId, payload) => apiFetch(`/api/stories/${storyId}/segments`, { method: 'POST', token, body: payload }),
  updateSegment: (token, segmentId, payload) =>
    apiFetch(`/api/segments/${segmentId}`, {
      // Use POST + _method override to avoid any client/proxy restrictions on PUT
      method: 'POST',
      token,
      body: { _method: 'PUT', ...payload },
    }),
  deleteSegment: (token, segmentId) => apiFetch(`/api/segments/${segmentId}`, { method: 'DELETE', token }),
  addChoice: (token, segmentId, payload) => apiFetch(`/api/segments/${segmentId}/choices`, { method: 'POST', token, body: payload }),
  rateSegment: (token, segmentId, payload) => apiFetch(`/api/segments/${segmentId}/rate`, { method: 'POST', token, body: payload }),
  bookmarkSegment: (token, segmentId, payload) => apiFetch(`/api/segments/${segmentId}/bookmark`, { method: 'POST', token, body: payload }),
  commentSegment: (token, segmentId, payload) => apiFetch(`/api/segments/${segmentId}/comments`, { method: 'POST', token, body: payload }),
  users: (token, search) => apiFetch('/api/users', { token, params: { search } }),
  choiceSegments: (token, storyId, choiceId) => apiFetch(`/api/stories/${storyId}/choices/${choiceId}/segments`, { token }),
  chatThreads: (token) => apiFetch('/api/chat/threads', { token }),
  chatThread: (token, id) => apiFetch(`/api/chat/threads/${id}`, { token }),
  createThread: (token, payload) => apiFetch('/api/chat/threads', { method: 'POST', token, body: payload }),
  sendMessage: (token, threadId, body) => apiFetch(`/api/chat/threads/${threadId}/messages`, { method: 'POST', token, body }),
  followUser: (token, userId) => apiFetch(`/api/users/${userId}/follow`, { method: 'POST', token }),
  unfollowUser: (token, userId) => apiFetch(`/api/users/${userId}/follow`, { method: 'DELETE', token }),
  followers: (token, userId) => apiFetch(`/api/users/${userId}/followers`, { token }),
  following: (token, userId) => apiFetch(`/api/users/${userId}/following`, { token }),
  isFollowing: (token, userId) => apiFetch(`/api/users/${userId}/is-following`, { token }),
  uploadImage: (token, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiFetch('/api/uploads/images', { method: 'POST', token, body: formData });
  },
};
