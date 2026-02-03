import axios from "axios";

export const apiClient = axios.create({
  // 모든 API 호출을 /api/v1 이하 상대 경로로 강제합니다.
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  // 필요한 경우 쿠키 공유를 위해 아래 옵션을 사용하세요.
  // withCredentials: true,
});

export const api = apiClient;

export default apiClient;
