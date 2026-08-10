import axios from "axios";
import { useAuthStore } from "../store/authStore";

const rawApiUrl = import.meta.env.VITE_API_URL || "https://menuai-studio.onrender.com/api";
const normalizedApiUrl = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/+$/, "")}/api`;

export const api = axios.create({
  baseURL: normalizedApiUrl
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // An expired JWT or a token signed before a server-secret rotation must
      // not remain in browser storage. Clearing it makes ProtectedRoute send
      // the user back to login instead of repeatedly showing token errors.
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error?.message || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}
