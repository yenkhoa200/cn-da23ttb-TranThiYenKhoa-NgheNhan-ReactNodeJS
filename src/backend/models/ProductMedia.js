const pool = require("../config/database");

const ProductMedia = {
  async findByProductId(productId) {
    const result = await pool.query(
      `SELECT ma_pt, loai_tu_lieu, duong_dan_tep, chu_thich, ngay_tai_len, ma_sp
       FROM da_phuong_tien
       WHERE ma_sp = $1
       ORDER BY ngay_tai_len DESC, ma_pt DESC`,
      [productId]
    );

    return result.rows;
  },

  async productBelongsToArtisan(productId, artisanId) {
    const result = await pool.query(
      "SELECT 1 FROM san_pham WHERE ma_sp = $1 AND ma_nn = $2",
      [productId, artisanId]
    );

    return result.rowCount > 0;
  },

  async create({ accountId, productId, mediaType, url, caption }) {
    const result = await pool.query(
      `INSERT INTO da_phuong_tien
         (ma_tk_tai_len, loai_tu_lieu, duong_dan_tep, chu_thich, ma_sp)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ma_pt, loai_tu_lieu, duong_dan_tep, chu_thich, ngay_tai_len, ma_sp`,
      [accountId, mediaType, url, caption || null, productId]
    );

    return result.rows[0];
  },
};

module.exports = ProductMedia;
