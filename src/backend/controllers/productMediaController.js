const fs = require("fs/promises");
const ProductMedia = require("../models/ProductMedia");

const productMediaController = {
  async getByProduct(req, res, next) {
    if (!/^[1-9]\d*$/.test(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Mã sản phẩm không hợp lệ.",
      });
    }

    try {
      const media = await ProductMedia.findByProductId(req.params.id);
      return res.status(200).json({ success: true, data: media });
    } catch (error) {
      return next(error);
    }
  },

  async ensureOwnsProduct(req, res, next) {
    if (!/^[1-9]\d*$/.test(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Mã sản phẩm không hợp lệ.",
      });
    }

    try {
      const belongsToArtisan = await ProductMedia.productBelongsToArtisan(
        req.params.id,
        req.user.id
      );

      if (!belongsToArtisan) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sản phẩm hoặc bạn không có quyền tải tư liệu lên sản phẩm này.",
        });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  },

  async upload(req, res, next) {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn một tệp để tải lên.",
      });
    }

    const caption = typeof req.body.caption === "string" ? req.body.caption.trim() : "";
    if (caption.length > 500) {
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Chú thích không được vượt quá 500 ký tự.",
      });
    }

    const url = `/uploads/products/${req.file.filename}`;

    try {
      const media = await ProductMedia.create({
        accountId: req.user.id,
        productId: req.params.id,
        mediaType: req.file.mediaType,
        url,
        caption,
      });

      return res.status(201).json({
        success: true,
        message: "Tải tư liệu lên thành công.",
        data: {
          ...media,
          url: media.duong_dan_tep,
        },
      });
    } catch (error) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        if (cleanupError.code !== "ENOENT") {
          console.error("Không thể xóa tệp tải lên chưa được lưu:", cleanupError);
        }
      }

      return next(error);
    }
  },
};

module.exports = productMediaController;
