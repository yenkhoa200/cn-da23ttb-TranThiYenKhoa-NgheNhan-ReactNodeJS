const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    dotfiles: "deny",
    index: false,
  })
);

// Kiểm tra API
app.get("/", (req, res) => {
  res.json({
    message: "API ứng dụng hỗ trợ nghệ nhân đang hoạt động",
  });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));

// Xử lý lỗi
app.use((err, req, res, next) => {
  console.error(err);

  const status = err.status
    || (err.code === "LIMIT_FILE_SIZE" ? 413 : null)
    || (err instanceof multer.MulterError ? 400 : 500);

  res.status(status).json({
    success: false,
    message: status === 413
      ? "Tệp tải lên không được vượt quá 50 MB."
      : status === 400
        ? err.message
        : "Lỗi máy chủ",
  });
});

module.exports = app;

/*
express.json(): Đọc dữ liệu JSON được gửi từ React.



cors(): Cho phép Frontend truy cập Backend.



/api/products: Đường dẫn API quản lý sản phẩm.



Middleware xử lý lỗi: Trả thông báo khi xảy ra lỗi phía Server.
*/