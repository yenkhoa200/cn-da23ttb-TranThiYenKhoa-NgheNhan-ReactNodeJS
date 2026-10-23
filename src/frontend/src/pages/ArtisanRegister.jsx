import { useState } from "react";
import "../style/Login.css"; // Dùng chung CSS base hoặc tạo file ArtisanRegister.css riêng
import logoImg from "../assets/logo.png";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/paths.js";

export default function ArtisanRegister() {
  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    fullName: "Trần Văn Độ",
    dob: "12/08/1957",
    gender: "nam",
    phone: "0912 345 678",
    email: "nguyen.van.nghenhan@nghenhan.vn",
    cccd: "001057008923",
    titles: ["NNND", "NNU"],
    
    // Phần 2: Làng nghề
    workshopName: "Xưởng Gốm Phục Dựng Men Cổ — Nghệ Nhân Trần Độ",
    craftType: "Gốm sứ truyền thống & Men ngọc/Men rạn",
    generations: "Đời thứ 5",
    experienceYears: "48 năm trong nghề",
    craftVillage: "Làng gốm Bát Tràng (Gia Lâm)",
    region: "Bắc Bộ (Đồng Bằng Sắc Lô / Bắc Bộ)",
    address: "Số 18, Ngõ Giang Cao, Thôn Bát Tràng, Xã Bát Tràng, Huyện Gia Lâm, Hà Nội",

    // Phần 3: Trải nghiệm & Workshop
    capacity: "Đoàn nhỏ hoặc vừa (dưới 20 người)",
    workshopType: "regular",
    amenities: ["sales", "live_demo", "copro"],
    foreignLanguages: ["tieng_anh", "phiendich"],

    // Cam kết
    agreePolicy: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (name === "agreePolicy") {
        setFormData({ ...formData, [name]: checked });
      } else {
        // Handle array checkboxes
        const updated = checked
          ? [...formData[name], value]
          : formData[name].filter((item) => item !== value);
        setFormData({ ...formData, [name]: updated });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit Artisan Data:", formData);
    alert("Gửi hồ sơ ghi danh thành công! Ban quản trị sẽ liên hệ trong 24h - 48h.");
  };

  return (
    <div className="artisan-register-page" style={{ backgroundColor: "#FAF7F2", color: "#333", minHeight: "100vh" }}>
      {/* 1. Header chính */}
      <header className="top-bar" style={{ display: "flex", justifyContent: "space-between", padding: "12px 5%", background: "#FFF", borderBottom: "1px solid #EAE0D5" }}>
        <div className="brand" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={logoImg} alt="Hồn Việt Logo" style={{ height: "40px" }} />
          <div>
            <strong style={{ fontSize: "18px", color: "#8B261D", display: "block" }}>Tinh Hoa Việt</strong>
            <small style={{ fontSize: "11px", color: "#666" }}>TINH HOA LÀNG NGHỀ</small>
          </div>
        </div>
        <nav style={{ display: "flex", gap: "20px", alignItems: "center", fontSize: "14px" }}>
          <Link to={ROUTES.HOME}>Trang chủ</Link>
          <a href="#nghe-nhan">Nghệ nhân</a>
          <a href="#lang-nghe">Làng nghề & Văn hóa</a>
          <a href="#workshop">Trải nghiệm Workshop</a>
          <a href="#kham-pha">Khám phá di sản</a>
          <Link to={ROUTES.LOGIN} style={{ color: "#8B261D", fontWeight: "bold" }}>Đăng nhập / Đăng ký</Link>
          <Link to={ROUTES.ARTISAN_REGISTER} style={{ background: "#8B261D", color: "#FFF", padding: "8px 16px", borderRadius: "4px", textDecoration: "none" }}>
            Đăng ký Nghệ nhân
          </Link>
        </nav>
      </header>

      {/* Banner tiêu đề */}
      <div style={{ textAlign: "center", padding: "30px 20px 10px" }}>
        <p style={{ color: "#8B261D", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
          🏛 BẢO TỒN NGHỆ NHÂN & BẢO TỒN DI SẢN LÀNG NGHỀ
        </p>
        <h1 style={{ fontFamily: "serif", fontSize: "28px", color: "#2B1810", margin: "8px 0" }}>
          Ghi Danh Nghệ Nhân & Xưởng Thủ Công
        </h1>
        <p style={{ color: "#666", fontSize: "14px", maxWidth: "700px", margin: "0 auto" }}>
          Kính mời Quý Nghệ nhân, Bậc thầy thủ công và Đại diện các dòng họ nghệ nhân tham gia ghi danh vào Mạng lưới Di sản Quốc gia để lưu giữ tinh hoa, quảng bá thương hiệu và kết nối du khách trải nghiệm chân thực.
        </p>
      </div>

      {/* 2. Thanh Tiến Trình (4 Bước) */}
      <div style={{ display: "flex", justifyContent: "center", gap: "15px", maxWidth: "1100px", margin: "20px auto 30px" }}>
        <div style={{ flex: 1, padding: "12px", background: "#8B261D", color: "#FFF", borderRadius: "6px", fontSize: "13px" }}>
          <span style={{ fontWeight: "bold", opacity: 0.8 }}>1. ĐANG THỰC HIỆN</span>
          <div style={{ fontWeight: "bold", marginTop: "2px" }}>Định danh Nghệ nhân</div>
        </div>
        <div style={{ flex: 1, padding: "12px", background: "#EAE0D5", color: "#666", borderRadius: "6px", fontSize: "13px" }}>
          <span style={{ fontWeight: "bold", opacity: 0.8 }}>2. BƯỚC KẾ TIẾP</span>
          <div>Xưởng & Làng nghề truyền thống</div>
        </div>
        <div style={{ flex: 1, padding: "12px", background: "#EAE0D5", color: "#666", borderRadius: "6px", fontSize: "13px" }}>
          <span style={{ fontWeight: "bold", opacity: 0.8 }}>3. BƯỚC KẾ TIẾP</span>
          <div>Sản phẩm & Workshop</div>
        </div>
        <div style={{ flex: 1, padding: "12px", background: "#EAE0D5", color: "#666", borderRadius: "6px", fontSize: "13px" }}>
          <span style={{ fontWeight: "bold", opacity: 0.8 }}>4. HOÀN TẤT</span>
          <div>Minh chứng & Thẩm định</div>
        </div>
      </div>

      {/* 3. Bố cục Form chính chia 2 cột (Cột Trái: Form, Cột Phải: Sidebar trợ giúp) */}
      <div style={{ display: "flex", gap: "30px", maxWidth: "1100px", margin: "0 auto 50px", padding: "0 15px" }}>
        
        {/* CỘT TRÁI - FORM NHẬP LỆU */}
        <form onSubmit={handleSubmit} style={{ flex: 2, display: "flex", flexDirection: "column", gap: "25px" }}>
          
          {/* PHẦN 1: Thông tin định danh */}
          <div style={{ background: "#FFF", padding: "25px", borderRadius: "8px", border: "1px solid #EAE0D5" }}>
            <h3 style={{ fontFamily: "serif", fontSize: "18px", borderBottom: "1px solid #EEE", paddingBottom: "10px", marginBottom: "20px", color: "#2B1810" }}>
              🎖 1. Thông Tin Định Danh Nghệ Nhân
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ fontSize: "13px", fontWeight: "bold", display: "block", marginBottom: "5px" }}>Họ và tên Nghệ nhân *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required style={{ width: "100%", padding: "10px", border: "1px solid #DDD", borderRadius: "4px" }} />
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: "bold", display: "block", marginBottom: "5px" }}>Năm sinh / Ngày tháng năm sinh *</label>
                <input type="text" name="dob" value={formData.dob} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "1px solid #DDD", borderRadius: "4px" }} />
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: "bold", display: "block", marginBottom: "5px" }}>Giới tính</label>
                <div style={{ display: "flex", gap: "15px", paddingTop: "8px" }}>
                  <label><input type="radio" name="gender" value="nam" checked={formData.gender === "nam"} onChange={handleChange} /> Nam</label>
                  <label><input type="radio" name="gender" value="nu" checked={formData.gender === "nu"} onChange={handleChange} /> Nữ</label>
                  <label><input type="radio" name="gender" value="khac" checked={formData.gender === "khac"} onChange={handleChange} /> Khác</label>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: "bold", display: "block", marginBottom: "5px" }}>Số điện thoại chính (Xác minh OTP) *</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: "100%", padding: "10px", border: "1px solid #DDD", borderRadius: "4px" }} />
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: "bold", display: "block", marginBottom: "5px" }}>Địa chỉ Email (Thường dùng)</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "1px solid #DDD", borderRadius: "4px" }} />
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <label style={{ fontSize: "13px", fontWeight: "bold", display: "block", marginBottom: "5px" }}>Số CCCD / Định danh cá nhân *</label>
                <input type="text" name="cccd" value={formData.cccd} onChange={handleChange} required style={{ width: "100%", padding: "10px", border: "1px solid #DDD", borderRadius: "4px" }} />
              </div>
            </div>

            <label style={{ fontSize: "13px", fontWeight: "bold", display: "block", marginBottom: "10px" }}>Danh hiệu / Phong tặng Văn hóa nhà nước (Chọn các mục tương ứng):</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "13px" }}>
              <label style={{ border: "1px solid #DDD", padding: "10px", borderRadius: "4px" }}>
                <input type="checkbox" name="titles" value="NNND" checked={formData.titles.includes("NNND")} onChange={handleChange} />
                <strong> Nghệ nhân Nhân dân (NNND)</strong><br />
                <small style={{ color: "#666" }}>Do Chủ tịch nước phong tặng</small>
              </label>
              <label style={{ border: "1px solid #DDD", padding: "10px", borderRadius: "4px" }}>
                <input type="checkbox" name="titles" value="NNUT" checked={formData.titles.includes("NNUT")} onChange={handleChange} />
                <strong> Nghệ nhân Ưu tú (NNUT)</strong><br />
                <small style={{ color: "#666" }}>Cấp Quốc gia (Bộ VHTTDL)</small>
              </label>
            </div>
          </div>

          {/* PHẦN 2: Thông tin Làng nghề */}
          <div style={{ background: "#FFF", padding: "25px", borderRadius: "8px", border: "1px solid #EAE0D5" }}>
            <h3 style={{ fontFamily: "serif", fontSize: "18px", borderBottom: "1px solid #EEE", paddingBottom: "10px", marginBottom: "20px", color: "#2B1810" }}>
              🏺 2. Thông Tin Làng Nghề & Cơ Sở Chủ Tác
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "bold", display: "block", marginBottom: "5px" }}>Tên Xưởng / Làng nghề - Cơ sở truyền thống *</label>
                <input type="text" name="workshopName" value={formData.workshopName} onChange={handleChange} required style={{ width: "100%", padding: "10px", border: "1px solid #DDD", borderRadius: "4px" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "bold", display: "block", marginBottom: "5px" }}>Ngành nghề chính *</label>
                  <select name="craftType" value={formData.craftType} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "1px solid #DDD", borderRadius: "4px" }}>
                    <option value="Gốm sứ truyền thống & Men ngọc/Men rạn">Gốm sứ truyền thống</option>
                    <option value="Mây tre đan">Mây tre đan</option>
                    <option value="Thêu tay & Lụa">Thêu tay & Lụa</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "bold", display: "block", marginBottom: "5px" }}>Thế hệ truyền thừa</label>
                  <input type="text" name="generations" value={formData.generations} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "1px solid #DDD", borderRadius: "4px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "bold", display: "block", marginBottom: "5px" }}>Số năm trong nghề *</label>
                  <input type="text" name="experienceYears" value={formData.experienceYears} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "1px solid #DDD", borderRadius: "4px" }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: "bold", display: "block", marginBottom: "5px" }}>Địa chỉ chi tiết xưởng nghề *</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required style={{ width: "100%", padding: "10px", border: "1px solid #DDD", borderRadius: "4px" }} />
              </div>
            </div>
          </div>

          {/* PHẦN 3: Năng lực đón tiếp du khách */}
          <div style={{ background: "#FFF", padding: "25px", borderRadius: "8px", border: "1px solid #EAE0D5" }}>
            <h3 style={{ fontFamily: "serif", fontSize: "18px", borderBottom: "1px solid #EEE", paddingBottom: "10px", marginBottom: "20px", color: "#2B1810" }}>
              🎨 3. Năng Lực Đón Tiếp Du Khách & Trải Nghiệm Workshop
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "bold", display: "block", marginBottom: "5px" }}>Khả năng đón tiếp đoàn khách cùng lúc</label>
                <select name="capacity" value={formData.capacity} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "1px solid #DDD", borderRadius: "4px" }}>
                  <option value="Đoàn nhỏ hoặc vừa (dưới 20 người)">Đoàn vừa (dưới 20 người)</option>
                  <option value="Đoàn lớn (trên 50 người)">Đoàn lớn (trên 50 người)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "bold", display: "block", marginBottom: "5px" }}>Hình thức Lớp học / Workshop</label>
                <div style={{ display: "flex", gap: "10px", paddingTop: "5px" }}>
                  <label><input type="radio" name="workshopType" value="regular" checked={formData.workshopType === "regular"} onChange={handleChange} /> Có mở lớp thường xuyên</label>
                  <label><input type="radio" name="workshopType" value="on_demand" checked={formData.workshopType === "on_demand"} onChange={handleChange} /> Chỉ nhận theo hẹn</label>
                </div>
              </div>
            </div>
          </div>

          {/* PHẦN 4: Minh chứng hình ảnh */}
          <div style={{ background: "#FFF", padding: "25px", borderRadius: "8px", border: "1px solid #EAE0D5" }}>
            <h3 style={{ fontFamily: "serif", fontSize: "18px", borderBottom: "1px solid #EEE", paddingBottom: "10px", marginBottom: "20px", color: "#2B1810" }}>
              🖼 4. Hình Ảnh Xưởng Nghề & Tư Liệu Minh Chứng
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", textAlign: "center" }}>
              <div style={{ border: "2px dashed #DDD", padding: "20px", borderRadius: "6px", background: "#FAF7F2" }}>
                <span style={{ fontSize: "24px" }}>📷</span>
                <p style={{ fontSize: "12px", margin: "5px 0", fontWeight: "bold" }}>Ảnh Chân Dung Nghệ Nhân</p>
                <button type="button" style={{ padding: "5px 10px", fontSize: "11px", cursor: "pointer" }}>Tải ảnh lên</button>
              </div>
              <div style={{ border: "2px dashed #DDD", padding: "20px", borderRadius: "6px", background: "#FAF7F2" }}>
                <span style={{ fontSize: "24px" }}>🖼</span>
                <p style={{ fontSize: "12px", margin: "5px 0", fontWeight: "bold" }}>Ảnh Xưởng & Tác Phẩm</p>
                <button type="button" style={{ padding: "5px 10px", fontSize: "11px", cursor: "pointer" }}>Tải 3-5 ảnh</button>
              </div>
              <div style={{ border: "2px dashed #DDD", padding: "20px", borderRadius: "6px", background: "#FAF7F2" }}>
                <span style={{ fontSize: "24px" }}>📜</span>
                <p style={{ fontSize: "12px", margin: "5px 0", fontWeight: "bold" }}>Bằng Khen / Chứng Nhận</p>
                <button type="button" style={{ padding: "5px 10px", fontSize: "11px", cursor: "pointer" }}>Tải ảnh/PDF</button>
              </div>
            </div>
          </div>

          {/* Cam kết & Nút gửi */}
          <div style={{ background: "#FFF8F0", border: "1px solid #EAE0D5", padding: "20px", borderRadius: "8px" }}>
            <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px" }}>
              <input type="checkbox" name="agreePolicy" checked={formData.agreePolicy} onChange={handleChange} required />
              <span>
                Tôi xin cam kết toàn bộ thông tin kê khai trên đây là hoàn toàn đúng thực tế và chịu trách nhiệm trước pháp luật cũng như Quy định Bảo tồn của Hồn Việt.
              </span>
            </label>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <button type="button" style={{ padding: "10px 20px", background: "#FFF", border: "1px solid #CCC", borderRadius: "4px", cursor: "pointer" }}>
                💾 Lưu bản nháp
              </button>
              <button type="submit" style={{ padding: "12px 30px", background: "#8B261D", color: "#FFF", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>
                Tiếp tục & Gửi Hồ Sơ Thẩm Định →
              </button>
            </div>
          </div>
        </form>

        {/* CỘT PHẢI - THÔNG TIN TRỢ GIÚP & QUYỀN LỢI */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Card Chuyên viên hỗ trợ */}
          <div style={{ background: "#8B261D", color: "#FFF", padding: "20px", borderRadius: "8px" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "15px" }}>🎧 Cần Chuyên Viên Tận Xưởng?</h4>
            <p style={{ fontSize: "12px", opacity: 0.9, lineHeight: "1.5" }}>
              Quý Cụ, Bậc thầy nghệ nhân gặp khó khăn khi làm hồ sơ? Đội ngũ chuyên viên văn hóa Hồn Việt sẵn sàng hỗ trợ tận xưởng hoàn toàn miễn phí.
            </p>
            <div style={{ marginTop: "15px", background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "4px", textAlign: "center", fontWeight: "bold", fontSize: "16px" }}>
              📞 Gọi Tổng Đài: 0902 345 678
            </div>
          </div>

          {/* Card Quyền lợi */}
          <div style={{ background: "#FFF", border: "1px solid #EAE0D5", padding: "20px", borderRadius: "8px", fontSize: "13px" }}>
            <h4 style={{ color: "#8B261D", marginTop: 0 }}>🌟 Quyền Lợi Nghệ Nhân Khi Gia Nhập</h4>
            <ul style={{ paddingLeft: "18px", margin: 0, display: "flex", flexDirection: "column", gap: "10px", color: "#555" }}>
              <li><strong>Quảng bá thương hiệu:</strong> Tiếp cận hàng triệu du khách trong & ngoài nước.</li>
              <li><strong>Bảo hộ tên tuổi:</strong> Cam kết bảo vệ bản quyền tác phẩm và dòng họ truyền thừa.</li>
              <li><strong>100% Học phí Workshop gửi về xưởng:</strong> Hỗ trợ tài chính trực tiếp duy trì làng nghề.</li>
            </ul>
          </div>

          {/* Card Quy trình xét duyệt */}
          <div style={{ background: "#FFF", border: "1px solid #EAE0D5", padding: "20px", borderRadius: "8px", fontSize: "13px" }}>
            <h4 style={{ color: "#8B261D", marginTop: 0 }}>📋 Quy Trình Xét Duyệt Hồ Sơ</h4>
            <ol style={{ paddingLeft: "18px", margin: 0, display: "flex", flexDirection: "column", gap: "8px", color: "#555" }}>
              <li><strong>1. Tiếp nhận hồ sơ:</strong> Kiểm tra tính chính xác của thông tin.</li>
              <li><strong>2. Thẩm định địa phương:</strong> Xác minh với đại diện Làng nghề/Chính quyền.</li>
              <li><strong>3. Kích hoạt hồ sơ:</strong> Đưa thông tin xưởng lên bản đồ di sản Hồn Việt.</li>
            </ol>
          </div>

        </div>

      </div>

      {/* Footer */}
      <footer style={{ background: "#2B1810", color: "#FFF", padding: "30px 5%", fontSize: "12px", textAlign: "center" }}>
        <p>© 2025 Hồn Việt — Nền tảng du lịch văn hóa & bảo tồn làng nghề truyền thống Việt Nam. Bảo lưu mọi quyền.</p>
      </footer>
    </div>
  );
}