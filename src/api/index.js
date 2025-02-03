// src/api/index.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const storedAuth = localStorage.getItem("authData");
  const token = storedAuth ? JSON.parse(storedAuth).token : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // note as crases
  }
  return config;
});

export default api;
