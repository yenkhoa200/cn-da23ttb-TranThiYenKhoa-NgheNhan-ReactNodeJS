const productService = require("../services/productService");

function validId(value) {
  return /^[1-9]\d*$/.test(String(value));
}

function validateProduct(body) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const price = body.price === "" || body.price === null || body.price === undefined
    ? null
    : Number(body.price);

  if (!title || title.length > 200) return { error: "Tên sản phẩm không được để trống hoặc quá 200 ký tự." };
  if (!category || category.length > 100) return { error: "Vui lòng chọn danh mục sản phẩm hợp lệ." };
  if (price !== null && (!Number.isFinite(price) || price < 0)) return { error: "Giá tham khảo phải là số không âm." };
  if (!description) return { error: "Vui lòng nhập mô tả sản phẩm." };
  return { data: { title, category, price, description } };
}

function requestedStatus(body) {
  return body.status === "nhap" ? "nhap" : "da_dang";
}

const productController = {
  async getAll(req, res, next) {
    try {
      const products = await productService.getAll({ publicOnly: true });
      return res.status(200).json({ success: true, data: products });
    } catch (error) {
      return next(error);
    }
  },

  async getById(req, res, next) {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Mã sản phẩm không hợp lệ." });
    try {
      const product = await productService.getById(req.params.id, { publicOnly: true });
      return res.status(200).json({ success: true, data: product });
    } catch (error) {
      if (error.message === "Không tìm thấy sản phẩm") {
        return res.status(404).json({ success: false, message: error.message });
      }
      return next(error);
    }
  },

  async create(req, res, next) {
    const validated = validateProduct(req.body);
    if (validated.error) return res.status(400).json({ success: false, message: validated.error });
    try {
      const product = await productService.create(validated.data, req.user.id, requestedStatus(req.body));
      return res.status(201).json({ success: true, message: "Đã lưu sản phẩm.", data: product });
    } catch (error) {
      return next(error);
    }
  },

  async update(req, res, next) {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Mã sản phẩm không hợp lệ." });
    const validated = validateProduct(req.body);
    if (validated.error) return res.status(400).json({ success: false, message: validated.error });
    try {
      const product = await productService.update(
        req.params.id,
        validated.data,
        req.user.id,
        requestedStatus(req.body)
      );
      return res.status(200).json({ success: true, message: "Đã cập nhật sản phẩm.", data: product });
    } catch (error) {
      if (error.message === "Không tìm thấy sản phẩm") {
        return res.status(404).json({ success: false, message: error.message });
      }
      return next(error);
    }
  },

  async listMine(req, res, next) {
    try {
      return res.status(200).json({
        success: true,
        data: await productService.getAll({ artisanId: req.user.id }),
      });
    } catch (error) {
      return next(error);
    }
  },

  async listForAdmin(req, res, next) {
    try {
      return res.status(200).json({ success: true, data: await productService.getAll() });
    } catch (error) {
      return next(error);
    }
  },

  async delete(req, res, next) {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Mã sản phẩm không hợp lệ." });
    try {
      const product = await productService.delete(req.params.id, req.user.id);
      if (!product) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm." });
      return res.status(200).json({ success: true, message: "Đã xóa sản phẩm.", data: product });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = productController;