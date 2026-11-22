const pool = require("../config/database");

const statusExpression = (column) => `CASE ${column}
  WHEN 'cho_xac_nhan' THEN 'pending'
  WHEN 'da_xac_nhan' THEN 'confirmed'
  WHEN 'bi_tu_choi' THEN 'rejected'
  WHEN 'da_huy' THEN 'cancelled'
  WHEN 'hoan_thanh' THEN 'completed'
END`;

const bookingFields = `
  dl.ma_dl AS id,
  dl.ma_tk AS tourist_id,
  dl.ma_hd AS activity_id,
  hd.ten_hd AS activity_title,
  hd.mo_ta_hd AS activity_description,
  hd.dia_diem_to_chuc AS location,
  hd.thoi_luong_phut AS duration_minutes,
  hd.sl_tham_gia_max AS capacity,
  artisan.ma_tk AS artisan_id,
  artisan.ho_ten AS artisan_name,
  artisan.email AS artisan_email,
  artisan.anh_dai_dien AS artisan_avatar,
  visitor.ho_ten AS tourist_name,
  COALESCE(dl.ten_lien_he, visitor.ho_ten) AS contact_name,
  COALESCE(dl.email_lien_he, visitor.email) AS contact_email,
  COALESCE(dl.sdt_lien_he, visitor.sdt) AS contact_phone,
  (SELECT pt.duong_dan_tep
   FROM da_phuong_tien pt
   WHERE pt.ma_hd = hd.ma_hd AND pt.loai_tu_lieu = 'hinh_anh'
   ORDER BY pt.ngay_tai_len DESC, pt.ma_pt DESC
   LIMIT 1) AS image,
  dl.ngay_trai_nghiem AS experience_date,
  to_char(dl.gio_bd, 'HH24:MI') AS start_time,
  to_char(dl.gio_kt, 'HH24:MI') AS end_time,
  dl.sl_nguoi_tham_gia AS participants,
  dl.ngay_dl AS requested_at,
  dl.ngay_xac_nhan AS confirmed_at,
  dl.ghi_chu AS note,
  dl.ly_do_tu_choi AS rejection_reason,
  dl.ly_do_huy AS cancellation_reason,
  CASE dl.trang_thai_dl
    WHEN 'cho_xac_nhan' THEN 'pending'
    WHEN 'da_xac_nhan' THEN 'confirmed'
    WHEN 'bi_tu_choi' THEN 'rejected'
    WHEN 'da_huy' THEN 'cancelled'
    WHEN 'hoan_thanh' THEN 'completed'
  END AS status,
  COALESCE((
    SELECT json_agg(json_build_object(
      'status', ${statusExpression("ls.trang_thai_moi")},
      'previousStatus', CASE ls.trang_thai_cu
        WHEN 'cho_xac_nhan' THEN 'pending'
        WHEN 'da_xac_nhan' THEN 'confirmed'
        WHEN 'bi_tu_choi' THEN 'rejected'
        WHEN 'da_huy' THEN 'cancelled'
        WHEN 'hoan_thanh' THEN 'completed'
      END,
      'changedAt', ls.thoi_diem,
      'reason', ls.ly_do
    ) ORDER BY ls.thoi_diem, ls.ma_lsd)
    FROM lich_su_dat_lich_trai_nghiem ls
    WHERE ls.ma_dl = dl.ma_dl
  ), '[]'::json) AS status_history
`;

function validId(value) {
  return /^[1-9]\d*$/.test(String(value));
}

