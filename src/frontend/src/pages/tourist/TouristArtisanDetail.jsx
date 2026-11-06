import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  ChevronDown,
  Clock3,
  Copy,
  Heart,
  Image,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Play,
  Quote,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/path.js";

function BookingCard({ artisan, saved, onFavorite, onNotice }) {
  const [people, setPeople] = useState(1);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
  });
  const submit = (event) => {
    event.preventDefault();
    onNotice(`Đã gửi yêu cầu gặp ${artisan.name} vào ngày ${date} cho ${people} người.`);
    setBookingOpen(false);
  };
  const shareProfile = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: artisan.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        onNotice("Đã sao chép liên kết hồ sơ nghệ nhân.");
      }
    } catch (error) {
      if (error.name !== "AbortError") onNotice("Không thể chia sẻ liên kết. Vui lòng thử lại.");
    }
  };
  return (
    <aside className="tourist-artisan-contact">
      <button type="button" className={`tourist-artisan-save-button${saved ? " is-saved" : ""}`} onClick={() => onFavorite(artisan)}>
        <Heart size={17} fill={saved ? "currentColor" : "none"} />
        {saved ? "Đã lưu vào yêu thích" : "Lưu vào yêu thích"}
      </button>
      <button type="button" className="tourist-artisan-contact-submit" onClick={() => setBookingOpen((open) => !open)}>
        <CalendarDays size={16} /> Đặt lịch trải nghiệm
      </button>
      {bookingOpen && (
        <form className="tourist-artisan-booking-form" onSubmit={submit}>
          <label htmlFor="artisan-booking-date">Ngày bạn muốn ghé thăm</label>
          <input id="artisan-booking-date" type="date" min={new Date().toISOString().slice(0, 10)} value={date} onChange={(event) => setDate(event.target.value)} required />
          <strong><Users size={15} /> Số lượng người</strong>
          <div className="tourist-artisan-quantity">
            <button type="button" aria-label="Giảm số người" disabled={people <= 1} onClick={() => setPeople((count) => Math.max(1, count - 1))}>−</button>
            <output>{people}</output>
            <button type="button" aria-label="Tăng số người" onClick={() => setPeople((count) => count + 1)}>+</button>
          </div>
          <button type="submit" className="tourist-artisan-contact-submit">Gửi yêu cầu đặt lịch</button>
        </form>
      )}
      <Link className="tourist-artisan-review-button" to="/tourist/reviews"><MessageCircle size={16} /> Gửi nhận xét</Link>
      <div className="tourist-artisan-share">
        <strong>Chia sẻ</strong>
        <button type="button" aria-label="Sao chép liên kết hồ sơ" onClick={shareProfile}><Link2 size={16} /></button>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" aria-label="Chia sẻ lên Facebook"><span className="tourist-artisan-facebook-mark">f</span></a>
        <a href={`mailto:?subject=${encodeURIComponent(`Nghệ nhân ${artisan.name}`)}&body=${encodeURIComponent(window.location.href)}`} aria-label="Chia sẻ qua email"><Mail size={16} /></a>
        <button type="button" aria-label="Sao chép liên kết" onClick={async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
            onNotice("Đã sao chép liên kết hồ sơ nghệ nhân.");
          } catch {
            onNotice("Không thể sao chép liên kết. Vui lòng thử lại.");
          }
        }}><Copy size={15} /></button>
      </div>
    </aside>
  );
}

