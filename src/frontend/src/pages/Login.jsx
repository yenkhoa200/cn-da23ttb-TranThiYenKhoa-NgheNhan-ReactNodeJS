import { useState } from "react";
import "../style/Login.css";
import { ArrowRight, Compass, Eye, EyeOff, Hammer, LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/paths.js";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState("visitor");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    navigate(accountType === "artisan" ? ROUTES.ARTISAN_DASHBOARD : ROUTES.HOME);
  };

  return (
    <div className="login-page login-page-redesign">
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
          <div className="login-card">
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
                <Link to={ROUTES.REGISTER} className="tab-btn">Đăng ký</Link>
              </nav>
            </div>

            <div className="login-brand">
              <span className="login-brand-mark" aria-hidden="true">✥</span>
              <span>
                <strong>Tinh Hoa Việt</strong>
                <small>GÌN GIỮ &amp; LAN TỎA BẢN SẮC</small>
              </span>
            </div>

            <div className="form-header">
              <h2>Đăng nhập</h2>
              <p>Đăng nhập để lưu lại những trải nghiệm yêu thích và khám phá thêm nhiều nội dung hấp dẫn.</p>
            </div>

            <form onSubmit={handleLogin}>
              <label className="input-group">
                <span>Email hoặc số điện thoại</span>
                <div className="input-box">
                  <Mail className="field-icon" size={15} aria-hidden="true" />
                  <input type="text" autoComplete="username" placeholder="example@gmail.com hoặc 0912345678" required />
                </div>
              </label>

              <label className="input-group">
                <div className="label-row">
                  <span>Mật khẩu</span>
                  <a href="#forgot" className="forgot-link">Quên mật khẩu?</a>
                </div>
                <div className="input-box">
                  <LockKeyhole className="field-icon" size={15} aria-hidden="true" />
                  <input 
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

              <button type="submit" className="submit-btn">
                Đăng nhập <ArrowRight size={16} />
              </button>
            </form>

            <div className="divider">
              <span>HOẶC</span>
            </div>

            <button className="google-login" type="button">
              <span className="google-mark" aria-hidden="true">G</span>
              Đăng nhập bằng Google
            </button>

            <div className="login-register-prompt">
              Chưa có tài khoản? <Link to={ROUTES.REGISTER}>Đăng ký ngay</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}