import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  Clock3,
  Heart,
  Image,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Search,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/path.js";

const routeFor = (artisan) => `/tourist/artisan/${artisan.id}`;

function ArtisanHero() {
  return (
    <section className="tourist-artisans-hero">
      <div className="tourist-artisans-hero-inner">
        <span className="tourist-artisans-hero-decoration" aria-hidden="true">❧</span>
        <div>
          <h1>Nghệ nhân</h1>
          <p>Khám phá những nghệ nhân tài hoa –<br />người gìn giữ và lan tỏa giá trị văn hóa Việt.</p>
        </div>
        <span className="tourist-artisans-hero-decoration right" aria-hidden="true">❧</span>
      </div>
    </section>
  );
}

function ArtisanCard({ artisan, favoriteIds, onFavorite }) {
  const saved = favoriteIds.includes(artisan.id);
  return (
    <article className="tourist-artisan-card">
      <Link to={routeFor(artisan)} className="tourist-artisan-card-image">
        <img src={artisan.image} alt={artisan.name} loading="lazy" />
      </Link>
      <button
        type="button"
        className={`tourist-artisan-card-heart${saved ? " is-saved" : ""}`}
        aria-label={saved ? `Bỏ lưu ${artisan.name}` : `Lưu ${artisan.name} yêu thích`}
        onClick={() => onFavorite(artisan)}
      >
        <Heart size={20} fill={saved ? "currentColor" : "none"} />
      </button>
      <div className="tourist-artisan-card-body">
        <Link className="tourist-artisan-card-name" to={routeFor(artisan)}>
          {artisan.name}<BadgeCheck size={14} fill="currentColor" />
        </Link>
        <span><Users size={13} /> Nghề: {artisan.craft}</span>
        <span><MapPin size={13} /> {artisan.place}</span>
        <div className="tourist-artisan-card-bottom">
          <small><Star size={14} fill="currentColor" /> {artisan.rating} <i>({artisan.reviews} đánh giá)</i></small>
          <Link to={routeFor(artisan)}>Xem chi tiết <ArrowRight size={13} /></Link>
        </div>
      </div>
    </article>
  );
}

function DiscoverMore({ crafts, products, stories }) {
  const entries = [
    { title: "Làng nghề Việt Nam", image: crafts[0]?.image, href: "/tourist/crafts", action: "Tìm hiểu ngay" },
    { title: "Nghề truyền thống nổi bật", image: crafts[1]?.image || crafts[0]?.image, href: "/tourist/crafts", action: "Khám phá" },
    { title: "Giá trị văn hóa qua bàn tay nghệ nhân", image: products[0]?.image || stories[0]?.image, href: "/tourist/stories", action: "Đọc ngay" },
  ].filter((entry) => entry.image);
  return (
    <aside className="tourist-artisans-discover">
      <h2><span aria-hidden="true">❧</span> Khám phá thêm</h2>
      {entries.map((entry) => (
        <Link to={entry.href} className="tourist-artisans-discover-card" key={entry.title}>
          <img src={entry.image} alt="" loading="lazy" />
          <span><strong>{entry.title}</strong><small>{entry.action} <ArrowRight size={12} /></small></span>
          <i><ArrowRight size={15} /></i>
        </Link>
      ))}
    </aside>
  );
}

