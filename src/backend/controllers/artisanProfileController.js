const fs = require("fs/promises");
const path = require("path");
const pool = require("../config/database");
const cloudinary = require("../config/cloudinary");

const uploadDirectory = path.resolve(__dirname, "..", "uploads", "artisans");

async function removeUploadedFile(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Không thể xóa ảnh hồ sơ:", error);
    }
  }
}

function getCloudinaryErrorMessage(error) {
  const status = Number(error.http_code || error.status);
  const code = typeof error.code === "string" ? error.code : "";

  if (status === 401 || /invalid (api key|signature|credentials)/i.test(error.message || "")) {
    return "Cloudinary từ chối thông tin xác thực. Kiểm tra cấu hình CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY và CLOUDINARY_API_SECRET.";
  }
  if (status === 413 || /file too large|file size.*limit|payload too large/i.test(error.message || "")) {
    return "Tệp vượt quá giới hạn tải lên của Cloudinary. Hãy chọn tệp nhỏ hơn.";
  }
  if (status === 429) {
    return "Cloudinary đã giới hạn yêu cầu hoặc tài nguyên tài khoản. Hãy kiểm tra hạn mức Cloudinary.";
  }
  if (["ECONNREFUSED", "ECONNRESET", "ENOTFOUND", "ETIMEDOUT"].includes(code)) {
    return "Không kết nối được Cloudinary. Kiểm tra mạng, DNS hoặc tường lửa của máy chạy backend.";
  }
  if (status) return `Cloudinary từ chối tệp (HTTP ${status}). Kiểm tra định dạng và giới hạn tải lên.`;
  return "Không thể tải tư liệu lên Cloudinary. Kiểm tra cấu hình dịch vụ, kết nối mạng hoặc giới hạn tệp.";
}

async function uploadMediaToCloudinary(file, folder = "nghenhan/artisan-media") {
  const config = cloudinary.config();
  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    const error = new Error("Cloudinary chưa được cấu hình đầy đủ.");
    error.status = 503;
    error.publicMessage = "Dịch vụ tải tư liệu chưa được cấu hình. Hãy kiểm tra cấu hình Cloudinary trong backend.";
    throw error;
  }

  const resourceType = file.mediaType === "video" ? "video" : "image";
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        if (!result?.secure_url || !result?.public_id || !result?.resource_type) {
          return reject(new Error("Cloudinary không trả về thông tin tệp đã tải."));
        }
        return resolve(result);
      }
    );
    stream.end(file.buffer);
  });
}

async function removeCloudinaryMedia(media) {
  try {
    await cloudinary.uploader.destroy(media.public_id, {
      resource_type: media.resource_type || "image",
    });
  } catch (error) {
    console.error("Không thể dọn tư liệu trên Cloudinary:", error);
  }
}

async function usesLegacySchema(queryable = pool) {
  const { rows } = await queryable.query(
    "SELECT to_regclass('public.accounts') AS accounts, to_regclass('public.tai_khoan') AS tai_khoan"
  );
  return Boolean(rows[0]?.accounts && !rows[0]?.tai_khoan);
}

