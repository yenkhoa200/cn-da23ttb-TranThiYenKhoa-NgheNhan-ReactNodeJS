
const pool = require("../config/database");

const ProductMedia = {
  // Lấy danh sách tư liệu của một sản phẩm.
  async findByProductId(productId) {
    const result = await pool.query(
      `SELECT
          ma_pt,
          loai_tu_lieu,
          duong_dan_tep,
          chu_thich,
          ngay_tai_len,
          ma_sp,
          cloudinary_public_id,
          cloudinary_resource_type
       FROM da_phuong_tien
       WHERE ma_sp = $1
       ORDER BY ngay_tai_len DESC, ma_pt DESC`,
      [productId]
    );

    return result.rows;
  },

  // Kiểm tra sản phẩm có thuộc nghệ nhân không.
  async productBelongsToArtisan(productId, artisanId) {
    const result = await pool.query(
      "SELECT 1 FROM san_pham WHERE ma_sp = $1 AND ma_nn = $2",
      [productId, artisanId]
    );

    return result.rowCount > 0;
  },

  // Thêm tư liệu sản phẩm.
  async create({
    accountId,
    productId,
    mediaType,
    url,
    caption,
    publicId,
    resourceType,
  }) {
    const result = await pool.query(
      `INSERT INTO da_phuong_tien
        (
          ma_tk_tai_len,
          loai_tu_lieu,
          duong_dan_tep,
          chu_thich,
          ma_sp,
          cloudinary_public_id,
          cloudinary_resource_type
        )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING
          ma_pt,
          loai_tu_lieu,
          duong_dan_tep,
          chu_thich,
          ngay_tai_len,
          ma_sp,
          cloudinary_public_id,
          cloudinary_resource_type`,
      [
        accountId,
        mediaType,
        url,
        caption || null,
        productId,
        publicId,
        resourceType,
      ]
    );

    return result.rows[0];
  },

  async saveYouTube(productId, accountId, url) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        "DELETE FROM da_phuong_tien WHERE ma_sp = $1 AND loai_tu_lieu = 'video'",
        [productId]
      );
      const result = await client.query(
        `INSERT INTO da_phuong_tien
         (ma_tk_tai_len, loai_tu_lieu, duong_dan_tep, chu_thich, ma_sp)
       VALUES ($2, 'video', $3, 'Video YouTube', $1)
       RETURNING ma_pt, loai_tu_lieu, duong_dan_tep, chu_thich, ma_sp`,
        [productId, accountId, url]
      );
      await client.query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async deleteById(productId, mediaId) {
    const result = await pool.query(
      `DELETE FROM da_phuong_tien
       WHERE ma_sp = $1 AND ma_pt = $2
       RETURNING ma_pt, cloudinary_public_id, cloudinary_resource_type`,
      [productId, mediaId]
    );
    return result.rows[0];
  },
};

module.exports = ProductMedia;
