import { useState } from "react";
import "../style/ArtisanStory.css";

export default function ArtisanStory() {
  const [title, setTitle] = useState("Hồn của đất và ngọn lửa lò bầu hơn trăm năm ở Bát Tràng");
  const [category, setCategory] = useState("KyUCThoGom");
  const [content, setContent] = useState(
    `Cái nghề làm gốm này, người ta bảo đất là mẹ, lửa là cha. Nhớ năm tôi mười hai tuổi, theo ông nội ra canh lò bầu suốt ba ngày ba đêm. Trời mùa đông rét thấu xương nhưng đứng trước cửa lò, ngọn lửa củi phượng đỏ rực như muốn thiêu đốt mọi vất vả. Ông dặn: "Nhìn màu ngọn lửa chuyển từ đỏ sẫm sang trắng trong là men gốm đã chín trọn vẹn, vội một canh giờ là non men, quá một khắc là gốm cháy cong vênh".\n\nMỗi mẻ gốm ra lò như đón một đứa con chào đời, mở cửa lò nghe tiếng men rạn reo tí tách vui tai hơn cả tiếng đàn. Đến nay đã hơn nửa thế kỷ trôi qua, lò gas lò điện đã thay thế dần những lò bầu hun hút khói, nhưng cái hồn của đất Bát Tràng và sự nhẫn nại, nâng niu từng thớ đất sét trắng vẫn nguyên vẹn như ngày ông tôi còn ngồi bên bàn xoay gỗ.`
  );
  const [videoLink, setVideoLink] = useState("https://youtube.com/watch?v=gom-ba");

  return (
    <div className="artisan-story-container">
      {/* Banner / Header thông báo */}
      <div className="story-banner-card">
        <div className="banner-icon">♨</div>
        <div className="banner-text">
          <span className="eyebrow">LƯU GIỮ KÝ ỨC DI SẢN</span>
          <h2>Kể câu chuyện văn hóa & Ký ức làng nghề</h2>
          <p>
            Mỗi câu chuyện của bác là một di sản quý giá cho thế hệ trẻ và du khách bốn phương. Hãy chia sẻ bằng ngôn từ giản dị, chân chất của người thợ làng gốm.
          </p>
        </div>
      </div>

      {/* Bước 1: Tiêu đề và thể loại */}
      <section className="story-section-card">
        <h3>1. Tiêu đề câu chuyện của bác</h3>
        <p className="sub-hint">
          Đặt tên thật gần gũi, gợi nhớ về nghề gốm hoặc kỷ niệm mà bác nhớ nhất.
        </p>

        <div className="input-group">
          <textarea
            className="title-textarea"
            rows="2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <span className="textarea-icon">✍</span>
        </div>

        <div className="story-category-block">
          <h3>2. Thể loại câu chuyện (Bác bấm chọn một ô phù hợp nhất)</h3>
          <p className="sub-hint">
            Giúp khách tham quan dễ tìm đọc theo đúng sở thích của họ.
          </p>

          <div className="category-grid">
            <label className={`category-card ${category === "LichSuNghe" ? "selected" : ""}`}>
              <input
                type="radio"
                name="category"
                value="LichSuNghe"
                checked={category === "LichSuNghe"}
                onChange={() => setCategory("LichSuNghe")}
              />
              <span className="cat-icon">📜</span>
              <span className="cat-title">Lịch sử nghề</span>
            </label>

            <label className={`category-card ${category === "KyThuatTruyenDoi" ? "selected" : ""}`}>
              <input
                type="radio"
                name="category"
                value="KyThuatTruyenDoi"
                checked={category === "KyThuatTruyenDoi"}
                onChange={() => setCategory("KyThuatTruyenDoi")}
              />
              <span className="cat-icon">⚒</span>
              <span className="cat-title">Kỹ thuật truyền đời</span>
            </label>

            <label className={`category-card ${category === "KyUCThoGom" ? "selected" : ""}`}>
              <input
                type="radio"
                name="category"
                value="KyUCThoGom"
                checked={category === "KyUCThoGom"}
                onChange={() => setCategory("KyUCThoGom")}
              />
              <span className="cat-icon">🏺</span>
              <span className="cat-title">Ký ức thợ gốm</span>
            </label>

            <label className={`category-card ${category === "PhongTuc" ? "selected" : ""}`}>
              <input
                type="radio"
                name="category"
                value="PhongTuc"
                checked={category === "PhongTuc"}
                onChange={() => setCategory("PhongTuc")}
              />
              <span className="cat-icon">🏯</span>
              <span className="cat-title">Phong tục làng nghề</span>
            </label>
          </div>
        </div>
      </section>

      {/* Bước 3: Chi tiết câu chuyện */}
      <section className="story-section-card">
        <div className="section-header-flex">
          <div>
            <h3>3. Chi tiết câu chuyện</h3>
            <p className="sub-hint">
              Bác có thể gõ phím hoặc bấm nút micro bên phải để vừa nói vừa chép thành chữ dễ dàng.
            </p>
          </div>
          <button type="button" className="voice-btn">
            🎙 Bác nói - Máy tự viết chữ
          </button>
        </div>

        {/* Khung gợi ý / Lời khuyên */}
        <div className="advice-box">
          <span className="info-icon">ℹ</span>
          <span>
            <strong>Lời khuyên cho bác:</strong> Bác cứ ngồi thong thả, bấm nút đó rồi kể như đang tâm sự với con cháu bên ấm trà sen.
          </span>
        </div>

        {/* Khung soạn thảo văn bản */}
        <div className="editor-container">
          <div className="editor-toolbar">
            <div className="toolbar-left">
              <button type="button" className="tool-btn"><strong>B</strong></button>
              <button type="button" className="tool-btn"><i>I</i></button>
              <button type="button" className="tool-btn">” Đoạn trích</button>
              <button type="button" className="tool-btn">TT Cỡ chữ to</button>
            </div>
            <span className="auto-save">🕒 Đã tự động lưu nháp lúc 10:24</span>
          </div>

          <textarea
            className="editor-content"
            rows="10"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </section>

      {/* Bước 4: Hình ảnh tư liệu */}
      <section className="story-section-card">
        <div className="section-header-flex">
          <div>
            <h3>4. Hình ảnh tư liệu xưa và nay</h3>
            <p className="sub-hint">
              Bác chọn những bức ảnh chụp lò gốm, bàn xoay, hoặc các kỷ vật của gia đình để câu chuyện thêm sống động.
            </p>
          </div>
          <button type="button" className="btn-outline-small">
            🖼 Thêm ảnh mới
          </button>
        </div>

        <div className="images-grid">
          {/* Ảnh 1 */}
          <div className="image-card">
            <div className="img-wrapper">
              <img
                src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=85"
                alt="Lò bầu cổ truyền"
              />
              <button type="button" className="delete-img-btn">🗑</button>
            </div>
            <div className="img-info">
              <strong>Lò bầu cổ truyền thời xưa (Năm 1978)</strong>
              <p>Ảnh tư liệu gia đình lưu giữ</p>
            </div>
          </div>

          {/* Ảnh 2 */}
          <div className="image-card">
            <div className="img-wrapper">
              <img
                src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=400&q=85"
                alt="Vuốt gốm thủ công"
              />
              <button type="button" className="delete-img-btn">🗑</button>
            </div>
            <div className="img-info">
              <strong>Vuốt gốm thủ công bên bàn xoay</strong>
              <p>Ảnh nghệ nhân Nguyễn Văn An lúc 40 tuổi</p>
            </div>
          </div>

          {/* Ô bấm tải ảnh */}
          <div className="upload-box">
            <div className="upload-icon-circle">📄</div>
            <strong>Bấm vào đây để tải thêm ảnh</strong>
            <p>Hỗ trợ ảnh từ điện thoại, máy ảnh hoặc ảnh quét lại</p>
          </div>
        </div>
      </section>

      {/* Bước 5: Thước phim tư liệu */}
      <section className="story-section-card">
        <h3>5. Thước phim tư liệu / Video ngắn (Nếu có)</h3>
        <p className="sub-hint">
          Đoạn phim ngắn bác tự quay hoặc phóng sự đài truyền hình làm về xưởng gốm của bác.
        </p>

        <div className="video-section-flex">
          <div className="video-input-left">
            <label className="input-label">
              Đường dẫn (Link) YouTube hoặc video tự quay:
            </label>
            <div className="link-input-box">
              <span className="link-icon">🔗</span>
              <input
                type="text"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                placeholder="Dán link youtube tại đây..."
              />
            </div>

            <div className="video-action-row">
              <button type="button" className="upload-video-btn">
                📁 Tải video từ máy của bác
              </button>
              <span className="auto-recognize">Tự động nhận diện video</span>
            </div>
          </div>

          {/* Video Preview */}
          <div className="video-preview-card">
            <img
              src="https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=600&q=85"
              alt="Video Phóng sự"
            />
            <div className="play-overlay">
              <span className="play-icon">▶</span>
            </div>
            <div className="video-caption">
              <strong>Phóng sự: Giữ lửa gốm cổ Bát Tràng cùng Bác Nguyễn Văn An</strong>
              <small>Thời lượng: 08 phút 45 giây</small>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Bar - Nút Đăng & Thử nghiệm */}
      <div className="story-submit-bar">
        <div className="submit-note">
          <span className="check-circle">✔</span>
          <div>
            <strong>Bài viết đã sẵn sàng đăng tải</strong>
            <p>Du khách trong và ngoài nước sẽ được thưởng thức câu chuyện này.</p>
          </div>
        </div>

        <div className="submit-buttons">
          <button type="button" className="btn-preview">
            👁 Xem thử bài viết hiển thị thế nào
          </button>
          <button type="button" className="btn-publish">
            ĐĂNG BÀI LÊN TRANG DU LỊCH
          </button>
        </div>
      </div>
    </div>
  );
}