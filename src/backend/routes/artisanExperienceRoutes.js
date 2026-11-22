const express = require("express");
const multer = require("multer");
const path = require("path");
const artisanExperienceController = require("../controllers/artisanExperienceController");
const experienceBookingController = require("../controllers/experienceBookingController");
const requireArtisan = require("../middlewares/requireArtisan");

const allowedTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter(_req, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();
    if (allowedTypes[extension] !== file.mimetype) {
      const error = new Error("Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP.");
      error.status = 400;
      return callback(error);
    }
    return callback(null, true);
  },
});

const router = express.Router();
router.use(requireArtisan);

router.get("/", artisanExperienceController.list);
router.post("/", artisanExperienceController.create);
router.put("/:id", artisanExperienceController.update);
router.delete("/:id", artisanExperienceController.remove);
router.post("/:id/media", upload.single("file"), artisanExperienceController.uploadImage);
router.get("/bookings", experienceBookingController.listArtisan);
router.patch("/bookings/:id/status", experienceBookingController.updateArtisanStatus);

module.exports = router;
