import TouristFooter from "../common/TouristFooter.jsx";
import TouristHeader from "../common/TouristHeader.jsx";
import "../../styles/TouristHome.css";

export default function TouristLayout({
  view,
  isTourist,
  favoriteIds,
  profile,
  onLogout,
  notifications,
  notificationError,
  onNotificationsRead,
  children,
  overlays,
}) {
  return (
    <div className={`tourist-page${view === "home" ? " tourist-home-shell" : ""}`} id="top">
      <TouristHeader
        view={view}
        isTourist={isTourist}
        favoriteIds={favoriteIds}
        profile={profile}
        onLogout={onLogout}
        notifications={notifications}
        notificationError={notificationError}
        onNotificationsRead={onNotificationsRead}
      />
      <main className="tourist-main">{children}</main>
      <TouristFooter isTourist={isTourist} />
      {overlays}
    </div>
  );
}
