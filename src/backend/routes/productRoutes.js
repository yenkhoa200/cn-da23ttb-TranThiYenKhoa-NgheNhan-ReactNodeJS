const express = require("express");

const router = express.Router();

const productController = require("../controllers/productController");
const productMediaController = require("../controllers/productMediaController");
const requireArtisan = require("../middlewares/requireArtisan");
const { uploadProductMedia } = require("../middlewares/productMediaUpload");

// Lấy các URL tư liệu của một sản phẩm.
router.get("/:id/media", productMediaController.getByProduct);

// Tải một tư liệu lên sản phẩm của nghệ nhân đang đăng nhập.
router.post(
  "/:id/media",
  requireArtisan,
  productMediaController.ensureOwnsProduct,
  uploadProductMedia.single("file"),
  productMediaController.upload
);

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