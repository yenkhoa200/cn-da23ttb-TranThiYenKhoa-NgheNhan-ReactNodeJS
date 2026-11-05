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
import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Login.css";
import { ROUTES } from "../../routes/path.js";

export default function ArtisanRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setStatusMessage("Mật khẩu nhập lại chưa khớp.");
      return;
    }

    // Chỉ kiểm tra dữ liệu giao diện; không lưu tài khoản khi API chưa có.
    setStatusMessage("Thông tin hợp lệ. API đăng ký chưa được kết nối nên chưa tạo tài khoản.");
  };

  return (
    <div className="login-page login-page-redesign artisan-auth-page register-page-redesign artisan-register-page">
      <main className="login-container register-container">
        <section className="login-banner register-banner">
          <div className="banner-content">
            <span className="quote-icon">“</span>
            <h1>
              Cùng viết tiếp <i>câu chuyện nghề Việt.</i>
            </h1>
            <p>
              Tạo tài khoản nghệ nhân để chia sẻ câu chuyện, giới thiệu nghề và
              lan tỏa giá trị truyền thống.
            </p>
            <div className="banner-features">
              <div className="feature-item">
                <span className="feat-icon"><Hammer size={17} /></span>
                <div>
                  <strong>Giới thiệu nghề truyền thống</strong>
                  <small>Đưa sản phẩm và câu chuyện của bạn đến gần hơn với du khách.</small>
                </div>
              </div>
              <div className="feature-item">
                <span className="feat-icon"><Compass size={17} /></span>
                <div>
                  <strong>Kết nối cùng cộng đồng</strong>
                  <small>Cùng gìn giữ và tiếp nối tinh hoa làng nghề Việt.</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="login-form-wrapper register-form-wrapper">
          <div className="login-card register-card">
            <div className="login-toolbar">
              <div className="account-tabs" role="group" aria-label="Loại tài khoản">
                <Link to={ROUTES.REGISTER} className="account-tab">
                  <Compass size={13} /> Du khách
                </Link>
                <span className="account-tab active" aria-current="page">
                  <Hammer size={13} /> Nghệ nhân
                </span>
              </div>
              <nav className="auth-tabs" aria-label="Tài khoản">
                <Link to={ROUTES.ARTISAN_LOGIN} className="tab-btn">Đăng nhập</Link>
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
              <h2>Đăng ký tài khoản - Nghệ nhân</h2>
              <p>Chia sẻ câu chuyện, giới thiệu nghề và lan tỏa giá trị văn hóa truyền thống của bạn.</p>
            </div>

            <form onSubmit={handleSubmit}>
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
                  <input type="email" autoComplete="email" placeholder="example@gmail.com" required />
                </div>
              </label>

              <label className="input-group">
                <span>Số điện thoại</span>
                <div className="input-box">
                  <Phone className="field-icon" size={15} aria-hidden="true" />
                  <input type="tel" autoComplete="tel" placeholder="0912 345 678" required />
                </div>
              </label>

              <label className="input-group">
                <span>Nghề truyền thống đang theo đuổi</span>
                <div className="input-box">
                  <Hammer className="field-icon" size={15} aria-hidden="true" />
                  <select className="artisan-craft-select" defaultValue="" required>
                    <option value="" disabled>Chọn ngành nghề truyền thống...</option>
                    <option value="ceramics">Gốm sứ</option>
                    <option value="weaving">Dệt may, thêu</option>
                    <option value="woodwork">Mộc, chạm khắc gỗ</option>
                    <option value="lacquerware">Sơn mài</option>
                    <option value="basketry">Mây tre đan</option>
                    <option value="other">Nghề truyền thống khác</option>
                  </select>
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

              <button type="submit" className="submit-btn">
                Đăng ký <ArrowRight size={16} />
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
              Đã có tài khoản? <Link to={ROUTES.ARTISAN_LOGIN}>Đăng nhập</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
