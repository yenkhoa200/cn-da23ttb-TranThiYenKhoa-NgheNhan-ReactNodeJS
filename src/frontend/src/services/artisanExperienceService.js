import { readApiResponse } from "./apiResponse.js";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");

async function request(path, { method = "GET", body, isFormData = false, resource = "artisan/experiences" } = {}) {
  const token = window.localStorage.getItem("auth-token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  if (body && !isFormData) headers["Content-Type"] = "application/json";

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/${resource}${path}`, {
      method,
      headers,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new Error("Không thể kết nối máy chủ. Vui lòng kiểm tra backend đang chạy.");
  }

  return readApiResponse(response);
}

const artisanExperienceService = {
  list: () => request(""),
  listPublic: () => request("", { resource: "experiences" }),
  create: (data) => request("", { method: "POST", body: data }),
  update: (id, data) => request(`/${id}`, { method: "PUT", body: data }),
  remove: (id) => request(`/${id}`, { method: "DELETE" }),
  uploadImage(id, file) {
    const body = new FormData();
    body.append("file", file);
    return request(`/${id}/media`, { method: "POST", body, isFormData: true });
  },
};

export default artisanExperienceService;
