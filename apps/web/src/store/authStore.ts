import { create } from "zustand";
import type { User } from "../types";

type AuthState = {
  token: string | null;
  user: User | null;
  setSession: (token: string, user: User) => void;
  logout: () => void;
};

function isTokenUsable(token: string | null) {
  if (!token) return false;

  try {
    const payload = token.split(".")[1];
    if (!payload) return false;

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, "=");
    const decodedPayload = JSON.parse(atob(paddedPayload)) as { exp?: number };

    return typeof decodedPayload.exp !== "number" || decodedPayload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function readStoredUser(token: string | null) {
  if (!token) return null;

  try {
    const value = localStorage.getItem("menuai_user");
    return value ? (JSON.parse(value) as User) : null;
  } catch {
    return null;
  }
}

const savedToken = localStorage.getItem("menuai_token");
const storedToken = isTokenUsable(savedToken) ? savedToken : null;
const storedUser = readStoredUser(storedToken);

if (!storedToken || !storedUser) {
  localStorage.removeItem("menuai_token");
  localStorage.removeItem("menuai_user");
}

export const useAuthStore = create<AuthState>((set) => ({
  token: storedToken,
  user: storedUser,
  setSession: (token, user) => {
    localStorage.setItem("menuai_token", token);
    localStorage.setItem("menuai_user", JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem("menuai_token");
    localStorage.removeItem("menuai_user");
    set({ token: null, user: null });
  }
}));
