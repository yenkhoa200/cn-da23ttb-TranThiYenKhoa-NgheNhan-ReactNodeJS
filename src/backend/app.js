const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

  res.status(500).json({
    success: false,
    message: "Lỗi máy chủ",
  });
});

module.exports = app;

/*
express.json(): Đọc dữ liệu JSON được gửi từ React.



cors(): Cho phép Frontend truy cập Backend.



/api/products: Đường dẫn API quản lý sản phẩm.



Middleware xử lý lỗi: Trả thông báo khi xảy ra lỗi phía Server.
*/