export function ArtisanListing({ artisans, crafts, products, stories, favoriteIds, onFavorite, query, onQuery }) {
  const [craft, setCraft] = useState("Nghề truyền thống");
  const [place, setPlace] = useState("Địa phương");
  const [sort, setSort] = useState("Sắp xếp");
  const craftOptions = [...new Set(artisans.map((item) => item.craft))];
  const placeOptions = [...new Set(artisans.map((item) => item.place.split(",")[0]))];
  const filtered = useMemo(() => {
    let items = artisans.filter((item) => {
      const text = `${item.name} ${item.craft} ${item.place}`.toLocaleLowerCase("vi");
      return text.includes(query.trim().toLocaleLowerCase("vi"))
        && (craft === "Nghề truyền thống" || item.craft === craft)
        && (place === "Địa phương" || item.place.startsWith(place));
    });
    if (sort === "Đánh giá cao") items = [...items].sort((a, b) => Number(b.rating) - Number(a.rating));
    if (sort === "Tên A–Z") items = [...items].sort((a, b) => a.name.localeCompare(b.name, "vi"));
    return items;
  }, [artisans, craft, place, query, sort]);

  return (
    <div className="tourist-artisans-page">
      <ArtisanHero />
      <div className="tourist-artisans-main">
        <div className="tourist-artisans-toolbar">
          <form className="tourist-artisans-search" onSubmit={(event) => event.preventDefault()}>
            <Search size={18} />
            <input aria-label="Tìm kiếm nghệ nhân" placeholder="Tìm kiếm nghệ nhân theo tên, nghề truyền thống..." value={query} onChange={(event) => onQuery(event.target.value)} />
            {query && <button type="button" aria-label="Xóa tìm kiếm" onClick={() => onQuery("")}>×</button>}
            <button type="submit">Tìm kiếm</button>
          </form>
          <div className="tourist-artisans-selects">
            <label><span>❀</span><select aria-label="Lọc theo nghề truyền thống" value={craft} onChange={(event) => setCraft(event.target.value)}><option>Nghề truyền thống</option>{craftOptions.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={14} /></label>
            <label><MapPin size={15} /><select aria-label="Lọc theo địa phương" value={place} onChange={(event) => setPlace(event.target.value)}><option>Địa phương</option>{placeOptions.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={14} /></label>
            <label><CalendarDays size={15} /><select aria-label="Sắp xếp nghệ nhân" value={sort} onChange={(event) => setSort(event.target.value)}><option>Sắp xếp</option><option>Đánh giá cao</option><option>Tên A–Z</option></select><ChevronDown size={14} /></label>
          </div>
        </div>

        <div className="tourist-artisans-layout">
          <section aria-label="Danh sách nghệ nhân">
            <span className="tourist-artisans-count">{filtered.length} nghệ nhân</span>
            {filtered.length ? <div className="tourist-artisans-grid">{filtered.map((item) => <ArtisanCard key={item.id} artisan={item} favoriteIds={favoriteIds} onFavorite={onFavorite} />)}</div> : <p className="tourist-empty">Không tìm thấy nghệ nhân phù hợp. Hãy thử từ khóa hoặc bộ lọc khác.</p>}
            {filtered.length > 0 && <nav className="tourist-artisans-pagination" aria-label="Phân trang nghệ nhân"><button type="button" aria-label="Trang trước" disabled><ArrowLeft size={15} /></button><button type="button" className="active" aria-current="page">1</button><button type="button" disabled>2</button><button type="button" disabled>3</button><button type="button" aria-label="Trang sau" disabled><ArrowRight size={15} /></button></nav>}
          </section>
          <DiscoverMore crafts={crafts} products={products} stories={stories} />
        </div>
      </div>
    </div>
  );
}

function BookingCard({ artisan, onNotice }) {
  const [people, setPeople] = useState(1);
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
  });
  const submit = (event) => {
    event.preventDefault();
    onNotice(`Đã gửi yêu cầu gặp ${artisan.name} vào ngày ${date} cho ${people} người.`);
  };
  return (
    <aside className="tourist-artisan-contact">
      <h2>Liên hệ với nghệ nhân</h2>
      <form onSubmit={submit}>
        <label htmlFor="artisan-booking-date"><CalendarDays size={15} /> Tham quan/Trải nghiệm tại xưởng</label>
        <input id="artisan-booking-date" type="date" min={new Date().toISOString().slice(0, 10)} value={date} onChange={(event) => setDate(event.target.value)} required />
        <strong><Users size={15} /> Số lượng người</strong>
        <div className="tourist-artisan-quantity">
          <button type="button" aria-label="Giảm số người" disabled={people <= 1} onClick={() => setPeople((count) => Math.max(1, count - 1))}>−</button>
          <output>{people}</output>
          <button type="button" aria-label="Tăng số người" onClick={() => setPeople((count) => count + 1)}>+</button>
        </div>
        <button type="submit" className="tourist-artisan-contact-submit"><MessageCircle size={15} /> Gửi yêu cầu</button>
      </form>
      <div className="tourist-artisan-contact-info">
        <b>Liên hệ: học với nghệ nhân</b>
        <span><Phone size={15} /><a href={`tel:${(artisan.phone || "0900000000").replaceAll(" ", "")}`}>{artisan.phone || "0900 000 000"}</a></span>
        <span><MapPin size={15} />Địa chỉ: {artisan.place}</span>
      </div>
    </aside>
  );
}

