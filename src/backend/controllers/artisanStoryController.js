const pool = require("../config/database");
const cloudinary = require("../config/cloudinary");

const categoryMap = {
  lich_su_nghe: "khac",
  ky_thuat_truyen_doi: "ky_thuat",
  ky_uc_tho_gom: "cau_chuyen",
  phong_tuc: "phong_tuc",
};

function validId(value) {
  return /^[1-9]\d*$/.test(String(value));
}

function parseYouTubeId(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1).split("/")[0] || null;
    if (url.hostname.includes("youtube.com")) {
      return url.searchParams.get("v")
        || (url.pathname.startsWith("/embed/") ? url.pathname.split("/")[2] : null)
        || (url.pathname.startsWith("/shorts/") ? url.pathname.split("/")[2] : null);
    }
  } catch {
    return null;
  }
  return null;
}

async function uploadFile(file) {
  const resourceType = file.mimetype.startsWith("video/") ? "video" : "image";
  const config = cloudinary.config();
  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    const error = new Error("Cloudinary chưa được cấu hình đầy đủ.");
    error.status = 503;
    error.publicMessage = "Dịch vụ tải tư liệu chưa được cấu hình. Hãy kiểm tra CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY và CLOUDINARY_API_SECRET trong backend.";
    throw error;
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "nghenhan/stories", resource_type: resourceType },
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

