import { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  ChevronDown,
  Compass,
  Heart,
  MapPin,
  Search,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

const villageRoute = (village) => `/tourist/craft/${village.id}`;

function VillageCard({ village, saved, onFavorite }) {
  return (
    <article className="tourist-village-card">
      <Link className="tourist-village-card-image" to={villageRoute(village)}>
        <img src={village.image} alt={village.title} loading="lazy" />
        <span><MapPin size={13} fill="currentColor" /> {village.location || village.place}</span>
      </Link>
      <button
        className={`tourist-village-card-heart${saved ? " is-saved" : ""}`}
        type="button"
        aria-label={saved ? `Bỏ lưu ${village.title}` : `Lưu ${village.title} yêu thích`}
        onClick={() => onFavorite(village)}
      >
        <Heart size={20} fill={saved ? "currentColor" : "none"} />
      </button>
      <div className="tourist-village-card-body">
        <Link to={villageRoute(village)} className="tourist-village-card-title">{village.title}</Link>
        <span><Building2 size={13} /> Nghề: {village.category}</span>
        <div className="tourist-village-card-footer">
          <span><Star size={14} fill="currentColor" /> {village.rating || "4.8"} <small>({village.reviews || "860"} đánh giá)</small></span>
          <Link to={villageRoute(village)}>Xem chi tiết <ArrowRight size={13} /></Link>
        </div>
      </div>
    </article>
  );
}

function FeaturedVillage({ village }) {
  if (!village) return null;

  return (
    <section className="tourist-village-featured">
      <h2><Compass size={18} /> Làng nghề nổi bật</h2>
      <Link to={villageRoute(village)} className="tourist-village-featured-image">
        <img src={village.featuredImage || village.image} alt={village.title} loading="lazy" />
      </Link>
      <Link to={villageRoute(village)} className="tourist-village-featured-title">{village.title}</Link>
      <span className="tourist-village-featured-place"><MapPin size={14} /> {village.location || village.place}</span>
      <p>{village.description}</p>
      <Link className="tourist-village-featured-action" to={villageRoute(village)}>Khám phá ngay <ArrowRight size={14} /></Link>
    </section>
  );
}

export default function TouristVillagePages({ crafts, favoriteIds, onFavorite, query, onQuery }) {
  const [place, setPlace] = useState("Tất cả địa điểm");
  const [category, setCategory] = useState("Nghề truyền thống");
  const [sort, setSort] = useState("Mặc định");
  const [page, setPage] = useState(1);
  const locations = [...new Set(crafts.map((item) => item.location || item.place.split(",").at(-1).trim()))];
  const categories = [...new Set(crafts.map((item) => item.category))];
  const visibleVillages = useMemo(() => {
    const searchTerm = query.trim().toLocaleLowerCase("vi");
    let filtered = crafts.filter((village) =>
      `${village.title} ${village.category} ${village.place} ${village.description}`
        .toLocaleLowerCase("vi")
        .includes(searchTerm)
        && (place === "Tất cả địa điểm" || (village.location || village.place).includes(place))
        && (category === "Nghề truyền thống" || village.category === category),
    );
    if (sort === "Đánh giá cao") filtered = [...filtered].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    if (sort === "Tên A–Z") filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title, "vi"));
    return filtered;
  }, [category, crafts, place, query, sort]);
  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(visibleVillages.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageVillages = visibleVillages.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="tourist-villages-page">
      <section className="tourist-villages-hero">
        <div className="tourist-villages-hero-inner">
          <span className="tourist-villages-hero-symbol" aria-hidden="true">⌂</span>
          <div>
            <h1>Làng nghề Việt</h1>
            <p>Khám phá những làng nghề truyền thống,<br />nơi lưu giữ tinh hoa văn hóa dân tộc.</p>
          </div>
          <span className="tourist-villages-hero-ornament" aria-hidden="true">〰</span>
        </div>
      </section>

      <div className="tourist-villages-main">
        <div className="tourist-villages-toolbar">
          <label className="tourist-villages-search">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => {
                onQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Tìm kiếm làng nghề (ví dụ: gốm Bát Tràng, lụa Vạn Phúc...)"
              aria-label="Tìm kiếm làng nghề"
            />
            {query && <button type="button" aria-label="Xóa tìm kiếm" onClick={() => onQuery("")}>×</button>}
          </label>
          <div className="tourist-villages-filters">
            <label><MapPin size={15} /><select aria-label="Lọc theo địa điểm" value={place} onChange={(event) => { setPlace(event.target.value); setPage(1); }}><option>Tất cả địa điểm</option>{locations.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></label>
            <label><CalendarDays size={15} /><select aria-label="Lọc theo nghề" value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}><option>Nghề truyền thống</option>{categories.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></label>
            <label><Compass size={15} /><select aria-label="Sắp xếp làng nghề" value={sort} onChange={(event) => setSort(event.target.value)}><option>Mặc định</option><option>Đánh giá cao</option><option>Tên A–Z</option></select><ChevronDown size={14} /></label>
          </div>
        </div>

        <div className="tourist-villages-layout">
          <div>
            <div className="tourist-villages-count">{visibleVillages.length} làng nghề truyền thống</div>
            {pageVillages.length ? (
              <div className="tourist-villages-grid">
                {pageVillages.map((village) => (
                  <VillageCard
                    key={village.id}
                    village={village}
                    saved={favoriteIds.includes(village.id)}
                    onFavorite={onFavorite}
                  />
                ))}
              </div>
            ) : (
              <p className="tourist-villages-empty">Chưa tìm thấy làng nghề phù hợp. Hãy thử từ khóa hoặc bộ lọc khác.</p>
            )}
            {pageCount > 1 && (
              <nav className="tourist-villages-pagination" aria-label="Phân trang làng nghề">
                <button type="button" aria-label="Trang trước" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>‹</button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                  <button type="button" key={pageNumber} className={pageNumber === currentPage ? "active" : ""} aria-current={pageNumber === currentPage ? "page" : undefined} onClick={() => setPage(pageNumber)}>{pageNumber}</button>
                ))}
                <button type="button" aria-label="Trang sau" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>›</button>
              </nav>
            )}
          </div>
 
          <aside className="tourist-villages-sidebar">
            <FeaturedVillage village={crafts[0]} />
            {/* 
            <section className="tourist-villages-reasons">
              <h2>Vì sao nên khám phá làng nghề?</h2>
              <div>
                <span><i>♨</i>Trải nghiệm<br />thực tế</span>
                <span><i>⌂</i>Tìm hiểu<br />văn hóa</span>
                <span><i>♡</i>Góp phần<br />bảo tồn nghề</span>
              </div>
            </section>
            */}
          </aside>
          
        </div>
      </div>
    </div>
  );
}