function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function isValidTime(value) {
  return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function bookingQuery(whereClause) {
  return `SELECT ${bookingFields}
    FROM dat_lich_trai_nghiem dl
    JOIN hoat_dong_trai_nghiem hd ON hd.ma_hd = dl.ma_hd
    JOIN tai_khoan artisan ON artisan.ma_tk = hd.ma_nn
    JOIN tai_khoan visitor ON visitor.ma_tk = dl.ma_tk
    ${whereClause}`;
}

function historyReason(status, reason) {
  return ["bi_tu_choi", "da_huy"].includes(status) ? reason : null;
}

async function setStatus({ bookingId, status, actorId, actorType, reason }) {
  const client = await pool.connect();
  let transactionStarted = false;
  try {
    await client.query("BEGIN");
    transactionStarted = true;
    const ownershipFilter = actorType === "artisan" ? "AND hd.ma_nn = $2" : "";
    const params = actorType === "artisan" ? [bookingId, actorId] : [bookingId];
    const currentResult = await client.query(
      `SELECT dl.ma_dl, dl.trang_thai_dl, dl.ngay_trai_nghiem,
              dl.gio_kt, hd.ma_nn,
              ((dl.ngay_trai_nghiem + dl.gio_kt) AT TIME ZONE 'Asia/Ho_Chi_Minh') AS ends_at
       FROM dat_lich_trai_nghiem dl
       JOIN hoat_dong_trai_nghiem hd ON hd.ma_hd = dl.ma_hd
       WHERE dl.ma_dl = $1 ${ownershipFilter}
       FOR UPDATE OF dl`,
      params
    );
    if (!currentResult.rowCount) {
      await client.query("ROLLBACK");
      transactionStarted = false;
      return { statusCode: 404, message: "Không tìm thấy lịch đặt." };
    }

    const current = currentResult.rows[0];
    const currentStatus = current.trang_thai_dl;
    const endsAt = new Date(current.ends_at);
    const isComplete = status === "hoan_thanh";
    if (isComplete && (currentStatus !== "da_xac_nhan" || endsAt > new Date())) {
      await client.query("ROLLBACK");
      transactionStarted = false;
      return { statusCode: 409, message: "Chỉ có thể ghi nhận hoàn thành sau khi hoạt động đã diễn ra." };
    }

    const allowedTransitions = {
      cho_xac_nhan: ["da_xac_nhan", "bi_tu_choi", "da_huy"],
      da_xac_nhan: ["hoan_thanh", "da_huy"],
    };
    if (!allowedTransitions[currentStatus]?.includes(status)) {
      await client.query("ROLLBACK");
      transactionStarted = false;
      return { statusCode: 409, message: "Lịch đặt đã được xử lý hoặc không thể chuyển sang trạng thái này." };
    }

    await client.query(
      `UPDATE dat_lich_trai_nghiem
       SET trang_thai_dl = $1::varchar,
           ngay_xac_nhan = CASE WHEN $1::varchar = 'da_xac_nhan' THEN now() ELSE ngay_xac_nhan END,
           ly_do_tu_choi = CASE WHEN $1::varchar = 'bi_tu_choi' THEN $2 ELSE ly_do_tu_choi END,
           ly_do_huy = CASE WHEN $1::varchar = 'da_huy' THEN $2 ELSE ly_do_huy END
       WHERE ma_dl = $3`,
      [status, reason, bookingId]
    );
    await client.query(
      `INSERT INTO lich_su_dat_lich_trai_nghiem
         (ma_dl, trang_thai_cu, trang_thai_moi, ma_tk_thay_doi, ly_do)
       VALUES ($1, $2, $3, $4, $5)`,
      [bookingId, currentStatus, status, actorId, historyReason(status, reason)]
    );
    await client.query("COMMIT");
    transactionStarted = false;
    return { statusCode: 200 };
  } catch (error) {
    if (transactionStarted) await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

const experienceBookingController = {
  async create(req, res, next) {
    const activityId = req.params.activityId;
    const { experienceDate, startTime, participants, contactName, contactEmail, contactPhone, note } = req.body || {};
    const count = Number(participants);
    const name = typeof contactName === "string" ? contactName.trim() : "";
    const email = typeof contactEmail === "string" ? contactEmail.trim() : "";
    const phone = typeof contactPhone === "string" ? contactPhone.trim() : "";
    const bookingNote = typeof note === "string" ? note.trim() : "";

    if (!validId(activityId)) {
      return res.status(400).json({ success: false, message: "Mã hoạt động không hợp lệ." });
    }
    if (!isValidDate(experienceDate) || !isValidTime(startTime)) {
      return res.status(400).json({ success: false, message: "Vui lòng chọn ngày và giờ tham gia hợp lệ." });
    }
    if (!Number.isInteger(count) || count < 1 || count > 32767) {
      return res.status(400).json({ success: false, message: "Số người tham gia phải là số nguyên dương." });
    }
    if (!name || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập tên và email liên hệ hợp lệ." });
    }
    if (!/^[\d+()\s-]{8,30}$/.test(phone) || bookingNote.length > 2000) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập số điện thoại hợp lệ; ghi chú tối đa 2.000 ký tự." });
    }

    const client = await pool.connect();
    let transactionStarted = false;
    try {
      await client.query("BEGIN");
      transactionStarted = true;
      const account = await client.query(
        `SELECT ma_tk FROM tai_khoan
         WHERE ma_tk = $1 AND vai_tro = 'du_khach' AND trang_thai_tk = 'hoat_dong'`,
        [req.user.id]
      );
      if (!account.rowCount) {
        await client.query("ROLLBACK");
        transactionStarted = false;
        return res.status(403).json({ success: false, message: "Tài khoản du khách không còn hoạt động." });
      }

      const activityResult = await client.query(
        `SELECT ma_hd, thoi_luong_phut, sl_tham_gia_max, trang_thai_hd
         FROM hoat_dong_trai_nghiem
         WHERE ma_hd = $1
         FOR UPDATE`,
        [activityId]
      );
      if (!activityResult.rowCount) {
        await client.query("ROLLBACK");
        transactionStarted = false;
        return res.status(404).json({ success: false, message: "Không tìm thấy hoạt động trải nghiệm." });
      }
      const activity = activityResult.rows[0];
      if (activity.trang_thai_hd !== "dang_mo") {
        await client.query("ROLLBACK");
        transactionStarted = false;
        return res.status(409).json({ success: false, message: "Hoạt động hiện không còn nhận đăng ký." });
      }
      const startMinutes = Number(startTime.slice(0, 2)) * 60 + Number(startTime.slice(3, 5));
      const endMinutes = startMinutes + Number(activity.thoi_luong_phut);
      if (endMinutes >= 24 * 60) {
        await client.query("ROLLBACK");
        transactionStarted = false;
        return res.status(400).json({ success: false, message: "Giờ kết thúc hoạt động phải nằm trong cùng ngày." });
      }
      const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`;
      const futureCheck = await client.query(
        `SELECT ($1::date + $2::time) AT TIME ZONE 'Asia/Ho_Chi_Minh' > now() AS is_future`,
        [experienceDate, startTime]
      );
      if (!futureCheck.rows[0].is_future) {
        await client.query("ROLLBACK");
        transactionStarted = false;
        return res.status(400).json({ success: false, message: "Ngày và giờ tham gia phải ở trong tương lai." });
      }

      const booked = await client.query(
        `SELECT COALESCE(SUM(sl_nguoi_tham_gia), 0)::integer AS participants
         FROM dat_lich_trai_nghiem
         WHERE ma_hd = $1 AND ngay_trai_nghiem = $2
           AND trang_thai_dl IN ('cho_xac_nhan', 'da_xac_nhan')
           AND gio_bd < $4::time AND gio_kt > $3::time`,
        [activityId, experienceDate, startTime, endTime]
      );
      if (Number(booked.rows[0].participants) + count > Number(activity.sl_tham_gia_max)) {
        await client.query("ROLLBACK");
        transactionStarted = false;
        return res.status(409).json({ success: false, message: "Khung giờ đã hết chỗ hoặc không đủ chỗ cho số người đã chọn." });
      }

      const created = await client.query(
        `INSERT INTO dat_lich_trai_nghiem
           (ma_tk, ma_hd, ngay_trai_nghiem, gio_bd, gio_kt,
            sl_nguoi_tham_gia, ghi_chu, trang_thai_dl,
            ten_lien_he, email_lien_he, sdt_lien_he)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'cho_xac_nhan', $8, $9, $10)
         RETURNING ma_dl`,
        [req.user.id, activityId, experienceDate, startTime, endTime, count, bookingNote || null, name, email, phone]
      );
      const bookingId = created.rows[0].ma_dl;
      await client.query(
        `INSERT INTO lich_su_dat_lich_trai_nghiem
           (ma_dl, trang_thai_cu, trang_thai_moi, ma_tk_thay_doi)
         VALUES ($1, NULL, 'cho_xac_nhan', $2)`,
        [bookingId, req.user.id]
      );
      await client.query("COMMIT");
      transactionStarted = false;
      const result = await pool.query(bookingQuery("WHERE dl.ma_dl = $1"), [bookingId]);
      return res.status(201).json({ success: true, message: "Đã gửi yêu cầu đặt lịch.", data: result.rows[0] });
    } catch (error) {
      if (transactionStarted) await client.query("ROLLBACK");
      if (error.code === "P0001") {
        return res.status(409).json({ success: false, message: error.message });
      }
      if (error.code === "23514") {
        return res.status(409).json({ success: false, message: "Không thể đặt lịch do hoạt động đã hết chỗ hoặc thông tin thời gian không hợp lệ." });
      }
      return next(error);
    } finally {
      client.release();
    }
  },

  async listMine(req, res, next) {
    try {
      const result = await pool.query(
        `${bookingQuery("WHERE dl.ma_tk = $1")} ORDER BY dl.ngay_dl DESC, dl.ma_dl DESC`,
        [req.user.id]
      );
      return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      return next(error);
    }
  },

  async getMine(req, res, next) {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Mã đặt lịch không hợp lệ." });
    try {
      const result = await pool.query(
        bookingQuery("WHERE dl.ma_dl = $1 AND dl.ma_tk = $2"),
        [req.params.id, req.user.id]
      );
      if (!result.rowCount) return res.status(404).json({ success: false, message: "Không tìm thấy lịch đặt." });
      return res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
      return next(error);
    }
  },

  async cancelMine(req, res, next) {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Mã đặt lịch không hợp lệ." });
    const reason = typeof req.body?.reason === "string" ? req.body.reason.trim() : "";
    if (reason.length > 1000) return res.status(400).json({ success: false, message: "Lý do hủy không được vượt quá 1.000 ký tự." });

    const client = await pool.connect();
    let transactionStarted = false;
    try {
      await client.query("BEGIN");
      transactionStarted = true;
      const booking = await client.query(
        `SELECT ma_dl, trang_thai_dl,
                ((ngay_trai_nghiem + gio_bd) AT TIME ZONE 'Asia/Ho_Chi_Minh') AS starts_at
         FROM dat_lich_trai_nghiem
         WHERE ma_dl = $1 AND ma_tk = $2
         FOR UPDATE`,
        [req.params.id, req.user.id]
      );
      if (!booking.rowCount) {
        await client.query("ROLLBACK");
        transactionStarted = false;
        return res.status(404).json({ success: false, message: "Không tìm thấy lịch đặt." });
      }
      const current = booking.rows[0];
      const cutoff = new Date(current.starts_at).getTime() - 24 * 60 * 60 * 1000;
      if (!["cho_xac_nhan", "da_xac_nhan"].includes(current.trang_thai_dl) || Date.now() >= cutoff) {
        await client.query("ROLLBACK");
        transactionStarted = false;
        return res.status(409).json({ success: false, message: "Lịch đặt chỉ có thể hủy trước thời gian trải nghiệm ít nhất 24 giờ." });
      }
      await client.query(
        "UPDATE dat_lich_trai_nghiem SET trang_thai_dl = 'da_huy', ly_do_huy = $1 WHERE ma_dl = $2",
        [reason || null, req.params.id]
      );
      await client.query(
        `INSERT INTO lich_su_dat_lich_trai_nghiem
           (ma_dl, trang_thai_cu, trang_thai_moi, ma_tk_thay_doi, ly_do)
         VALUES ($1, $2, 'da_huy', $3, $4)`,
        [req.params.id, current.trang_thai_dl, req.user.id, reason || null]
      );
      await client.query("COMMIT");
      transactionStarted = false;
      return res.status(200).json({ success: true, message: "Đã hủy lịch đặt." });
    } catch (error) {
      if (transactionStarted) await client.query("ROLLBACK");
      return next(error);
    } finally {
      client.release();
    }
  },

  async listArtisan(req, res, next) {
    try {
      const result = await pool.query(
        `${bookingQuery("WHERE hd.ma_nn = $1")} ORDER BY dl.ngay_dl DESC, dl.ma_dl DESC`,
        [req.user.id]
      );
      return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      return next(error);
    }
  },

  async listAdmin(_req, res, next) {
    try {
      const result = await pool.query(
        `${bookingQuery("")} ORDER BY dl.ngay_dl DESC, dl.ma_dl DESC`
      );
      return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      return next(error);
    }
  },

  async updateArtisanStatus(req, res, next) {
    return experienceBookingController.updateStatus(req, res, next, "artisan");
  },

  async updateAdminStatus(req, res, next) {
    return experienceBookingController.updateStatus(req, res, next, "admin");
  },

  async updateStatus(req, res, next, actorType) {
    const targetStatus = {
      pending: "cho_xac_nhan",
      confirmed: "da_xac_nhan",
      rejected: "bi_tu_choi",
      cancelled: "da_huy",
      completed: "hoan_thanh",
    }[req.body?.status];
    const reason = typeof req.body?.reason === "string" ? req.body.reason.trim() : "";
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Mã đặt lịch không hợp lệ." });
    if (!targetStatus || targetStatus === "cho_xac_nhan" || reason.length > 1000) {
      return res.status(400).json({ success: false, message: "Trạng thái hoặc lý do xử lý không hợp lệ." });
    }

    try {
      const result = await setStatus({
        bookingId: req.params.id,
        status: targetStatus,
        actorId: req.user.id,
        actorType,
        reason: reason || null,
      });
      if (result.statusCode) return res.status(result.statusCode).json({ success: false, message: result.message });
      return res.status(200).json({ success: true, message: "Đã cập nhật trạng thái lịch đặt." });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = experienceBookingController;
