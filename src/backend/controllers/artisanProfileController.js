const fs = require("fs/promises");
const path = require("path");
const pool = require("../config/database");

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

function parseCraftNames(value) {
  if (typeof value !== "string") return null;

  const names = value.split(",").map((name) => name.trim()).filter(Boolean);
  return [...new Set(names)];
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
                   ar.address AS dia_chi, ar.introduction AS gioi_thieu,
                   ar.years_of_experience AS so_nam_kn,
                   ar.craft_background AS qua_trinh_lam_nghe,
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
                 nn.dia_chi, nn.gioi_thieu, nn.so_nam_kn, nn.qua_trinh_lam_nghe,
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
    const address = typeof req.body.address === "string" ? req.body.address.trim() : "";
    const introduction = typeof req.body.introduction === "string" ? req.body.introduction.trim() : "";
    const careerHistory = typeof req.body.careerHistory === "string" ? req.body.careerHistory.trim() : "";
    const years = Number(req.body.yearsOfExperience);
    const craftNames = parseCraftNames(req.body.crafts);

    if (!name || name.length > 100) {
      return res.status(400).json({ success: false, message: "Họ tên phải có từ 1 đến 100 ký tự." });
    }

    if (phone && (phoneDigits.length < 8 || phoneDigits.length > 15)) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập số điện thoại hợp lệ." });
    }

    if (address.length > 255 || introduction.length > 10000 || careerHistory.length > 10000) {
      return res.status(400).json({ success: false, message: "Một hoặc nhiều thông tin vượt quá độ dài cho phép." });
    }

    if (!Number.isInteger(years) || years < 0 || years > 32767) {
      return res.status(400).json({ success: false, message: "Số năm kinh nghiệm phải là số nguyên không âm." });
    }

    if (!craftNames) {
      return res.status(400).json({ success: false, message: "Danh sách nghề truyền thống không hợp lệ." });
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
          `INSERT INTO nghe_nhan (ma_nn, dia_chi, gioi_thieu, so_nam_kn, qua_trinh_lam_nghe)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (ma_nn) DO UPDATE SET
             dia_chi = EXCLUDED.dia_chi,
             gioi_thieu = EXCLUDED.gioi_thieu,
             so_nam_kn = EXCLUDED.so_nam_kn,
             qua_trinh_lam_nghe = EXCLUDED.qua_trinh_lam_nghe`,
          [req.user.id, address || null, introduction || null, years, careerHistory || null]
        );
      }

      const craftsResult = craftNames.length
        ? isLegacySchema
          ? await client.query(
            "SELECT craft_id AS id FROM traditional_crafts WHERE craft_name = ANY($1::text[])",
            [craftNames]
          )
          : await client.query(
            "SELECT ma_nghe AS id FROM nghe_truyen_thong WHERE ten_nghe = ANY($1::text[])",
            [craftNames]
          )
        : { rows: [], rowCount: 0 };

      if (craftsResult.rowCount !== craftNames.length) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          message: "Một hoặc nhiều nghề không tồn tại. Hãy nhập đúng tên nghề có trong danh sách hệ thống.",
        });
      }

      const craftIds = craftsResult.rows.map((craft) => craft.id);
      if (craftIds.length) {
        if (isLegacySchema) {
          await client.query(
            "DELETE FROM artisan_crafts WHERE artisan_id = $1 AND NOT (craft_id = ANY($2::bigint[]))",
            [req.user.id, craftIds]
          );
          await client.query(
            `INSERT INTO artisan_crafts (artisan_id, craft_id)
             SELECT $1, unnest($2::bigint[])
             ON CONFLICT (artisan_id, craft_id) DO NOTHING`,
            [req.user.id, craftIds]
          );
        } else {
          await client.query(
            "DELETE FROM nghe_nhan_nghe WHERE ma_nn = $1 AND NOT (ma_nghe = ANY($2::bigint[]))",
            [req.user.id, craftIds]
          );
          await client.query(
            `INSERT INTO nghe_nhan_nghe (ma_nn, ma_nghe)
             SELECT $1, unnest($2::bigint[])
             ON CONFLICT (ma_nn, ma_nghe) DO NOTHING`,
            [req.user.id, craftIds]
          );
        }
      } else {
        await client.query(
          isLegacySchema
            ? "DELETE FROM artisan_crafts WHERE artisan_id = $1"
            : "DELETE FROM nghe_nhan_nghe WHERE ma_nn = $1",
          [req.user.id]
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

    const imageUrl = `/uploads/artisans/${req.file.filename}`;
    try {
      const isLegacySchema = await usesLegacySchema();
      const result = isLegacySchema
        ? await pool.query(
          `UPDATE accounts
           SET avatar_url = $1
           WHERE account_id = $2 AND lower(role) IN ('artisans', 'nghe_nhan')
           RETURNING avatar_url AS anh_dai_dien`,
          [imageUrl, req.user.id]
        )
        : await pool.query(
          `UPDATE tai_khoan
           SET anh_dai_dien = $1
           WHERE ma_tk = $2 AND vai_tro = 'nghe_nhan'
           RETURNING anh_dai_dien`,
          [imageUrl, req.user.id]
        );

      if (!result.rowCount) {
        await removeUploadedFile(req.file.path);
        return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ nghệ nhân." });
      }

      return res.status(200).json({
        success: true,
        message: "Đã cập nhật ảnh đại diện.",
        data: { avatarUrl: result.rows[0].anh_dai_dien },
      });
    } catch (error) {
      await removeUploadedFile(req.file.path);
      return next(error);
    }
  },

  async getImages(req, res, next) {
    try {
      const isLegacySchema = await usesLegacySchema();
      const result = isLegacySchema
        ? await pool.query(
          `SELECT media_id AS ma_pt,
                  CASE WHEN file_url LIKE '/%' THEN file_url ELSE '/' || file_url END AS url,
                  caption, uploaded_at
           FROM media_files
           WHERE artisan_id = $1 AND media_type = 'hinh_anh'
           ORDER BY uploaded_at DESC, media_id DESC`,
          [req.user.id]
        )
        : await pool.query(
          `SELECT ma_pt,
                  CASE WHEN duong_dan_tep LIKE '/%' THEN duong_dan_tep ELSE '/' || duong_dan_tep END AS url,
                  chu_thich AS caption, ngay_tai_len AS uploaded_at
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
      await removeUploadedFile(req.file.path);
      return res.status(400).json({ success: false, message: "Chú thích không được vượt quá 500 ký tự." });
    }

    const mediaUrl = `/uploads/artisans/${req.file.filename}`;
    try {
      const isLegacySchema = await usesLegacySchema();
      const result = isLegacySchema
        ? await pool.query(
          `INSERT INTO media_files (uploaded_by_account_id, media_type, file_url, caption, artisan_id)
           SELECT a.account_id, $2, $3, $4, a.account_id
           FROM accounts a
           WHERE a.account_id = $1 AND lower(a.role) IN ('artisans', 'nghe_nhan')
           RETURNING media_id AS id, media_type AS type, file_url AS url,
                     caption, uploaded_at`,
          [req.user.id, req.file.mediaType, mediaUrl, caption || null]
        )
        : await pool.query(
          `INSERT INTO da_phuong_tien
             (ma_tk_tai_len, loai_tu_lieu, duong_dan_tep, chu_thich, ma_nn)
           SELECT tk.ma_tk, $2, $3, $4, tk.ma_tk
           FROM tai_khoan tk
           WHERE tk.ma_tk = $1 AND tk.vai_tro = 'nghe_nhan'
           RETURNING ma_pt AS id, loai_tu_lieu AS type, duong_dan_tep AS url,
                     chu_thich AS caption, ngay_tai_len AS uploaded_at`,
          [req.user.id, req.file.mediaType, mediaUrl, caption || null]
        );

      if (!result.rowCount) {
        await removeUploadedFile(req.file.path);
        return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ nghệ nhân." });
      }

      return res.status(201).json({
        success: true,
        message: "Đã tải tư liệu lên thư viện.",
        data: { ...result.rows[0], category: "Thư viện nghệ nhân" },
      });
    } catch (error) {
      await removeUploadedFile(req.file.path);
      return next(error);
    }
  },

  async uploadImage(req, res, next) {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Vui lòng chọn ảnh cần tải lên." });
    }

    const caption = typeof req.body.caption === "string" ? req.body.caption.trim() : "";
    if (caption.length > 500) {
      await removeUploadedFile(req.file.path);
      return res.status(400).json({ success: false, message: "Chú thích không được vượt quá 500 ký tự." });
    }

    try {
      const isLegacySchema = await usesLegacySchema();
      const result = isLegacySchema
        ? await pool.query(
          `INSERT INTO media_files (uploaded_by_account_id, media_type, file_url, caption, artisan_id)
           SELECT a.account_id, 'hinh_anh', $2, $3, a.account_id
           FROM accounts a
           WHERE a.account_id = $1 AND lower(a.role) IN ('artisans', 'nghe_nhan')
           RETURNING media_id AS ma_pt, file_url AS url, caption, uploaded_at`,
          [req.user.id, `/uploads/artisans/${req.file.filename}`, caption || null]
        )
        : await pool.query(
          `INSERT INTO da_phuong_tien (ma_tk_tai_len, loai_tu_lieu, duong_dan_tep, chu_thich, ma_nn)
           SELECT tk.ma_tk, 'hinh_anh', $2, $3, tk.ma_tk
           FROM tai_khoan tk
           WHERE tk.ma_tk = $1 AND tk.vai_tro = 'nghe_nhan'
           RETURNING ma_pt, duong_dan_tep AS url, chu_thich AS caption, ngay_tai_len AS uploaded_at`,
          [req.user.id, `/uploads/artisans/${req.file.filename}`, caption || null]
        );

      if (!result.rowCount) {
        await removeUploadedFile(req.file.path);
        return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ nghệ nhân." });
      }

      return res.status(201).json({ success: true, message: "Đã tải ảnh lên hồ sơ.", data: result.rows[0] });
    } catch (error) {
      await removeUploadedFile(req.file.path);
      return next(error);
    }
  },

  async deleteImage(req, res, next) {
    if (!/^[1-9]\d*$/.test(req.params.id)) {
      return res.status(400).json({ success: false, message: "Mã ảnh không hợp lệ." });
    }

    try {
      const isLegacySchema = await usesLegacySchema();
      const result = isLegacySchema
        ? await pool.query(
          "DELETE FROM media_files WHERE media_id = $1 AND artisan_id = $2 RETURNING file_url AS duong_dan_tep",
          [req.params.id, req.user.id]
        )
        : await pool.query(
          "DELETE FROM da_phuong_tien WHERE ma_pt = $1 AND ma_nn = $2 RETURNING duong_dan_tep",
          [req.params.id, req.user.id]
        );

      if (!result.rowCount) {
        return res.status(404).json({ success: false, message: "Không tìm thấy ảnh trong hồ sơ của bạn." });
      }

      const imagePath = result.rows[0].duong_dan_tep;
      if (imagePath.startsWith("/uploads/artisans/")) {
        await removeUploadedFile(path.join(uploadDirectory, path.basename(imagePath)));
      }

      return res.status(200).json({ success: true, message: "Đã xóa ảnh khỏi hồ sơ." });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = artisanProfileController;
