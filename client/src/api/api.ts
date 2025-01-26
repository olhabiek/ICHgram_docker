import axios from "axios";

const base_url = "http://localhost:3000";

export const $api = axios.create({ baseURL: base_url });

$api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export const socketURL = "http://ichgram:3000";
