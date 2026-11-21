const Product = require("../models/Product");

const productService = {
  async getAll(options) {
    return Product.findAll(options);
  },

  async getById(id, options) {
    const product = await Product.findById(id, options);

    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    return product;
  },

  async create(data, artisanId, status) {
    return Product.create(data, artisanId, status);
  },

  async update(id, data, artisanId, status) {
    const product = await Product.findById(id, { artisanId });

    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    return Product.update(id, data, artisanId, status);
  },

  async delete(id, artisanId) {
    const product = await Product.findById(id, { artisanId });

    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    return Product.delete(id, artisanId);
  },
};

module.exports = productService;