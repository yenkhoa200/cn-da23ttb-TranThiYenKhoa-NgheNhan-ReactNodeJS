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

  // Thêm sản phẩm
  create(data) {
    return api.post("/products", data);
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