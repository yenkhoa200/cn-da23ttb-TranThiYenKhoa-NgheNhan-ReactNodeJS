import { readApiResponse } from "./apiResponse.js";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");

async function request(path, { method = "GET", body, isFormData = false } = {}) {
  const token = window.localStorage.getItem("auth-token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  if (body && !isFormData) headers["Content-Type"] = "application/json";

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/artisan/stories${path}`, {
      method,
      headers,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new Error("Không thể kết nối máy chủ.");
  }

  return readApiResponse(response);
}

const artisanStoryService = {
  list: () => request(""),
  get: (id) => request(`/${id}`),
  create: (data) => request("", { method: "POST", body: data }),
  update: (id, data) => request(`/${id}`, { method: "PUT", body: data }),
  remove: (id) => request(`/${id}`, { method: "DELETE" }),
  publish: (id) => request(`/${id}/publish`, { method: "POST" }),
  removeMedia: (id, mediaId) => request(`/${id}/media/${mediaId}`, { method: "DELETE" }),
  saveYoutube: (id, url) => request(`/${id}/youtube`, { method: "POST", body: { url } }),
  uploadMedia(id, { images, video }) {
    const body = new FormData();
    images.forEach((file) => body.append("images", file));
    if (video) body.append("video", video);
    return request(`/${id}/media`, { method: "POST", body, isFormData: true });
  },
};

export default artisanStoryService;
