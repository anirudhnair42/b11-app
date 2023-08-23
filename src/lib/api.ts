import axios from "axios";

const api = axios.create({
  baseURL: "https://b11-api-57a95f225119.herokuapp.com/",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