function ArtisanTabs({ artisan, products }) {
  const [tab, setTab] = useState("Về nghệ nhân");
  const tabs = [["Về nghệ nhân", Users], ["Câu chuyện nghề", Image], ["Sản phẩm", Package], [`Đánh giá (${artisan.reviews})`, Star]];
  const matchedProducts = products.filter((product) => `${product.title} ${product.category}`.toLocaleLowerCase("vi").includes((artisan.product || artisan.craft).toLocaleLowerCase("vi").split(" ")[0]));
  return (
    <section className="tourist-artisan-tabs-card">
      <div className="tourist-artisan-tabs" role="tablist" aria-label="Thông tin nghệ nhân">
        {tabs.map(([label, Icon]) => <button type="button" role="tab" aria-selected={tab === label} className={tab === label ? "active" : ""} key={label} onClick={() => setTab(label)}><Icon size={15} />{label}</button>)}
      </div>
      <div className="tourist-artisan-tab-content" role="tabpanel">
        {tab === "Về nghệ nhân" && <><b>Về nghệ nhân</b><p><strong>Làng nghề:</strong> {artisan.place}</p><p><strong>Sản phẩm chính:</strong> {artisan.product || artisan.craft}</p><p><strong>Kinh nghiệm:</strong> {artisan.years || 20} năm</p><p>{artisan.description}</p></>}
        {tab === "Câu chuyện nghề" && <><b>Câu chuyện nghề</b><p>{artisan.description}</p><p>Từ tình yêu với nghề và sự kiên trì qua năm tháng, {artisan.name} mong muốn chia sẻ tri thức và truyền cảm hứng gìn giữ nghề truyền thống cho thế hệ tiếp nối.</p></>}
        {tab === "Sản phẩm" && <div className="tourist-artisan-products">{(matchedProducts.length ? matchedProducts : products.slice(0, 3)).map((product) => <Link to={`/tourist/product/${product.id}`} key={product.id}><img src={product.image} alt={product.title} /><span>{product.title}</span></Link>)}</div>}
        {tab.startsWith("Đánh giá") && <div className="tourist-artisan-tab-reviews"><b>Đánh giá từ du khách</b><p>★★★★★ Lê Văn Tùng — Trải nghiệm rất thú vị, nghệ nhân thân thiện và nhiệt tình.</p><p>★★★★★ Nguyễn Thị Hạnh — Được tìm hiểu câu chuyện nghề rất đáng nhớ.</p></div>}
      </div>
    </section>
  );
}

