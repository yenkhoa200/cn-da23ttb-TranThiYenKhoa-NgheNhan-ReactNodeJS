import { useState } from "react";
import { Link } from "react-router-dom";
import "../style/ArtisanAddProduct.css";
import { ROUTES } from "../routes/paths.js";

export default function ArtisanAddProduct() {
  const [selectedCategory, setSelectedCategory] = useState("Gốm trang trí");

  return (
    <main className="product-content">
          {/* Nút quay lại */}
          <div className="back-button-row">
            <Link to={ROUTES?.ARTISAN_PRODUCTS || "/artisan-products"} className="btn-back">
              ← Trở về danh sách sản phẩm
            </Link>
          </div>

          {/* Banner Tiêu đề Trang */}
          <div className="page-header-card">
            <div>
              <span className="step-tag-red">✍ BƯỚC ĐIỀN THÔNG TIN TÁC PHẨM</span>
              <h1>Thêm sản phẩm gốm truyền thống mới</h1>
              <p className="subtitle">
                Bác An chỉ cần điền các ô chữ bên dưới. Nếu có chỗ nào chưa rõ, bác hãy bấm nghe giọng hướng dẫn màu vàng nhé.
              </p>
            </div>
            <button className="btn-audio-guide">
              🔊 Bật đọc giọng nói hướng dẫn
            </button>
          </div>

          {/* FORM BƯỚC 1: TÊN SẢN PHẨM & DANH MỤC */}
          <div className="product-card">
            <div className="card-step-header">
              <div className="step-number">1</div>
              <h2>Tên sản phẩm & Danh mục</h2>
              <span className="required-note">Bắt buộc nhập</span>
            </div>

            <form className="step-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>Tên sản phẩm gốm *</label>
                <small className="label-sub">Bác đặt tên rõ ràng, kèm hoa văn đặc trưng để khách dễ nhớ.</small>
                <div className="input-with-voice">
                  <input 
                    type="text" 
                    defaultValue="Bình hoa gốm men rạn vẽ hoa sen thủ công" 
                    placeholder="Nhập tên sản phẩm..."
                  />
                  <button type="button" className="voice-btn">🎙 Đọc bằng giọng nói</button>
                </div>
              </div>

              <div className="form-group">
                <label>Nghề & Danh mục sản phẩm *</label>
                <small className="label-sub">Bác bấm chọn một ô phù hợp nhất với sản phẩm này của bác:</small>

                <div className="category-options-grid">
                  <div 
                    className={`cat-card ${selectedCategory === "Gốm trang trí" ? "selected" : ""}`}
                    onClick={() => setSelectedCategory("Gốm trang trí")}
                  >
                    <input type="radio" checked={selectedCategory === "Gốm trang trí"} readOnly />
                    <div>
                      <strong>Gốm trang trí</strong>
                      <small>Bình hoa, tranh gốm, tượng bày</small>
                    </div>
                  </div>

                  <div 
                    className={`cat-card ${selectedCategory === "Đồ gia dụng" ? "selected" : ""}`}
                    onClick={() => setSelectedCategory("Đồ gia dụng")}
                  >
                    <input type="radio" checked={selectedCategory === "Đồ gia dụng"} readOnly />
                    <div>
                      <strong>Đồ gia dụng</strong>
                      <small>Ấm chén trà, bát đĩa men cổ</small>
                    </div>
                  </div>

                  <div 
                    className={`cat-card ${selectedCategory === "Đồ phong thủy" ? "selected" : ""}`}
                    onClick={() => setSelectedCategory("Đồ phong thủy")}
                  >
                    <input type="radio" checked={selectedCategory === "Đồ phong thủy"} readOnly />
                    <div>
                      <strong>Đồ phong thủy</strong>
                      <small>Lộc bình, đỉnh trầm hương, đồ thờ cúng</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Giá tham khảo (VNĐ) *</label>
                <input type="text" defaultValue="2.500.000" placeholder="Ví dụ: 1.500.000" />
              </div>
            </form>
          </div>

          {/* FORM BƯỚC 2: MÔ TẢ SẢN PHẨM & CÂU CHUYỆN GỐM */}
          <div className="product-card">
            <div className="card-step-header">
              <div className="step-number">2</div>
              <h2>Mô tả sản phẩm & Câu chuyện gốm</h2>
              <span className="tip-link">💡 Gợi ý câu chữ</span>
            </div>

            <div className="story-prompt-box">
              <strong>💡 Gợi ý để Bác An kể chuyện sản phẩm cho du khách nghe:</strong>
              <ul>
                <li><strong>Chất đất:</strong> Sản phẩm làm từ đất sét nào? (Ví dụ: đất phù sa sông Hồng nung 1250°C).</li>
                <li><strong>Ý nghĩa hoa văn:</strong> Hoa tiết sen có ý nghĩa gì đối với người làng Bát Tràng?</li>
                <li><strong>Kích thước & Trọng lượng:</strong> Cao bao nhiêu cm? Nặng bao nhiêu kg? Dùng cắm hoa gì đẹp nhất?</li>
              </ul>
            </div>

            <div className="form-group">
              <textarea 
                rows={6}
                defaultValue="Bình hoa gốm dáng củ tỏi được nghệ nhân chuốt tay hoàn toàn trên bàn xoay thủ công. Lớp men rạn màu gạo nếp truyền thống kết hợp hoa tiết hoa sen vẽ bút lông mực lam chàm cổ. Đất sét trắng dẻo tuyển chọn vùng Trúc Thôn, nung lửa củi ở 1280 độ C tạo độ dẻo đanh bóng bền bỉ cùng thời gian. Kích thước cao 36cm, đường kính bụng 22cm, thích hợp trưng phòng khách và cắm sen mùa hạ."
              />
            </div>

            <div className="textarea-footer">
              <span className="char-count-ok">Đã viết: 84 từ (Rất đầy đủ và truyền cảm hứng)</span>
              <button type="button" className="btn-add-speech">🎙 Nói thêm vào đây</button>
            </div>
          </div>

          {/* FORM BƯỚC 3: HÌNH ẢNH SẢN PHẨM GỐM */}
          <div className="product-card">
            <div className="card-step-header">
              <div className="step-number">3</div>
              <h2>Hình ảnh sản phẩm gốm</h2>
              <span className="count-info">3 / 4 ảnh</span>
            </div>
            <p className="step-sub-desc">Tải lên từ 1 đến 4 hình ảnh rõ nét của sản phẩm để du khách ngắm nhìn chi tiết</p>

            <div className="images-upload-grid">
              {/* Ảnh 1 */}
              <div className="image-preview-card">
                <span className="main-tag">Ảnh đại diện</span>
                <img src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=400&q=85" alt="Toàn cảnh bình hoa" />
                <span className="img-title">Toàn cảnh bình hoa</span>
              </div>

              {/* Ảnh 2 */}
              <div className="image-preview-card">
                <img src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=85" alt="Chi tiết nét vẽ sen lam" />
                <span className="img-title">Chi tiết nét vẽ sen lam</span>
              </div>

              {/* Ảnh 3 */}
              <div className="image-preview-card">
                <img src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=400&q=85" alt="Triện con nghệ nhân An" />
                <span className="img-title">Triện con nghệ nhân An</span>
              </div>

              {/* Ô Tải ảnh 4 */}
              <div className="upload-placeholder-card">
                <span className="upload-icon">🖼</span>
                <strong>Thêm ảnh thứ 4</strong>
                <small>Bấm máy ảnh hoặc chọn từ máy</small>
              </div>
            </div>

            <div className="upload-action-bar">
              <div className="camera-tip">
                <span className="cam-icon">📷</span>
                <span>Bác An có thể chụp thêm góc khác bằng điện thoại. Hỗ trợ định dạng JPG, PNG dung lượng đến 10MB.</span>
              </div>
              <button type="button" className="btn-choose-file">📷 Chọn ảnh từ máy</button>
            </div>
          </div>

          {/* FORM BƯỚC 4: VIDEO GIỚI THIỆU SẢN PHẨM */}
          <div className="product-card">
            <div className="card-step-header">
              <div className="step-number">4</div>
              <div>
                <h2>Video giới thiệu sản phẩm</h2>
                <p className="step-sub-desc margin-0">Thước phim ngắn quay cảnh chuốt gốm hoặc xoay bình để khách phương xa an tâm đặt mua</p>
              </div>
              <span className="optional-badge">Không bắt buộc</span>
            </div>

            <div className="form-group">
              <label>Dán liên kết video YouTube tại đây:</label>
              <div className="input-with-btn">
                <input type="text" defaultValue="https://youtube.com/watch?v=gom-bat-trang" placeholder="https://youtube.com/..." />
                <button type="button" className="btn-check-video">📺 Kiểm tra video</button>
              </div>
            </div>

            {/* Khung phát thử video */}
            <div className="video-preview-wrapper">
              <div className="video-preview-header">
                <span>👁 Khung phát thử xem trước cho bác An kiểm tra ngay:</span>
                <span className="link-ok">✔ Liên kết hoạt động tốt</span>
              </div>
              <div className="video-player-box">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85" alt="Video thumbnail" />
                <button type="button" className="play-button">▶</button>
                <div className="video-overlay-text">
                  <strong>Nghệ nhân Nguyễn Văn An - Kỹ nghệ men rạn Bát Tràng (3:20)</strong>
                  <small>Video này sẽ hiển thị cho du khách khi xem trang bình hoa</small>
                </div>
                <div className="video-footer-info">
                  <span>Độ dài: 3 phút 20 giây</span>
                  <span>Chất lượng: Độ nét cao HD 1080p</span>
                </div>
              </div>
            </div>
          </div>

          {/* THANH LƯU SẢN PHẨM CỐ ĐỊNH HOẶC Ở CỦOI */}
          <div className="sticky-save-bar">
            <div className="save-status-info">
              <span className="green-dot">●</span>
              <span>Đã tự động lưu bản sao lúc 14:32. Không lo mất, chỉ cần là tốt may.</span>
            </div>
            <div className="save-action-btns">
              <button type="button" className="btn-save-draft">📄 Lưu nháp để xem lại sau</button>
              <button type="button" className="btn-publish-product">💾 LƯU SẢN PHẨM</button>
            </div>
          </div>

    </main>
  );
}