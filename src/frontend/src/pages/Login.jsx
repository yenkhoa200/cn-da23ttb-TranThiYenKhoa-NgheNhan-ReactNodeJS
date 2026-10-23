import { useState } from "react";
import "../style/Login.css";
import logoImg from "../assets/logo.png"; // Đường dẫn tới logo của bạn
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/paths.js";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-page">
      {/* Header nhỏ phía trên */}
      <header className="login-top-bar">
        <div className="login-brand">
          <img src={logoImg} alt="Tinh Hoa Việt Logo" className="brand-logo" />
          
          {/*<div className="brand-icon-box">H</div>*/}
          <div>
            <strong>Tinh Hoa Việt</strong>
            <small>Nền tảng di sản - Tinh hoa tương lai</small>
          </div>
        </div>
        <div className="top-actions">
          <Link to={ROUTES.HOME} className="back-link">← Trang chủ</Link>
        </div>
      </header>

      {/* Main Container chia 2 cột */}
      <main className="login-container">
        {/* Cột Trái: Banner giới thiệu nghệ nhân */}
        <div className="login-banner">
          <div className="banner-overlay"></div>
          <div className="banner-content">
            <span className="quote-icon">“</span>
            <h1>
              Đồng hành cùng <i>350+ nghệ nhân</i> gìn giữ dòng chảy di sản Việt.
            </h1>
            <p>
              Mỗi chuyến ghé thăm làng nghề không chỉ là một hành trình trải nghiệm,
              mà còn là nguồn trợ lực trực tiếp cho các thế hệ nghệ nhân nuôi dưỡng tinh hoa ngàn năm.
            </p>

            <div className="banner-features">
              <div className="feature-item">
                <span className="feat-icon">🛡</span>
                <div>
                  <strong>Trải nghiệm văn hóa chân thực</strong>
                  <small>Tham gia trực tiếp cùng nghệ nhân tại xưởng truyền thống</small>
                </div>
              </div>
              <div className="feature-item">
                <span className="feat-icon">💎</span>
                <div>
                  <strong>Hỗ trợ trực tiếp cộng đồng nghệ nhân</strong>
                  <small>100% học phí workshop gửi về quỹ phát triển làng nghề</small>
                </div>
              </div>
              <div className="feature-item">
                <span className="feat-icon">📜</span>
                <div>
                  <strong>Bảo lưu giá trị ngàn năm</strong>
                  <small>Số hóa tư liệu và câu chuyện truyền thừa từ các bậc cao niên</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cột Phải: Form đăng nhập */}
        <div className="login-form-wrapper">
          <div className="login-card">
            {/* Tabs chọn Đăng nhập / Đăng ký */}
            <div className="auth-tabs">
              <button className="tab-btn active">Đăng nhập</button>
              <Link to={ROUTES.REGISTER} className="tab-btn">Đăng ký</Link>
            </div>

            <div className="form-header">
              <h2>Chào mừng du khách trở lại</h2>
              <p>Tiếp tục hành trình khám phá những miền di sản ngàn đời của Việt Nam.</p>
            </div>

            {/* Nút đăng nhập mạng xã hội */}
            <div className="social-login">
              <button className="social-btn">
                <span className="soc-icon g">G</span> Google
              </button>
              <button className="social-btn">
                <span className="soc-icon f">f</span> Facebook
              </button>
              <button className="social-btn">
                <span className="soc-icon a"></span> Apple ID
              </button>
            </div>

            <div className="divider">
              <span>HOẶC QUA TÀI KHOẢN</span>
            </div>

            {/* Form nhập liệu */}
            <form onSubmit={(e) => e.preventDefault()}>
              <label className="input-group">
                <span>Địa chỉ Email</span>
                <div className="input-box">
                  <span className="field-icon">✉</span>
                  <input type="email" placeholder="nguyen.van@example.com" defaultValue="nguyen.van@example.com" />
                </div>
              </label>

              <label className="input-group">
                <div className="label-row">
                  <span>Mật khẩu</span>
                  <a href="#forgot" className="forgot-link">Quên mật khẩu?</a>
                </div>
                <div className="input-box">
                  <span className="field-icon">🔒</span>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Nhập mật khẩu của bạn" 
                  />
                  <button 
                    type="button" 
                    className="eye-btn" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    👁
                  </button>
                </div>
              </label>

              <div className="remember-row">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Ghi nhớ đăng nhập trên thiết bị này</span>
                </label>
              </div>

              <button type="submit" className="submit-btn">
                Đăng nhập vào Hồn Việt →
              </button>
            </form>

            {/* Liên kết chuyển đổi cho Nghệ nhân */}
            <div className="artisan-switch-footer">
              <span>🏠 Bạn là Nghệ nhân hoặc Đại diện Làng nghề?</span>
              <Link to={ROUTES.ARTISAN_REGISTER}>Đăng ký tại Cổng Nghệ Nhân →</Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer nhỏ phía dưới */}
      <footer className="login-footer">
        <div>
          <strong>Tinh Hoa Việt</strong>
          <p>© 2025 Tinh Hoa Việt — Nền tảng du lịch văn hóa & bảo tồn làng nghề truyền thống Việt Nam. Bảo lưu mọi quyền.</p>
        </div>
        <div className="footer-links">
          <a href="#about">Về dự án Tinh Hoa Việt</a>
          <a href="#privacy">Chính sách bảo tồn</a>
          <a href="#lang">Tiếng Việt (VN)</a>
        </div>
      </footer>
    </div>
  );
}