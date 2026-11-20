/*
memoryStorage() giúp nhận file tạm thời trong bộ nhớ máy.
Giới hạn mỗi file tối đa 40 MB.
Chỉ cho phép những định dạng đã quy định
*/
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 40 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "video/mp4"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Chỉ hỗ trợ JPG, PNG, WEBP và MP4"));
        }
    }
});

module.exports = upload;