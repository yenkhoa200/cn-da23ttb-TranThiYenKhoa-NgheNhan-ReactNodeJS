import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Heart,
  Image,
  Info,
  MapPin,
  MessageCircle,
  Play,
  Search,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/path.js";
import { ArtisanDetail, ArtisanListing } from "./TouristArtisanPages.jsx";

const viewTitles = {
  search: ["Tìm kiếm", "Khám phá nghệ nhân, làng nghề, sản phẩm và hoạt động."],
  artisans: ["Nghệ nhân", "Gặp gỡ những người đang gìn giữ tinh hoa nghề Việt."],
  crafts: ["Làng nghề & sản phẩm", "Khám phá nghề truyền thống và câu chuyện phía sau mỗi sản phẩm."],
  products: ["Sản phẩm thủ công", "Những sản phẩm mang theo kỹ thuật và bản sắc của làng nghề Việt."],
  stories: ["Câu chuyện văn hóa", "Những tri thức và giá trị được trao truyền qua nhiều thế hệ."],
  activities: ["Hoạt động trải nghiệm", "Tìm một trải nghiệm chân thực cùng nghệ nhân địa phương."],
  gallery: ["Thư viện hình ảnh & video", "Ngắm nhìn người thợ, sản phẩm và nhịp sống làng nghề."],
  favorites: ["Nội dung yêu thích", "Những nghệ nhân, câu chuyện và trải nghiệm bạn đã lưu."],
  reviews: ["Đánh giá & nhận xét", "Chia sẻ cảm nhận để cùng lan tỏa những trải nghiệm đáng nhớ."],
  profile: ["Thông tin cá nhân", "Quản lý thông tin và hoạt động của tài khoản du khách."],
};

const itemRoute = (item) => {
  if (item.name) return `/tourist/artisan/${item.id}`;
  if (item.id?.startsWith("craft-")) return `/tourist/craft/${item.id}`;
  if (item.id?.startsWith("product-")) return `/tourist/product/${item.id}`;
  if (item.id?.startsWith("story-")) return `/tourist/story/${item.id}`;
  if (item.id?.startsWith("activity-")) return `/tourist/activity/${item.id}`;
  return `/tourist/${item.type === "Video" ? "video" : "image"}/${encodeURIComponent(item.title)}`;
};

function PageHeading({ title, description, backTo = ROUTES.TOURIST }) {
  return (
    <div className="tourist-view-heading">
      <div>
        <div className="tourist-breadcrumb"><Link to={ROUTES.TOURIST}>Trang chủ</Link><span>›</span>{title}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <Link className="tourist-back-link" to={backTo}><ArrowLeft size={15} /> Trang trước</Link>
    </div>
  );
}

function ResultCard({ item, favoriteIds, onFavorite, variant = "default" }) {
  const isSaved = favoriteIds.includes(item.id);
  const title = item.name || item.title;
  const subtitle = item.craft || item.category || item.place;
  return (
    <article className={`tourist-result-card tourist-result-${variant}`}>
      <Link className="tourist-result-image" to={itemRoute(item)}>
        <img src={item.image} alt={title} loading="lazy" />
        {item.type === "Video" && <span className="tourist-result-play"><Play size={16} fill="currentColor" /></span>}
      </Link>
      <button className={`tourist-favorite tourist-result-heart ${isSaved ? "is-saved" : ""}`} type="button" aria-label={isSaved ? "Bỏ yêu thích" : "Lưu yêu thích"} onClick={() => onFavorite(item)}>
        <Heart size={16} fill={isSaved ? "currentColor" : "none"} />
      </button>
      <div className="tourist-result-content">
        {item.rating && <div className="tourist-rating"><Star size={13} fill="currentColor" /> {item.rating} <span>({item.reviews} đánh giá)</span></div>}
        {item.category && <span className="tourist-result-category">{item.category}</span>}
        <Link className="tourist-result-title" to={itemRoute(item)}>{title}</Link>
        {subtitle && <span className="tourist-result-subtitle">{subtitle}</span>}
        {item.place && <span className="tourist-location"><MapPin size={13} /> {item.place}</span>}
        <Link className="tourist-text-button" to={itemRoute(item)}>Khám phá <ArrowRight size={14} /></Link>
      </div>
    </article>
  );
}

