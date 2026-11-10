import api from "./api";

const productService = {
  // Lấy danh sách sản phẩm
  getAll() {
    return api.get("/products");
  },

  // Lấy sản phẩm theo ID
  getById(id) {
    return api.get(`/products/${id}`);
  },

  getMedia(id) {
    return api.get(`/products/${id}/media`);
  },

  // Thêm sản phẩm
  create(data) {
    return api.post("/products", data);
  },

  async uploadMedia(id, file, caption = "") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);

    const token = window.localStorage.getItem("auth-token");
    const baseUrl = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");
    const response = await fetch(`${baseUrl}/products/${id}/media`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Tải tư liệu lên không thành công.");
    }

    return result.data;
  },

  // Cập nhật sản phẩm
  update(id, data) {
    return api.put(`/products/${id}`, data);
  },

  // Xóa sản phẩm
  delete(id) {
    return api.delete(`/products/${id}`);
  },
};

export default productService;