import { readApiResponse } from "./apiResponse.js";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");

async function request(path, payload, method = "POST") {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/${path}`, {
      method,
      headers: payload ? { "Content-Type": "application/json" } : {},
      body: payload ? JSON.stringify(payload) : undefined,
    });
  } catch {
    throw new Error("Không thể kết nối máy chủ. Vui lòng kiểm tra backend đang chạy.");
  }

  return readApiResponse(response);
}

export function loginAccount(payload) {
  return request("login", payload);
}

export function registerTourist(payload) {
  return request("register", payload);
}

export function registerArtisan(payload) {
  return request("register-artisan", payload);
}

export function getArtisanCraftOptions() {
  return request("crafts", undefined, "GET");
}

export function saveAuthSession(session) {
  window.localStorage.setItem("auth-token", session.token);
  window.localStorage.setItem("auth-user", JSON.stringify(session.user));
}
