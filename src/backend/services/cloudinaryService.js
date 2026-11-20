/*
Hàm này có nhiệm vụ:
1. Nhận file từ Multer.
2. Xác định đó là hình ảnh hay video.
3. Gửi file lên Cloudinary.
4. Nhận URL và mã public_id từ Cloudinary.
5. Trả thông tin về cho Controller.
*/

const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (file, folder) => {
    return new Promise((resolve, reject) => {

        const resourceType = file.mimetype.startsWith("video/")
            ? "video"
            : "image";

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: resourceType
            },

            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                    format: result.format,
                    size: result.bytes,
                    resource_type: result.resource_type
                });
            }
        );

        stream.end(file.buffer);
    });
};

module.exports = uploadToCloudinary;