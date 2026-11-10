const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const allowedLoginRoles = {
  visitor: "du_khach",
  artisan: "nghe_nhan",
  admin: "quan_tri",
};

function createSession(account) {
  const token = jwt.sign(
    { role: account.vai_tro },
    process.env.JWT_SECRET,
    { subject: String(account.ma_tai_khoan), expiresIn: "12h" }
  );

  return {
    token,
    user: {
      id: account.ma_tai_khoan,
      name: account.ho_ten,
      email: account.email,
      phone: account.so_dien_thoai || "",
      role: account.vai_tro,
    },
  };
}

function validateCredentials(password) {
  return typeof password === "string"
    && password.length >= 6
    && Buffer.byteLength(password, "utf8") <= 72;
}

const authController = {
  async register(req, res, next) {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const phone = typeof req.body.phone === "string" ? req.body.phone.trim() : "";
    const phoneDigits = phone.replace(/\D/g, "");
    const { password } = req.body;

    if (!name || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập họ tên và email hợp lệ." });
    }

    if (!validateCredentials(password)) {
      return res.status(400).json({ success: false, message: "Mật khẩu phải có ít nhất 6 ký tự và không vượt quá 72 byte." });
    }

    if (phoneDigits.length < 8 || phoneDigits.length > 15 || phone.length > 30) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập số điện thoại hợp lệ." });
    }

    if (!process.env.JWT_SECRET) {
      return next(new Error("JWT_SECRET chưa được cấu hình."));
    }

    try {
      const passwordHash = await bcrypt.hash(password, 12);
      const result = await pool.query(
        `INSERT INTO tai_khoan (ho_ten, email, mat_khau_hash, sdt, vai_tro)
         VALUES ($1, $2, $3, $4, 'du_khach')
         RETURNING ma_tk AS ma_tai_khoan, ho_ten, email, sdt AS so_dien_thoai,
                   upper(vai_tro) AS vai_tro`,
        [name, email, passwordHash, phone]
      );

      return res.status(201).json({
        success: true,
        message: "Đăng ký tài khoản thành công.",
        data: createSession(result.rows[0]),
      });
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json({ success: false, message: "Email này đã được đăng ký." });
      }

      return next(error);
    }
  },

  async login(req, res, next) {
    const identifier = typeof req.body.identifier === "string" ? req.body.identifier.trim() : "";
    const { password } = req.body;
    const role = allowedLoginRoles[req.body.accountType];

    if (!identifier || !validateCredentials(password) || !role) {
      return res.status(400).json({ success: false, message: "Thông tin đăng nhập không hợp lệ." });
    }

    if (!process.env.JWT_SECRET) {
      return next(new Error("JWT_SECRET chưa được cấu hình."));
    }

    try {
      const isEmail = identifier.includes("@");
      const accountResult = isEmail
        ? await pool.query(
          `SELECT ma_tk AS ma_tai_khoan, ho_ten, email, sdt AS so_dien_thoai,
                  mat_khau_hash AS mat_khau, upper(vai_tro) AS vai_tro,
                  upper(trang_thai_tk) AS trang_thai
           FROM tai_khoan
           WHERE lower(email) = lower($1) AND vai_tro = $2
           LIMIT 1`,
          [identifier, role]
        )
        : await pool.query(
          `SELECT ma_tk AS ma_tai_khoan, ho_ten, email, sdt AS so_dien_thoai,
                  mat_khau_hash AS mat_khau, upper(vai_tro) AS vai_tro,
                  upper(trang_thai_tk) AS trang_thai
           FROM tai_khoan
           WHERE regexp_replace(coalesce(sdt, ''), '\\D', '', 'g') = $1
             AND vai_tro = $2
           LIMIT 1`,
          [identifier.replace(/\D/g, ""), role]
        );

      const account = accountResult.rows[0];
      if (!account || !(await bcrypt.compare(password, account.mat_khau))) {
        return res.status(401).json({ success: false, message: "Email/số điện thoại hoặc mật khẩu không chính xác." });
      }

      if (account.trang_thai !== "HOAT_DONG") {
        return res.status(403).json({ success: false, message: "Tài khoản chưa được kích hoạt hoặc đã bị khóa." });
      }

      return res.status(200).json({
        success: true,
        message: "Đăng nhập thành công.",
        data: createSession(account),
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = authController;
