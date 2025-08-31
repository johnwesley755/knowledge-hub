import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

// Specific API methods
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/me"),
  updateProfile: (userData) => api.put("/auth/profile", userData),
};

export const documentsAPI = {
  getAll: (params) => api.get("/documents", { params }),
  getById: (id) => api.get(`/documents/${id}`),
  create: (data) => api.post("/documents", data),
  update: (id, data) => api.put(`/documents/${id}`, data),
  delete: (id) => api.delete(`/documents/${id}`),
  getVersions: (id) => api.get(`/documents/${id}/versions`),
  toggleLike: (id) => api.post(`/documents/${id}/like`),
  getActivityFeed: (params) =>
    api.get("/documents/activities/feed", { params }),
  getStats: () => api.get("/documents/stats"),
  download: (id) =>
    api.get(`/documents/${id}/download`, { responseType: "blob" }),

};
export const searchAPI = {
  textSearch: (params) => api.get("/search/text", { params }),
  semanticSearch: (data) => api.post("/search/semantic", data),
  getSuggestions: (params) => api.get("/search/suggestions", { params }),
};
export const qaAPI = {
  askQuestion: (data) => api.post("/qa/ask", data),
  getHistory: (documentId) => api.get(`/qa/history/${documentId}`),
};
