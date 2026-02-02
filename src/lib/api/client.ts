import axios from "axios";

const baseURL = "";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = apiClient;

export default apiClient;