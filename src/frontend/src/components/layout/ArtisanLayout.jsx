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
  ClipboardList,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/icons/logo_v1.png";
import ArtisanToastProvider from "../common/ArtisanToastProvider.jsx";
import { ROUTES } from "../../routes/path.js";
import "../../styles/ArtisanLayout.css";

const navigationGroups = [

  {
    items: [
      { label: "Tổng quan", icon: LayoutDashboard, to: ROUTES.ARTISAN_DASHBOARD },
      { label: "Nghề truyền thống", icon: Sprout, to: ROUTES.ARTISAN_CRAFTS },
      { label: "Câu chuyện văn hóa", icon: BookOpen, to: ROUTES.ARTISAN_STORY },
      { label: "Sản phẩm của tôi", icon: Package, to: ROUTES.ARTISAN_ADD_PRODUCT },
      { label: "Thư viện hình ảnh & video", icon: Image, to: ROUTES.ARTISAN_MEDIA },
      { label: "Hồ sơ cá nhân", icon: UserRound, to: ROUTES.ARTISAN_PROFILE },

      { label: "Hoạt động trải nghiệm", icon: CalendarDays, to: ROUTES.ARTISAN_EXPERIENCES },
      { label: "Danh sách đăng ký", icon: ClipboardList, to: ROUTES.ARTISAN_REGISTRATIONS },
      { label: "Đánh giá & nhận xét", icon: MessageSquare, to: ROUTES.ARTISAN_REVIEWS },
    ],
  },
  {
    items: [

    ],
  },
];

function readStoredUser() {
  try {
    const user = JSON.parse(window.localStorage.getItem("auth-user") || "null");
    return user && typeof user === "object" ? user : null;
  } catch {
    return null;
  }
}

