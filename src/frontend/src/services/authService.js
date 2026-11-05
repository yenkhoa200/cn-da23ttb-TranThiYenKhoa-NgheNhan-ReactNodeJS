const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");

async function request(path, payload) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Không thể kết nối máy chủ. Vui lòng kiểm tra backend đang chạy.");
  }

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Yêu cầu không thành công.");
  }

  return result.data;
}

export function loginAccount(payload) {
  return request("login", payload);
}

export function registerTourist(payload) {
  return request("register", payload);
}

export function saveAuthSession(session) {
  window.localStorage.setItem("auth-token", session.token);
  window.localStorage.setItem("auth-user", JSON.stringify(session.user));
}
