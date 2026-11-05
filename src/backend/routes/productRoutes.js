const express = require("express");

const router = express.Router();

const productController = require("../controllers/productController");

// GET: Lấy danh sách sản phẩm
router.get("/", productController.getAll);

// GET: Lấy sản phẩm theo ID
router.get("/:id", productController.getById);

// POST: Thêm sản phẩm
router.post("/", productController.create);

// PUT: Cập nhật sản phẩm
router.put("/:id", productController.update);

// DELETE: Xóa sản phẩm
router.delete("/:id", productController.delete);

module.exports = router;