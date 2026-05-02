const API_BASE = '/api';

const getToken = () => localStorage.getItem('creatorai_token');

async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw { status: response.status, ...data };
    }

    return data;
  } catch (error) {
    if (error.status) throw error;
    throw { error: 'Network error. Please check your connection.' };
  }
}

export const api = {
  // Auth
  signup: (data) => apiRequest('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => apiRequest('/auth/me'),
  upgrade: () => apiRequest('/auth/upgrade', { method: 'POST' }),
  createStripeSession: () => apiRequest('/stripe/create-checkout-session', { method: 'POST' }),

  // AI Features
  generateCaption: (data) => apiRequest('/generate-caption', { method: 'POST', body: JSON.stringify(data) }),
  generateIdeas: (data) => apiRequest('/generate-ideas', { method: 'POST', body: JSON.stringify(data) }),
  generateImagePrompts: (data) => apiRequest('/generate-image-prompts', { method: 'POST', body: JSON.stringify(data) }),
  getViralScore: (data) => apiRequest('/viral-score', { method: 'POST', body: JSON.stringify(data) }),
  optimizeProfile: (data) => apiRequest('/optimize-profile', { method: 'POST', body: JSON.stringify(data) }),
  generateImage: (data) => apiRequest('/generate-image', { method: 'POST', body: JSON.stringify(data) }),

  // Analytics
  getAnalytics: () => apiRequest('/analytics'),

  // Saved Content
  getSaved: () => apiRequest('/saved'),
  saveContent: (endpoint, data) => apiRequest(`${endpoint}/save`, { method: 'POST', body: JSON.stringify(data) }),
  deleteSaved: (id) => apiRequest(`/saved/${id}`, { method: 'DELETE' }),
};

export default api;
