import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/paths.js";

export default function ArtisanDashboard() {
  return (
    <>
      {/* Banner chào mừng */}
      <div className="welcome-banner-card">
        <div className="welcome-text">
          <span className="sun-icon">☀</span>
          <div>
            <h2>Kính chào Bác Nguyễn Văn An</h2>
            <p>Nghệ nhân Gốm Bát Tràng • Chúc bác một ngày thành thái sáng tạo và đón nhiều khách quý ghé thăm làng nghề.</p>
          </div>
        </div>
        <button className="light-green-btn">Xưởng gốm đang mở cửa đón khách</button>
      </div>

      {/* Card thông tin chi tiết nghệ nhân */}
      <div className="artisan-hero-card">
        <div className="artisan-hero-left">
          <img 
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=85" 
            alt="Bác An" 
          />
        </div>
        <div className="artisan-hero-right">
          <div className="tags-row">
            <span className="badge red">Danh hiệu Nghệ Nhân Nhân Dân</span>
            <span className="badge green">Làng nghề Cổ Bát Tràng</span>
          </div>
          <h1>Bác Nguyễn Văn An</h1>
          <p className="subtitle-craft">Nghệ nhân Gốm Chu Đậu - Bát Tràng (Hơn 40 năm gìn giữ nghề)</p>
          <p className="address-text">📍 Địa chỉ xưởng gốm: Số 18, Thôn Giang Cao, Xã Bát Tràng, Gia Lâm, Hà Nội</p>
          <blockquote className="quote-box">
            "Đất là đất mẹ, là hồn cốt của người đời. Tôi mong muốn truyền ngọn lửa đất nung và kỹ thuật men ngọc cho thế hệ trẻ và du khách bốn phương khi ghé qua làng nghề."
          </blockquote>
          <div className="hero-action-buttons">
            <Link to={ROUTES?.ARTISAN_PROFILE || "/artisan-profile"} className="btn-brown-solid" style={{ textDecoration: 'none', display: 'inline-block' }}>
              ✏ Xem & Cập nhật hồ sơ
            </Link>
            <button className="btn-brown-outline">🔗 Chia sẻ trang nghệ nhân</button>
          </div>
        </div>
      </div>

      {/* Thống kê hoạt động làng nghề */}
      <section className="stats-section">
        <div className="section-header-row">
          <h3>Thống kê hoạt động làng nghề</h3>
          <span className="update-time">Cập nhật tự động hôm nay</span>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-top">
              <span>Sản phẩm trưng bày</span>
              <span className="icon-box">📦</span>
            </div>
            <h2>24</h2>
            <p>Tác phẩm gốm sứ đang mở bán & giới thiệu</p>
            <button className="link-text-btn">Xem tất cả sản phẩm →</button>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Câu chuyện văn hóa</span>
              <span className="icon-box">📖</span>
            </div>
            <h2>8</h2>
            <p>Bài viết kể tích gốm cổ truyền tới hồn lang</p>
            <button className="link-text-btn">Xem các câu chuyện →</button>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Hoạt động trải nghiệm</span>
              <span className="icon-box">📅</span>
            </div>
            <h2>3</h2>
            <p>Lớp học vuốt gốm, nung men đang mở đón khách</p>
            <button className="link-text-btn">Xem hoạt động →</button>
          </div>

          <div className="stat-card highlight">
            <div className="stat-card-top">
              <span>Lượt khách đăng ký</span>
              <span className="icon-box">👥</span>
            </div>
            <h2>15 <span className="sub-badge">3 chờ xác nhận</span></h2>
            <p>Du khách và đoàn tham quan đăng ký tuần này</p>
            <button className="btn-red-solid">Duyệt khách đăng ký →</button>
          </div>
        </div>
      </section>

      {/* Thao tác nhanh */}
      <section className="quick-actions-section">
        <h3>Thao tác nhanh dành cho Bác An</h3>
        <p className="section-desc">Bác bấm vào các nút bên dưới để thêm nội dung mới lên trang làng nghề</p>
        <div className="quick-actions-grid">
          <div className="quick-action-box">
            <span className="action-icon">➕</span>
            <h4>+ Thêm sản phẩm mới</h4>
            <p>Đăng ảnh bình gốm, ấm trà, tượng</p>
          </div>
          <div className="quick-action-box">
            <span className="action-icon">✍</span>
            <h4>+ Viết câu chuyện văn hóa</h4>
            <p>Kể tích xưa, kinh nghiệm chọn men gốm</p>
          </div>
          <div className="quick-action-box">
            <span className="action-icon">📅</span>
            <h4>+ Mở buổi trải nghiệm mới</h4>
            <p>Đặt lịch hẹn làm gốm cùng du khách</p>
          </div>
        </div>
      </section>

      {/* Du khách vừa đăng ký gần đây */}
      <section className="recent-bookings-section">
        <div className="section-header-row">
          <div>
            <h3>Du khách vừa đăng ký gần đây</h3>
            <p>Bác có thể kiểm tra danh sách và bấm "Xác nhận đón tiếp" màu xanh để nhận khách</p>
          </div>
          <span className="total-badge">Tổng 16 lượt đăng ký</span>
        </div>

        <div className="table-responsive">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Du khách & Liên hệ</th>
                <th>Hoạt động đăng ký</th>
                <th>Số lượng</th>
                <th>Thời gian hẹn</th>
                <th>Thao tác của Bác An</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="visitor-info">
                    <div className="avatar-circle red">TR</div>
                    <div>
                      <strong>Trần Thu Trang</strong>
                      <span className="phone">📞 0982 345 678</span>
                    </div>
                  </div>
                </td>
                <td>
                  <strong>Trải nghiệm vuốt gốm thủ công & Tô màu men</strong>
                  <span className="sub-note">Lớp cơ bản 2 tiếng</span>
                </td>
                <td><span className="count-pill orange">4 người</span></td>
                <td>
                  <strong>09:00 - Thứ Bảy</strong>
                  <small>Ngày 18/05/2025</small>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="btn-green-action">✔ Xác nhận đón tiếp</button>
                    <button className="btn-outline-action">👁 Xem chi tiết</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}