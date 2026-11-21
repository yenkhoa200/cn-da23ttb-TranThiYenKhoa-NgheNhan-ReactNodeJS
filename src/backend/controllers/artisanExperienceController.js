const pool = require("../config/database");
const cloudinary = require("../config/cloudinary");

const statusMap = {
  draft: "nhap",
  published: "dang_mo",
};

function validId(value) {
  return /^[1-9]\d*$/.test(String(value));
}

function validateActivity(body) {
  const craftId = body.craftId === "" || body.craftId === null || body.craftId === undefined
    ? null
    : Number(body.craftId);
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const location = typeof body.location === "string" ? body.location.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const schedule = typeof body.schedule === "string" ? body.schedule.trim() : "";
  const requirements = typeof body.requirements === "string" ? body.requirements.trim() : "";
  const duration = Number(body.duration);
  const capacity = Number(body.capacity);
  const status = body.status === undefined ? "nhap" : statusMap[body.status];

  if (!title || title.length > 200) return { error: "Tên hoạt động không được để trống hoặc quá 200 ký tự." };
  if (!location || location.length > 255) return { error: "Địa điểm không được để trống hoặc quá 255 ký tự." };
  if (!Number.isInteger(duration) || duration < 1 || duration > 32767) return { error: "Thời lượng phải là số nguyên dương." };
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 32767) return { error: "Sức chứa phải là số nguyên dương." };
  if (schedule.length > 255) return { error: "Lịch tổ chức không được vượt quá 255 ký tự." };
  if (craftId !== null && (!Number.isSafeInteger(craftId) || craftId <= 0)) return { error: "Nghề truyền thống không hợp lệ." };
  if (!status) return { error: "Trạng thái hoạt động không hợp lệ." };

  return {
    data: {
      craftId,
      title,
      location,
      description: description || null,
      schedule: schedule || null,
      requirements: requirements || null,
      duration,
      capacity,
      status,
    },
  };
}

async function findOwnedActivity(id, artisanId) {
  const result = await pool.query(
    "SELECT ma_hd FROM hoat_dong_trai_nghiem WHERE ma_hd = $1 AND ma_nn = $2",
    [id, artisanId]
  );
  return result.rowCount > 0;
}

async function uploadImage(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "nghenhan/experiences", resource_type: "image" },
      (error, result) => error ? reject(error) : resolve(result)
    );
    stream.end(file.buffer);
  });
}

