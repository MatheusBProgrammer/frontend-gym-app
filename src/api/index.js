// src/api/index.js
import axios from "axios";

const api = axios.create({
  baseURL:
    "https://backend-gym-qnz2-git-main-matheusbprogrammers-projects.vercel.app",
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
