import axios from "axios";

const DEFAULT_API_BASE_URL = "/api";
const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = apiClient;

export default apiClient;