const artisanExperienceController = {
  async listPublic(req, res, next) {
    try {
      const result = await pool.query(
        `SELECT hd.ma_hd AS id, hd.ten_hd AS title, nt.ten_nghe AS category,
                hd.mo_ta_hd AS description, hd.dia_diem_to_chuc AS place,
                hd.thoi_luong_phut AS duration, hd.sl_tham_gia_max AS max_participants,
                hd.thoi_gian_to_chuc AS schedule,
                hd.yeu_cau_tham_gia AS requirements,
                (
                  SELECT pt.duong_dan_tep
                  FROM da_phuong_tien pt
                  WHERE pt.ma_hd = hd.ma_hd AND pt.loai_tu_lieu = 'hinh_anh'
                  ORDER BY pt.ngay_tai_len DESC, pt.ma_pt DESC
                  LIMIT 1
                ) AS image
         FROM hoat_dong_trai_nghiem hd
         JOIN tai_khoan tk ON tk.ma_tk = hd.ma_nn AND tk.trang_thai_tk = 'hoat_dong'
         LEFT JOIN nghe_truyen_thong nt ON nt.ma_nghe = hd.ma_nghe
         WHERE hd.trang_thai_hd = 'dang_mo'
         ORDER BY hd.ngay_tao DESC, hd.ma_hd DESC`
      );
      return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      return next(error);
    }
  },

  async list(req, res, next) {
    try {
      const result = await pool.query(
        `SELECT hd.ma_hd AS id, hd.ma_nghe AS craft_id, nt.ten_nghe AS craft,
                hd.ten_hd AS title, hd.mo_ta_hd AS description,
                hd.dia_diem_to_chuc AS location,
                hd.thoi_luong_phut AS duration, hd.sl_tham_gia_max AS capacity,
                hd.thoi_gian_to_chuc AS schedule,
                hd.yeu_cau_tham_gia AS requirements,
                CASE hd.trang_thai_hd
                  WHEN 'nhap' THEN 'draft'
                  WHEN 'dang_mo' THEN 'published'
                  ELSE hd.trang_thai_hd
                END AS status,
                hd.ngay_tao AS created_at,
                (
                  SELECT pt.duong_dan_tep
                  FROM da_phuong_tien pt
                  WHERE pt.ma_hd = hd.ma_hd AND pt.loai_tu_lieu = 'hinh_anh'
                  ORDER BY pt.ngay_tai_len DESC, pt.ma_pt DESC
                  LIMIT 1
                ) AS image
         FROM hoat_dong_trai_nghiem hd
         LEFT JOIN nghe_truyen_thong nt ON nt.ma_nghe = hd.ma_nghe
         WHERE hd.ma_nn = $1
         ORDER BY hd.ngay_tao DESC, hd.ma_hd DESC`,
        [req.user.id]
      );
      return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      return next(error);
    }
  },

  async create(req, res, next) {
    const validated = validateActivity(req.body);
    if (validated.error) return res.status(400).json({ success: false, message: validated.error });

    try {
      const { data } = validated;
      if (data.craftId !== null) {
        const craft = await pool.query(
          "SELECT 1 FROM nghe_nhan_nghe WHERE ma_nn = $1 AND ma_nghe = $2",
          [req.user.id, data.craftId]
        );
        if (!craft.rowCount) {
          return res.status(400).json({ success: false, message: "Nghề này chưa được thêm vào hồ sơ nghệ nhân." });
        }
      }

      const result = await pool.query(
        `INSERT INTO hoat_dong_trai_nghiem
           (ma_nn, ma_nghe, ten_hd, mo_ta_hd, dia_diem_to_chuc,
            thoi_luong_phut, sl_tham_gia_max, thoi_gian_to_chuc,
            yeu_cau_tham_gia, trang_thai_hd)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING ma_hd AS id, ma_nghe AS craft_id, ten_hd AS title,
                   mo_ta_hd AS description, dia_diem_to_chuc AS location,
                   thoi_luong_phut AS duration, sl_tham_gia_max AS capacity,
                   thoi_gian_to_chuc AS schedule,
                   yeu_cau_tham_gia AS requirements, ngay_tao AS created_at`,
        [
          req.user.id, data.craftId, data.title, data.description, data.location,
          data.duration, data.capacity, data.schedule, data.requirements, data.status,
        ]
      );
      return res.status(201).json({
        success: true,
        message: "Đã lưu hoạt động.",
        data: { ...result.rows[0], status: data.status === "nhap" ? "draft" : "published", image: null },
      });
    } catch (error) {
      return next(error);
    }
  },

  async update(req, res, next) {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Mã hoạt động không hợp lệ." });
    const validated = validateActivity(req.body);
    if (validated.error) return res.status(400).json({ success: false, message: validated.error });

    try {
      const { data } = validated;
      if (data.craftId !== null) {
        const craft = await pool.query(
          "SELECT 1 FROM nghe_nhan_nghe WHERE ma_nn = $1 AND ma_nghe = $2",
          [req.user.id, data.craftId]
        );
        if (!craft.rowCount) {
          return res.status(400).json({ success: false, message: "Nghề này chưa được thêm vào hồ sơ nghệ nhân." });
        }
      }

      const result = await pool.query(
        `UPDATE hoat_dong_trai_nghiem
         SET ma_nghe = $1, ten_hd = $2, mo_ta_hd = $3, dia_diem_to_chuc = $4,
             thoi_luong_phut = $5, sl_tham_gia_max = $6,
             thoi_gian_to_chuc = $7, yeu_cau_tham_gia = $8, trang_thai_hd = $9
         WHERE ma_hd = $10 AND ma_nn = $11
         RETURNING ma_hd AS id, ma_nghe AS craft_id, ten_hd AS title,
                   mo_ta_hd AS description, dia_diem_to_chuc AS location,
                   thoi_luong_phut AS duration, sl_tham_gia_max AS capacity,
                   thoi_gian_to_chuc AS schedule,
                   yeu_cau_tham_gia AS requirements, ngay_tao AS created_at`,
        [
          data.craftId, data.title, data.description, data.location, data.duration,
          data.capacity, data.schedule, data.requirements, data.status,
          req.params.id, req.user.id,
        ]
      );
      if (!result.rowCount) return res.status(404).json({ success: false, message: "Không tìm thấy hoạt động." });
      return res.status(200).json({
        success: true,
        message: "Đã cập nhật hoạt động.",
        data: { ...result.rows[0], status: data.status === "nhap" ? "draft" : "published" },
      });
    } catch (error) {
      return next(error);
    }
  },

  async remove(req, res, next) {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Mã hoạt động không hợp lệ." });
    try {
      const client = await pool.connect();
      let media;
      try {
        await client.query("BEGIN");
        const owned = await client.query(
          "SELECT 1 FROM hoat_dong_trai_nghiem WHERE ma_hd = $1 AND ma_nn = $2 FOR UPDATE",
          [req.params.id, req.user.id]
        );
        if (!owned.rowCount) {
          await client.query("ROLLBACK");
          return res.status(404).json({ success: false, message: "Không tìm thấy hoạt động." });
        }
        const mediaResult = await client.query(
          "SELECT cloudinary_public_id, cloudinary_resource_type FROM da_phuong_tien WHERE ma_hd = $1 AND cloudinary_public_id IS NOT NULL",
          [req.params.id]
        );
        media = mediaResult.rows;
        await client.query(
          "DELETE FROM hoat_dong_trai_nghiem WHERE ma_hd = $1 AND ma_nn = $2",
          [req.params.id, req.user.id]
        );
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }

      for (const item of media) {
        try {
          await cloudinary.uploader.destroy(item.cloudinary_public_id, {
            resource_type: item.cloudinary_resource_type || "image",
          });
        } catch (error) {
          console.error("Không thể xóa ảnh hoạt động trên Cloudinary:", error);
        }
      }
      return res.status(200).json({ success: true, message: "Đã xóa hoạt động." });
    } catch (error) {
      return next(error);
    }
  },

  async uploadImage(req, res, next) {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Mã hoạt động không hợp lệ." });
    if (!req.file) return res.status(400).json({ success: false, message: "Vui lòng chọn ảnh hoạt động." });

    let uploaded;
    try {
      if (!(await findOwnedActivity(req.params.id, req.user.id))) {
        return res.status(404).json({ success: false, message: "Không tìm thấy hoạt động." });
      }
      uploaded = await uploadImage(req.file);
      const result = await pool.query(
        `INSERT INTO da_phuong_tien
           (ma_tk_tai_len, loai_tu_lieu, duong_dan_tep, chu_thich, ma_hd,
            cloudinary_public_id, cloudinary_resource_type)
         VALUES ($1, 'hinh_anh', $2, 'Ảnh hoạt động', $3, $4, $5)
         RETURNING ma_pt AS id, duong_dan_tep AS url, chu_thich AS caption`,
        [req.user.id, uploaded.secure_url, req.params.id, uploaded.public_id, uploaded.resource_type]
      );
      const previous = await pool.query(
        `DELETE FROM da_phuong_tien
         WHERE ma_hd = $1 AND ma_pt <> $2 AND loai_tu_lieu = 'hinh_anh'
         RETURNING cloudinary_public_id, cloudinary_resource_type`,
        [req.params.id, result.rows[0].id]
      );
      for (const item of previous.rows) {
        if (!item.cloudinary_public_id) continue;
        await cloudinary.uploader.destroy(item.cloudinary_public_id, {
          resource_type: item.cloudinary_resource_type || "image",
        }).catch((error) => console.error("Không thể thay ảnh cũ trên Cloudinary:", error));
      }
      return res.status(201).json({
        success: true,
        message: "Đã tải ảnh hoạt động lên.",
        data: { ...result.rows[0], image: result.rows[0].url },
      });
    } catch (error) {
      if (uploaded?.public_id) {
        await cloudinary.uploader.destroy(uploaded.public_id, {
          resource_type: uploaded.resource_type || "image",
        }).catch((cleanupError) => console.error("Không thể xóa ảnh tải lên lỗi:", cleanupError));
      }
      return next(error);
    }
  },
};

module.exports = artisanExperienceController;