function ResultsGrid({ items, favoriteIds, onFavorite, emptyText, variant }) {
  if (!items.length) return <p className="tourist-empty">{emptyText}</p>;
  return (
    <div className={`tourist-results-grid tourist-results-${variant || "default"}-grid`}>
      {items.map((item) => <ResultCard key={item.id || item.title} item={item} favoriteIds={favoriteIds} onFavorite={onFavorite} variant={variant} />)}
    </div>
  );
}

function ListingView({ view, data, favoriteIds, onFavorite, query, onQuery, searchType, onSearchType, mediaType, onMediaType, onOpenMedia }) {
  const [title, description] = viewTitles[view];
  const datasets = {
    artisans: data.artisans,
    crafts: data.crafts,
    products: data.products,
    stories: data.stories,
    activities: data.activities,
    favorites: data.savedItems,
  };
  const labels = {
    artisans: "Nghệ nhân",
    crafts: "Làng nghề",
    products: "Sản phẩm",
    stories: "Văn hóa",
    activities: "Hoạt động",
    favorites: "Đã lưu",
  };
  const resultSets = view === "search"
    ? [
        ["Tất cả", data.allItems],
        ["Nghệ nhân", data.artisans],
        ["Làng nghề", data.crafts],
        ["Câu chuyện", data.stories],
        ["Hoạt động", data.activities],
      ]
    : [[labels[view], datasets[view] || []]];
  const selectedItems = view === "favorites"
    ? data.savedItems
    : view === "search"
      ? resultSets.find(([label]) => label === searchType)?.[1] || data.allItems
      : datasets[view] || [];
  const visibleItems = selectedItems.filter((item) =>
    `${item.name || item.title} ${item.craft || ""} ${item.category || ""} ${item.place || ""}`
      .toLocaleLowerCase("vi")
      .includes(query.trim().toLocaleLowerCase("vi")),
  );
  const filteredMedia = data.mediaItems.filter((item) => mediaType === "Tất cả" || item.type === mediaType);

  return (
    <div className="tourist-view">
      <PageHeading title={title} description={description} />
      {view === "search" && (
        <div className="tourist-search-view-box">
          <label className="tourist-search-box">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Nhập từ khóa bạn muốn khám phá..." aria-label="Nhập từ khóa tìm kiếm" />
            {query && <button type="button" onClick={() => onQuery("")} aria-label="Xóa tìm kiếm">×</button>}
          </label>
        </div>
      )}
      {view === "gallery" ? (
        <>
          <div className="tourist-view-filters">
            {["Tất cả", "Hình ảnh", "Video"].map((filter) => <button key={filter} className={mediaType === filter ? "active" : ""} onClick={() => onMediaType(filter)} type="button">{filter}</button>)}
            <span>{filteredMedia.length} nội dung</span>
          </div>
          <div className="tourist-gallery-grid tourist-gallery-view-grid">
            {filteredMedia.map((media) => (
              <button className="tourist-gallery-item" key={media.title} onClick={() => onOpenMedia(media)}>
                <img src={media.image} alt={media.title} loading="lazy" />
                {media.type === "Video" && <span className="tourist-play"><Play size={18} fill="currentColor" /></span>}
                <span className="tourist-gallery-label">{media.title}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          {view === "search" && (
            <div className="tourist-view-filters">
              {resultSets.map(([label]) => <button key={label} type="button" className={searchType === label ? "active" : ""} onClick={() => onSearchType(label)}>{label}</button>)}
              <span>{visibleItems.length} kết quả</span>
            </div>
          )}
          {view === "favorites" && (
            <div className="tourist-view-filters">
              {["Tất cả", "Nghệ nhân", "Làng nghề", "Hoạt động"].map((filter) => <button key={filter} type="button" className={searchType === filter ? "active" : ""} onClick={() => onSearchType(filter)}>{filter}</button>)}
              <span>{visibleItems.length} nội dung</span>
            </div>
          )}
          <ResultsGrid
            items={view === "favorites" && searchType !== "Tất cả" ? visibleItems.filter((item) => {
              if (searchType === "Nghệ nhân") return Boolean(item.name);
              if (searchType === "Làng nghề") return item.id?.startsWith("craft-");
              return item.id?.startsWith("activity-");
            }) : visibleItems}
            favoriteIds={favoriteIds}
            onFavorite={onFavorite}
            variant={view === "favorites" ? "favorites" : "listing"}
            emptyText={view === "search" ? "Không tìm thấy nội dung phù hợp. Hãy thử từ khóa khác." : "Chưa có nội dung ở danh mục này."}
          />
        </>
      )}
    </div>
  );
}

function ActivityListing({ activities, favoriteIds, onFavorite, query, onQuery }) {
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
                      <Link className="tourist-activity-list-image" to={itemRoute(activity)}>
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
                        <Link className="tourist-activity-list-title" to={itemRoute(activity)}>{activity.title}</Link>
                        <span className="tourist-activity-list-meta"><MapPin size={14} />{activity.place}</span>
                        <span className="tourist-activity-list-meta"><Clock3 size={14} />{activity.duration}</span>
                        <div className="tourist-activity-list-bottom">
                          <span className="tourist-activity-list-rating"><Star size={15} fill="currentColor" />{activity.rating}<small>({activity.reviews} đánh giá)</small></span>
                          <Link to={itemRoute(activity)}>Xem chi tiết <ArrowRight size={14} /></Link>
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
            <p>Cùng Hồn Việt khám phá những hoạt động ý nghĩa, gìn giữ và lan tỏa giá trị truyền thống.</p>
            <Link to="/tourist/stories">Khám phá ngay <ArrowRight size={15} /></Link>
            <span className="tourist-activities-promo-art" aria-hidden="true">⌂</span>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ActivityDetail({ item, favoriteIds, onFavorite, onNotice, mediaItems }) {
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

function DetailView({ item, products, activities, mediaItems, favoriteIds, onFavorite, onReview }) {
  const [selectedTab, setSelectedTab] = useState("");
  if (!item) {
    return <div className="tourist-view"><PageHeading title="Không tìm thấy nội dung" description="Nội dung có thể đã bị gỡ hoặc đường dẫn không chính xác." /><Link className="tourist-primary-button" to={ROUTES.TOURIST}>Về trang chủ</Link></div>;
  }
  if (item.id?.startsWith("activity-")) {
    return <ActivityDetail item={item} favoriteIds={favoriteIds} onFavorite={onFavorite} onNotice={onReview} mediaItems={mediaItems} />;
  }
  const artisan = Boolean(item.name);
  const activity = item.id?.startsWith("activity-");
  const craft = item.id?.startsWith("craft-");
  const product = item.id?.startsWith("product-");
  const title = item.name || item.title;
  const isSaved = favoriteIds.includes(item.id);
  const detailTabs = craft
    ? ["Giới thiệu", "Quy trình", "Sản phẩm tiêu biểu"]
    : artisan
      ? ["Câu chuyện", "Sản phẩm", "Hoạt động", "Video"]
      : ["Giới thiệu", "Câu chuyện", "Hình ảnh & video"];
  const activeTab = detailTabs.includes(selectedTab) ? selectedTab : detailTabs[0];
  const tabDescription = activeTab === "Quy trình"
    ? "Từ khâu chọn nguyên liệu, tạo hình, hoàn thiện đến công đoạn nung, mỗi bước đều đòi hỏi kinh nghiệm và sự tỉ mỉ của người thợ."
    : activeTab === "Câu chuyện"
      ? item.description
      : product
        ? item.description
        : "Tìm hiểu thêm về những kỹ thuật thủ công, câu chuyện của người thợ và giá trị văn hóa được gìn giữ tại làng nghề.";
  const relatedProducts = products.filter((productItem) =>
    craft
      ? productItem.craftId === item.id
      : artisan && productItem.category.toLocaleLowerCase("vi").includes(item.craft.replace("Nghệ nhân ", "").toLocaleLowerCase("vi").split(" ")[0]),
  );
  const relatedActivities = activities.filter((activityItem) =>
    `${activityItem.title} ${activityItem.place}`.toLocaleLowerCase("vi")
      .includes(item.craft?.replace("Nghệ nhân ", "").toLocaleLowerCase("vi").split(" ")[0] || item.category?.toLocaleLowerCase("vi").split(" ")[0] || ""),
  );
  const relatedMedia = mediaItems.filter((mediaItem) =>
    activeTab === "Video" ? mediaItem.type === "Video" : true,
  );

  return (
    <div className="tourist-view">
      <div className="tourist-breadcrumb"><Link to={ROUTES.TOURIST}>Trang chủ</Link><span>›</span>{artisan ? "Nghệ nhân" : craft ? "Làng nghề" : activity ? "Hoạt động trải nghiệm" : "Văn hóa"}<span>›</span>{title}</div>
      <section className={`tourist-detail-layout ${artisan ? "tourist-artisan-detail" : ""}`}>
        <div className="tourist-detail-visual">
          <img src={item.image} alt={title} />
          {artisan && <div className="tourist-detail-thumbnails"><img src={item.image} alt="Ảnh nghệ nhân" /><img src={craftDataImage(item)} alt="Không gian làng nghề" /><img src={item.image} alt="Tác phẩm thủ công" /></div>}
        </div>
        <div className="tourist-detail-copy">
          <span className="tourist-eyebrow">{item.craft || item.category || (activity ? "TRẢI NGHIỆM VĂN HÓA" : "CÂU CHUYỆN VĂN HÓA")}</span>
          <h1>{title}{artisan && <span className="tourist-verified-mark"><Check size={12} /></span>}</h1>
          {item.rating && <div className="tourist-rating"><Star size={14} fill="currentColor" /> {item.rating} <span>({item.reviews} đánh giá)</span></div>}
          {item.place && <p className="tourist-detail-meta"><MapPin size={15} /> {item.place}</p>}
          {item.duration && <p className="tourist-detail-meta"><Clock3 size={15} /> Thời lượng: {item.duration}</p>}
          <p>{item.description}</p>
          <div className="tourist-detail-actions">
            <button type="button" className="tourist-primary-button" onClick={() => onFavorite(item)}><Heart size={15} fill={isSaved ? "currentColor" : "none"} /> {isSaved ? "Đang theo dõi" : artisan ? "Theo dõi nghệ nhân" : "Lưu yêu thích"}</button>
            {activity && <button type="button" className="tourist-secondary-button" onClick={() => onReview("Đăng ký trải nghiệm thành công! Chúng tôi sẽ liên hệ xác nhận.")}><CalendarDays size={15} /> Đăng ký trải nghiệm</button>}
          </div>
          <div className="tourist-detail-tabs">
            {detailTabs.map((tab) => <button type="button" key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setSelectedTab(tab)}>{tab}</button>)}
          </div>
          <div className="tourist-detail-tab-content">
            {activeTab === "Sản phẩm tiêu biểu" || activeTab === "Sản phẩm" ? (
              <div className="tourist-related-products">
                {relatedProducts.map((relatedProduct) => <Link to={itemRoute(relatedProduct)} key={relatedProduct.id}><img src={relatedProduct.image} alt={relatedProduct.title} /><span>{relatedProduct.category}</span><strong>{relatedProduct.title}</strong></Link>)}
                {!relatedProducts.length && <p>Thông tin sản phẩm đang được cập nhật.</p>}
              </div>
            ) : activeTab === "Hoạt động" ? (
              <div className="tourist-related-activities">
                {(relatedActivities.length ? relatedActivities : activities).slice(0, 2).map((activityItem) => <Link to={itemRoute(activityItem)} key={activityItem.id}><img src={activityItem.image} alt="" /><span><strong>{activityItem.title}</strong><small><MapPin size={12} /> {activityItem.place}</small></span><ArrowRight size={14} /></Link>)}
              </div>
            ) : activeTab === "Video" || activeTab === "Hình ảnh & video" ? (
              <div className="tourist-related-media">
                {relatedMedia.slice(0, 3).map((mediaItem) => <Link to={itemRoute(mediaItem)} key={mediaItem.title}><img src={mediaItem.image} alt={mediaItem.title} />{mediaItem.type === "Video" && <span><Play size={14} fill="currentColor" /></span>}</Link>)}
              </div>
            ) : (
              <>
                <p>{tabDescription}</p>
                <div className="tourist-detail-facts">
                  <span><Check size={14} /> Thông tin được cộng đồng xác thực</span>
                  <span><MessageCircle size={14} /> Chia sẻ và đánh giá trải nghiệm</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      <section className="tourist-detail-review">
        <div><span className="tourist-eyebrow">CẢM NHẬN CỦA DU KHÁCH</span><h2>Đánh giá & nhận xét</h2><p>Chia sẻ trải nghiệm của bạn với cộng đồng.</p></div>
        <Link className="tourist-primary-button" to="/tourist/reviews">Viết đánh giá <ArrowRight size={14} /></Link>
      </section>
    </div>
  );
}

function craftDataImage(item) {
  return item.id === "artisan-lan"
    ? "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=85"
    : item.image;
}

function ProfileView({ profile, profileDraft, onDraftChange, onSave, onNavigate }) {
  return (
    <div className="tourist-view">
      <PageHeading title="Thông tin cá nhân" description="Quản lý hồ sơ và các hoạt động khám phá của bạn." />
      <div className="tourist-profile-layout">
        <aside className="tourist-profile-sidebar">
          <div className="tourist-profile-avatar">YK</div>
          <strong>{profile.name}</strong>
          <span>Du khách · Thành viên từ 2025</span>
          <button type="button" className="active"><Check size={14} /> Thông tin cá nhân</button>
          <button type="button" onClick={() => onNavigate("favorites")}><Heart size={14} /> Yêu thích</button>
          <button type="button" onClick={() => onNavigate("reviews")}><Star size={14} /> Đánh giá của tôi</button>
        </aside>
        <form className="tourist-profile-edit" onSubmit={onSave}>
          <div className="tourist-panel-heading"><div><span className="tourist-eyebrow">HỒ SƠ CỦA BẠN</span><h2>Thông tin cá nhân</h2></div></div>
          <label>Họ và tên<input value={profileDraft.name} onChange={(event) => onDraftChange({ ...profileDraft, name: event.target.value })} required /></label>
          <label>Email<input type="email" value={profileDraft.email} onChange={(event) => onDraftChange({ ...profileDraft, email: event.target.value })} required /></label>
          <label>Số điện thoại<input value={profileDraft.phone} onChange={(event) => onDraftChange({ ...profileDraft, phone: event.target.value })} /></label>
          <button className="tourist-primary-button" type="submit"><Check size={15} /> Lưu thay đổi</button>
        </form>
      </div>
    </div>
  );
}

function ReviewsView({ reviews, rating, onRating, reviewText, onReviewText, onSubmit }) {
  return (
    <div className="tourist-view">
      <PageHeading title="Đánh giá & nhận xét" description="Chia sẻ cảm nhận về nội dung hoặc hoạt động trải nghiệm." />
      <div className="tourist-review-page-layout">
        <section className="tourist-review-write">
          <span className="tourist-eyebrow">Ý KIẾN CỦA BẠN</span>
          <h2>Chuyến đi của bạn thế nào?</h2>
          <p>Đánh giá giúp những du khách khác chọn được trải nghiệm phù hợp.</p>
          <form onSubmit={onSubmit}>
            <div className="tourist-star-picker" role="group" aria-label="Chọn số sao">
              {[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} onClick={() => onRating(value)} aria-label={`${value} sao`} aria-pressed={rating >= value}><Star size={23} fill={rating >= value ? "currentColor" : "none"} /></button>)}
            </div>
            <label htmlFor="review-message">Nhận xét của bạn</label>
            <textarea id="review-message" value={reviewText} onChange={(event) => onReviewText(event.target.value)} placeholder="Chia sẻ điều bạn yêu thích về nghệ nhân, làng nghề hoặc hoạt động..." required />
            <button className="tourist-primary-button" type="submit">Gửi đánh giá <ArrowRight size={15} /></button>
          </form>
        </section>
        <section className="tourist-review-summary">
          <span className="tourist-eyebrow">CỘNG ĐỒNG DU KHÁCH</span>
          <h2>Đánh giá trung bình</h2>
          <div className="tourist-review-score"><strong>4.8</strong><span><Star size={15} fill="currentColor" /> 1.248 đánh giá</span></div>
          {[["5 sao", "72%"], ["4 sao", "18%"], ["3 sao", "6%"], ["2 sao", "2%"], ["1 sao", "2%"]].map(([label, amount]) => <div className="tourist-rating-bar" key={label}><span>{label}</span><div><i style={{ width: amount }} /></div><small>{amount}</small></div>)}
          <div className="tourist-review-feed">
            {reviews.length ? reviews.map((review) => <article key={review.id}><strong>{review.name}</strong><span><Star size={12} fill="currentColor" /> {review.rating}/5</span><p>{review.content}</p></article>) : <p>Chưa có nhận xét mới. Hãy là người đầu tiên chia sẻ cảm nhận.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function TouristViews({ view, data, favoriteIds, onFavorite, query, onQuery, searchType, onSearchType, mediaType, onMediaType, onOpenMedia, reviews, rating, onRating, reviewText, onReviewText, onSubmitReview, profile, profileDraft, onDraftChange, onSaveProfile, onNavigate, onNotice }) {
  if (view === "artisans") {
    return <ArtisanListing artisans={data.artisans} crafts={data.crafts} products={data.products} stories={data.stories} favoriteIds={favoriteIds} onFavorite={onFavorite} query={query} onQuery={onQuery} />;
  }
  if (view === "artisan") {
    const artisan = data.artisans.find((item) => item.id === data.detailId);
    if (artisan) return <ArtisanDetail artisan={artisan} products={data.products} activities={data.activities} favoriteIds={favoriteIds} onFavorite={onFavorite} onNotice={onNotice} />;
  }
  if (view === "activities") {
    return <ActivityListing activities={data.activities} favoriteIds={favoriteIds} onFavorite={onFavorite} query={query} onQuery={onQuery} />;
  }
  if (view === "profile") {
    return <ProfileView profile={profile} profileDraft={profileDraft} onDraftChange={onDraftChange} onSave={onSaveProfile} onNavigate={onNavigate} />;
  }
  if (view === "reviews") {
    return <ReviewsView reviews={reviews} rating={rating} onRating={onRating} reviewText={reviewText} onReviewText={onReviewText} onSubmit={onSubmitReview} />;
  }
  if (["artisan", "craft", "product", "story", "activity", "image", "video"].includes(view)) {
    const item = [...data.allItems, ...data.mediaItems].find((candidate) =>
      candidate.id === data.detailId || candidate.title === decodeURIComponent(data.detailId || ""),
    );
    return <DetailView item={item} products={data.products} activities={data.activities} mediaItems={data.mediaItems} favoriteIds={favoriteIds} onFavorite={onFavorite} onReview={onNotice} />;
  }
  return <ListingView view={view} data={data} favoriteIds={favoriteIds} onFavorite={onFavorite} query={query} onQuery={onQuery} searchType={searchType} onSearchType={onSearchType} mediaType={mediaType} onMediaType={onMediaType} onOpenMedia={onOpenMedia} />;
}
