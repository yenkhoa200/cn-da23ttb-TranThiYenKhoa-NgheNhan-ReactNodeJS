const Product = require("../models/Product");

const productService = {
  async getAll() {
    return await Product.findAll();
  },

  async getById(id) {
    const product = await Product.findById(id);

    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    return product;
  },

  async create(data) {
    if (!data.ten_san_pham || !data.ma_nghe_nhan) {
      throw new Error("Vui lòng nhập đầy đủ thông tin");
    }

    return await Product.create(data);
  },

  async update(id, data) {
    const product = await Product.findById(id);

    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    return await Product.update(id, data);
  },

  async delete(id) {
    const product = await Product.findById(id);

    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    return await Product.delete(id);
  },
};

module.exports = productService;