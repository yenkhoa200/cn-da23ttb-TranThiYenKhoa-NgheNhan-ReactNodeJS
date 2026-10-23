import "../style/ArtisanProfile.css";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/paths.js";

export default function ArtisanProfile() {
  return (
    <main className="profile-content">
          {/* Breadcrumb & Title */}
          <div className="breadcrumb-row">
            <Link to={ROUTES.ARTISAN_DASHBOARD}>Tổng quan</Link>
            <span>›</span>
            <span className="active">Hồ sơ nghệ nhân</span>
          </div>

          <div className="title-section-row">
            <div>
              <h1>Sổ Lưu Danh & Hồ Sơ Nghệ Nhân</h1>
              <p className="subtitle">
                Thông tin được chứng thực dành cho du khách, nhà nghiên cứu và bạn bè quốc tế tìm hiểu nghề gốm cổ.
              </p>
            </div>
            <div className="verified-badge-pill">
              <span>✔ Đã xác minh cấp quốc gia</span>
            </div>
          </div>

          {/* CARD 1: ẢNH ĐẠI DIỆN TRANG TRỌNG */}
          <div className="profile-card avatar-section-card">
            <div className="avatar-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=85" 
                alt="Bác Nguyễn Văn An chân dung" 
              />
              <span className="badge-on-img">🎖 Nghệ nhân Ưu tú</span>
            </div>

            <div className="avatar-info-right">
              <span className="section-tag-red">Ảnh đại diện trang trọng</span>
              <h2>Bác Nguyễn Văn An</h2>
              <p className="desc-text">
                Bức ảnh chân dung này sẽ xuất hiện trên trang giới thiệu của Làng Nghề Việt và sách hướng dẫn trải nghiệm cho khách du lịch trong và ngoài nước.
              </p>

              <div className="avatar-action-row">
                <button className="change-avatar-btn">
                  📷 Đổi ảnh đại diện
                </button>
                <div className="tip-box">
                  <span className="tip-icon">💡</span>
                  <span><strong>Mẹo nhỏ cho Bác:</strong> Hãy nhờ con cháu hoặc thợ chụp giúp ảnh chân dung rõ nét, thể hiện thần thái tự nhiên.</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: THÔNG TIN CƠ BẢN CỦA NGHỆ NHÂN */}
          <div className="profile-card form-section-card">
            <div className="form-card-header">
              <h2>📝 Thông tin cơ bản của nghệ nhân</h2>
              <span className="tip-note">* Nhấp vào từng ô bên dưới để sửa chữ</span>
            </div>

            <form className="artisan-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-grid-2col">
                <div className="form-group">
                  <label>1. Họ và tên nghệ nhân:</label>

                    <input type="text" defaultValue="Nguyễn Văn An" />
  
                </div>

                <div className="form-group">
                  <label>2. Nghề truyền thống gắn bó:</label>
                  <input type="text" defaultValue="Nghề làm gốm Chu Đậu - Bát Tràng" />
                </div>

                <div className="form-group">
                  <label>3. Thâm niên gắn bó với nghề:</label>
                  <input type="text" defaultValue="42 năm truyền nghề" />
                </div>

                <div className="form-group">
                  <label>4. Số điện thoại liên hệ đón khách:</label>
                  <input type="text" defaultValue="0912 345 678" />
                </div>
              </div>

              <div className="form-group full-width">
                <label>5. Địa chỉ lò gốm / Không gian nhà cổ đón khách:</label>
                <input type="text" defaultValue="Số 12, Ngõ Cổ, Làng Gốm Bát Tràng, Gia Lâm, Hà Nội" />
                <small className="field-hint">Du khách sẽ tìm đến địa chỉ này theo bản đồ chỉ dẫn.</small>
              </div>

              <div className="form-group full-width">
                <div className="label-with-tip">
                  <label>6. Lời tự thuật của nghệ nhân (Giới thiệu bản thân & Truyền thống gia tộc):</label>
                  <span className="auto-text-tip">✏ Bác có thể đọc để máy tự viết</span>
                </div>
                <textarea 
                  rows={4}
                  defaultValue="Gia đình tôi đã bốn đời gắn bó với đất sét trắng và ngọn lửa lò bầu tại Làng gốm Bát Tràng. Kế thừa đôi bàn tay khéo léo và ngọn lửa yêu nghề từ cụ thân sinh, tôi luôn tâm niệm mỗi chiếc bình, chiếc bát vuốt tay không chỉ là vật dụng, mà còn chứa đựng cái hồn, cái mộc mạc và sự thanh tịnh của cốt đất quê hương Việt Nam. Tôi mong muốn truyền kiến thức, kỹ thuật cho thế hệ trẻ và du khách bốn phương ghé thăm."
                />
              </div>

              <div className="form-group full-width">
                <label>7. Hành trình gìn giữ & Phục dựng tinh hoa di sản:</label>
                <textarea 
                  rows={4}
                  defaultValue="Hơn bốn mươi năm qua, tôi đã dành trọn tâm huyết phục chế thành công công thức bôi men lam cổ và men rạn tam thái từ thế kỷ 16 vốn từng bị thất truyền. Xưởng gốm vinh dự nhận Giải Bàn Tay Vàng Làng Nghề năm 2005 và Bằng khen Tinh Hoa Đất Việt năm 2018. Hiện nay, xưởng vẫn kiên quyết giữ kỹ thuật vuốt gốm thủ công bằng tay hoàn toàn không dùng khuôn đúc công nghiệp."
                />
              </div>
            </form>
          </div>

          {/* CARD 3: GIẤY CHỨNG NHẬN & KỶ NIỆM CHƯƠNG */}
          <div className="profile-card certificates-section-card">
            <div className="form-card-header">
              <div>
                <h2>🎖 Giấy chứng nhận nghệ nhân & Kỷ niệm chương</h2>
                <p className="header-desc">Các bằng khen, huy chương, giấy khen nhà nước đã được tải lên để khách tham quan chiêm ngưỡng.</p>
              </div>
              <button className="btn-upload-cert">📷 Chụp thêm bằng khen</button>
            </div>

            <div className="certificates-grid">
              {/* Bằng khen 1 */}
              <div className="cert-item-card">
                <div className="cert-img-box">
                  <img src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=85" alt="Bằng Nghệ Nhân Ưu Tú" />
                  <span className="year-tag">Năm 2012</span>
                </div>
                <h4>Bằng Nghệ Nhân Ưu Tú Cấp Nhà Nước</h4>
                <p>Chứng nhận cống hiến trọn đời cho di sản gốm Việt Nam do Chủ tịch nước phong tặng.</p>
                <div className="cert-footer">
                  <span className="verified-text">✔ Bản gốc xác thực</span>
                  <button className="del-btn">Gỡ ảnh</button>
                </div>
              </div>

              {/* Bằng khen 2 */}
              <div className="cert-item-card">
                <div className="cert-img-box">
                  <img src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=400&q=85" alt="Kỷ Niệm Chương" />
                  <span className="year-tag">Năm 2006</span>
                </div>
                <h4>Kỷ Niệm Chương Bàn Tay Vàng</h4>
                <p>Giải thưởng hội thi tay nghề vuốt gốm mộc không dùng khuôn đúc Làng Bát Tràng.</p>
                <div className="cert-footer">
                  <span className="verified-text">✔ Bản gốc xác thực</span>
                  <button className="del-btn">Gỡ ảnh</button>
                </div>
              </div>

              {/* Ô Thêm bằng khen */}
              <div className="add-cert-card">
                <div className="add-icon-circle">📷</div>
                <h4>Thêm bằng khen khác</h4>
                <p>Bác có thể chụp thêm ảnh kỷ niệm chương hoặc bài báo viết về xưởng gốm của mình.</p>
              </div>
            </div>
          </div>

          {/* DÒNG NÚT LƯU BÊN DƯỚI */}
          <div className="bottom-action-bar">
            <button className="btn-print">🖨 In hồ sơ ra giấy</button>
            <button className="btn-save-primary">💾 Lưu thay đổi hồ sơ</button>
          </div>

          {/* FLOATING SUPPORT BAR */}
          <div className="support-banner">
            <div className="support-left">
              <span className="support-icon">☎</span>
              <div>
                <strong>Bác gặp vướng mắc khi dùng máy tính?</strong>
                <p>Nếu bác gặp khó khăn, hãy bấm gọi <strong>1900 8888</strong> để được các cháu thanh niên hỗ trợ tận nhà miễn phí.</p>
              </div>
            </div>
            <button className="call-now-btn">📞 Bấm gọi 1900 8888</button>
          </div>
    </main>
  );
}