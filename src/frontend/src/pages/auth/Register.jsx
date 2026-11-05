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
import "../../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/path.js";
import { registerTourist, saveAuthSession } from "../../services/authService.js";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setStatusMessage("Mật khẩu nhập lại chưa khớp.");
      return;
    }

    setStatusMessage("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const session = await registerTourist({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        password,
      });
      saveAuthSession(session);
      navigate(ROUTES.TOURIST, { replace: true });
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <span className="account-tab active" aria-current="page">
                  <Compass size={13} /> Du khách
                </span>
                <Link to={ROUTES.ARTISAN_REGISTER} className="account-tab">
                  <Hammer size={13} /> Nghệ nhân
                </Link>
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

            <form onSubmit={handleRegister}>
              <label className="input-group">
                <span>Họ và tên</span>
                <div className="input-box">
                  <UserRound className="field-icon" size={15} aria-hidden="true" />
                  <input name="name" type="text" autoComplete="name" placeholder="Nguyễn Văn A" required />
                </div>
              </label>

              <label className="input-group">
                <span>Email</span>
                <div className="input-box">
                  <Mail className="field-icon" size={15} aria-hidden="true" />
                  <input
                    name="email"
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
                    name="phone"
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
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
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
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
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

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký"} <ArrowRight size={16} />
              </button>
            </form>

            {statusMessage && <p className="auth-status" role="status">{statusMessage}</p>}

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
