import { readApiResponse } from "./apiResponse.js";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");

export function getProfileImageUrl(fileUrl) {
  if (/^https?:\/\//i.test(fileUrl)) return fileUrl;

  const serverBaseUrl = API_BASE_URL.replace(/\/api$/i, "");
  const normalizedPath = fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`;
  return `${serverBaseUrl}${normalizedPath}`;
}

async function request(path, { method = "GET", body, isFormData = false } = {}) {
  const token = window.localStorage.getItem("auth-token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  if (body && !isFormData) headers["Content-Type"] = "application/json";

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/artisan/profile${path}`, {
      method,
      headers,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new Error("Không thể kết nối máy chủ. Vui lòng kiểm tra backend đang chạy.");
  }

  return readApiResponse(response);
}

async function adminRequest(path, { method = "GET", body } = {}) {
  const token = window.localStorage.getItem("auth-token");
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/admin/profile${path}`, {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Không thể kết nối máy chủ. Vui lòng kiểm tra backend đang chạy.");
  }
  return readApiResponse(response);
}

const artisanProfileService = {
  getProfile: () => request(""),
  updateProfile: (profile) => request("", { method: "PUT", body: profile }),
  submitProfile: () => request("/submit", { method: "POST" }),
  getImages: () => request("/images"),
  getProofs: () => request("/proofs"),
  getMedia: () => request("/media"),
  deleteMedia: (id) => request(`/media/${id}`, { method: "DELETE" }),
  getReviews: () => request("/reviews"),
  deleteImage: (id) => request(`/images/${id}`, { method: "DELETE" }),

  uploadAvatar(file) {
    const body = new FormData();
    body.append("file", file);
    return request("/avatar", { method: "PUT", body, isFormData: true });
  },

  uploadImage(file, caption = "") {
    const body = new FormData();
    body.append("caption", caption);
    body.append("file", file);
    return request("/images", { method: "POST", body, isFormData: true });
  },

  uploadProofFile(file, caption = "") {
    const body = new FormData();
    body.append("caption", caption);
    body.append("file", file);
    return request("/proofs/file", { method: "POST", body, isFormData: true });
  },

  addProofLink(url, caption = "") {
    return request("/proofs/link", { method: "POST", body: { url, caption } });
  },

  deleteProof(id) {
    return request(`/proofs/${id}`, { method: "DELETE" });
  },

  uploadMedia(file, caption = "") {
    const body = new FormData();
    body.append("file", file);
    body.append("caption", caption);
    return request("/media", { method: "POST", body, isFormData: true });
  },
  getAdminArtisans: () => adminRequest("/artisans"),
  updateVerificationStatus(id, status) {
    return adminRequest(`/artisans/${id}/status`, { method: "PUT", body: { status } });
  },
};

export default artisanProfileService;
