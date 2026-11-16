const express = require("express");
const artisanProfileController = require("../controllers/artisanProfileController");
const requireArtisan = require("../middlewares/requireArtisan");
const { uploadProfileImage } = require("../middlewares/artisanProfileUpload");

const router = express.Router();

router.use(requireArtisan);
router.get("/", artisanProfileController.getProfile);
router.put("/", artisanProfileController.updateProfile);
router.put("/avatar", uploadProfileImage, artisanProfileController.uploadAvatar);
router.get("/images", artisanProfileController.getImages);
router.post("/images", uploadProfileImage, artisanProfileController.uploadImage);
router.delete("/images/:id", artisanProfileController.deleteImage);

module.exports = router;
