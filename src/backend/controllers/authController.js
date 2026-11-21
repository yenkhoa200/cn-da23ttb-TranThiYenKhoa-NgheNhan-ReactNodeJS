const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const allowedLoginRoles = {
  visitor: ["du_khach"],
  artisan: ["nghe_nhan", "artisans"],
  admin: ["quan_tri"],
};

function normalizeRole(role) {
  const value = typeof role === "string" ? role.trim().toLowerCase() : "";

  if (value === "artisans") return "nghe_nhan";
  if (value === "du_khach" || value === "nghe_nhan" || value === "quan_tri") {
    return value;
  }

  return value;
}

function normalizeStatus(status) {
  return typeof status === "string" ? status.trim().toUpperCase() : "";
}

function createSession(account) {
  const role = normalizeRole(account.vai_tro ?? account.role);
  const token = jwt.sign(
    { role },
    process.env.JWT_SECRET,
    { subject: String(account.ma_tai_khoan ?? account.account_id), expiresIn: "12h" }
  );

  return {
    token,
    user: {
      id: account.ma_tai_khoan ?? account.account_id,
      name: account.ho_ten ?? account.full_name,
      email: account.email,
      phone: account.so_dien_thoai || account.phone_number || "",
      role,
      avatarUrl: account.anh_dai_dien || account.avatar_url || "",
    },
  };
}

function validateCredentials(password) {
  return typeof password === "string"
    && password.length >= 6
    && Buffer.byteLength(password, "utf8") <= 72;
}

async function resolveAccountTable(queryable = pool) {
  const { rows } = await queryable.query(`
    SELECT
      to_regclass('public.tai_khoan') AS tai_khoan,
      to_regclass('public.accounts') AS accounts
  `);

  const tableInfo = rows[0] || {};
  return tableInfo.tai_khoan ? "tai_khoan" : (tableInfo.accounts ? "accounts" : "tai_khoan");
}

