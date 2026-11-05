import {
  BookOpen,
  Bell,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Settings,
  Sprout,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import logo from "../assets/logo_v1.png";
import { ROUTES } from "../routes/paths.js";
import "../style/AdminLayout.css";

const navigationItems = [
  { label: "Trang tổng quan", icon: LayoutDashboard, to: ROUTES.ARTISAN_DASHBOARD },
  { label: "Hồ sơ nghệ nhân", icon: UserRound, to: ROUTES.ARTISAN_PROFILE },
  { label: "Quản lý nghề truyền thống", icon: Sprout, disabled: true },
  { label: "Quản lý sản phẩm", icon: Package, to: ROUTES.ARTISAN_ADD_PRODUCT },
  { label: "Quản lý câu chuyện văn hóa", icon: BookOpen, to: ROUTES.ARTISAN_STORY },
  { label: "Quản lý hoạt động trải nghiệm", icon: CalendarDays, to: ROUTES.ARTISAN_EXPERIENCES },
  { label: "Quản lý hình ảnh và video", icon: Image, disabled: true },
  { label: "Đánh giá và nhận xét", icon: MessageSquare, disabled: true },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dateParts = new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).formatToParts(new Date());
  const currentDate = `${dateParts.find((part) => part.type === "day")?.value} tháng ${dateParts.find((part) => part.type === "month")?.value} năm ${dateParts.find((part) => part.type === "year")?.value}`;

  return (
    <div className={`artisan-shell${isSidebarOpen ? " artisan-shell-menu-open" : ""}`}>
      <aside className="artisan-sidebar">
        <NavLink
          className="artisan-brand"
          to={ROUTES.ARTISAN_DASHBOARD}
          aria-label="Tinh Hoa Việt - Trang tổng quan"
          onClick={() => setIsSidebarOpen(false)}
        >
          <img src={logo} alt="" />
          <span>Tinh Hoa Việt</span>
        </NavLink>

        <div className="artisan-sidebar-label">
          <span>KHÔNG GIAN NGHỆ NHÂN</span>
          <button
            className="artisan-sidebar-toggle"
            type="button"
            aria-label={isSidebarOpen ? "Đóng menu" : "Mở menu"}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={15} />
          </button>
        </div>

        <nav className="artisan-navigation" aria-label="Điều hướng nghệ nhân">
          {navigationItems.map(({ label, icon: Icon, to, disabled }) => (
            disabled ? (
              <span className="artisan-nav-item artisan-nav-disabled" key={label} aria-disabled="true" title="Tính năng sẽ sớm được cập nhật">
                <Icon size={17} aria-hidden="true" />
                <span>{label}</span>
              </span>
            ) : (
              <NavLink
                className={({ isActive }) => `artisan-nav-item${isActive ? " active" : ""}`}
                end
                key={label}
                to={to}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon size={17} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            )
          ))}
        </nav>

        <div className="artisan-sidebar-bottom">
          <button className="artisan-nav-item" type="button">
            <Settings size={17} aria-hidden="true" />
            <span>Cài đặt tài khoản</span>
          </button>
          <NavLink className="artisan-nav-item" to={ROUTES.ARTISAN_LOGIN} onClick={() => setIsSidebarOpen(false)}>
            <LogOut size={17} aria-hidden="true" />
            <span>Đăng xuất</span>
          </NavLink>
          <div className="artisan-help-link">
            <CircleHelp size={15} />
            <span>Trợ giúp &amp; hướng dẫn</span>
          </div>
        </div>
      </aside>

      <div className="artisan-main">
        <header className="artisan-header">
          <button
            className="artisan-mobile-menu"
            type="button"
            aria-label={isSidebarOpen ? "Đóng menu" : "Mở menu"}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={20} />
          </button>
          <div className="artisan-header-greeting">
            <h1>Xin chào bác Hoàng An!</h1>
            <span>Xin chào, Nghệ nhân!</span>
          </div>
          <div className="artisan-header-actions">
            <div className="artisan-date">
              <CalendarDays size={15} />
              <span>{currentDate}</span>
            </div>
            <button className="artisan-notification" type="button" aria-label="Thông báo">
              <Bell size={17} />
            </button>
            <button className="artisan-user-menu" type="button">
              <span className="artisan-avatar">NN</span>
              <span>Nghệ nhân</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </header>

        <div className="artisan-layout-content">
          <Outlet />
          <footer className="artisan-layout-footer">© 2026 Tinh Hoa Việt</footer>
        </div>
      </div>
      {isSidebarOpen && (
        <button
          className="artisan-sidebar-backdrop"
          type="button"
          aria-label="Đóng menu"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
