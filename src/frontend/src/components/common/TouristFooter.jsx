import { Link } from "react-router-dom";
import logoImg from "../../assets/icons/logo_v1.png";
import { ROUTES } from "../../routes/path.js";

export default function TouristFooter({ isTourist }) {
  return (
    <footer className="tourist-footer">
      <div className="tourist-footer-main">
        <div className="tourist-footer-brand">
          <Link className="tourist-brand" to={ROUTES.TOURIST}>
            <img src={logoImg} alt="" className="tourist-brand-logo" />
            <span><strong>Tinh Hoa Việt</strong><small>Nền tảng di sản - Tinh hoa tương lai</small></span>
          </Link>
          <p>Hành trình kết nối những giá trị văn hóa và nghề truyền thống, để tinh hoa Việt tiếp tục được gìn giữ và lan tỏa.</p>
        </div>
        <div className="tourist-footer-column">
          <strong>Khám phá</strong>
          <Link to="/tourist/crafts">Làng nghề Việt</Link>
          <Link to="/tourist/traditional-crafts">Nghề truyền thống</Link>
          <Link to="/tourist/artisans">Nghệ nhân</Link>
          <Link to="/tourist/products">Sản phẩm thủ công</Link>
        </div>
        <div className="tourist-footer-column">
          <strong>Dành cho du khách</strong>
          <Link to="/tourist/activities">Hoạt động trải nghiệm</Link>
          <Link to="/tourist/stories">Câu chuyện văn hóa</Link>
          <Link to="/tourist/favorites">Nội dung yêu thích</Link>
          {isTourist && <Link to={ROUTES.TOURIST_BOOKINGS}>Lịch đặt trải nghiệm</Link>}
        </div>
        <div className="tourist-footer-column">
          <strong>Tài khoản</strong>
          <Link to="/tourist/profile">Thông tin cá nhân</Link>
          <Link to="/tourist/search">Tìm kiếm</Link>
          <Link to={ROUTES.HOME}>Trang khách vãng lai</Link>
        </div>
      </div>
      <div className="tourist-footer-bottom">
        <span>· Gìn giữ tinh hoa nghề Việt.</span>
        <span>Đồng hành cùng nghệ nhân và làng nghề Việt Nam.</span>
      </div>
    </footer>
  );
}
