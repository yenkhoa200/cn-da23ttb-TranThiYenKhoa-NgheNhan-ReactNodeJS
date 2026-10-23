import "../style/ArtisanDashboard.css"; // Dùng chung file CSS
import { Link, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "../routes/paths.js";

export default function ArtisanLayout() {
  const location = useLocation();

  // Hàm kiểm tra menu nào đang active dựa trên đường dẫn hiện tại
  const isActive = (path) => location.pathname === path;

  return (
    <div className="artisan-dashboard-container">
      {/* 1. THANH ĐIỀU HƯỚNG TRÊN CÙNG (TOP HEADER) */}
      <header className="artisan-top-nav">
        <div className="brand-box">
          <div className="logo-square">H</div>
          <div>
            <strong>Tinh Hoa Việt</strong>
            <small>Nền tảng di sản - Tinh hoa tương lai</small>
          </div>
        </div>
        <div className="top-nav-right">
          <span className="nav-link-item">Cộng đồng</span>
          <span className="nav-link-item">Tài liệu hướng dẫn</span>
          <span className="bell-icon">🔔</span>
          <div className="hotline-pill">
            <span>📞</span> Gọi trợ giúp ngay: <strong>1900 8888</strong>
          </div>
        </div>
      </header>

      {/* 2. LAYOUT CHÍNH: SIDEBAR TRÁI & NỘI DUNG PHẢI */}
      <div className="dashboard-main-layout">
        
        {/* SIDEBAR BÊN TRÁI */}
        <aside className="artisan-sidebar">
          <div className="artisan-profile-mini">
            <img 
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=85" 
              alt="Bác Nguyễn Văn An" 
            />
            <div>
              <h3>Bác Nguyễn Văn An</h3>
              <small>Nghệ nhân Gốm Bát Tràng</small>
            </div>
          </div>

          <nav className="sidebar-menu">
            <Link
              to={ROUTES.ARTISAN_DASHBOARD}
              className={`menu-item ${isActive(ROUTES.ARTISAN_DASHBOARD) ? "active" : ""}`}
            >
              📊 Tổng quan
            </Link>
            <Link
              to={ROUTES.ARTISAN_PROFILE}
              className={`menu-item ${isActive(ROUTES.ARTISAN_PROFILE) ? "active" : ""}`}
            >
              👤 Hồ sơ nghệ nhân
            </Link>
            <Link
              to={ROUTES.ARTISAN_ADD_PRODUCT}
              className={`menu-item ${isActive(ROUTES.ARTISAN_ADD_PRODUCT) ? "active" : ""}`}
            >
              📦 Thêm sản phẩm
            </Link>
            <a href="#products" className="menu-item">📦 Sản phẩm</a>
            <a href="#culture" className="menu-item">📖 Câu chuyện văn hóa</a>
            <a href="#activities" className="menu-item">📅 Hoạt động trải nghiệm</a>
            <a href="#bookings" className="menu-item">👥 Đăng ký của du khách</a>
          </nav>

          <div className="sidebar-footer-menu">
            <a href="#help">❓ Trợ giúp & Hướng dẫn</a>
            <a href="#settings">⚙ Cài đặt</a>
            <div className="sidebar-hotline-box">
              <small>Cần hỗ trợ kỹ thuật?</small>
              <strong>1900 8888</strong>
            </div>
          </div>
        </aside>

        {/* NỘI DUNG CHÍNH THAY ĐỔI LINH HOẠT GIỮA CÁC TRANG */}
        <main className="dashboard-content">
          <Outlet />

          {/* Footer nhỏ bên trong trang quản trị */}
          <footer className="dashboard-footer">
            <p>Không Gian Nghệ Nhân Làng Nghề Việt Nam © 2025 • Đồng hành gìn giữ tinh hoa gốm Bát Tràng</p>
            <p>Dành riêng cho Bác Nguyễn Văn An • Hệ thống hỗ trợ nghệ nhân 24/7 qua tổng đài 1900 8888</p>
          </footer>
        </main>
      </div>
    </div>
  );
}