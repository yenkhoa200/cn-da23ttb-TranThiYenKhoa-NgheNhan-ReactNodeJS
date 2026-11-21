import { readApiResponse } from "./apiResponse.js";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");

async function request(path, { method = "GET", body } = {}) {
  const token = window.localStorage.getItem("auth-token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  if (body) headers["Content-Type"] = "application/json";

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/artisan/crafts${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Không thể kết nối máy chủ. Vui lòng kiểm tra backend đang chạy.");
  }

  return readApiResponse(response);
}

const artisanCraftService = {
  getAll: () => request(""),
  select: (id, startYear) => request(`/${id}/select`, {
    method: "POST",
    body: { startYear },
  }),
  remove: (id) => request(`/${id}/select`, { method: "DELETE" }),
};

export default artisanCraftService;
