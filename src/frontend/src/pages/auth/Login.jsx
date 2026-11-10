import { useState } from "react";
import "../../styles/Login.css";
import { ArrowRight, Compass, Eye, EyeOff, Hammer, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/path.js";
import { loginAccount, saveAuthSession } from "../../services/authService.js";

export default function Login({ initialAccountType = "visitor" }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState(initialAccountType);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isArtisan = accountType === "artisan";
  const isAdmin = accountType === "admin";
  const registerPath = isArtisan ? ROUTES.ARTISAN_REGISTER : ROUTES.REGISTER;

  const handleLogin = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const session = await loginAccount({
        identifier: formData.get("identifier"),
        password: formData.get("password"),
        accountType,
      });
      saveAuthSession(session);
      const destination = isAdmin
        ? ROUTES.ADMIN_DASHBOARD
        : isArtisan
          ? ROUTES.ARTISAN_DASHBOARD
          : ROUTES.TOURIST;
      navigate(destination, { replace: true });
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`login-page login-page-redesign${isArtisan ? " artisan-auth-page" : ""}${isAdmin ? " admin-auth-page" : ""}`}>
      {isAdmin && (
        <header className="admin-login-header">
          <span className="admin-login-header-icon" aria-hidden="true">
            <ShieldCheck size={18} />
          </span>
          <span>
            <strong>HỆ THỐNG QUẢN TRỊ</strong>
            <small>Nghề Nhân &amp; Văn Hóa Việt Nam</small>
          </span>
        </header>
      )}

      <main className="login-container">
        <div className="login-banner">
          <div className="banner-content">
            <span className="quote-icon">“</span>
            <h1>
              Gìn giữ tinh hoa, <i>tiếp nối</i> câu chuyện Việt.
            </h1>
            <p>
              Gặp gỡ nghệ nhân, khám phá làng nghề và cùng lan tỏa những giá trị văn hóa Việt.
            </p>
            <div className="banner-features">
              <div className="feature-item">
                <span className="feat-icon"><Compass size={17} /></span>
                <div>
                  <strong>Khám phá di sản sống</strong>
                  <small>Những câu chuyện và trải nghiệm từ khắp các làng nghề.</small>
                </div>
              </div>
              <div className="feature-item">
                <span className="feat-icon"><Hammer size={17} /></span>
                <div>
                  <strong>Đồng hành cùng nghệ nhân</strong>
                  <small>Góp phần gìn giữ nghề truyền thống qua từng thế hệ.</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-form-wrapper">
          <div className={`login-card${isAdmin ? " admin-login-card" : ""}`}>
            {isAdmin ? (
              <div className="admin-login-icon" aria-hidden="true">
                <LockKeyhole size={23} />
              </div>
            ) : null}
            {!isAdmin && (
            <div className="login-toolbar">
              <div className="account-tabs" role="group" aria-label="Loại tài khoản">
                <button
                  className={`account-tab ${accountType === "visitor" ? "active" : ""}`}
                  type="button"
                  aria-pressed={accountType === "visitor"}
                  onClick={() => setAccountType("visitor")}
                >
                  <Compass size={13} /> Du khách
                </button>
                <button
                  className={`account-tab ${accountType === "artisan" ? "active" : ""}`}
                  type="button"
                  aria-pressed={accountType === "artisan"}
                  onClick={() => setAccountType("artisan")}
                >
                  <Hammer size={13} /> Nghệ nhân
                </button>
              </div>
              <nav className="auth-tabs" aria-label="Tài khoản">
                <span className="tab-btn active" aria-current="page">Đăng nhập</span>
                <Link to={registerPath} className="tab-btn">Đăng ký</Link>
              </nav>
            </div>
            )}

            {!isAdmin && (
              <div className="login-brand">
                <span className="login-brand-mark" aria-hidden="true">✥</span>
                <span>
                  <strong>Tinh Hoa Việt</strong>
                  <small>GÌN GIỮ &amp; LAN TỎA BẢN SẮC</small>
                </span>
              </div>
            )}

            <div className="form-header">
              <h2>{isAdmin ? "Đăng Nhập Quản Trị" : isArtisan ? "Đăng nhập - Nghệ nhân" : "Đăng nhập"}</h2>
              <p>
                {isAdmin
                  ? "Vui lòng nhập thông tin tài khoản được cấp để tiếp tục."
                  : isArtisan
                  ? "Đăng nhập để quản lý hồ sơ, sản phẩm, câu chuyện và hoạt động trải nghiệm của bạn."
                  : "Đăng nhập để lưu lại những trải nghiệm yêu thích và khám phá thêm nhiều nội dung hấp dẫn."}
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <label className="input-group">
                <span>{isAdmin ? <>Email / Tên đăng nhập <b>*</b></> : "Email hoặc số điện thoại"}</span>
                <div className="input-box">
                  <Mail className="field-icon" size={15} aria-hidden="true" />
                  <input
                    name="identifier"
                    type="text"
                    autoComplete="username"
                    placeholder={isAdmin ? "admin@vanhoa.vn" : "example@gmail.com hoặc 0912345678"}
                    required
                  />
                </div>
              </label>

              <label className="input-group">
                <div className="label-row">
                  <span>{isAdmin ? <>Mật khẩu <b>*</b></> : "Mật khẩu"}</span>
                  <a href="#forgot" className="forgot-link">Quên mật khẩu?</a>
                </div>
                <div className="input-box">
                  <LockKeyhole className="field-icon" size={15} aria-hidden="true" />
                  <input 
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    autoComplete="current-password"
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button" 
                    className="eye-btn" 
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <div className="remember-row">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting
                  ? "Đang đăng nhập..."
                  : isAdmin
                    ? "Đăng Nhập Hệ Thống"
                    : "Đăng nhập"} <ArrowRight size={16} />
              </button>
            </form>

            {statusMessage && <p className="auth-status" role="status">{statusMessage}</p>}

            {isAdmin ? (
              <div className="admin-login-demo">
                <span>Chỉ tài khoản được cấp quyền quản trị mới có thể đăng nhập.</span>
                <span className="admin-login-demo-badge">Quản trị viên (Admin)</span>
              </div>
            ) : (
              <>
                <div className="divider">
                  <span>HOẶC</span>
                </div>

                <button className="google-login" type="button">
                  <span className="google-mark" aria-hidden="true">G</span>
                  Đăng nhập bằng Google
                </button>

                <div className="login-register-prompt">
                  Chưa có tài khoản? <Link to={registerPath}>Đăng ký ngay</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      {isAdmin && (
        <footer className="admin-login-footer">
          <span>© 2026 Hệ thống Quản lý Nghệ Nhân &amp; Văn Hóa.</span>
          <span>Bảo mật dành riêng cho tài khoản quản trị.</span>
        </footer>
      )}
    </div>
  );
}