import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  Check,
  Clock3,
  Heart,
  Image,
  Info,
  MapPin,
  Play,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/path.js";

export function ActivityDetail({ item, favoriteIds, onFavorite, onNotice, mediaItems }) {
  const [activePhoto, setActivePhoto] = useState(0);
  const [activeTab, setActiveTab] = useState("Giới thiệu");
  const [participants, setParticipants] = useState(1);
  const [date, setDate] = useState(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 3);
    return `${defaultDate.getFullYear()}-${String(defaultDate.getMonth() + 1).padStart(2, "0")}-${String(defaultDate.getDate()).padStart(2, "0")}`;
  });
  const isSaved = favoriteIds.includes(item.id);
  const gallery = item.gallery?.length ? item.gallery : [item.image, ...mediaItems.map((media) => media.image)].slice(0, 4);
  const rating = Number(item.rating) || 4.8;
  const maxParticipants = item.maxParticipants || 20;
  const highlights = [
    `Trực tiếp trải nghiệm ${item.category?.toLocaleLowerCase("vi") || "nghề truyền thống"}`,
    "Gặp gỡ nghệ nhân làng nghề",
    "Mang về sản phẩm do chính tay mình làm",
  ];

  const submitBooking = (event) => {
    event.preventDefault();
    onNotice(`Đã nhận đăng ký ${participants} người cho ngày ${date}. Chúng tôi sẽ liên hệ xác nhận.`);
  };

  return (
    <div className="tourist-view tourist-activity-detail">
      <div className="tourist-breadcrumb">
        <Link to={ROUTES.TOURIST}>Trang chủ</Link>
        <span>›</span>
        <Link to="/tourist/activities">Hoạt động trải nghiệm</Link>
        <span>›</span>
        {item.title}
      </div>

      <section className="tourist-activity-detail-top">
        <div className="tourist-activity-gallery">
          <div className="tourist-activity-gallery-main">
            <img src={gallery[activePhoto]} alt={`${item.title} - hình ${activePhoto + 1}`} />
            <button
              type="button"
              className={`tourist-activity-gallery-favorite ${isSaved ? "is-saved" : ""}`}
              aria-label={isSaved ? "Bỏ yêu thích" : "Lưu yêu thích"}
              onClick={() => onFavorite(item)}
            >
              <Heart size={19} fill={isSaved ? "currentColor" : "none"} />
            </button>
            {gallery.length > 1 && (
              <button
                type="button"
                className="tourist-activity-gallery-next"
                aria-label="Xem ảnh tiếp theo"
                onClick={() => setActivePhoto((current) => (current + 1) % gallery.length)}
              >
                <ArrowRight size={20} />
              </button>
            )}
          </div>
          <div className="tourist-activity-gallery-thumbnails" aria-label="Thư viện hình ảnh hoạt động">
            {gallery.map((image, index) => (
              <button
                type="button"
                className={index === activePhoto ? "active" : ""}
                key={`${image}-${index}`}
                aria-label={`Xem hình ${index + 1}`}
                aria-pressed={index === activePhoto}
                onClick={() => setActivePhoto(index)}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="tourist-activity-detail-info">
          <span className="tourist-activity-detail-badge"><span aria-hidden="true">❧</span> Hoạt động trải nghiệm</span>
          <h1>{item.title}</h1>
          <div className="tourist-activity-detail-rating" aria-label={`Đánh giá ${rating} trên 5`}>
            <span>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} fill={star <= Math.round(rating) ? "currentColor" : "none"} />)}</span>
            <small>({item.reviews || 0} đánh giá)</small>
          </div>
          <p className="tourist-activity-detail-description">{item.description}</p>

          <div className="tourist-activity-detail-facts">
            <div><MapPin size={18} /><span><strong>Địa điểm</strong><small>{item.place}</small></span></div>
            <div><Clock3 size={18} /><span><strong>Thời lượng</strong><small>{item.duration || "2 giờ"}</small></span></div>
            <div><Users size={18} /><span><strong>Số người tối đa</strong><small>{maxParticipants} người</small></span></div>
            <div><CalendarCheck size={18} /><span><strong>Thời gian tổ chức</strong><small>{item.schedule || "Thứ 7, Chủ nhật hằng tuần"}</small></span></div>
            <div><ShieldCheck size={18} /><span><strong>Yêu cầu tham gia</strong><small>{item.minimumAge || "Phù hợp mọi lứa tuổi"}</small></span></div>
          </div>

          <div className="tourist-activity-highlights">
            <strong><span aria-hidden="true">❧</span> Điểm nổi bật</strong>
            {highlights.map((highlight) => <span key={highlight}><Check size={14} />{highlight}</span>)}
          </div>
        </div>

        <aside className="tourist-activity-booking">
          <h2>Đặt lịch tham gia</h2>
          <form onSubmit={submitBooking}>
            <label htmlFor="activity-date"><CalendarDays size={16} /> Chọn ngày tham gia</label>
            <input id="activity-date" type="date" min={new Date().toISOString().slice(0, 10)} value={date} onChange={(event) => setDate(event.target.value)} required />
            <span className="tourist-activity-booking-label"><Users size={17} /> Số lượng người</span>
            <div className="tourist-activity-quantity">
              <button type="button" aria-label="Giảm số người" disabled={participants <= 1} onClick={() => setParticipants((current) => Math.max(1, current - 1))}>−</button>
              <output aria-live="polite">{participants}</output>
              <button type="button" aria-label="Tăng số người" disabled={participants >= maxParticipants} onClick={() => setParticipants((current) => Math.min(maxParticipants, current + 1))}>+</button>
            </div>
            <button type="submit" className="tourist-activity-booking-submit"><CalendarDays size={16} /> Đăng ký ngay</button>
          </form>
          <div className="tourist-activity-booking-note"><Info size={16} /><span>Miễn phí hủy trước 24h<br />trước sự kiện</span></div>
          <div className="tourist-activity-booking-art" aria-hidden="true">⌂</div>
        </aside>
      </section>

      <section className="tourist-activity-detail-lower">
        <div className="tourist-activity-detail-tabs-panel">
          <div className="tourist-activity-detail-tabs" role="tablist" aria-label="Thông tin hoạt động">
            {[
              ["Giới thiệu", BookOpen],
              ["Hình ảnh & Video", Image],
              ["Lịch trình", CalendarDays],
              [`Đánh giá (${item.reviews || 0})`, Star],
            ].map(([label, Icon]) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === label}
                className={activeTab === label ? "active" : ""}
                key={label}
                onClick={() => setActiveTab(label)}
              >
                <Icon size={16} />{label}
              </button>
            ))}
          </div>
          <div className="tourist-activity-detail-tab-content" role="tabpanel">
            {activeTab === "Giới thiệu" && (
              <p>{item.description} Tham gia hoạt động, bạn sẽ được nghệ nhân hướng dẫn tận tình, tìm hiểu quy trình và tự tay tạo nên sản phẩm mang dấu ấn riêng.</p>
            )}
            {activeTab === "Hình ảnh & Video" && (
              <div className="tourist-activity-detail-tab-gallery">
                {gallery.map((image, index) => <button key={`${image}-tab-${index}`} type="button" onClick={() => { setActivePhoto(index); window.scrollTo({ top: 0, behavior: "smooth" }); }}><img src={image} alt={`${item.title} ${index + 1}`} /><span><Play size={14} fill="currentColor" /></span></button>)}
              </div>
            )}
            {activeTab === "Lịch trình" && (
              <div className="tourist-activity-schedule">
                <span><strong>00:00</strong><span>Đón khách tại {item.place}</span></span>
                <span><strong>00:15</strong><span>Gặp gỡ nghệ nhân, tìm hiểu câu chuyện làng nghề</span></span>
                <span><strong>{item.duration || "2 giờ"}</strong><span>Hoàn thành sản phẩm và kết thúc trải nghiệm</span></span>
              </div>
            )}
            {activeTab.startsWith("Đánh giá") && (
              <div className="tourist-activity-reviews-tab">
                <strong>{rating.toFixed(1)} / 5</strong>
                <span>{item.reviews || 0} du khách đã đánh giá hoạt động này.</span>
                <Link to="/tourist/reviews">Viết đánh giá <ArrowRight size={14} /></Link>
              </div>
            )}
          </div>
        </div>

        <aside className="tourist-activity-review-card">
          <h2><Star size={20} fill="currentColor" /> Đánh giá từ du khách</h2>
          <div className="tourist-activity-review-content">
            <div className="tourist-activity-review-avatar">M</div>
            <div>
              <strong>Nguyễn Thị Mai</strong>
              <span className="tourist-activity-review-stars"><span>★★★★★</span><small>02/11/2026</small></span>
              <p>Trải nghiệm rất thú vị, các nghệ nhân thân thiện và nhiệt tình. Tôi rất thích hoạt động này!</p>
            </div>
            <img src={gallery[Math.min(2, gallery.length - 1)]} alt="Sản phẩm từ trải nghiệm" />
          </div>
          <button type="button" className="tourist-activity-review-link" onClick={() => setActiveTab(`Đánh giá (${item.reviews || 0})`)}>Xem tất cả đánh giá <ArrowRight size={14} /></button>
        </aside>
      </section>
    </div>
  );
}