export default function ArtisanLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState(readStoredUser);
  const dateParts = new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    weekday: "short",
  }).formatToParts(new Date());
  const currentDate = `${dateParts.find((part) => part.type === "weekday")?.value}, ${dateParts.find((part) => part.type === "day")?.value}/${dateParts.find((part) => part.type === "month")?.value}/${dateParts.find((part) => part.type === "year")?.value}`;
  const userName = authUser?.name || "Nghệ nhân";
  const avatarUrl = authUser?.avatarUrl || authUser?.avatar || authUser?.anh_dai_dien;
  const isDashboard = location.pathname === ROUTES.ARTISAN_DASHBOARD;
  const breadcrumbItems = location.pathname === ROUTES.ARTISAN_EXPERIENCES
    ? [
      { label: "Tổng quan", to: ROUTES.ARTISAN_DASHBOARD },
      { label: "Hoạt động trải nghiệm", to: ROUTES.ARTISAN_EXPERIENCES },
      { label: "Danh sách hoạt động", current: true },
    ]
    : location.pathname === ROUTES.ARTISAN_EXPERIENCE_CREATE
      ? [
        { label: "Tổng quan", to: ROUTES.ARTISAN_DASHBOARD },
        { label: "Hoạt động trải nghiệm", to: ROUTES.ARTISAN_EXPERIENCES },
        { label: "Thêm hoạt động mới", current: true },
      ]
      : [
        { label: "Tổng quan", to: ROUTES.ARTISAN_DASHBOARD },
        {
          label: navigationGroups.flatMap((group) => group.items)
            .find((item) => item.to === location.pathname)?.label || "Không gian nghệ nhân",
          current: true,
        },
      ];

  useEffect(() => {
    const syncUser = () => setAuthUser(readStoredUser());
    window.addEventListener("auth-user-updated", syncUser);
    return () => window.removeEventListener("auth-user-updated", syncUser);
  }, []);

  useEffect(() => {
    if (!isUserMenuOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!userMenuRef.current?.contains(event.target)) setIsUserMenuOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsUserMenuOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    window.localStorage.removeItem("auth-token");
    window.localStorage.removeItem("auth-user");
    setAuthUser(null);
    setIsUserMenuOpen(false);
    navigate(ROUTES.ARTISAN_LOGIN, { replace: true });
  };

  return (
    <ArtisanToastProvider>
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
            {navigationGroups.map((group) => (
              <div className="artisan-nav-group" key={group.title || "overview"}>
                {group.title && <h2 className="artisan-nav-section-title">{group.title}</h2>}
                {group.items.map(({ label, icon: Icon, to, disabled }) => (
                  disabled ? (
                    <span
                      className="artisan-nav-item artisan-nav-disabled"
                      key={label}
                      aria-disabled="true"
                      title="Tính năng sẽ sớm được cập nhật"
                    >
                      <Icon size={17} aria-hidden="true" />
                      <span>{label}</span>
                    </span>
                  ) : (
                    <NavLink
                      className={({ isActive }) => `artisan-nav-item${isActive ? " active" : ""}`}
                      end={to !== ROUTES.ARTISAN_EXPERIENCES}
                      key={label}
                      to={to}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <Icon size={17} aria-hidden="true" />
                      <span>{label}</span>
                    </NavLink>
                  )
                ))}
              </div>
            ))}
          </nav>

          <div className="artisan-sidebar-bottom">
            <button className="artisan-nav-item" type="button">
              <Settings size={17} aria-hidden="true" />
              <span>Cài đặt</span>
            </button>
            <button className="artisan-nav-item" type="button" onClick={handleLogout}>
              <LogOut size={17} aria-hidden="true" />
              <span>Đăng xuất</span>
            </button>
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
            {isDashboard ? (
              <div className="artisan-header-greeting">
                <h1>Xin chào {userName}!</h1>
                <span>Chào mừng bạn trở lại với Tinh Hoa Việt</span>
              </div>
            ) : (
              <nav className="artisan-header-breadcrumb" aria-label="Điều hướng">
                {breadcrumbItems.map((item, index) => (
                  <span className="artisan-header-breadcrumb-part" key={`${item.label}-${index}`}>
                    {index > 0 && <span className="artisan-header-breadcrumb-separator">/</span>}
                    {item.current ? (
                      <strong aria-current="page">{item.label}</strong>
                    ) : (
                      <NavLink to={item.to}>{item.label}</NavLink>
                    )}
                  </span>
                ))}
              </nav>
            )}
            <div className="artisan-header-actions">
              {isDashboard && (
                <div className="artisan-date">
                  <CalendarDays size={15} />
                  <span>{currentDate}</span>
                </div>
              )}
              <button className="artisan-notification" type="button" aria-label="Thông báo, 3 thông báo mới">
                <Bell size={17} />
                <span className="artisan-notification-count">3</span>
              </button>
              <div className="artisan-user-menu-wrap" ref={userMenuRef}>
                <button
                  className="artisan-user-menu"
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isUserMenuOpen}
                  aria-label={isDashboard ? undefined : "Tài khoản nghệ nhân"}
                  onClick={() => setIsUserMenuOpen((open) => !open)}
                >
                  {avatarUrl
                    ? <img className="artisan-avatar" src={avatarUrl} alt="" />
                    : <span className="artisan-avatar artisan-avatar-fallback" aria-hidden="true">{userName.charAt(0)}</span>}
                  {isDashboard && (
                    <>
                      <span>{userName}</span>
                      <ChevronDown size={14} />
                    </>
                  )}
                </button>
                {isUserMenuOpen && (
                  <div className="artisan-user-dropdown" role="menu">
                    {isDashboard && (
                      <div className="artisan-user-dropdown-heading">
                        <strong>{userName}</strong>
                        {authUser?.email && <span>{authUser.email}</span>}
                      </div>
                    )}
                    <NavLink
                      className="artisan-user-dropdown-item"
                      to={ROUTES.ARTISAN_PROFILE}
                      role="menuitem"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <UserRound size={16} aria-hidden="true" />
                      Hồ sơ cá nhân
                    </NavLink>
                    <button className="artisan-user-dropdown-item" type="button" role="menuitem" onClick={handleLogout}>
                      <LogOut size={16} aria-hidden="true" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
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
    </ArtisanToastProvider>
  );
}
