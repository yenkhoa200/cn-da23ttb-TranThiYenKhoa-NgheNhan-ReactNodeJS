const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDirectory = path.resolve(__dirname, "..", "uploads", "artisans");
fs.mkdirSync(uploadDirectory, { recursive: true });

const allowedTypes = {
  ".jpg": { mimeType: "image/jpeg", mediaType: "hinh_anh" },
  ".jpeg": { mimeType: "image/jpeg", mediaType: "hinh_anh" },
  ".png": { mimeType: "image/png", mediaType: "hinh_anh" },
  ".webp": { mimeType: "image/webp", mediaType: "hinh_anh" },
  ".mp4": { mimeType: "video/mp4", mediaType: "video" },
  ".mov": { mimeType: "video/quicktime", mediaType: "video" },
  ".webm": { mimeType: "video/webm", mediaType: "video" },
};

const uploadArtisanMedia = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadDirectory),
    filename: (_req, file, callback) => {
      callback(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`);
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const allowedType = allowedTypes[extension];

    if (!allowedType || allowedType.mimeType !== file.mimetype) {
      const error = new Error("Chỉ chấp nhận ảnh JPG, PNG, WEBP hoặc video MP4, MOV, WEBM.");
      error.status = 400;
      return callback(error);
    }

    file.mediaType = allowedType.mediaType;
    return callback(null, true);
  },
});

module.exports = { uploadArtisanMedia: uploadArtisanMedia.single("file") };
