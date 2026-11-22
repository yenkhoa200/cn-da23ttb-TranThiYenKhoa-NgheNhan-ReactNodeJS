const pool = require("../config/database");

const touristContentController = {
  async listArtisans(_req, res, next) {
    try {
      const result = await pool.query(
        `SELECT tk.ma_tk AS id, tk.ho_ten AS name,
                coalesce(tk.anh_dai_dien, (
                  SELECT pt.duong_dan_tep
                  FROM da_phuong_tien pt
                  WHERE pt.ma_nn = tk.ma_tk AND pt.loai_tu_lieu = 'hinh_anh'
                  ORDER BY pt.ngay_tai_len DESC, pt.ma_pt DESC
                  LIMIT 1
                )) AS image,
                coalesce((
                  SELECT string_agg(DISTINCT nt.ten_nghe, ', ' ORDER BY nt.ten_nghe)
                  FROM nghe_nhan_nghe nnn
                  JOIN nghe_truyen_thong nt ON nt.ma_nghe = nnn.ma_nghe
                  WHERE nnn.ma_nn = tk.ma_tk
                ), 'Nghề truyền thống') AS craft,
                coalesce((
                  SELECT string_agg(DISTINCT ln.ten_ln, ', ' ORDER BY ln.ten_ln)
                  FROM nghe_nhan_lang_nghe nnln
                  JOIN lang_nghe ln ON ln.ma_ln = nnln.ma_ln
                  WHERE nnln.ma_nn = tk.ma_tk
                ), nn.dia_chi, '') AS place,
                coalesce(nn.gioi_thieu, '') AS description,
                coalesce(nn.qua_trinh_lam_nghe, '') AS career_history,
                coalesce(nn.lang_nghe_mo_ta, '') AS craft_village_description,
                coalesce(nn.hoat_dong_trai_nghiem_mo_ta, '') AS experience_description,
                nn.so_nam_kn AS years,
                nn.trang_thai_xac_minh = 'da_xac_minh' AS verified,
                (
                  SELECT round(avg(dg.diem_danh_gia)::numeric, 1)
                  FROM danh_gia dg
                  WHERE dg.ma_nn = tk.ma_tk AND dg.trang_thai_kiem_duyet = 'da_duyet'
                ) AS rating,
                (
                  SELECT count(*)::int
                  FROM danh_gia dg
                  WHERE dg.ma_nn = tk.ma_tk AND dg.trang_thai_kiem_duyet = 'da_duyet'
                ) AS reviews,
                coalesce((
                  SELECT json_agg(json_build_object(
                    'id', pt.ma_pt,
                    'type', pt.loai_tu_lieu,
                    'url', pt.duong_dan_tep,
                    'caption', pt.chu_thich
                  ) ORDER BY pt.ngay_tai_len DESC, pt.ma_pt DESC)
                  FROM da_phuong_tien pt
                  WHERE pt.ma_nn = tk.ma_tk
                ), '[]'::json) AS media
         FROM tai_khoan tk
         JOIN nghe_nhan nn ON nn.ma_nn = tk.ma_tk
         WHERE tk.vai_tro = 'nghe_nhan' AND tk.trang_thai_tk = 'hoat_dong'
         ORDER BY tk.ngay_tao DESC, tk.ma_tk DESC`
      );
      return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      return next(error);
    }
  },

  async listStories(_req, res, next) {
    try {
      const result = await pool.query(
        `SELECT nd.ma_nd AS id, nd.tieu_de AS title, nd.loai_nd AS category,
                coalesce(nd.tom_tat, left(nd.noi_dung_chi_tiet, 240)) AS description,
                nd.noi_dung_chi_tiet AS content, nd.y_nghia_van_hoa AS cultural_value,
                nd.ngay_dang AS created_at,
                tk.ma_tk AS artisan_id, tk.ho_ten AS artisan,
                tk.anh_dai_dien AS artisan_image,
                coalesce((
                  SELECT json_agg(json_build_object(
                    'id', pt.ma_pt,
                    'type', pt.loai_tu_lieu,
                    'url', pt.duong_dan_tep,
                    'caption', pt.chu_thich
                  ) ORDER BY pt.ngay_tai_len DESC, pt.ma_pt DESC)
                  FROM da_phuong_tien pt
                  WHERE pt.ma_nd = nd.ma_nd
                ), '[]'::json) AS media
         FROM nd_van_hoa nd
         JOIN tai_khoan tk ON tk.ma_tk = nd.ma_nn
         WHERE nd.trang_thai_kiem_duyet = 'da_dang'
           AND tk.vai_tro = 'nghe_nhan'
           AND tk.trang_thai_tk = 'hoat_dong'
         ORDER BY nd.ngay_dang DESC, nd.ma_nd DESC`
      );
      return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      return next(error);
    }
  },

  async listTraditionalCrafts(_req, res, next) {
    try {
      const result = await pool.query(
        `SELECT nt.ma_nghe AS id, nt.ten_nghe AS name, nt.mo_ta AS description,
                nt.nguon_goc AS origin, nt.quy_trinh_thuc_hien AS technique,
                nt.gia_tri_van_hoa AS cultural_value,
                nt.anh_dai_dien AS image,
                coalesce((
                  SELECT string_agg(DISTINCT ln.ten_ln, ', ' ORDER BY ln.ten_ln)
                  FROM lang_nghe_nghe lnn
                  JOIN lang_nghe ln ON ln.ma_ln = lnn.ma_ln
                  WHERE lnn.ma_nghe = nt.ma_nghe
                ), '') AS villages,
                (
                  SELECT count(*)::int
                  FROM nghe_nhan_nghe nnn
                  JOIN tai_khoan tk ON tk.ma_tk = nnn.ma_nn
                  WHERE nnn.ma_nghe = nt.ma_nghe
                    AND tk.vai_tro = 'nghe_nhan'
                    AND tk.trang_thai_tk = 'hoat_dong'
                ) AS artisan_count,
                (
                  SELECT count(*)::int
                  FROM hoat_dong_trai_nghiem hd
                  WHERE hd.ma_nghe = nt.ma_nghe AND hd.trang_thai_hd = 'dang_mo'
                ) AS activity_count
         FROM nghe_truyen_thong nt
         WHERE nt.trang_thai_hoat_dong = 'hoat_dong'
         ORDER BY nt.ten_nghe, nt.ma_nghe`
      );
      return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = touristContentController;
