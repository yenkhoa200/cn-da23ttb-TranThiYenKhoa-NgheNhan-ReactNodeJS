const productService = require("../services/productService");

const productController = {
  // GET: Lấy danh sách sản phẩm
  async getAll(req, res, next) {
    try {
      const products = await productService.getAll();

      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET: Lấy sản phẩm theo ID
  async getById(req, res, next) {
    try {
      const product = await productService.getById(
        req.params.id
      );

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  // POST: Thêm sản phẩm
  async create(req, res, next) {
    try {
      const product = await productService.create(req.body);

      res.status(201).json({
        success: true,
        message: "Thêm sản phẩm thành công",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT: Cập nhật sản phẩm
  async update(req, res, next) {
    try {
      const product = await productService.update(
        req.params.id,
        req.body
      );

      res.status(200).json({
        success: true,
        message: "Cập nhật sản phẩm thành công",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE: Xóa sản phẩm
  async delete(req, res, next) {
    try {
      const product = await productService.delete(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message: "Xóa sản phẩm thành công",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;