function getCloudinaryErrorMessage(error) {
  const status = Number(error.http_code || error.status);
  const code = typeof error.code === "string" ? error.code : "";

  if (status === 401 || /invalid (api key|signature|credentials)/i.test(error.message || "")) {
    return "Cloudinary từ chối thông tin xác thực. Kiểm tra CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY và CLOUDINARY_API_SECRET.";
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
  if (status) {
    return `Cloudinary từ chối tệp (HTTP ${status}). Kiểm tra định dạng và giới hạn tải lên.`;
  }
  return "Không thể tải tư liệu lên Cloudinary. Kiểm tra cấu hình dịch vụ, kết nối mạng hoặc giới hạn tệp.";
}

async function removeCloudinaryFiles(files) {
  for (const file of files) {
    try {
      await cloudinary.uploader.destroy(file.public_id, {
        resource_type: file.resource_type || "image",
      });
    } catch (error) {
      console.error("Không thể dọn tệp Cloudinary sau khi lưu tư liệu thất bại:", error);
    }
  }
}

async function findOwnedStory(id, artisanId) {
  const result = await pool.query(
    "SELECT * FROM nd_van_hoa WHERE ma_nd = $1 AND ma_nn = $2",
    [id, artisanId]
  );
  return result.rows[0] || null;
}

const artisanStoryController = {
  async list(req, res, next) {
    try {
      const result = await pool.query(
        `SELECT nd.ma_nd, nd.tieu_de, nd.loai_nd, nd.tom_tat,
                nd.noi_dung_chi_tiet, nd.trang_thai_kiem_duyet,
                nd.ngay_dang, nd.ngay_cap_nhat,
                coalesce((
                  SELECT json_agg(json_build_object(
                    'id', pt.ma_pt,
                    'type', pt.loai_tu_lieu,
                    'url', pt.duong_dan_tep,
                    'caption', pt.chu_thich
                  ) ORDER BY pt.ngay_tai_len DESC, pt.ma_pt DESC)
                  FROM da_phuong_tien pt WHERE pt.ma_nd = nd.ma_nd
                ), '[]'::json) AS media
         FROM nd_van_hoa nd
         WHERE nd.ma_nn = $1
         ORDER BY nd.ngay_cap_nhat DESC, nd.ma_nd DESC`,
        [req.user.id]
      );
      return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      return next(error);
    }
  },

  async getOne(req, res, next) {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Mã bài viết không hợp lệ." });
    try {
      const story = await findOwnedStory(req.params.id, req.user.id);
      if (!story) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết." });
      const media = await pool.query(
        `SELECT ma_pt AS id, loai_tu_lieu AS type, duong_dan_tep AS url, chu_thich AS caption
         FROM da_phuong_tien WHERE ma_nd = $1 ORDER BY ngay_tai_len DESC, ma_pt DESC`,
        [req.params.id]
      );
      return res.status(200).json({ success: true, data: { ...story, media: media.rows } });
    } catch (error) {
      return next(error);
    }
  },

  async create(req, res, next) {
    const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
    const content = typeof req.body.content === "string" ? req.body.content.trim() : "";
    const summary = typeof req.body.summary === "string" ? req.body.summary.trim() : "";
    const category = categoryMap[req.body.category] || "cau_chuyen";
    const status = req.body.status === "da_dang" || req.body.status === "nhap" ? req.body.status : null;
    if (!title || title.length > 250) return res.status(400).json({ success: false, message: "Tiêu đề bài viết không được để trống hoặc quá 250 ký tự." });
    if (!content) return res.status(400).json({ success: false, message: "Nội dung bài viết không được để trống." });
    if (!status) return res.status(400).json({ success: false, message: "Trạng thái bài viết không hợp lệ." });

    try {
      const result = await pool.query(
        `INSERT INTO nd_van_hoa
           (ma_nn, ma_nghe, tieu_de, loai_nd, tom_tat, noi_dung_chi_tiet, trang_thai_kiem_duyet)
         VALUES ($1, NULL, $2, $3, $4, $5, $6)
         RETURNING ma_nd, tieu_de, loai_nd, tom_tat, noi_dung_chi_tiet,
                   trang_thai_kiem_duyet, ngay_dang, ngay_cap_nhat`,
        [req.user.id, title, category, summary || null, content, status]
      );
      return res.status(201).json({
        success: true,
        message: status === "nhap" ? "Đã lưu bản nháp." : "Đã đăng câu chuyện thành công.",
        data: { ...result.rows[0], media: [] },
      });
    } catch (error) {
      return next(error);
    }
  },

  async update(req, res, next) {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Mã bài viết không hợp lệ." });
    const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
    const content = typeof req.body.content === "string" ? req.body.content.trim() : "";
    const summary = typeof req.body.summary === "string" ? req.body.summary.trim() : "";
    const category = categoryMap[req.body.category] || "cau_chuyen";
    const status = req.body.status === "da_dang" || req.body.status === "nhap" ? req.body.status : null;
    if (!title || title.length > 250) return res.status(400).json({ success: false, message: "Tiêu đề bài viết không được để trống hoặc quá 250 ký tự." });
    if (!content) return res.status(400).json({ success: false, message: "Nội dung bài viết không được để trống." });
    if (!status) return res.status(400).json({ success: false, message: "Trạng thái bài viết không hợp lệ." });

    try {
      const result = await pool.query(
        `UPDATE nd_van_hoa
         SET tieu_de = $1, loai_nd = $2, tom_tat = $3, noi_dung_chi_tiet = $4,
             trang_thai_kiem_duyet = $5, ngay_cap_nhat = now()
         WHERE ma_nd = $6 AND ma_nn = $7
         RETURNING ma_nd, tieu_de, loai_nd, tom_tat, noi_dung_chi_tiet,
                   trang_thai_kiem_duyet, ngay_dang, ngay_cap_nhat`,
        [title, category, summary || null, content, status, req.params.id, req.user.id]
      );
      if (!result.rowCount) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết." });
      return res.status(200).json({ success: true, message: "Đã cập nhật bài viết.", data: result.rows[0] });
    } catch (error) {
      return next(error);
    }
  },

  async remove(req, res, next) {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Mã bài viết không hợp lệ." });
    try {
      const story = await findOwnedStory(req.params.id, req.user.id);
      if (!story) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết." });

      const media = await pool.query(
        "SELECT cloudinary_public_id, cloudinary_resource_type FROM da_phuong_tien WHERE ma_nd = $1 AND cloudinary_public_id IS NOT NULL",
        [req.params.id]
      );
      await pool.query("DELETE FROM nd_van_hoa WHERE ma_nd = $1 AND ma_nn = $2", [req.params.id, req.user.id]);
      for (const item of media.rows) {
        try {
          await cloudinary.uploader.destroy(item.cloudinary_public_id, { resource_type: item.cloudinary_resource_type || "image" });
        } catch (error) {
          console.error("Không thể xóa tư liệu trên Cloudinary:", error);
        }
      }
      return res.status(200).json({ success: true, message: "Đã xóa bài viết." });
    } catch (error) {
      return next(error);
    }
  },

  async publish(req, res, next) {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Mã bài viết không hợp lệ." });
    try {
      const result = await pool.query(
        `UPDATE nd_van_hoa
         SET trang_thai_kiem_duyet = 'da_dang', ngay_dang = now(), ngay_cap_nhat = now()
         WHERE ma_nd = $1 AND ma_nn = $2
         RETURNING ma_nd, tieu_de, trang_thai_kiem_duyet`,
        [req.params.id, req.user.id]
      );
      if (!result.rowCount) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết." });
      return res.status(200).json({ success: true, message: "Đã đăng bài viết.", data: result.rows[0] });
    } catch (error) {
      return next(error);
    }
  },

  async saveYoutube(req, res, next) {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Mã bài viết không hợp lệ." });
    const url = typeof req.body.url === "string" ? req.body.url.trim() : "";
    const videoId = parseYouTubeId(url);
    if (!videoId) return res.status(400).json({ success: false, message: "Liên kết YouTube không hợp lệ." });
    try {
      const story = await findOwnedStory(req.params.id, req.user.id);
      if (!story) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết." });
      await pool.query(
        "DELETE FROM da_phuong_tien WHERE ma_nd = $1 AND loai_tu_lieu = 'video'",
        [req.params.id]
      );
      const result = await pool.query(
        `INSERT INTO da_phuong_tien
           (ma_tk_tai_len, loai_tu_lieu, duong_dan_tep, chu_thich, ma_nd)
         VALUES ($1, 'video', $2, 'Video YouTube', $3)
         RETURNING ma_pt AS id, loai_tu_lieu AS type, duong_dan_tep AS url, chu_thich AS caption`,
        [req.user.id, `https://www.youtube.com/watch?v=${videoId}`, req.params.id]
      );
      return res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      return next(error);
    }
  },

  async uploadMedia(req, res, next) {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Mã bài viết không hợp lệ." });
    const uploadedFiles = [];
    let filesCommitted = false;
    try {
      const story = await findOwnedStory(req.params.id, req.user.id);
      if (!story) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết." });

      const files = [
        ...((req.files?.images || []).map((file) => ({ file, type: "hinh_anh" }))),
        ...((req.files?.video || []).map((file) => ({ file, type: "video" }))),
      ];
      if (!files.length) return res.status(400).json({ success: false, message: "Vui lòng chọn ảnh hoặc video." });

      for (const item of files) {
        try {
          uploadedFiles.push({
            ...await uploadFile(item.file),
            mediaType: item.type,
          });
        } catch (error) {
          console.error("Cloudinary không tải được tư liệu câu chuyện:", error);
          error.status = 502;
          error.publicMessage = error.publicMessage || getCloudinaryErrorMessage(error);
          throw error;
        }
      }

      let client;
      try {
        client = await pool.connect();
      } catch (error) {
        console.error("Không thể kết nối PostgreSQL để lưu tư liệu câu chuyện:", error);
        error.publicMessage = "Không kết nối được PostgreSQL để lưu tư liệu. Kiểm tra DB_HOST, DB_PORT, DB_NAME và trạng thái PostgreSQL.";
        throw error;
      }

      const media = [];
      let replacedVideos = [];
      try {
        await client.query("BEGIN");
        if (uploadedFiles.some((file) => file.mediaType === "video")) {
          const deleted = await client.query(
            `DELETE FROM da_phuong_tien
             WHERE ma_nd = $1 AND loai_tu_lieu = 'video'
             RETURNING cloudinary_public_id, cloudinary_resource_type`,
            [req.params.id]
          );
          replacedVideos = deleted.rows.filter((file) => file.cloudinary_public_id);
        }

        for (const file of uploadedFiles) {
          const result = await client.query(
            `INSERT INTO da_phuong_tien
               (ma_tk_tai_len, loai_tu_lieu, duong_dan_tep, chu_thich, ma_nd,
                cloudinary_public_id, cloudinary_resource_type)
             VALUES ($1, $2, $3, NULL, $4, $5, $6)
             RETURNING ma_pt AS id, loai_tu_lieu AS type, duong_dan_tep AS url, chu_thich AS caption`,
            [req.user.id, file.mediaType, file.secure_url, req.params.id, file.public_id, file.resource_type]
          );
          media.push(result.rows[0]);
        }
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK").catch((rollbackError) => {
          console.error("Không thể hủy giao dịch lưu tư liệu câu chuyện:", rollbackError);
        });
        console.error("Không thể lưu thông tin tư liệu câu chuyện vào PostgreSQL:", error);
        error.status = 500;
        error.publicMessage = error.code === "42703"
          ? "Database thiếu cột lưu thông tin Cloudinary. Hãy cập nhật bảng da_phuong_tien theo schema nghenhan_db.sql."
          : "Tệp đã tải lên nhưng không lưu được thông tin vào database. Kiểm tra bảng da_phuong_tien và kết nối PostgreSQL.";
        throw error;
      } finally {
        client.release();
      }

      filesCommitted = true;
      await removeCloudinaryFiles(
        replacedVideos.map((file) => ({
          public_id: file.cloudinary_public_id,
          resource_type: file.cloudinary_resource_type,
        }))
      );
      return res.status(201).json({ success: true, message: "Đã tải tư liệu lên.", data: media });
    } catch (error) {
      if (!filesCommitted) await removeCloudinaryFiles(uploadedFiles);
      return next(error);
    }
  },

  async removeMedia(req, res, next) {
    if (!validId(req.params.id) || !validId(req.params.mediaId)) {
      return res.status(400).json({ success: false, message: "Mã tư liệu không hợp lệ." });
    }
    try {
      const result = await pool.query(
        `DELETE FROM da_phuong_tien pt
         USING nd_van_hoa nd
         WHERE pt.ma_pt = $1 AND pt.ma_nd = nd.ma_nd
           AND nd.ma_nd = $2 AND nd.ma_nn = $3
         RETURNING pt.cloudinary_public_id, pt.cloudinary_resource_type`,
        [req.params.mediaId, req.params.id, req.user.id]
      );
      if (!result.rowCount) return res.status(404).json({ success: false, message: "Không tìm thấy tư liệu." });
      const removed = result.rows[0];
      if (removed.cloudinary_public_id) {
        await cloudinary.uploader.destroy(
          removed.cloudinary_public_id,
          { resource_type: removed.cloudinary_resource_type || "image" }
        ).catch((error) => console.error("Không thể xóa tư liệu trên Cloudinary:", error));
      }
      return res.status(200).json({ success: true, message: "Đã xóa tư liệu." });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = artisanStoryController;