const authController = {
  async listArtisanCrafts(_req, res, next) {
    try {
      const tableName = await resolveAccountTable();
      const result = tableName === "accounts"
        ? await pool.query(
          `SELECT craft_id AS id, craft_name AS name
           FROM traditional_crafts
           ORDER BY craft_name`
        )
        : await pool.query(
          `SELECT ma_nghe AS id, ten_nghe AS name
           FROM nghe_truyen_thong
           ORDER BY ten_nghe`
        );

      return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      return next(error);
    }
  },

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
      const tableName = await resolveAccountTable();
      const isLegacyTable = tableName === "accounts";

      const result = isLegacyTable
        ? await pool.query(
          `INSERT INTO accounts (full_name, email, password_hash, phone_number, role)
           VALUES ($1, $2, $3, $4, 'du_khach')
           RETURNING account_id AS ma_tai_khoan, full_name AS ho_ten, email, phone_number AS so_dien_thoai,
                     avatar_url AS anh_dai_dien,
                     upper(role) AS vai_tro`,
          [name, email, passwordHash, phone]
        )
        : await pool.query(
          `INSERT INTO tai_khoan (ho_ten, email, mat_khau_hash, sdt, vai_tro)
           VALUES ($1, $2, $3, $4, 'du_khach')
           RETURNING ma_tk AS ma_tai_khoan, ho_ten, email, sdt AS so_dien_thoai, anh_dai_dien,
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

  async registerArtisan(req, res, next) {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const rawPhone = typeof req.body.phone === "string" ? req.body.phone.trim() : "";
    const phone = rawPhone.replace(/[^\d+]/g, "");
    const { password } = req.body;
    const craftId = typeof req.body.craftId === "string" || typeof req.body.craftId === "number"
      ? String(req.body.craftId)
      : "";

    if (!name || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập họ tên và email hợp lệ." });
    }
    if (!validateCredentials(password)) {
      return res.status(400).json({ success: false, message: "Mật khẩu phải có ít nhất 6 ký tự và không vượt quá 72 byte." });
    }
    if (phone.length < 9 || phone.length > 15 || !/^\+?\d{8,14}$/.test(phone)) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập số điện thoại hợp lệ." });
    }
    if (!/^[1-9]\d*$/.test(craftId) || !Number.isSafeInteger(Number(craftId))) {
      return res.status(400).json({ success: false, message: "Vui lòng chọn nghề truyền thống hợp lệ." });
    }
    if (!process.env.JWT_SECRET) {
      return next(new Error("JWT_SECRET chưa được cấu hình."));
    }

    let client;
    let transactionStarted = false;
    try {
      const passwordHash = await bcrypt.hash(password, 12);
      client = await pool.connect();
      await client.query("BEGIN");
      transactionStarted = true;

      const tableName = await resolveAccountTable(client);
      const isLegacyTable = tableName === "accounts";
      const craftResult = isLegacyTable
        ? await client.query("SELECT craft_id FROM traditional_crafts WHERE craft_id = $1", [craftId])
        : await client.query("SELECT ma_nghe FROM nghe_truyen_thong WHERE ma_nghe = $1", [craftId]);

      if (!craftResult.rowCount) {
        await client.query("ROLLBACK");
        transactionStarted = false;
        return res.status(400).json({ success: false, message: "Nghề truyền thống đã chọn không còn tồn tại." });
      }

      const accountResult = isLegacyTable
        ? await client.query(
          `INSERT INTO accounts (full_name, email, password_hash, phone_number, role)
           VALUES ($1, $2, $3, $4, 'artisans')
           RETURNING account_id AS ma_tai_khoan, full_name AS ho_ten, email,
                     phone_number AS so_dien_thoai, avatar_url AS anh_dai_dien,
                     upper(role) AS vai_tro`,
          [name, email, passwordHash, phone]
        )
        : await client.query(
          `INSERT INTO tai_khoan (ho_ten, email, mat_khau_hash, sdt, vai_tro)
           VALUES ($1, $2, $3, $4, 'nghe_nhan')
           RETURNING ma_tk AS ma_tai_khoan, ho_ten, email, sdt AS so_dien_thoai,
                     anh_dai_dien, upper(vai_tro) AS vai_tro`,
          [name, email, passwordHash, phone]
        );
      const artisanId = accountResult.rows[0].ma_tai_khoan;

      if (isLegacyTable) {
        await client.query("INSERT INTO artisans (artisan_id) VALUES ($1)", [artisanId]);
        await client.query(
          "INSERT INTO artisan_crafts (artisan_id, craft_id) VALUES ($1, $2)",
          [artisanId, craftId]
        );
      } else {
        await client.query("INSERT INTO nghe_nhan (ma_nn) VALUES ($1)", [artisanId]);
        await client.query(
          "INSERT INTO nghe_nhan_nghe (ma_nn, ma_nghe) VALUES ($1, $2)",
          [artisanId, craftId]
        );
      }

      await client.query("COMMIT");
      transactionStarted = false;
      return res.status(201).json({
        success: true,
        message: "Đăng ký tài khoản nghệ nhân thành công.",
        data: { email: accountResult.rows[0].email },
      });
    } catch (error) {
      if (transactionStarted) {
        await client.query("ROLLBACK").catch((rollbackError) => {
          console.error("Không thể hoàn tác đăng ký nghệ nhân:", rollbackError);
        });
      }
      if (error.code === "23505") {
        return res.status(409).json({ success: false, message: "Email này đã được đăng ký." });
      }
      return next(error);
    } finally {
      if (client) client.release();
    }
  },

  async login(req, res, next) {
    const identifier = typeof req.body.identifier === "string" ? req.body.identifier.trim() : "";
    const { password } = req.body;
    const roleCandidates = allowedLoginRoles[req.body.accountType];

    if (!identifier || !validateCredentials(password) || !roleCandidates || !roleCandidates.length) {
      return res.status(400).json({ success: false, message: "Thông tin đăng nhập không hợp lệ." });
    }

    if (!process.env.JWT_SECRET) {
      return next(new Error("JWT_SECRET chưa được cấu hình."));
    }

    try {
      const tableName = await resolveAccountTable();
      const isLegacyTable = tableName === "accounts";
      const isEmail = identifier.includes("@");
      const roleFilter = roleCandidates.map((candidate) => candidate.toLowerCase());

      const accountResult = isLegacyTable
        ? isEmail
          ? await pool.query(
            `SELECT account_id AS ma_tai_khoan, full_name AS ho_ten, email,
                    phone_number AS so_dien_thoai, avatar_url AS anh_dai_dien, password_hash AS mat_khau,
                    lower(role) AS vai_tro, lower(account_status) AS trang_thai
             FROM accounts
             WHERE lower(email) = lower($1) AND lower(role) = ANY($2)
             LIMIT 1`,
            [identifier, roleFilter]
          )
          : await pool.query(
            `SELECT account_id AS ma_tai_khoan, full_name AS ho_ten, email,
                    phone_number AS so_dien_thoai, avatar_url AS anh_dai_dien, password_hash AS mat_khau,
                    lower(role) AS vai_tro, lower(account_status) AS trang_thai
             FROM accounts
             WHERE regexp_replace(coalesce(phone_number, ''), '\\D', '', 'g') = $1
               AND lower(role) = ANY($2)
             LIMIT 1`,
            [identifier.replace(/\D/g, ""), roleFilter]
          )
        : isEmail
          ? await pool.query(
            `SELECT ma_tk AS ma_tai_khoan, ho_ten, email, sdt AS so_dien_thoai, anh_dai_dien,
                    mat_khau_hash AS mat_khau, lower(vai_tro) AS vai_tro,
                    lower(trang_thai_tk) AS trang_thai
             FROM tai_khoan
             WHERE lower(email) = lower($1) AND lower(vai_tro) = ANY($2)
             LIMIT 1`,
            [identifier, roleFilter]
          )
          : await pool.query(
            `SELECT ma_tk AS ma_tai_khoan, ho_ten, email, sdt AS so_dien_thoai, anh_dai_dien,
                    mat_khau_hash AS mat_khau, lower(vai_tro) AS vai_tro,
                    lower(trang_thai_tk) AS trang_thai
             FROM tai_khoan
             WHERE regexp_replace(coalesce(sdt, ''), '\\D', '', 'g') = $1
               AND lower(vai_tro) = ANY($2)
             LIMIT 1`,
            [identifier.replace(/\D/g, ""), roleFilter]
          );

      const account = accountResult.rows[0];
      if (!account) {
        return res.status(401).json({ success: false, message: "Email/số điện thoại hoặc mật khẩu không chính xác." });
      }

      const normalizedRole = normalizeRole(account.vai_tro ?? account.role);
      const normalizedStatus = normalizeStatus(account.trang_thai ?? account.account_status);
      const isPasswordValid = await bcrypt.compare(password, account.mat_khau || account.password_hash);

      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: "Email/số điện thoại hoặc mật khẩu không chính xác." });
      }

      if (normalizedStatus !== "HOAT_DONG") {
        return res.status(403).json({ success: false, message: "Tài khoản chưa được kích hoạt hoặc đã bị khóa." });
      }

      return res.status(200).json({
        success: true,
        message: "Đăng nhập thành công.",
        data: createSession({ ...account, vai_tro: normalizedRole, role: normalizedRole, trang_thai: normalizedStatus }),
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = authController;
