import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  Heart,
  MapPin,
  Search,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

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
