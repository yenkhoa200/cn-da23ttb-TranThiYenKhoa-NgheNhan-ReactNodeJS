const path = require("path");
const multer = require("multer");

const allowedTypes = {
  ".jpg": { mimeType: "image/jpeg", mediaType: "hinh_anh" },
  ".jpeg": { mimeType: "image/jpeg", mediaType: "hinh_anh" },
  ".png": { mimeType: "image/png", mediaType: "hinh_anh" },
  ".webp": { mimeType: "image/webp", mediaType: "hinh_anh" },
  ".mp4": { mimeType: "video/mp4", mediaType: "video" },
  ".mov": { mimeType: "video/quicktime", mediaType: "video" },
  ".webm": { mimeType: "video/webm", mediaType: "video" },
  ".pdf": { mimeType: "application/pdf", mediaType: "tai_lieu" },
};

const uploadProductMedia = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const allowedType = allowedTypes[extension];

    if (!allowedType || allowedType.mimeType !== file.mimetype) {
      const error = new Error("Chỉ chấp nhận JPG, PNG, WEBP, MP4, MOV, WEBM hoặc PDF.");
      error.status = 400;
      return callback(error);
    }

    file.mediaType = allowedType.mediaType;
    return callback(null, true);
  },
});

module.exports = { uploadProductMedia };
