import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  Heart,
  MapPin,
  Search,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

const activityRoute = (activity) => `/tourist/activity/${activity.id}`;

export function ActivityListing({ activities, favoriteIds, onFavorite, query, onQuery }) {
  const [category, setCategory] = useState("Tất cả loại hình");
  const [place, setPlace] = useState("Tất cả địa điểm");
  const [duration, setDuration] = useState("Thời gian");
  const categories = [...new Set(activities.map((activity) => activity.category))];
  const places = [...new Set(activities.map((activity) => activity.place.split(",")[0]))];
  const filteredActivities = activities.filter((activity) => {
    const matchesQuery = `${activity.title} ${activity.category} ${activity.place}`
      .toLocaleLowerCase("vi")
      .includes(query.trim().toLocaleLowerCase("vi"));
    const matchesCategory = category === "Tất cả loại hình" || activity.category === category;
    const matchesPlace = place === "Tất cả địa điểm" || activity.place.startsWith(place);
    const matchesDuration = duration === "Thời gian"
      || (duration === "Dưới 2 giờ" && activity.durationHours < 2)
      || (duration === "Từ 2 giờ" && activity.durationHours >= 2);
    return matchesQuery && matchesCategory && matchesPlace && matchesDuration;
  });

  return (
    <div className="tourist-activities-page">
      <section className="tourist-activities-hero">
        <div className="tourist-activities-hero-inner">
          <div className="tourist-activities-hero-copy">
            <span className="tourist-activities-hero-icon" aria-hidden="true">✦</span>
            <div>
              <span className="tourist-activities-eyebrow">CHẠM VÀO DI SẢN</span>
              <h1>Hoạt động trải nghiệm</h1>
              <p>Khám phá, trải nghiệm và cảm nhận tinh hoa văn hóa Việt qua<br className="tourist-activities-desktop-break" /> những hoạt động độc đáo cùng nghệ nhân.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="tourist-activities-main">
        <div className="tourist-activities-toolbar">
          <form className="tourist-activities-search" onSubmit={(event) => event.preventDefault()}>
            <Search size={18} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => onQuery(event.target.value)}
              placeholder="Tìm kiếm hoạt động trải nghiệm..."
              aria-label="Tìm kiếm hoạt động trải nghiệm"
            />
            {query && <button type="button" onClick={() => onQuery("")} aria-label="Xóa từ khóa">×</button>}
            <button type="submit">Tìm kiếm</button>
          </form>

          <div className="tourist-activities-selects">
            <label>
              <span className="tourist-activities-select-icon">✿</span>
              <select aria-label="Lọc theo loại hình" value={category} onChange={(event) => setCategory(event.target.value)}>
                <option>Tất cả loại hình</option>
                {categories.map((option) => <option key={option}>{option}</option>)}
              </select>
              <ChevronDown size={14} aria-hidden="true" />
            </label>
            <label>
              <MapPin size={16} aria-hidden="true" />
              <select aria-label="Lọc theo địa điểm" value={place} onChange={(event) => setPlace(event.target.value)}>
                <option>Tất cả địa điểm</option>
                {places.map((option) => <option key={option}>{option}</option>)}
              </select>
              <ChevronDown size={14} aria-hidden="true" />
            </label>
            <label>
              <CalendarDays size={16} aria-hidden="true" />
              <select aria-label="Lọc theo thời lượng" value={duration} onChange={(event) => setDuration(event.target.value)}>
                <option>Thời gian</option>
                <option>Dưới 2 giờ</option>
                <option>Từ 2 giờ</option>
              </select>
              <ChevronDown size={14} aria-hidden="true" />
            </label>
          </div>
        </div>

        <div className="tourist-activities-layout">
          <section className="tourist-activities-results" aria-label="Danh sách hoạt động trải nghiệm">
            <div className="tourist-activities-count" aria-live="polite">
              <strong>{filteredActivities.length}</strong> hoạt động dành cho bạn
            </div>
            {filteredActivities.length ? (
              <div className="tourist-activities-grid">
                {filteredActivities.map((activity) => {
                  const isSaved = favoriteIds.includes(activity.id);
                  return (
                    <article className="tourist-activity-list-card" key={activity.id}>
                      <Link className="tourist-activity-list-image" to={activityRoute(activity)}>
                        <img src={activity.image} alt={activity.title} loading="lazy" />
                        <span className="tourist-activity-list-category"><span aria-hidden="true">✿</span>{activity.category}</span>
                      </Link>
                      <button
                        type="button"
                        className={`tourist-activity-list-favorite ${isSaved ? "is-saved" : ""}`}
                        aria-label={isSaved ? "Bỏ yêu thích" : "Lưu yêu thích"}
                        onClick={() => onFavorite(activity)}
                      >
                        <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
                      </button>
                      <div className="tourist-activity-list-body">
                        <Link className="tourist-activity-list-title" to={activityRoute(activity)}>{activity.title}</Link>
                        <span className="tourist-activity-list-meta"><MapPin size={14} />{activity.place}</span>
                        <span className="tourist-activity-list-meta"><Clock3 size={14} />{activity.duration}</span>
                        <div className="tourist-activity-list-bottom">
                          <span className="tourist-activity-list-rating"><Star size={15} fill="currentColor" />{activity.rating}<small>({activity.reviews} đánh giá)</small></span>
                          <Link to={activityRoute(activity)}>Xem chi tiết <ArrowRight size={14} /></Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="tourist-empty tourist-activities-empty">Không tìm thấy hoạt động phù hợp. Hãy thử thay đổi bộ lọc.</p>
            )}
            {filteredActivities.length > 0 && (
              <nav className="tourist-activities-pagination" aria-label="Phân trang hoạt động">
                <button type="button" aria-label="Trang trước" disabled><ArrowLeft size={15} /></button>
                <button type="button" className="active" aria-current="page">1</button>
                <span>Đang hiển thị {filteredActivities.length} hoạt động</span>
                <button type="button" aria-label="Trang sau" disabled><ArrowRight size={15} /></button>
              </nav>
            )}
          </section>

          <aside className="tourist-activities-promo">
            <span className="tourist-activities-promo-icon" aria-hidden="true">⌁</span>
            <span className="tourist-activities-eyebrow">HÀNH TRÌNH DI SẢN</span>
            <h2>Trải nghiệm<br />văn hóa Việt</h2>
            <p>Cùng Tinh Hoa Việt khám phá những hoạt động ý nghĩa, gìn giữ và lan tỏa giá trị truyền thống.</p>
            <Link to="/tourist/stories">Khám phá ngay <ArrowRight size={15} /></Link>
            <span className="tourist-activities-promo-art" aria-hidden="true">⌂</span>
          </aside>
        </div>
      </div>
    </div>
  );
}
