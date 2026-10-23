import "../style/ArtisanDashboard.css"; // Dùng chung file CSS
import { Link, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "../routes/paths.js";
//import header và footer
import ArtisanHeader from "../components/Header.jsx";
import ArtisanFooter from "../components/Footer.jsx";

export default function ArtisanLayout() {
  const location = useLocation();

  // Hàm kiểm tra menu nào đang active dựa trên đường dẫn hiện tại
  const isActive = (path) => location.pathname === path;

  return (
    <div className="artisan-dashboard-container">
      <ArtisanHeader />
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
            <Link
              to={ROUTES.ARTISAN_STORY}
              className={`menu-item ${isActive(ROUTES.ARTISAN_STORY) ? "active" : ""}`}
            >
              📖 Câu chuyện văn hóa
            </Link>
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
          <ArtisanFooter />
        </main>
      </div>
    </div>
  );
}