import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  Heart,
  LogOut,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import logoImg from "../../assets/icons/logo_v1.png";
import { ROUTES } from "../../routes/path.js";

const navigation = [
  { label: "Trang chủ", to: ROUTES.TOURIST, view: "home" },
  { label: "Nghệ nhân", to: "/tourist/artisans", view: "artisans" },
  { label: "Làng nghề", to: "/tourist/crafts", view: "crafts" },
  { label: "Nghề truyền thống", to: "/tourist/traditional-crafts", view: "traditional-crafts" },
  { label: "Sản phẩm", to: "/tourist/products", view: "products" },
  { label: "Văn hóa", to: "/tourist/stories", view: "stories" },
  { label: "Hoạt động trải nghiệm", to: "/tourist/activities", view: "activities" },
];

export default function TouristHeader({
  view,
  isTourist,
  favoriteIds,
  profile,
  onLogout,
  notifications = [],
  notificationError = "",
  onNotificationsRead,
}) {
  const [headerPanel, setHeaderPanel] = useState("");
  const headerActionsRef = useRef(null);
  const unreadNotificationCount = notifications.filter((notification) => !notification.read).length;
  const initials = (profile.name || "Du khách")
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("vi");

  useEffect(() => {
    if (!headerPanel) return undefined;

    const closeHeaderPanel = (event) => {
      if (event.type === "keydown" && event.key === "Escape") {
        setHeaderPanel("");
      } else if (event.type === "pointerdown" && !headerActionsRef.current?.contains(event.target)) {
        setHeaderPanel("");
      }
    };

    document.addEventListener("pointerdown", closeHeaderPanel);
    document.addEventListener("keydown", closeHeaderPanel);
    return () => {
      document.removeEventListener("pointerdown", closeHeaderPanel);
      document.removeEventListener("keydown", closeHeaderPanel);
    };
  }, [headerPanel]);

  return (
    <header className="tourist-header">
      <Link className="tourist-brand" to={ROUTES.TOURIST} aria-label="Tinh Hoa Việt - Trang chủ">
        <img src={logoImg} alt="" className="tourist-brand-logo" />
        <span><strong>Tinh Hoa Việt</strong><small>Nền tảng di sản - Tinh hoa tương lai</small></span>
      </Link>
      <nav className="tourist-nav" aria-label="Điều hướng chính">
        {navigation.map((item) => {
          const isCurrent =
            view === item.view
            || (view === "artisan" && item.view === "artisans")
            || (view === "craft" && item.view === "crafts")
            || (view === "traditional-craft" && item.view === "traditional-crafts")
            || (view === "product" && item.view === "products");

          return (
            <Link
              className={isCurrent ? "is-current" : ""}
              to={item.to}
              key={item.label}
              aria-current={isCurrent ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="tourist-header-actions" ref={headerActionsRef}>
        <Link
          className="tourist-icon-button"
          to={isTourist ? ROUTES.TOURIST_BOOKINGS : ROUTES.LOGIN}
          state={isTourist ? undefined : { from: { pathname: ROUTES.TOURIST_BOOKINGS }, accountType: "visitor" }}
          aria-label="Lịch sử đặt lịch trải nghiệm"
          title="Lịch sử đặt lịch"
        >
          <CalendarDays size={18} />
        </Link>
        <Link
          className="tourist-icon-button tourist-saved-shortcut"
          to="/tourist/favorites"
          aria-label={`Nội dung yêu thích${favoriteIds.length ? `, ${favoriteIds.length} mục đã lưu` : ""}`}
        >
          <Heart size={18} />
          {favoriteIds.length > 0 && <span className="tourist-favorite-count">{favoriteIds.length}</span>}
        </Link>
        <div className="tourist-header-popover-wrap">
          <button
            className="tourist-icon-button"
            type="button"
            aria-label="Thông báo"
            aria-expanded={headerPanel === "notifications"}
            onClick={() => {
              const opening = headerPanel !== "notifications";
              setHeaderPanel(opening ? "notifications" : "");
              if (opening) onNotificationsRead?.();
            }}
          >
            <Bell size={18} />
            {unreadNotificationCount > 0 && (
              <span className="tourist-notification-count" aria-label={`${unreadNotificationCount} thông báo chưa đọc`}>
                {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
              </span>
            )}
          </button>
          {headerPanel === "notifications" && (
            <section className="tourist-header-popover tourist-notification-popover" aria-label="Thông báo">
              <strong>Thông báo</strong>
              {notificationError && <p className="tourist-notification-error" role="alert">{notificationError}</p>}
              {notifications.length ? (
                <div className="tourist-notification-list">
                  {notifications.slice(0, 6).map((notification) => (
                    <Link
                      className={`tourist-notification-item${notification.read ? "" : " is-unread"}`}
                      to={ROUTES.TOURIST_BOOKINGS}
                      key={notification.id}
                      onClick={() => setHeaderPanel("")}
                    >
                      <span>
                        <strong>{notification.message}</strong>
                        {notification.reason && <small>Lý do: {notification.reason}</small>}
                        <small>
                          #{notification.bookingId}
                          {notification.changedAt && ` · ${new Date(notification.changedAt).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}`}
                        </small>
                      </span>
                      {!notification.read && <i aria-label="Chưa đọc" />}
                    </Link>
                  ))}
                </div>
              ) : !notificationError ? (
                <p>Bạn chưa có thông báo mới.</p>
              ) : null}
              <Link className="tourist-notification-all" to={ROUTES.TOURIST_BOOKINGS} onClick={() => setHeaderPanel("")}>
                Xem lịch đặt trải nghiệm
              </Link>
            </section>
          )}
        </div>
        <div className="tourist-header-popover-wrap">
          <button
            className="tourist-account-button"
            type="button"
            aria-label="Mở menu tài khoản"
            aria-expanded={headerPanel === "account"}
            onClick={() => setHeaderPanel(headerPanel === "account" ? "" : "account")}
          >
            <span className="tourist-avatar">{initials || <UserRound size={17} />}</span>
            <ChevronDown size={14} />
          </button>
          {headerPanel === "account" && (
            <section className="tourist-header-popover tourist-account-popover" aria-label="Menu tài khoản">
              <div className="tourist-account-summary">
                <strong>{profile.name}</strong>
                <span>{profile.email}</span>
              </div>
              <Link to="/tourist/profile" onClick={() => setHeaderPanel("")}>
                <UserRound size={16} /> Thông tin cá nhân
              </Link>
              <button type="button" onClick={onLogout}>
                <LogOut size={16} /> Đăng xuất
              </button>
            </section>
          )}
        </div>
      </div>
    </header>
  );
}
