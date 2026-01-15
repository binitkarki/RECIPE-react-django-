import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export async function signup(username, password) {
  return axios.post(`${API_URL}/auth/signup/`, { username, password });
}

export async function login(username, password) {
  const res = await axios.post(`${API_URL}/token/`, { username, password });
  localStorage.setItem("accessToken", res.data.access);
  localStorage.setItem("refreshToken", res.data.refresh);
  return res.data;
}

export function getAuthHeader() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
