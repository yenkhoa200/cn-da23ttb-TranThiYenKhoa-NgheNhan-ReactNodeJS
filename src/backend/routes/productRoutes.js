
const express = require("express");

const router = express.Router();

const productController = require("../controllers/productController");
const productMediaController = require("../controllers/productMediaController");
const requireArtisan = require("../middlewares/requireArtisan");
const requireAdmin = require("../middlewares/requireAdmin");
const { uploadProductMedia } = require("../middlewares/productMediaUpload");

router.get("/admin", requireAdmin, productController.listForAdmin);
router.get("/mine", requireArtisan, productController.listMine);
// Lấy các URL tư liệu của một sản phẩm.
router.get("/:id/media", requireArtisan, productMediaController.ensureOwnsProduct, productMediaController.getByProduct);

// Tải tư liệu lên sản phẩm của nghệ nhân đang đăng nhập.
router.post(
  "/:id/media",
  requireArtisan,
  productMediaController.ensureOwnsProduct,
  uploadProductMedia.single("file"),
  productMediaController.upload
);
router.post("/:id/youtube", requireArtisan, productMediaController.ensureOwnsProduct, productMediaController.saveYoutube);
router.delete("/:id/media/:mediaId", requireArtisan, productMediaController.ensureOwnsProduct, productMediaController.remove);

// GET: Lấy danh sách sản phẩm.
router.get("/", productController.getAll);

// GET: Lấy sản phẩm theo ID.
router.get("/:id", productController.getById);

// POST: Thêm sản phẩm.
router.post("/", requireArtisan, productController.create);

// PUT: Cập nhật sản phẩm.
router.put("/:id", requireArtisan, productController.update);

// DELETE: Xóa sản phẩm.
router.delete("/:id", requireArtisan, productController.delete);

module.exports = router;
