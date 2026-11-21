import { readApiResponse } from "./apiResponse.js";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");

async function request(path, { method = "GET", body, file, caption = "" } = {}) {
  const token = window.localStorage.getItem("auth-token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  let requestBody;
  if (file) {
    requestBody = new FormData();
    requestBody.append("file", file);
    requestBody.append("caption", caption);
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/products${path}`, {
      method,
      headers,
      body: requestBody,
    });
  } catch {
    throw new Error("Không thể kết nối máy chủ. Vui lòng kiểm tra backend đang chạy.");
  }
  return readApiResponse(response);
}

const productService = {
  getAll: () => request(""),
  getById: (id) => request(`/${id}`),
  getMine: () => request("/mine"),
  getAdminAll: () => request("/admin"),
  getMedia: (id) => request(`/${id}/media`),
  create: (data) => request("", { method: "POST", body: data }),
  update: (id, data) => request(`/${id}`, { method: "PUT", body: data }),
  delete: (id) => request(`/${id}`, { method: "DELETE" }),
  uploadMedia: (id, file, caption = "") => request(`/${id}/media`, {
    method: "POST",
    file,
    caption,
  }),
  saveYouTube: (id, url) => request(`/${id}/youtube`, {
    method: "POST",
    body: { url },
  }),
  removeMedia: (id, mediaId) => request(`/${id}/media/${mediaId}`, { method: "DELETE" }),
};

export default productService;
