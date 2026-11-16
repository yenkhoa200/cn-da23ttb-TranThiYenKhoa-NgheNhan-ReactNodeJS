import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  FileImage,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Search,
  ShieldAlert,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/icons/logo_v1.png";
import { ROUTES } from "../../routes/path.js";

// eslint-disable-next-line react-refresh/only-export-components
export const adminNavigation = [
  { label: "Tổng quan", path: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
  { label: "Quản lý tài khoản", path: "/admin/accounts", icon: Users },
  { label: "Quản lý nghệ nhân", path: "/admin/artisans", icon: UserCheck },
  { label: "Nghề truyền thống", path: "/admin/crafts", icon: Leaf },
  { label: "Quản lý sản phẩm", path: "/admin/products", icon: Package },
  { label: "Nội dung văn hóa", path: "/admin/stories", icon: BookOpen },
  { label: "Hoạt động trải nghiệm", path: "/admin/experiences", icon: CalendarDays },
  { label: "Hình ảnh và video", path: "/admin/media", icon: FileImage },
  { label: "Quản lý đánh giá", path: "/admin/reviews", icon: MessageSquare },
  { label: "Nội dung vi phạm", path: "/admin/reports", icon: ShieldAlert },
];

export function AdminSidebar({ onClose, reportsCount }) {
  return (
    <aside className="admin-sidebar">
      <Link className="admin-brand" to={ROUTES.ADMIN_DASHBOARD} onClick={onClose}>
        <img src={logo} alt="" />
        <span><strong>Tinh Hoa Việt</strong></span>
      </Link>
      <div className="admin-nav-caption">
        <button className="admin-sidebar-toggle" type="button" aria-label="Đóng menu" onClick={onClose}>
          <X size={17} />
        </button>
      </div>
      <nav className="admin-navigation" aria-label="Điều hướng quản trị">
        {adminNavigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === ROUTES.ADMIN_DASHBOARD}
            className={({ isActive }) => `admin-nav-link${isActive ? " active" : ""}`}
            onClick={onClose}
          >
            <Icon size={17} />
            <span>{label}</span>
            {label === "Nội dung vi phạm" && <i>{reportsCount}</i>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export function AdminHeader({ currentTitle, search, onSearchChange, onSearchSubmit, onMenuOpen }) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const handleLogout = () => {
    window.localStorage.removeItem("auth-token");
    window.localStorage.removeItem("auth-user");
    setAccountMenuOpen(false);
  };

  return (
    <header className="admin-header">
      <button
        className="admin-mobile-menu"
        type="button"
        aria-label="Mở menu"
        onClick={onMenuOpen}
      >
        <Menu size={20} />
      </button>

      <div className="admin-header-title">
        <h1>{currentTitle}</h1>
      </div>

      <form className="admin-header-search" onSubmit={onSearchSubmit}>
        <Search size={17} />
        <input
          aria-label="Tìm kiếm nhanh"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Tìm nhanh chức năng..."
        />
      </form>

      <div className="admin-header-actions">
        <button className="admin-notification" type="button" aria-label="Thông báo">
          <Bell size={18} />
          <i />
        </button>

        <span className="admin-header-divider" />

        <div className="admin-profile-wrap">
          <button
            className="admin-profile"
            type="button"
            aria-expanded={accountMenuOpen}
            onClick={() => setAccountMenuOpen((open) => !open)}
          >
            <span className="admin-profile-avatar">QT</span>
            <span>
              <strong>Admin</strong>
              <small>Quản trị viên</small>
            </span>
            <ChevronDown size={15} />
          </button>

          {accountMenuOpen && (
            <div className="admin-profile-menu">
              <strong>Quản trị viên</strong>
              <small>admin@tinhhoaviet.vn</small>
              <Link to={ROUTES.ADMIN_LOGIN} onClick={handleLogout}>
                <LogOut size={14} />Đăng xuất
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
