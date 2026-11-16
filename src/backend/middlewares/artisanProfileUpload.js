const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDirectory = path.resolve(__dirname, "..", "uploads", "artisans");
fs.mkdirSync(uploadDirectory, { recursive: true });

const allowedTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadDirectory),
    filename: (_req, file, callback) => {
      callback(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (allowedTypes[extension] !== file.mimetype) {
      const error = new Error("Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP.");
      error.status = 400;
      return callback(error);
    }

    return callback(null, true);
  },
});

module.exports = { uploadProfileImage: upload.single("file") };
