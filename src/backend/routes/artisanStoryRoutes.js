const express = require("express");
const multer = require("multer");
const path = require("path");
const requireArtisan = require("../middlewares/requireArtisan");
const artisanStoryController = require("../controllers/artisanStoryController");

const allowedTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024, files: 11 },
  fileFilter(_req, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();
    if (allowedTypes[extension] !== file.mimetype) {
      const error = new Error("Chỉ tải được ảnh JPG, PNG, WEBP hoặc video MP4, MOV, WEBM.");
      error.status = 400;
      return callback(error);
    }
    callback(null, true);
  },
});

const router = express.Router();
router.use(requireArtisan);

router.get("/", artisanStoryController.list);
router.post("/", artisanStoryController.create);
router.get("/:id", artisanStoryController.getOne);
router.put("/:id", artisanStoryController.update);
router.delete("/:id", artisanStoryController.remove);
router.post("/:id/publish", artisanStoryController.publish);
router.post("/:id/youtube", artisanStoryController.saveYoutube);
router.delete("/:id/media/:mediaId", artisanStoryController.removeMedia);
router.post(
  "/:id/media",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
  ]),
  artisanStoryController.uploadMedia
);

module.exports = router;