function ArtisanTabs({ artisan, products, activities, gallery }) {
  const [tab, setTab] = useState("Giới thiệu");
  const tabs = [["Giới thiệu", Users], ["Sản phẩm", Package], ["Câu chuyện & Giá trị văn hóa", BookOpen], ["Hoạt động trải nghiệm", CalendarDays], ["Hình ảnh & Video", Image]];
  const matchedProducts = products.filter((product) => `${product.title} ${product.category}`.toLocaleLowerCase("vi").includes((artisan.product || artisan.craft).toLocaleLowerCase("vi").split(" ")[0]));
  const relatedActivities = activities.slice(0, 3);
  return (
    <section className="tourist-artisan-tabs-card">
      <div className="tourist-artisan-tabs" role="tablist" aria-label="Thông tin nghệ nhân">
        {tabs.map(([label, Icon]) => <button type="button" role="tab" aria-selected={tab === label} className={tab === label ? "active" : ""} key={label} onClick={() => setTab(label)}><Icon size={15} />{label}</button>)}
      </div>
      <div className="tourist-artisan-tab-content" role="tabpanel">
        {tab === "Giới thiệu" && (
          <div className="tourist-artisan-introduction">
            <div>
              <h2><span aria-hidden="true">❧</span> Hành trình gìn giữ nghề</h2>
              <p>{artisan.description} Sinh ra và lớn lên tại {artisan.place}, {artisan.name} đã gắn bó với nghề {artisan.craft.toLocaleLowerCase("vi")} từ khi còn nhỏ. Qua nhiều năm tháng, nghệ nhân luôn tâm huyết với việc bảo tồn và truyền dạy nghề truyền thống.</p>
              <blockquote><Quote size={22} /><span>“Tôi mong muốn giữ gìn nghề truyền thống, để thế hệ sau vẫn còn được biết và tự hào về văn hóa Việt.”<small>— {artisan.name}</small></span></blockquote>
            </div>
            <div className="tourist-artisan-intro-gallery">
              <img src={gallery[1] || gallery[0]} alt={`Nghệ nhân ${artisan.name} đang làm nghề`} />
              <div>{gallery.slice(2, 4).map((image, index) => <img key={`${image}-${index}`} src={image} alt={`Khoảnh khắc tại xưởng của ${artisan.name}`} />)}</div>
            </div>
          </div>
        )}
        {tab === "Sản phẩm" && <div className="tourist-artisan-products">{(matchedProducts.length ? matchedProducts : products.slice(0, 3)).map((product) => <Link to={`/tourist/product/${product.id}`} key={product.id}><img src={product.image} alt={product.title} /><span>{product.category}</span><strong>{product.title}</strong></Link>)}</div>}
        {tab === "Câu chuyện & Giá trị văn hóa" && <div className="tourist-artisan-story"><BookOpen size={22} /><div><h2>Câu chuyện nghề {artisan.craft.toLocaleLowerCase("vi")}</h2><p>{artisan.description}</p><p>Từ tình yêu với nghề và sự kiên trì qua năm tháng, {artisan.name} mong muốn chia sẻ tri thức, kỹ thuật và cảm hứng gìn giữ nghề truyền thống cho thế hệ tiếp nối.</p></div></div>}
        {tab === "Hoạt động trải nghiệm" && <div className="tourist-artisan-related-activities">{relatedActivities.map((activity) => <Link to={`/tourist/activity/${activity.id}`} key={activity.id}><img src={activity.image} alt="" /><span><strong>{activity.title}</strong><small><MapPin size={13} /> {activity.place}</small><small><CalendarDays size={13} /> {activity.schedule}</small></span><ArrowRight size={15} /></Link>)}</div>}
        {tab === "Hình ảnh & Video" && <div className="tourist-artisan-media-gallery">{gallery.map((image, index) => <div key={`${image}-${index}`}><img src={image} alt={`Hình ảnh ${index + 1} về nghệ nhân ${artisan.name}`} />{index === 0 && <span><Play size={16} fill="currentColor" /></span>}</div>)}</div>}
      </div>
    </section>
  );
}

