import { useState } from "react";
import {
  ArrowRight,
  Compass,
  Eye,
  EyeOff,
  Hammer,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import "../style/Login.css";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/paths.js";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState("visitor");

  return (
    <div className="login-page login-page-redesign register-page-redesign">
      <main className="login-container register-container">
        <section className="login-banner register-banner">
          <div className="banner-content">
            <span className="quote-icon">“</span>
            <h1>
              Cùng viết tiếp <i>câu chuyện nghề Việt.</i>
            </h1>
            <p>
              Tạo tài khoản để khám phá nghệ nhân, làng nghề và những giá trị
              văn hóa đang được gìn giữ qua từng thế hệ.
            </p>
            <div className="banner-features">
              <div className="feature-item">
                <span className="feat-icon"><Compass size={17} /></span>
                <div>
                  <strong>Khám phá di sản sống</strong>
                  <small>Gặp gỡ nghệ nhân và tìm hiểu câu chuyện phía sau mỗi nghề.</small>
                </div>
              </div>
              <div className="feature-item">
                <span className="feat-icon"><Hammer size={17} /></span>
                <div>
                  <strong>Đồng hành cùng làng nghề</strong>
                  <small>Lan tỏa bản sắc Việt và góp phần tiếp nối nghề truyền thống.</small>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="login-form-wrapper register-form-wrapper">
          <div className="login-card register-card">
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
                <Link to={ROUTES.LOGIN} className="tab-btn">Đăng nhập</Link>
                <span className="tab-btn active" aria-current="page">Đăng ký</span>
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
              <h2>Đăng ký tài khoản</h2>
              <p>Khám phá nghệ nhân, làng nghề, sản phẩm và những câu chuyện văn hóa đặc sắc của Việt Nam.</p>
            </div>

            <form onSubmit={(event) => event.preventDefault()}>
              <label className="input-group">
                <span>Họ và tên</span>
                <div className="input-box">
                  <UserRound className="field-icon" size={15} aria-hidden="true" />
                  <input type="text" autoComplete="name" placeholder="Nguyễn Văn A" required />
                </div>
              </label>

              <label className="input-group">
                <span>Email</span>
                <div className="input-box">
                  <Mail className="field-icon" size={15} aria-hidden="true" />
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="example@gmail.com"
                    required
                  />
                </div>
              </label>

              <label className="input-group">
                <span>Số điện thoại</span>
                <div className="input-box">
                  <Phone className="field-icon" size={15} aria-hidden="true" />
                  <input
                    type="tel"
                    autoComplete="tel"
                    placeholder="0912 345 678"
                    required
                  />
                </div>
              </label>

              <label className="input-group">
                <span>Mật khẩu</span>
                <div className="input-box">
                  <LockKeyhole className="field-icon" size={15} aria-hidden="true" />
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Tạo mật khẩu (ít nhất 6 ký tự)"
                    minLength={6}
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

              <label className="input-group">
                <span>Nhập lại mật khẩu</span>
                <div className="input-box">
                  <ShieldCheck className="field-icon" size={15} aria-hidden="true" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Nhập lại mật khẩu"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <div className="remember-row">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span>
                    Tôi đồng ý với <a href="#terms">Điều khoản sử dụng</a> và{" "}
                    <a href="#privacy">Chính sách bảo mật</a>
                  </span>
                </label>
              </div>

              <button type="submit" className="submit-btn">
                Đăng ký <ArrowRight size={16} />
              </button>
            </form>

            <div className="divider">
              <span>HOẶC</span>
            </div>

            <button className="google-login" type="button">
              <span className="google-mark" aria-hidden="true">G</span>
              Đăng ký bằng Google
            </button>

            <div className="login-register-prompt">
              Đã có tài khoản? <Link to={ROUTES.LOGIN}>Đăng nhập</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
