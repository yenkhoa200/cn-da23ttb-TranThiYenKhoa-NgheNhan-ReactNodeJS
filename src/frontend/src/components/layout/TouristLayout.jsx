import { Moon, Sun, Type, X } from "lucide-react";
import { useEffect, useState } from "react";
import TouristFooter from "../common/TouristFooter.jsx";
import TouristHeader from "../common/TouristHeader.jsx";
import "../../styles/TouristHome.css";

const settingsStorageKey = "tourist-ui-settings";
const defaultSettings = { fontSize: "medium", theme: "light" };

function readStoredSettings() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(settingsStorageKey) || "null");
    return {
      fontSize: ["small", "medium", "large"].includes(stored?.fontSize)
        ? stored.fontSize
        : defaultSettings.fontSize,
      theme: ["light", "dark"].includes(stored?.theme)
        ? stored.theme
        : defaultSettings.theme,
    };
  } catch {
    return defaultSettings;
  }
}

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
  const [settings, setSettings] = useState(readStoredSettings);
  const [draftSettings, setDraftSettings] = useState(settings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  useEffect(() => {
    if (!isSettingsOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsSettingsOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isSettingsOpen]);

  const openSettings = () => {
    setDraftSettings(settings);
    setSettingsError("");
    setIsSettingsOpen(true);
  };

  const saveSettings = () => {
    try {
      window.localStorage.setItem(settingsStorageKey, JSON.stringify(draftSettings));
      setSettings(draftSettings);
      setSettingsError("");
      setIsSettingsOpen(false);
    } catch {
      setSettingsError("Không thể lưu cài đặt trên thiết bị này. Vui lòng kiểm tra quyền lưu trữ của trình duyệt.");
    }
  };

  return (
    <div
      className={`tourist-page${view === "home" ? " tourist-home-shell" : ""}`}
      data-theme={settings.theme}
      data-font-size={settings.fontSize}
      id="top"
    >
      <TouristHeader
        view={view}
        isTourist={isTourist}
        favoriteIds={favoriteIds}
        profile={profile}
        onLogout={onLogout}
        notifications={notifications}
        notificationError={notificationError}
        onNotificationsRead={onNotificationsRead}
        onOpenSettings={openSettings}
      />
      <main className="tourist-main">{children}</main>
      <TouristFooter isTourist={isTourist} />
      {overlays}
      {isSettingsOpen && (
        <div
          className="tourist-settings-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsSettingsOpen(false);
          }}
        >
          <section
            className="tourist-settings-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tourist-settings-title"
          >
            <header className="tourist-settings-header">
              <div>
                <span>CÁ NHÂN HÓA KHÔNG GIAN</span>
                <h2 id="tourist-settings-title">Cài đặt giao diện</h2>
              </div>
              <button type="button" aria-label="Đóng cài đặt" onClick={() => setIsSettingsOpen(false)}>
                <X size={19} />
              </button>
            </header>

            <section className="tourist-settings-group" aria-labelledby="tourist-font-size-title">
              <div className="tourist-settings-group-title">
                <Type size={18} />
                <div>
                  <h3 id="tourist-font-size-title">Cỡ chữ</h3>
                  <p>Chọn mức dễ đọc cho nội dung.</p>
                </div>
              </div>
              <div className="tourist-settings-options tourist-font-options">
                {[
                  { value: "small", label: "Nhỏ", size: "14 px" },
                  { value: "medium", label: "Vừa", size: "16 px" },
                  { value: "large", label: "Lớn", size: "18 px" },
                ].map((option) => (
                  <button
                    className={draftSettings.fontSize === option.value ? "selected" : ""}
                    type="button"
                    key={option.value}
                    aria-pressed={draftSettings.fontSize === option.value}
                    onClick={() => setDraftSettings((current) => ({ ...current, fontSize: option.value }))}
                  >
                    <strong style={{ fontSize: option.size }}>Aa</strong>
                    <span>{option.label}</span>
                    <small>{option.size}</small>
                  </button>
                ))}
              </div>
            </section>

            <section className="tourist-settings-group" aria-labelledby="tourist-theme-title">
              <div className="tourist-settings-group-title">
                {draftSettings.theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
                <div>
                  <h3 id="tourist-theme-title">Chế độ giao diện</h3>
                  <p>Chọn giao diện sáng hoặc tối.</p>
                </div>
              </div>
              <div className="tourist-settings-options tourist-theme-options">
                <button
                  className={draftSettings.theme === "light" ? "selected" : ""}
                  type="button"
                  aria-pressed={draftSettings.theme === "light"}
                  onClick={() => setDraftSettings((current) => ({ ...current, theme: "light" }))}
                >
                  <Sun size={19} />
                  <span>Sáng</span>
                </button>
                <button
                  className={draftSettings.theme === "dark" ? "selected" : ""}
                  type="button"
                  aria-pressed={draftSettings.theme === "dark"}
                  onClick={() => setDraftSettings((current) => ({ ...current, theme: "dark" }))}
                >
                  <Moon size={19} />
                  <span>Tối</span>
                </button>
              </div>
            </section>

            {settingsError && <p className="tourist-settings-error" role="alert">{settingsError}</p>}
            <footer className="tourist-settings-footer">
              <button type="button" onClick={() => setIsSettingsOpen(false)}>Hủy</button>
              <button className="tourist-settings-save" type="button" onClick={saveSettings}>Lưu cài đặt</button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