function profileQuery(isLegacySchema) {
  if (isLegacySchema) {
    return `SELECT a.account_id AS ma_tk, a.full_name AS ho_ten, a.email,
                   a.phone_number AS sdt, a.avatar_url AS anh_dai_dien,
                   NULL::date AS ngay_sinh,
                   NULL::text AS gioi_tinh,
                   ar.address AS dia_chi, ar.introduction AS gioi_thieu,
                   ar.years_of_experience AS so_nam_kn,
                   ar.craft_background AS qua_trinh_lam_nghe,
                   ''::text AS lang_nghe_mo_ta,
                   ''::text AS hoat_dong_trai_nghiem_mo_ta,
                   coalesce((
                     SELECT string_agg(DISTINCT tc.craft_name, ', ')
                     FROM artisan_crafts ac
                     JOIN traditional_crafts tc ON tc.craft_id = ac.craft_id
                     WHERE ac.artisan_id = a.account_id
                   ), '') AS nghe_truyen_thong,
                   coalesce((
                     SELECT string_agg(DISTINCT cv.craft_village_name, ', ')
                     FROM artisan_craft_villages acv
                     JOIN craft_villages cv ON cv.craft_village_id = acv.craft_village_id
                     WHERE acv.artisan_id = a.account_id
                   ), '') AS lang_nghe,
                   coalesce((
                     SELECT json_agg(json_build_object(
                       'name', ea.activity_name,
                       'venue', ea.venue,
                       'status', ea.activity_status
                     ) ORDER BY ea.activity_id)
                     FROM experience_activities ea
                     WHERE ea.artisan_id = a.account_id
                   ), '[]'::json) AS hoat_dong,
                   ar.verification_status AS trang_thai_xac_minh
            FROM accounts a
            LEFT JOIN artisans ar ON ar.artisan_id = a.account_id
            WHERE a.account_id = $1 AND lower(a.role) IN ('artisans', 'nghe_nhan')`;
  }

  return `SELECT tk.ma_tk, tk.ho_ten, tk.email, tk.sdt, tk.anh_dai_dien,
                 nn.ngay_sinh, nn.gioi_tinh, nn.dia_chi, nn.gioi_thieu, nn.so_nam_kn,
                 nn.qua_trinh_lam_nghe, nn.lang_nghe_mo_ta,
                 nn.hoat_dong_trai_nghiem_mo_ta,
                 coalesce((
                   SELECT string_agg(DISTINCT nt.ten_nghe, ', ')
                   FROM nghe_nhan_nghe nnn
                   JOIN nghe_truyen_thong nt ON nt.ma_nghe = nnn.ma_nghe
                   WHERE nnn.ma_nn = tk.ma_tk
                 ), '') AS nghe_truyen_thong,
                 coalesce((
                   SELECT string_agg(DISTINCT ln.ten_ln, ', ')
                   FROM nghe_nhan_lang_nghe nnln
                   JOIN lang_nghe ln ON ln.ma_ln = nnln.ma_ln
                   WHERE nnln.ma_nn = tk.ma_tk
                 ), '') AS lang_nghe,
                 coalesce((
                   SELECT json_agg(json_build_object(
                     'name', hd.ten_hd,
                     'venue', hd.dia_diem_to_chuc,
                     'status', hd.trang_thai_hd
                   ) ORDER BY hd.ma_hd)
                   FROM hoat_dong_trai_nghiem hd
                   WHERE hd.ma_nn = tk.ma_tk
                 ), '[]'::json) AS hoat_dong,
                 nn.trang_thai_xac_minh
          FROM tai_khoan tk
          LEFT JOIN nghe_nhan nn ON nn.ma_nn = tk.ma_tk
          WHERE tk.ma_tk = $1 AND tk.vai_tro = 'nghe_nhan'`;
}

