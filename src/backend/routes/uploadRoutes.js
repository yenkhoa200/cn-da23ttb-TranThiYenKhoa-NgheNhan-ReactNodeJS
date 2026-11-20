const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const uploadToCloudinary = require("../services/cloudinaryService");

// API thử nghiệm tải ảnh/video
router.post(
    "/test",
    upload.single("file"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "Bạn chưa chọn file"
                });
            }

            const result = await uploadToCloudinary(
                req.file,
                "nghenhan/test"
            );

            res.status(200).json({
                message: "Tải file lên Cloudinary thành công",
                data: result
            });

        } catch (error) {
            res.status(500).json({
                message: "Không thể tải file",
                error: error.message
            });
        }
    }
);

module.exports = router;