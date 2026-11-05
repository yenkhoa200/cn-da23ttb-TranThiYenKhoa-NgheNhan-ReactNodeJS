/*const express = require("express");

const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Backend ứng dụng hỗ trợ nghệ nhân đang hoạt động!");
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
*/
require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});