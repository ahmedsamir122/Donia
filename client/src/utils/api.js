import axios from "axios";

const api = axios.create({
  baseURL: "https://your-api.com", // add the real end point
  withCredentials: true,
});

// Token management logic here
let accessToken = null;

const refreshAccessToken = async () => {
  try {
    const response = await api.post("/auth/refresh-token"); // add the real end point
    accessToken = response.data.accessToken;
    return accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

api.interceptors.request.use(
  async (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
