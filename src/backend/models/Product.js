const pool = require("../config/database");

const Product = {
  async findAll({ publicOnly = false, artisanId = null } = {}) {
    const result = await pool.query(
      `SELECT sp.ma_sp AS id, sp.ma_nn AS artisan_id, tk.ho_ten AS artisan,
              sp.ma_nghe AS craft_id, nt.ten_nghe AS craft,
              sp.ten_sp AS title, sp.danh_muc AS category,
              sp.gia_tham_khao AS price, sp.mo_ta_sp AS description,
              sp.nguyen_lieu AS material, sp.quy_trinh_che_tac AS process,
              sp.y_nghia_van_hoa AS cultural_value,
              sp.trang_thai_hien_thi AS status, sp.ngay_dang AS created_at,
              coalesce((
                SELECT json_agg(json_build_object(
                  'id', pt.ma_pt,
                  'type', pt.loai_tu_lieu,
                  'url', pt.duong_dan_tep,
                  'caption', pt.chu_thich
                ) ORDER BY pt.ngay_tai_len, pt.ma_pt)
                FROM da_phuong_tien pt WHERE pt.ma_sp = sp.ma_sp
              ), '[]'::json) AS media
       FROM san_pham sp
       JOIN tai_khoan tk ON tk.ma_tk = sp.ma_nn
       LEFT JOIN nghe_truyen_thong nt ON nt.ma_nghe = sp.ma_nghe
       WHERE ($1::boolean = false OR (
               sp.trang_thai_hien_thi = 'da_dang'
               AND tk.vai_tro = 'nghe_nhan'
               AND tk.trang_thai_tk = 'hoat_dong'
             ))
         AND ($2::bigint IS NULL OR sp.ma_nn = $2)
       ORDER BY sp.ngay_dang DESC, sp.ma_sp DESC`,
      [publicOnly, artisanId]
    );

    return result.rows;
  },

  async findById(id, { publicOnly = false, artisanId = null } = {}) {
    const result = await pool.query(
      `SELECT sp.ma_sp AS id, sp.ma_nn AS artisan_id, tk.ho_ten AS artisan,
              sp.ma_nghe AS craft_id, nt.ten_nghe AS craft,
              sp.ten_sp AS title, sp.danh_muc AS category,
              sp.gia_tham_khao AS price, sp.mo_ta_sp AS description,
              sp.nguyen_lieu AS material, sp.quy_trinh_che_tac AS process,
              sp.y_nghia_van_hoa AS cultural_value,
              sp.trang_thai_hien_thi AS status, sp.ngay_dang AS created_at,
              coalesce((
                SELECT json_agg(json_build_object(
                  'id', pt.ma_pt,
                  'type', pt.loai_tu_lieu,
                  'url', pt.duong_dan_tep,
                  'caption', pt.chu_thich
                ) ORDER BY pt.ngay_tai_len, pt.ma_pt)
                FROM da_phuong_tien pt WHERE pt.ma_sp = sp.ma_sp
              ), '[]'::json) AS media
       FROM san_pham sp
       JOIN tai_khoan tk ON tk.ma_tk = sp.ma_nn
       LEFT JOIN nghe_truyen_thong nt ON nt.ma_nghe = sp.ma_nghe
       WHERE sp.ma_sp = $1
         AND ($2::boolean = false OR (
               sp.trang_thai_hien_thi = 'da_dang'
               AND tk.vai_tro = 'nghe_nhan'
               AND tk.trang_thai_tk = 'hoat_dong'
             ))
         AND ($3::bigint IS NULL OR sp.ma_nn = $3)`,
      [id, publicOnly, artisanId]
    );

    return result.rows[0];
  },

  async create(data, artisanId, status) {
    const result = await pool.query(
      `INSERT INTO san_pham
       (ma_nn, ten_sp, danh_muc, gia_tham_khao, mo_ta_sp, trang_thai_hien_thi)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ma_sp AS id, ma_nn AS artisan_id, ten_sp AS title,
                 danh_muc AS category, gia_tham_khao AS price,
                 mo_ta_sp AS description, trang_thai_hien_thi AS status`,
      [
        artisanId,
        data.title,
        data.category,
        data.price,
        data.description,
        status,
      ]
    );

    return result.rows[0];
  },

  async update(id, data, artisanId, status) {
    const result = await pool.query(
      `UPDATE san_pham
       SET ten_sp = $1, danh_muc = $2, gia_tham_khao = $3, mo_ta_sp = $4,
           trang_thai_hien_thi = $5
       WHERE ma_sp = $6 AND ma_nn = $7
       RETURNING ma_sp AS id, ma_nn AS artisan_id, ten_sp AS title,
                 danh_muc AS category, gia_tham_khao AS price,
                 mo_ta_sp AS description, trang_thai_hien_thi AS status`,
      [
        data.title,
        data.category,
        data.price,
        data.description,
        status,
        id,
        artisanId,
      ]
    );

    return result.rows[0];
  },

  async delete(id, artisanId) {
    const result = await pool.query(
      "DELETE FROM san_pham WHERE ma_sp = $1 AND ma_nn = $2 RETURNING ma_sp AS id",
      [id, artisanId]
    );

    return result.rows[0];
  },
};

module.exports = Product;