function ReviewAndMap({ artisan, activities }) {
  const activity = activities.find((item) => `${item.title} ${item.place}`.toLocaleLowerCase("vi").includes(artisan.place.split(",")[0].toLocaleLowerCase("vi"))) || activities[0];
  return (
    <div className="tourist-artisan-detail-aside">
      <section className="tourist-artisan-reviews-card">
        <h2><Star size={19} fill="currentColor" /> Nhận xét từ du khách</h2>
        {[["L", "Lê Văn Tùng", "Trải nghiệm rất thú vị, nghệ nhân thân thiện và nhiệt tình. Tôi rất thích hoạt động này!"], ["N", "Nguyễn Thị Hạnh", "Được tìm hiểu câu chuyện và thử làm sản phẩm thủ công rất đáng nhớ."]].map(([initial, name, review]) => <article key={name}><span className="tourist-artisan-review-avatar">{initial}</span><div><b>{name}</b><small>★★★★★ <i>02/11/2026</i></small><p>{review}</p></div></article>)}
        <Link to="/tourist/reviews">Xem tất cả nhận xét <ArrowRight size={13} /></Link>
      </section>
      <div className="tourist-artisan-map-card"><span><MapPin size={22} fill="currentColor" /></span><b>{artisan.place.split(",")[0]}</b></div>
      {activity && <Link className="tourist-artisan-activity-card" to={`/tourist/activity/${activity.id}`}><small>HOẠT ĐỘNG TRẢI NGHIỆM</small><b>{activity.title}</b><span>Khám phá cùng nghệ nhân <ArrowRight size={13} /></span><img src={activity.image} alt="" /></Link>}
    </div>
  );
}

export function ArtisanDetail({ artisan, products, activities, favoriteIds, onFavorite, onNotice }) {
  const [photo, setPhoto] = useState(0);
  const saved = favoriteIds.includes(artisan.id);
  const gallery = artisan.gallery?.length ? artisan.gallery : [artisan.image, artisan.image, artisan.image, artisan.image];
  return (
    <div className="tourist-view tourist-artisan-detail-page">
      <div className="tourist-breadcrumb"><Link to={ROUTES.TOURIST}>Trang chủ</Link><span>›</span><Link to="/tourist/artisans">Nghệ nhân</Link><span>›</span>{artisan.name}</div>
      <section className="tourist-artisan-detail-top">
        <div className="tourist-artisan-gallery">
          <div className="tourist-artisan-main-photo">
            <img src={gallery[photo]} alt={`${artisan.name} tại xưởng`} />
            <button type="button" className={`tourist-artisan-photo-heart${saved ? " is-saved" : ""}`} aria-label={saved ? "Bỏ yêu thích nghệ nhân" : "Lưu nghệ nhân yêu thích"} onClick={() => onFavorite(artisan)}><Heart size={18} fill={saved ? "currentColor" : "none"} /></button>
            <button type="button" className="tourist-artisan-photo-next" aria-label="Ảnh tiếp theo" onClick={() => setPhoto((index) => (index + 1) % gallery.length)}><ArrowRight size={18} /></button>
          </div>
          <div className="tourist-artisan-thumbnails">{gallery.map((image, index) => <button type="button" key={`${image}-${index}`} aria-label={`Xem ảnh ${index + 1}`} className={photo === index ? "active" : ""} onClick={() => setPhoto(index)}><img src={image} alt="" /></button>)}</div>
        </div>

        <div className="tourist-artisan-profile">
          <span className="tourist-artisan-award">🏅 Nghệ nhân ưu tú</span>
          <h1>{artisan.name}</h1>
          <div className="tourist-artisan-rating"><span>{"★".repeat(Math.round(Number(artisan.rating) || 5))}</span><small>({artisan.reviews} đánh giá)</small></div>
          <div className="tourist-artisan-facts">
            <span><Users size={15} /><b>Làng nghề:</b> {artisan.place}</span>
            <span><MapPin size={15} /><b>Sản phẩm chính:</b> {artisan.product || artisan.craft}</span>
            <span><Clock3 size={15} /><b>Kinh nghiệm:</b> {artisan.years || 20} năm</span>
          </div>
          <p>{artisan.description} Từ tình yêu với nghề và sự kiên trì qua năm tháng, những giá trị văn hóa được trao truyền và lan tỏa đến cộng đồng.</p>
        </div>

        <BookingCard artisan={artisan} onNotice={onNotice} />
      </section>
      <section className="tourist-artisan-detail-lower">
        <ArtisanTabs artisan={artisan} products={products} />
        <ReviewAndMap artisan={artisan} activities={activities} />
      </section>
    </div>
  );
}
