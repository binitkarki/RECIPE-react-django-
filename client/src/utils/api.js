import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 errors by refreshing the token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refreshToken");

      if (refresh) {
        try {
          const res = await axios.post("http://127.0.0.1:8000/api/auth/login/refresh", {
            refresh,
          });
          const newAccess = res.data.access;
          localStorage.setItem("accessToken", newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch (err) {
          
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export const AuthAPI = {
  login: async (username, password) => {
    const res = await api.post("/auth/login", { username, password });
    // Save both access and refresh tokens
    localStorage.setItem("accessToken", res.data.access);
    localStorage.setItem("refreshToken", res.data.refresh);
    return res;
  },
  register: (username, password) =>
    api.post("/auth/register", { username, password }),
};

export const RecipesAPI = {
  list: (search = "", category = "") =>
    api.get("/recipes/", {
      params: {
        ...(search ? { search } : {}),
        ...(category ? { category: category.toLowerCase() } : {}), 
      },
    }),
  detail: (id) => api.get(`/recipes/${id}/`),
  create: (data) =>
    api.post("/recipes/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data) =>
    api.put(`/recipes/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  remove: (id) => api.delete(`/recipes/${id}/`),
  mine: () => api.get("/recipes/mine/"),
  like: (id) => api.post(`/recipes/${id}/like/`),
  view: (id) => api.post(`/recipes/${id}/increment_view/`),
};

export const BookmarksAPI = {
  list: () => api.get("/bookmarks/"),
  add: (recipeId) => api.post("/bookmarks/", { recipe_id: recipeId }),
  remove: (bookmarkId) => api.delete(`/bookmarks/${bookmarkId}/`),
};

export const CommentsAPI = {
  list: (recipeId) => api.get(`/recipes/${recipeId}/comments`),
  add: (recipeId, text) => api.post(`/recipes/${recipeId}/comments`, { text }),
};

export default api;
