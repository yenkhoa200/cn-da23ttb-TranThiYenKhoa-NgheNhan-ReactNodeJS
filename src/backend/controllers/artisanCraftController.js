const pool = require("../config/database");

async function usesLegacySchema(queryable = pool) {
  const { rows } = await queryable.query(
    "SELECT to_regclass('public.accounts') AS accounts, to_regclass('public.tai_khoan') AS tai_khoan"
  );
  return Boolean(rows[0]?.accounts && !rows[0]?.tai_khoan);
}

const artisanCraftController = {
  async getAll(req, res, next) {
    try {
      const isLegacySchema = await usesLegacySchema();
      const result = isLegacySchema
        ? await pool.query(
          `SELECT tc.craft_id AS id, tc.craft_name AS name,
                  tc.description, tc.origin, tc.production_process AS technique,
                  tc.cultural_value, tc.avatar_url AS image,
                  tc.activity_status AS status, ac.start_year,
                  (ac.artisan_id IS NOT NULL) AS selected,
                  coalesce((
                    SELECT string_agg(DISTINCT cv.craft_village_name, ', ')
                    FROM craft_village_crafts cvc
                    JOIN craft_villages cv ON cv.craft_village_id = cvc.craft_village_id
                    WHERE cvc.craft_id = tc.craft_id
                  ), '') AS villages,
                  (
                    SELECT count(*)::int
                    FROM experience_activities ea
                    WHERE ea.artisan_id = $1 AND ea.craft_id = tc.craft_id
                  ) AS activity_count
           FROM traditional_crafts tc
           LEFT JOIN artisan_crafts ac
             ON ac.craft_id = tc.craft_id AND ac.artisan_id = $1
           ORDER BY selected DESC, tc.craft_name`,
          [req.user.id]
        )
        : await pool.query(
          `SELECT nt.ma_nghe AS id, nt.ten_nghe AS name,
                  nt.mo_ta AS description, nt.nguon_goc AS origin,
                  nt.quy_trinh_thuc_hien AS technique,
                  nt.gia_tri_van_hoa AS cultural_value,
                  nt.anh_dai_dien AS image,
                  nt.trang_thai_hoat_dong AS status, nnn.nam_bat_dau AS start_year,
                  (nnn.ma_nn IS NOT NULL) AS selected,
                  coalesce((
                    SELECT string_agg(DISTINCT ln.ten_ln, ', ')
                    FROM lang_nghe_nghe lnn
                    JOIN lang_nghe ln ON ln.ma_ln = lnn.ma_ln
                    WHERE lnn.ma_nghe = nt.ma_nghe
                  ), '') AS villages,
                  (
                    SELECT count(*)::int
                    FROM hoat_dong_trai_nghiem hd
                    WHERE hd.ma_nn = $1 AND hd.ma_nghe = nt.ma_nghe
                  ) AS activity_count
           FROM nghe_truyen_thong nt
           LEFT JOIN nghe_nhan_nghe nnn
             ON nnn.ma_nghe = nt.ma_nghe AND nnn.ma_nn = $1
           ORDER BY selected DESC, nt.ten_nghe`,
          [req.user.id]
        );

      return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      return next(error);
    }
  },

  async select(req, res, next) {
    if (!/^[1-9]\d*$/.test(req.params.id)) {
      return res.status(400).json({ success: false, message: "Mã nghề không hợp lệ." });
    }

    const rawStartYear = req.body.startYear;
    const startYear = rawStartYear === "" || rawStartYear === undefined || rawStartYear === null
      ? null
      : Number(rawStartYear);
    if (startYear !== null && (!Number.isInteger(startYear) || startYear < 1900 || startYear > 2100)) {
      return res.status(400).json({ success: false, message: "Năm bắt đầu phải từ 1900 đến 2100." });
    }

    try {
      const isLegacySchema = await usesLegacySchema();
      const exists = isLegacySchema
        ? await pool.query("SELECT 1 FROM traditional_crafts WHERE craft_id = $1", [req.params.id])
        : await pool.query("SELECT 1 FROM nghe_truyen_thong WHERE ma_nghe = $1", [req.params.id]);

      if (!exists.rowCount) {
        return res.status(404).json({ success: false, message: "Không tìm thấy nghề truyền thống." });
      }

      if (isLegacySchema) {
        await pool.query(
          `INSERT INTO artisan_crafts (artisan_id, craft_id, start_year)
           VALUES ($1, $2, $3)
           ON CONFLICT (artisan_id, craft_id) DO UPDATE SET
             start_year = coalesce(EXCLUDED.start_year, artisan_crafts.start_year)`,
          [req.user.id, req.params.id, startYear]
        );
      } else {
        await pool.query(
          `INSERT INTO nghe_nhan_nghe (ma_nn, ma_nghe, nam_bat_dau)
           VALUES ($1, $2, $3)
           ON CONFLICT (ma_nn, ma_nghe) DO UPDATE SET
             nam_bat_dau = coalesce(EXCLUDED.nam_bat_dau, nghe_nhan_nghe.nam_bat_dau)`,
          [req.user.id, req.params.id, startYear]
        );
      }

      return res.status(200).json({
        success: true,
        message: "Đã thêm nghề vào hồ sơ của bạn.",
        data: { id: req.params.id, selected: true, start_year: startYear },
      });
    } catch (error) {
      return next(error);
    }
  },

  async remove(req, res, next) {
    if (!/^[1-9]\d*$/.test(req.params.id)) {
      return res.status(400).json({ success: false, message: "Mã nghề không hợp lệ." });
    }

    try {
      const isLegacySchema = await usesLegacySchema();
      const result = isLegacySchema
        ? await pool.query(
          "DELETE FROM artisan_crafts WHERE artisan_id = $1 AND craft_id = $2",
          [req.user.id, req.params.id]
        )
        : await pool.query(
          "DELETE FROM nghe_nhan_nghe WHERE ma_nn = $1 AND ma_nghe = $2",
          [req.user.id, req.params.id]
        );

      if (!result.rowCount) {
        return res.status(404).json({ success: false, message: "Nghề này chưa có trong hồ sơ của bạn." });
      }

      return res.status(200).json({ success: true, message: "Đã bỏ nghề khỏi hồ sơ của bạn." });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = artisanCraftController;
