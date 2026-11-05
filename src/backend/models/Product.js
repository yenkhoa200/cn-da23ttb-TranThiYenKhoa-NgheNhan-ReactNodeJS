const pool = require("../config/database");

const Product = {
  // Lấy tất cả sản phẩm
  async findAll() {
    const result = await pool.query(
      "SELECT * FROM san_pham ORDER BY ma_san_pham DESC"
    );

    return result.rows;
  },

  // Tìm sản phẩm theo ID
  async findById(id) {
    const result = await pool.query(
      "SELECT * FROM san_pham WHERE ma_san_pham = $1",
      [id]
    );

    return result.rows[0];
  },

  // Thêm sản phẩm
  async create(data) {
    const result = await pool.query(
      `INSERT INTO san_pham
       (ten_san_pham, mo_ta, ma_nghe_nhan)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        data.ten_san_pham,
        data.mo_ta,
        data.ma_nghe_nhan,
      ]
    );

    return result.rows[0];
  },

  // Cập nhật sản phẩm
  async update(id, data) {
    const result = await pool.query(
      `UPDATE san_pham
       SET ten_san_pham = $1, mo_ta = $2
       WHERE ma_san_pham = $3
       RETURNING *`,
      [
        data.ten_san_pham,
        data.mo_ta,
        id,
      ]
    );

    return result.rows[0];
  },

  // Xóa sản phẩm
  async delete(id) {
    const result = await pool.query(
      "DELETE FROM san_pham WHERE ma_san_pham = $1 RETURNING *",
      [id]
    );

    return result.rows[0];
  },
};

module.exports = Product;