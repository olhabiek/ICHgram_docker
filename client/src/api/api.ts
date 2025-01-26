import axios from "axios";

<<<<<<< HEAD
const base_url = "http://localhost:3000";
=======
const base_url = "http://localhost:5005/api";
>>>>>>> 8bd6e3c91f17b61bca9fa5e2cc75c61181fbd107

export const $api = axios.create({ baseURL: base_url });

$api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

<<<<<<< HEAD
export const socketURL = "http://ichgram:3000";
=======
export const socketURL = "http://ichgram:5005";
>>>>>>> 8bd6e3c91f17b61bca9fa5e2cc75c61181fbd107