function FeaturedProducts({ artisan, products }) {
  const keyword = (artisan.product || artisan.craft).toLocaleLowerCase("vi").split(" ")[0];
  const matchingProducts = products.filter((product) =>
    `${product.title} ${product.category}`.toLocaleLowerCase("vi").includes(keyword),
  );
  const featuredProducts = (matchingProducts.length ? matchingProducts : products).slice(0, 5);

  return (
    <section className="tourist-artisan-featured-products">
      <div className="tourist-artisan-featured-heading">
        <h2><Package size={19} /> Sản phẩm tiêu biểu</h2>
        <Link to="/tourist/products">Xem tất cả <ArrowRight size={14} /></Link>
      </div>
      <div className="tourist-artisan-featured-grid">
        {featuredProducts.map((product) => (
          <Link to={`/tourist/product/${product.id}`} key={product.id}>
            <img src={product.image} alt={product.title} loading="lazy" />
            <span>{product.category}</span>
            <strong>{product.title}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ReviewAndMap({ artisan, activities }) {
  return (
    <div className="tourist-artisan-detail-aside">
      <section className="tourist-artisan-location-card">
        <div className="tourist-artisan-aside-title"><h2><MapPin size={18} fill="currentColor" /> Vị trí của nghệ nhân</h2><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(artisan.place)}`} target="_blank" rel="noreferrer">Xem bản đồ <ArrowRight size={12} /></a></div>
        <a className="tourist-artisan-map-card" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(artisan.place)}`} target="_blank" rel="noreferrer" aria-label={`Xem vị trí ${artisan.place} trên bản đồ`}>
          <span><MapPin size={27} fill="currentColor" /></span>
          <b>{artisan.place.split(",")[0]}</b>
        </a>
        <p><MapPin size={14} /> {artisan.place}</p>
        <strong>Thông tin liên hệ</strong>
        <a href={`tel:${(artisan.phone || "0900000000").replaceAll(" ", "")}`}><Phone size={14} /> {artisan.phone || "0900 000 000"}</a>
        <a href="mailto:hello@tinhhoaviet.vn"><Mail size={14} /> hello@tinhhoaviet.vn</a>
      </section>
      <section className="tourist-artisan-reviews-card">
        <h2><Star size={19} fill="currentColor" /> Đánh giá từ du khách</h2>
        <div className="tourist-artisan-review-average"><strong>{artisan.rating || "4.8"}/5</strong><span>({artisan.reviews} đánh giá)</span></div>
        {[["5 sao", "72%"], ["4 sao", "18%"], ["3 sao", "6%"], ["2 sao", "2%"], ["1 sao", "2%"]].map(([label, value]) => <div className="tourist-artisan-rating-bar" key={label}><span>{label}</span><i><b style={{ width: value }} /></i><small>{value}</small></div>)}
        {[["L", "Lê Văn Tùng", "Trải nghiệm rất thú vị, nghệ nhân thân thiện và nhiệt tình."], ["N", "Nguyễn Thị Hạnh", "Được tìm hiểu câu chuyện nghề rất đáng nhớ."]].map(([initial, name, review]) => <article key={name}><span className="tourist-artisan-review-avatar">{initial}</span><div><b>{name}</b><small>★★★★★</small><p>{review}</p></div></article>)}
        <Link to="/tourist/reviews">Xem tất cả nhận xét <ArrowRight size={13} /></Link>
      </section>
      {activities[0] && <Link className="tourist-artisan-activity-card" to={`/tourist/activity/${activities[0].id}`}><small>HOẠT ĐỘNG TRẢI NGHIỆM</small><b>{activities[0].title}</b><span>Khám phá cùng nghệ nhân <ArrowRight size={13} /></span><img src={activities[0].image} alt="" /></Link>}
    </div>
  );
}

export function ArtisanDetail({ artisan, products, activities, favoriteIds, onFavorite, onNotice }) {
  const [photo, setPhoto] = useState(2);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const saved = favoriteIds.includes(artisan.id);
  const gallery = artisan.gallery?.length ? artisan.gallery : [artisan.image, artisan.image, artisan.image, artisan.image];
  return (
    <div className="tourist-view tourist-artisan-detail-page">
      <div className="tourist-breadcrumb"><Link to={ROUTES.TOURIST}>Trang chủ</Link><span>›</span><Link to="/tourist/artisans">Nghệ nhân</Link><span>›</span>{artisan.name}</div>
      <section className="tourist-artisan-detail-top">
        <div className="tourist-artisan-gallery">
          <div className="tourist-artisan-main-photo">
            <img src={gallery[photo]} alt={`${artisan.name} tại xưởng`} />
            <button type="button" className="tourist-artisan-photo-next" aria-label="Ảnh tiếp theo" onClick={() => setPhoto((index) => (index + 1) % gallery.length)}><Play size={19} fill="currentColor" /></button>
          </div>
          <div className="tourist-artisan-thumbnails">{gallery.slice(1, 4).map((image, index) => <button type="button" key={`${image}-${index}`} aria-label={`Xem ảnh ${index + 2}`} className={photo === index + 1 ? "active" : ""} onClick={() => setPhoto(index + 1)}><img src={image} alt="" />{index === 2 && gallery.length > 4 && <span>+{gallery.length - 4}</span>}</button>)}</div>
        </div>

        <div className="tourist-artisan-profile">
          <h1>{artisan.name} <BadgeCheck size={23} fill="currentColor" /></h1>
          <p className="tourist-artisan-craft-title">Nghệ nhân {artisan.craft.toLocaleLowerCase("vi")}</p>
          <div className="tourist-artisan-rating"><span>{"★".repeat(Math.round(Number(artisan.rating) || 5))}</span><b>{artisan.rating || "4.8"}</b><small>({artisan.reviews} đánh giá)</small></div>
          <div className="tourist-artisan-facts">
            <span><MapPin size={17} />{artisan.place}</span>
            <span><Clock3 size={17} />{artisan.years || 20} năm kinh nghiệm</span>
            <span><ShieldCheck size={17} />Đã xác minh nghệ nhân</span>
          </div>
          <p>
            {artisan.description}
            {showFullDescription && ` Từ tình yêu với nghề và sự kiên trì qua năm tháng, ${artisan.name} mong muốn chia sẻ tri thức và truyền cảm hứng gìn giữ nghề truyền thống cho thế hệ tiếp nối. Những giá trị văn hóa ấy tiếp tục được trao truyền và lan tỏa đến cộng đồng.`}
          </p>
          <button type="button" className="tourist-artisan-more-link" aria-expanded={showFullDescription} onClick={() => setShowFullDescription((expanded) => !expanded)}>
            {showFullDescription ? "Thu gọn" : "Xem thêm"} <ChevronDown size={15} />
          </button>
        </div>

        <BookingCard artisan={artisan} saved={saved} onFavorite={onFavorite} onNotice={onNotice} />
      </section>
      <section className="tourist-artisan-detail-lower">
        <div className="tourist-artisan-detail-primary">
          <ArtisanTabs artisan={artisan} products={products} activities={activities} gallery={gallery} />
          <FeaturedProducts artisan={artisan} products={products} />
        </div>
        <ReviewAndMap artisan={artisan} activities={activities} />
      </section>
    </div>
  );
}
