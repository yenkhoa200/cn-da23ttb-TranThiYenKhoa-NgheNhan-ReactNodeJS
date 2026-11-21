
const cloudinary = require("../config/cloudinary");
const ProductMedia = require("../models/ProductMedia");

function validId(value) {
  return /^[1-9]\d*$/.test(String(value));
}

function getYouTubeId(value) {
  try {
    const url = new URL(value);
    if (url.hostname === "youtu.be") return url.pathname.slice(1).split("/")[0] || null;
    if (url.hostname === "youtube.com" || url.hostname === "www.youtube.com" || url.hostname === "m.youtube.com") {
      return url.searchParams.get("v")
        || (url.pathname.startsWith("/embed/") ? url.pathname.split("/")[2] : null)
        || (url.pathname.startsWith("/shorts/") ? url.pathname.split("/")[2] : null);
    }
  } catch {
    return null;
  }
  return null;
}

// Hàm tải file từ bộ nhớ RAM lên Cloudinary.
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const resourceType =
      file.mediaType === "video"
        ? "video"
        : file.mediaType === "tai_lieu"
          ? "raw"
          : "image";

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "nghenhan/products",
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    stream.end(file.buffer);
  });
};

const productMediaController = {
  // Lấy danh sách tư liệu của sản phẩm.
  async getByProduct(req, res, next) {
    if (!/^[1-9]\d*$/.test(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Mã sản phẩm không hợp lệ.",
      });
    }

    try {
      const media = await ProductMedia.findByProductId(req.params.id);

      return res.status(200).json({
        success: true,
        data: media,
      });
    } catch (error) {
      return next(error);
    }
  },

  // Kiểm tra sản phẩm có thuộc nghệ nhân đang đăng nhập không.
  async ensureOwnsProduct(req, res, next) {
    if (!/^[1-9]\d*$/.test(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Mã sản phẩm không hợp lệ.",
      });
    }

    try {
      const belongsToArtisan =
        await ProductMedia.productBelongsToArtisan(
          req.params.id,
          req.user.id
        );

      if (!belongsToArtisan) {
        return res.status(404).json({
          success: false,
          message:
            "Không tìm thấy sản phẩm hoặc bạn không có quyền tải tư liệu lên sản phẩm này.",
        });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  },

  // Tải tư liệu lên Cloudinary và lưu URL vào PostgreSQL.
  async upload(req, res, next) {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn một tệp để tải lên.",
      });
    }

    const caption =
      typeof req.body.caption === "string"
        ? req.body.caption.trim()
        : "";

    if (caption.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Chú thích không được vượt quá 500 ký tự.",
      });
    }

    let cloudinaryResult = null;

    try {
      // Bước 1: Tải file lên Cloudinary.
      cloudinaryResult = await uploadToCloudinary(req.file);

      // Bước 2: Lưu URL Cloudinary vào PostgreSQL. khi tải ảnh/video lên, PostgreSQL sẽ lưu được cả URL và mã định danh Cloudinary.
      const media = await ProductMedia.create({
        accountId: req.user.id,
        productId: req.params.id,
        mediaType: req.file.mediaType,
        url: cloudinaryResult.secure_url,
        caption,
        publicId: cloudinaryResult.public_id,
        resourceType: cloudinaryResult.resource_type,
      });

      // Bước 3: Trả kết quả cho frontend.
      return res.status(201).json({
        success: true,
        message: "Tải tư liệu lên thành công.",
        data: {
          ...media,
          url: media.duong_dan_tep,
        },
      });
    } catch (error) {
      // Nếu Cloudinary đã nhận file nhưng lưu database thất bại,
      // xóa file trên Cloudinary để tránh dữ liệu thừa.
      if (cloudinaryResult?.public_id) {
        try {
          await cloudinary.uploader.destroy(
            cloudinaryResult.public_id,
            {
              resource_type: cloudinaryResult.resource_type,
            }
          );
        } catch (cleanupError) {
          console.error(
            "Không thể xóa file thừa trên Cloudinary:",
            cleanupError
          );
        }
      }

      return next(error);
    }
  },

  async saveYoutube(req, res, next) {
    if (!validId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Mã sản phẩm không hợp lệ." });
    }
    const videoId = typeof req.body.url === "string" ? getYouTubeId(req.body.url.trim()) : null;
    if (!videoId) {
      return res.status(400).json({ success: false, message: "Liên kết YouTube không hợp lệ." });
    }
    try {
      const media = await ProductMedia.saveYouTube(
        req.params.id,
        req.user.id,
        `https://www.youtube.com/watch?v=${videoId}`
      );
      return res.status(201).json({
        success: true,
        data: {
          id: media.ma_pt,
          type: media.loai_tu_lieu,
          url: media.duong_dan_tep,
          caption: media.chu_thich,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  async remove(req, res, next) {
    if (!validId(req.params.id) || !validId(req.params.mediaId)) {
      return res.status(400).json({ success: false, message: "Mã tư liệu không hợp lệ." });
    }
    try {
      const media = await ProductMedia.deleteById(req.params.id, req.params.mediaId);
      if (!media) return res.status(404).json({ success: false, message: "Không tìm thấy tư liệu." });
      if (media.cloudinary_public_id) {
        await cloudinary.uploader.destroy(
          media.cloudinary_public_id,
          { resource_type: media.cloudinary_resource_type || "image" }
        );
      }
      return res.status(200).json({ success: true, message: "Đã xóa tư liệu." });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = productMediaController;