const artisanProfileController = {
  async getProfile(req, res, next) {
    try {
      const isLegacySchema = await usesLegacySchema();
      const result = await pool.query(profileQuery(isLegacySchema), [req.user.id]);

      if (!result.rowCount) {
        return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ nghệ nhân." });
      }

      return res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
      return next(error);
    }
  },

  async updateProfile(req, res, next) {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const phone = typeof req.body.phone === "string" ? req.body.phone.trim() : "";
    const phoneDigits = phone.replace(/\D/g, "");
    const gender = typeof req.body.gender === "string" ? req.body.gender.trim() : "";
    const birthDate = typeof req.body.birthDate === "string" ? req.body.birthDate.trim() : "";
    const address = typeof req.body.address === "string" ? req.body.address.trim() : "";
    const introduction = typeof req.body.introduction === "string" ? req.body.introduction.trim() : "";
    const careerHistory = typeof req.body.careerHistory === "string" ? req.body.careerHistory.trim() : "";
    const craftVillageDescription = typeof req.body.craftVillageDescription === "string"
      ? req.body.craftVillageDescription.trim()
      : "";
    const experienceDescription = typeof req.body.experienceDescription === "string"
      ? req.body.experienceDescription.trim()
      : "";
    const years = Number(req.body.yearsOfExperience);

    if (!name || name.length > 100) {
      return res.status(400).json({ success: false, message: "Họ tên phải có từ 1 đến 100 ký tự." });
    }

    if (!["Nam", "Nữ", "Khác"].includes(gender)) {
      return res.status(400).json({ success: false, message: "Vui lòng chọn giới tính hợp lệ." });
    }

    if (phone && (phoneDigits.length < 8 || phoneDigits.length > 15)) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập số điện thoại hợp lệ." });
    }

    const birthDateValue = birthDate || null;
    const validBirthDate = !birthDateValue
      || (/^\d{4}-\d{2}-\d{2}$/.test(birthDateValue)
        && !Number.isNaN(Date.parse(`${birthDateValue}T00:00:00.000Z`))
        && new Date(`${birthDateValue}T00:00:00.000Z`).toISOString().slice(0, 10) === birthDateValue
        && birthDateValue < new Date().toISOString().slice(0, 10));

    if (!validBirthDate) {
      return res.status(400).json({ success: false, message: "Ngày sinh không hợp lệ hoặc nằm trong tương lai." });
    }

    if (
      address.length > 255
      || introduction.length > 10000
      || careerHistory.length > 10000
      || craftVillageDescription.length > 1000
      || experienceDescription.length > 10000
    ) {
      return res.status(400).json({ success: false, message: "Một hoặc nhiều thông tin vượt quá độ dài cho phép." });
    }

    if (!Number.isInteger(years) || years < 0 || years > 32767) {
      return res.status(400).json({ success: false, message: "Số năm kinh nghiệm phải là số nguyên không âm." });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const isLegacySchema = await usesLegacySchema(client);

      const accountResult = isLegacySchema
        ? await client.query(
          `UPDATE accounts
           SET full_name = $1, phone_number = $2
           WHERE account_id = $3 AND lower(role) IN ('artisans', 'nghe_nhan')
           RETURNING account_id`,
          [name, phoneDigits || null, req.user.id]
        )
        : await client.query(
          `UPDATE tai_khoan
           SET ho_ten = $1, sdt = $2
           WHERE ma_tk = $3 AND vai_tro = 'nghe_nhan'
           RETURNING ma_tk`,
          [name, phoneDigits || null, req.user.id]
        );

      if (!accountResult.rowCount) {
        await client.query("ROLLBACK");
        return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ nghệ nhân." });
      }

      if (isLegacySchema) {
        await client.query(
          `INSERT INTO artisans (artisan_id, address, introduction, years_of_experience, craft_background)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (artisan_id) DO UPDATE SET
             address = EXCLUDED.address,
             introduction = EXCLUDED.introduction,
             years_of_experience = EXCLUDED.years_of_experience,
             craft_background = EXCLUDED.craft_background`,
          [req.user.id, address || null, introduction || null, years, careerHistory || null]
        );
      } else {
        await client.query(
          `INSERT INTO nghe_nhan (
             ma_nn, ngay_sinh, gioi_tinh, dia_chi, gioi_thieu, so_nam_kn, qua_trinh_lam_nghe,
             lang_nghe_mo_ta, hoat_dong_trai_nghiem_mo_ta
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (ma_nn) DO UPDATE SET
             ngay_sinh = EXCLUDED.ngay_sinh,
             gioi_tinh = EXCLUDED.gioi_tinh,
             dia_chi = EXCLUDED.dia_chi,
             gioi_thieu = EXCLUDED.gioi_thieu,
             so_nam_kn = EXCLUDED.so_nam_kn,
             qua_trinh_lam_nghe = EXCLUDED.qua_trinh_lam_nghe,
             lang_nghe_mo_ta = EXCLUDED.lang_nghe_mo_ta,
             hoat_dong_trai_nghiem_mo_ta = EXCLUDED.hoat_dong_trai_nghiem_mo_ta`,
          [
            req.user.id,
            birthDateValue,
            gender || null,
            address || null,
            introduction || null,
            years,
            careerHistory || null,
            craftVillageDescription || null,
            experienceDescription || null,
          ]
        );
      }

      await client.query("COMMIT");
      return artisanProfileController.getProfile(req, res, next);
    } catch (error) {
      await client.query("ROLLBACK");
      return next(error);
    } finally {
      client.release();
    }
  },

  async uploadAvatar(req, res, next) {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Vui lòng chọn ảnh đại diện." });
    }

    let uploadedFile;
    try {
      try {
        uploadedFile = await uploadMediaToCloudinary(req.file, "nghenhan/artisan-avatars");
      } catch (error) {
        console.error("Cloudinary không tải được ảnh đại diện nghệ nhân:", error);
        error.status = error.status || 502;
        error.publicMessage = error.publicMessage || getCloudinaryErrorMessage(error);
        throw error;
      }

      const isLegacySchema = await usesLegacySchema();
      const result = isLegacySchema
        ? await pool.query(
          `UPDATE accounts
           SET avatar_url = $1
           WHERE account_id = $2 AND lower(role) IN ('artisans', 'nghe_nhan')
           RETURNING avatar_url AS anh_dai_dien`,
          [uploadedFile.secure_url, req.user.id]
        )
        : await pool.query(
          `WITH previous AS (
             SELECT anh_dai_dien_public_id, anh_dai_dien_resource_type
             FROM tai_khoan
             WHERE ma_tk = $4 AND vai_tro = 'nghe_nhan'
           ), updated AS (
             UPDATE tai_khoan
             SET anh_dai_dien = $1,
                 anh_dai_dien_public_id = $2,
                 anh_dai_dien_resource_type = $3
             WHERE ma_tk = $4 AND vai_tro = 'nghe_nhan'
             RETURNING anh_dai_dien
           )
           SELECT updated.anh_dai_dien,
                  previous.anh_dai_dien_public_id,
                  previous.anh_dai_dien_resource_type
           FROM updated CROSS JOIN previous`,
          [uploadedFile.secure_url, uploadedFile.public_id, uploadedFile.resource_type, req.user.id]
        );

      if (!result.rowCount) {
        await removeCloudinaryMedia(uploadedFile);
        return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ nghệ nhân." });
      }

      const previousAvatar = !isLegacySchema && result.rows[0].anh_dai_dien_public_id
        ? {
          public_id: result.rows[0].anh_dai_dien_public_id,
          resource_type: result.rows[0].anh_dai_dien_resource_type,
        }
        : null;
      if (previousAvatar && previousAvatar.public_id !== uploadedFile.public_id) {
        await removeCloudinaryMedia(previousAvatar);
      }

      return res.status(200).json({
        success: true,
        message: "Đã cập nhật ảnh đại diện.",
        data: { avatarUrl: result.rows[0].anh_dai_dien },
      });
    } catch (error) {
      if (uploadedFile?.public_id) await removeCloudinaryMedia(uploadedFile);
      return next(error);
    }
  },

  async getImages(req, res, next) {
    try {
      const result = await pool.query(
        `SELECT ma_pt, duong_dan_tep AS url, chu_thich AS caption,
                ngay_tai_len AS uploaded_at
         FROM da_phuong_tien
         WHERE ma_nn = $1 AND loai_tu_lieu = 'hinh_anh'
         ORDER BY ngay_tai_len DESC, ma_pt DESC`,
        [req.user.id]
      );

      return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      return next(error);
    }
  },

  async getMedia(req, res, next) {
    try {
      const isLegacySchema = await usesLegacySchema();
      const result = isLegacySchema
        ? await pool.query(
          `SELECT mf.media_id AS id, mf.media_type AS type, mf.file_url AS url,
                  mf.caption, mf.uploaded_at,
                  coalesce(p.product_name, 'Thư viện nghệ nhân') AS category
           FROM media_files mf
           LEFT JOIN products p ON p.product_id = mf.product_id
           WHERE mf.uploaded_by_account_id = $1
             AND mf.media_type IN ('hinh_anh', 'video')
           ORDER BY mf.uploaded_at DESC, mf.media_id DESC`,
          [req.user.id]
        )
        : await pool.query(
          `SELECT pt.ma_pt AS id, pt.loai_tu_lieu AS type,
                  pt.duong_dan_tep AS url, pt.chu_thich AS caption,
                  pt.ngay_tai_len AS uploaded_at,
                  coalesce(sp.ten_sp, 'Thư viện nghệ nhân') AS category
           FROM da_phuong_tien pt
           LEFT JOIN san_pham sp ON sp.ma_sp = pt.ma_sp
           WHERE pt.ma_tk_tai_len = $1
             AND pt.loai_tu_lieu IN ('hinh_anh', 'video')
           ORDER BY pt.ngay_tai_len DESC, pt.ma_pt DESC`,
          [req.user.id]
        );

      return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      return next(error);
    }
  },

  async deleteMedia(req, res, next) {
    if (!/^[1-9]\d*$/.test(req.params.id)) {
      return res.status(400).json({ success: false, message: "Mã tư liệu không hợp lệ." });
    }

    try {
      const isLegacySchema = await usesLegacySchema();
      const result = isLegacySchema
        ? await pool.query(
          `DELETE FROM media_files
           WHERE media_id = $1 AND uploaded_by_account_id = $2
           RETURNING file_url AS url`,
          [req.params.id, req.user.id]
        )
        : await pool.query(
          `DELETE FROM da_phuong_tien
           WHERE ma_pt = $1 AND ma_tk_tai_len = $2
           RETURNING duong_dan_tep AS url, cloudinary_public_id, cloudinary_resource_type`,
          [req.params.id, req.user.id]
        );

      if (!result.rowCount) {
        return res.status(404).json({ success: false, message: "Không tìm thấy tư liệu của bạn." });
      }

      const media = result.rows[0];
      if (media.cloudinary_public_id) {
        await removeCloudinaryMedia({
          public_id: media.cloudinary_public_id,
          resource_type: media.cloudinary_resource_type,
        });
      } else if (media.url.startsWith("/uploads/artisans/")) {
        await removeUploadedFile(path.join(uploadDirectory, path.basename(media.url)));
      }

      return res.status(200).json({ success: true, message: "Đã xóa tư liệu khỏi thư viện." });
    } catch (error) {
      return next(error);
    }
  },

  async getReviews(req, res, next) {
    try {
      const isLegacySchema = await usesLegacySchema();
      const result = isLegacySchema
        ? await pool.query(
          `SELECT r.review_id AS id, r.rating,
                  coalesce(r.review_content, '') AS comment,
                  r.reviewed_at AS "createdAt",
                  visitor.full_name AS "visitorName",
                  visitor.avatar_url AS "visitorAvatar",
                  CASE
                    WHEN r.artisan_id IS NOT NULL THEN 'artisan'
                    WHEN r.product_id IS NOT NULL THEN 'product'
                    ELSE 'activity'
                  END AS "targetType",
                  coalesce(p.product_name, ea.activity_name, 'Hồ sơ nghệ nhân') AS subject
           FROM reviews r
           JOIN accounts visitor ON visitor.account_id = r.account_id
           LEFT JOIN products p ON p.product_id = r.product_id
           LEFT JOIN experience_activities ea ON ea.activity_id = r.activity_id
           WHERE r.moderation_status = 'da_duyet'
             AND (
               r.artisan_id = $1
               OR r.product_id IN (SELECT product_id FROM products WHERE artisan_id = $1)
               OR r.activity_id IN (SELECT activity_id FROM experience_activities WHERE artisan_id = $1)
             )
           ORDER BY r.reviewed_at DESC, r.review_id DESC`,
          [req.user.id]
        )
        : await pool.query(
          `SELECT dg.ma_dg AS id, dg.diem_danh_gia AS rating,
                  coalesce(dg.noi_dung_danh_gia, '') AS comment,
                  dg.ngay_danh_gia AS "createdAt",
                  visitor.ho_ten AS "visitorName",
                  visitor.anh_dai_dien AS "visitorAvatar",
                  CASE
                    WHEN dg.ma_nn IS NOT NULL THEN 'artisan'
                    WHEN dg.ma_sp IS NOT NULL THEN 'product'
                    ELSE 'activity'
                  END AS "targetType",
                  coalesce(sp.ten_sp, hd.ten_hd, 'Hồ sơ nghệ nhân') AS subject
           FROM danh_gia dg
           JOIN tai_khoan visitor ON visitor.ma_tk = dg.ma_tk
           LEFT JOIN san_pham sp ON sp.ma_sp = dg.ma_sp
           LEFT JOIN hoat_dong_trai_nghiem hd ON hd.ma_hd = dg.ma_hd
           WHERE dg.trang_thai_kiem_duyet = 'da_duyet'
             AND (
               dg.ma_nn = $1
               OR dg.ma_sp IN (SELECT ma_sp FROM san_pham WHERE ma_nn = $1)
               OR dg.ma_hd IN (SELECT ma_hd FROM hoat_dong_trai_nghiem WHERE ma_nn = $1)
             )
           ORDER BY dg.ngay_danh_gia DESC, dg.ma_dg DESC`,
          [req.user.id]
        );

      return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      return next(error);
    }
  },

  async uploadMedia(req, res, next) {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Vui lòng chọn ảnh hoặc video để tải lên." });
    }

    const caption = typeof req.body.caption === "string" ? req.body.caption.trim() : "";
    if (caption.length > 500) {
      return res.status(400).json({ success: false, message: "Chú thích không được vượt quá 500 ký tự." });
    }

    const mediaCaption = caption || req.file.originalname;
    let uploadedFile;
    try {
      try {
        uploadedFile = await uploadMediaToCloudinary(req.file);
      } catch (error) {
        console.error("Cloudinary không tải được tư liệu thư viện nghệ nhân:", error);
        error.status = error.status || 502;
        error.publicMessage = error.publicMessage || getCloudinaryErrorMessage(error);
        throw error;
      }

      const isLegacySchema = await usesLegacySchema();
      const result = isLegacySchema
        ? await pool.query(
          `INSERT INTO media_files (uploaded_by_account_id, media_type, file_url, caption, artisan_id)
           SELECT a.account_id, $2, $3, $4, a.account_id
           FROM accounts a
           WHERE a.account_id = $1 AND lower(a.role) IN ('artisans', 'nghe_nhan')
           RETURNING media_id AS id, media_type AS type, file_url AS url,
                     caption, uploaded_at`,
          [req.user.id, req.file.mediaType, uploadedFile.secure_url, mediaCaption]
        )
        : await pool.query(
          `INSERT INTO da_phuong_tien
             (ma_tk_tai_len, loai_tu_lieu, duong_dan_tep, chu_thich, ma_nn,
              cloudinary_public_id, cloudinary_resource_type)
           SELECT tk.ma_tk, $2, $3, $4, tk.ma_tk, $5, $6
           FROM tai_khoan tk
           WHERE tk.ma_tk = $1 AND tk.vai_tro = 'nghe_nhan'
           RETURNING ma_pt AS id, loai_tu_lieu AS type, duong_dan_tep AS url,
                     chu_thich AS caption, ngay_tai_len AS uploaded_at`,
          [
            req.user.id,
            req.file.mediaType,
            uploadedFile.secure_url,
            mediaCaption,
            uploadedFile.public_id,
            uploadedFile.resource_type,
          ]
        );

      if (!result.rowCount) {
        await removeCloudinaryMedia(uploadedFile);
        return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ nghệ nhân." });
      }

      return res.status(201).json({
        success: true,
        message: "Đã tải tư liệu lên thư viện.",
        data: {
          ...result.rows[0],
          category: "Thư viện nghệ nhân",
          cloudinary_public_id: uploadedFile.public_id,
          cloudinary_resource_type: uploadedFile.resource_type,
        },
      });
    } catch (error) {
      if (uploadedFile?.public_id) await removeCloudinaryMedia(uploadedFile);
      return next(error);
    }
  },

  async uploadImage(req, res, next) {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Vui lòng chọn ảnh cần tải lên." });
    }

    const caption = typeof req.body.caption === "string" ? req.body.caption.trim() : "";
    if (caption.length > 500) {
      return res.status(400).json({ success: false, message: "Chú thích không được vượt quá 500 ký tự." });
    }
    const imageCaption = caption || req.file.originalname.slice(0, 500);

    let uploadedFile;
    try {
      try {
        uploadedFile = await uploadMediaToCloudinary(req.file);
      } catch (error) {
        console.error("Cloudinary không tải được ảnh hồ sơ nghệ nhân:", error);
        error.status = error.status || 502;
        error.publicMessage = error.publicMessage || getCloudinaryErrorMessage(error);
        throw error;
      }

      const result = await pool.query(
        `INSERT INTO da_phuong_tien
           (ma_tk_tai_len, loai_tu_lieu, duong_dan_tep, chu_thich, ma_nn,
            cloudinary_public_id, cloudinary_resource_type)
         SELECT tk.ma_tk, 'hinh_anh', $2, $3, tk.ma_tk, $4, $5
         FROM tai_khoan tk
         WHERE tk.ma_tk = $1 AND tk.vai_tro = 'nghe_nhan'
         RETURNING ma_pt, duong_dan_tep AS url, chu_thich AS caption,
                   ngay_tai_len AS uploaded_at`,
        [
          req.user.id,
          uploadedFile.secure_url,
          imageCaption,
          uploadedFile.public_id,
          uploadedFile.resource_type,
        ]
      );

      if (!result.rowCount) {
        await removeCloudinaryMedia(uploadedFile);
        return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ nghệ nhân." });
      }

      return res.status(201).json({
        success: true,
        message: "Đã tải ảnh lên hồ sơ.",
        data: {
          ...result.rows[0],
          cloudinary_public_id: uploadedFile.public_id,
          cloudinary_resource_type: uploadedFile.resource_type,
        },
      });
    } catch (error) {
      if (uploadedFile?.public_id) await removeCloudinaryMedia(uploadedFile);
      return next(error);
    }
  },

  async deleteImage(req, res, next) {
    if (!/^[1-9]\d*$/.test(req.params.id)) {
      return res.status(400).json({ success: false, message: "Mã ảnh không hợp lệ." });
    }

    try {
      const result = await pool.query(
        `DELETE FROM da_phuong_tien
         WHERE ma_pt = $1 AND ma_nn = $2 AND loai_tu_lieu = 'hinh_anh'
         RETURNING duong_dan_tep, cloudinary_public_id, cloudinary_resource_type`,
        [req.params.id, req.user.id]
      );

      if (!result.rowCount) {
        return res.status(404).json({ success: false, message: "Không tìm thấy ảnh trong hồ sơ của bạn." });
      }

      const {
        duong_dan_tep: imagePath,
        cloudinary_public_id: publicId,
        cloudinary_resource_type: resourceType,
      } = result.rows[0];
      if (publicId) {
        await removeCloudinaryMedia({ public_id: publicId, resource_type: resourceType });
      } else if (imagePath.startsWith("/uploads/artisans/")) {
        await removeUploadedFile(path.join(uploadDirectory, path.basename(imagePath)));
      }

      return res.status(200).json({ success: true, message: "Đã xóa ảnh khỏi hồ sơ." });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = artisanProfileController;
