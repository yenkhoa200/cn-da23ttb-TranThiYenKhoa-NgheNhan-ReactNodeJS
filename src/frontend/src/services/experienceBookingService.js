import { readApiResponse } from "./apiResponse.js";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");

async function request(path, { method = "GET", body } = {}) {
  const token = window.localStorage.getItem("auth-token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  if (body) headers["Content-Type"] = "application/json";

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/bookings${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Không thể kết nối máy chủ. Vui lòng kiểm tra backend đang chạy.");
  }

  return readApiResponse(response);
}

const experienceBookingService = {
  listMine: () => request("/mine"),
  getMine: (id) => request(`/mine/${id}`),
  create(activityId, data) {
    const id = String(activityId).replace(/^activity-/, "");
    if (!/^[1-9]\d*$/.test(id)) {
      throw new Error("Hoạt động này chưa được lưu trên hệ thống nên chưa thể đặt lịch.");
    }
    return request(`/experiences/${id}`, { method: "POST", body: data });
  },
  cancel(id, reason = "") {
    return request(`/mine/${id}/cancel`, { method: "PATCH", body: { reason } });
  },
};

export default experienceBookingService;
