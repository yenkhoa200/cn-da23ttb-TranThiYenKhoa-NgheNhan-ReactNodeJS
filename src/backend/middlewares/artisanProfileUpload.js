
const multer = require("multer");
const path = require("path");

const allowedTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },

  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedTypes[extension] !== file.mimetype) {
      const error = new Error(
        "Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP."
      );
      error.status = 400;
      return callback(error);
    }

    return callback(null, true);
  },
});

module.exports = {
  uploadProfileImage: upload.single("file"),
  uploadProofDocument: multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 1,
    },
    fileFilter: (req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const allowedTypes = {
        ".pdf": "application/pdf",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".doc": "application/msword",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };

      if (allowedTypes[extension] !== file.mimetype) {
        const error = new Error("Chỉ chấp nhận PDF, DOC, DOCX, JPG, PNG hoặc WEBP.");
        error.status = 400;
        return callback(error);
      }

      file.mediaType = extension === ".pdf" || [".doc", ".docx"].includes(extension)
        ? "raw"
        : "image";
      callback(null, true);
    },
  }).single("file"),
};
