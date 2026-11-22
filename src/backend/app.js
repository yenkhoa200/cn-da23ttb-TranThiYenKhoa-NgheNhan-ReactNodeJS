/*onst express = require("express");
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
app.use("/api/artisan/crafts", require("./routes/artisanCraftRoutes"));
app.use("/api/artisan/profile", require("./routes/artisanProfileRoutes"));
app.use("/api/artisan/experiences", require("./routes/artisanExperienceRoutes"));
app.use("/api/experiences", require("./routes/experienceRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/admin/experience-bookings", require("./routes/adminExperienceBookingRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/artisan/stories", require("./routes/artisanStoryRoutes"));

// Xử lý lỗi
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Không tìm thấy API.",
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  const status = err.status
    || (err.code === "LIMIT_FILE_SIZE" ? 413 : null)
    || (err instanceof multer.MulterError ? 400 : 500);

  res.status(status).json({
    success: false,
    message: status === 413
      ? req.path.startsWith("/api/artisan/profile")
        ? req.path.startsWith("/api/artisan/profile/media")
          ? "Ảnh hoặc video không được vượt quá 50 MB."
          : "Ảnh hồ sơ không được vượt quá 10 MB."
        : "Tệp tải lên không được vượt quá 50 MB."
      : status === 400
        ? err.message
        : "Lỗi máy chủ",
  });
});

module.exports = app;
*/


const express = require("express");
const cors = require("cors");
const multer = require("multer");

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
app.use("/api/artisan/crafts", require("./routes/artisanCraftRoutes"));
app.use("/api/artisan/profile", require("./routes/artisanProfileRoutes"));
app.use("/api/artisan/experiences", require("./routes/artisanExperienceRoutes"));
app.use("/api/experiences", require("./routes/experienceRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/artisan/stories", require("./routes/artisanStoryRoutes"));
app.use("/api/tourist", require("./routes/touristContentRoutes"));

// Xử lý lỗi
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Không tìm thấy API.",
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  const status =
    err.status ||
    (err.code === "LIMIT_FILE_SIZE" ? 413 : null) ||
    (err instanceof multer.MulterError ? 400 : 500);

  res.status(status).json({
    success: false,
    message: err.publicMessage || (status === 413
        ? "Tệp tải lên vượt quá dung lượng cho phép."
        : status === 400
          ? err.message
          : "Lỗi máy chủ"),
  });
});

module.exports = app;


/*
express.json(): Đọc dữ liệu JSON được gửi từ React.



cors(): Cho phép Frontend truy cập Backend.



/api/products: Đường dẫn API quản lý sản phẩm.



Middleware xử lý lỗi: Trả thông báo khi xảy ra lỗi phía Server.
*/