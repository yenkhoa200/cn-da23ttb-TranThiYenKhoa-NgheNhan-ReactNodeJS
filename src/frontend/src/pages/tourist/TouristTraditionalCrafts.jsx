import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ArrowDownUp,
  Compass,
  Heart,
  MapPin,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import SearchFilterBar from "../../components/common/SearchFilterBar.jsx";

const craftRoute = (craft) => `/tourist/traditional-craft/${craft.id}`;

function CraftCard({ craft, saved, onFavorite }) {
  return (
    <article className="tourist-traditional-card">
      <Link className="tourist-traditional-card-image" to={craftRoute(craft)}>
        <img src={craft.image} alt={craft.name} loading="lazy" />
        {(craft.villages || craft.origin) && (
          <span><MapPin size={13} fill="currentColor" /> {craft.villages || craft.origin}</span>
        )}
      </Link>
      <button
        className={`tourist-traditional-card-heart${saved ? " is-saved" : ""}`}
        type="button"
        aria-label={saved ? `Bỏ lưu ${craft.name}` : `Lưu ${craft.name} yêu thích`}
        onClick={() => onFavorite(craft)}
      >
        <Heart size={20} fill={saved ? "currentColor" : "none"} />
      </button>
      <div className="tourist-traditional-card-body">
        <Link to={craftRoute(craft)} className="tourist-traditional-card-title">{craft.name}</Link>
        <p>{craft.description || "Nghề truyền thống được gìn giữ qua nhiều thế hệ."}</p>
        <div className="tourist-traditional-card-meta">
          <span><Users size={14} /> {craft.artisanCount} nghệ nhân</span>
          <span><CalendarDays size={14} /> {craft.activityCount} hoạt động</span>
        </div>
        <Link to={craftRoute(craft)} className="tourist-traditional-card-link">
          Xem chi tiết <ArrowRight size={13} />
        </Link>
      </div>
    </article>
  );
}

function FeaturedCraft({ craft }) {
  if (!craft) return null;

  return (
    <section className="tourist-traditional-featured">
      <h2><Compass size={18} /> Nghề truyền thống nổi bật</h2>
      <Link to={craftRoute(craft)} className="tourist-traditional-featured-image">
        <img src={craft.image} alt={craft.name} loading="lazy" />
      </Link>
      <Link to={craftRoute(craft)} className="tourist-traditional-featured-title">{craft.name}</Link>
      {(craft.villages || craft.origin) && (
        <span className="tourist-traditional-featured-place">
          <MapPin size={14} /> {craft.villages || craft.origin}
        </span>
      )}
      <p>{craft.description || craft.culturalValue}</p>
      <Link className="tourist-traditional-featured-action" to={craftRoute(craft)}>
        Khám phá ngay <ArrowRight size={14} />
      </Link>
    </section>
  );
}

export default function TouristTraditionalCrafts({
  crafts,
  query,
  onQuery,
  loading,
  favoriteIds,
  onFavorite,
}) {
  const [place, setPlace] = useState("Tất cả địa điểm");
  const [selectedCraft, setSelectedCraft] = useState("Tất cả nghề");
  const [sort, setSort] = useState("Mặc định");
  const [page, setPage] = useState(1);
  const locations = useMemo(
    () => [...new Set(crafts.flatMap((craft) => craft.villages.split(",").map((village) => village.trim()).filter(Boolean)))],
    [crafts],
  );
  const craftOptions = useMemo(() => crafts.map((craft) => craft.name), [crafts]);
  const visibleCrafts = useMemo(() => {
    const searchTerm = query.trim().toLocaleLowerCase("vi");
    let filtered = crafts.filter((craft) =>
      `${craft.name} ${craft.origin} ${craft.villages} ${craft.description} ${craft.technique} ${craft.culturalValue}`
        .toLocaleLowerCase("vi")
        .includes(searchTerm)
        && (place === "Tất cả địa điểm" || craft.villages.split(",").some((village) => village.trim() === place))
        && (selectedCraft === "Tất cả nghề" || craft.name === selectedCraft),
    );
    if (sort === "Nhiều nghệ nhân") filtered = [...filtered].sort((a, b) => b.artisanCount - a.artisanCount);
    if (sort === "Tên A–Z") filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name, "vi"));
    return filtered;
  }, [crafts, place, query, selectedCraft, sort]);
  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(visibleCrafts.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageCrafts = visibleCrafts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const updateQuery = (value) => {
    onQuery(value);
    setPage(1);
  };

  return (
    <div className="tourist-traditional-page">
      <section className="tourist-traditional-hero">
        <div className="tourist-traditional-hero-inner">
          <span className="tourist-traditional-hero-symbol" aria-hidden="true"><BookOpen size={34} /></span>
          <div>
            <h1>Nghề truyền thống Việt</h1>
            <p>Khám phá những nghề thủ công lâu đời,<br />nơi lưu giữ tinh hoa và bản sắc văn hóa dân tộc.</p>
          </div>
          <span className="tourist-traditional-hero-ornament" aria-hidden="true">〰</span>
        </div>
      </section>

      <div className="tourist-traditional-main">
        <SearchFilterBar
          value={query}
          onChange={updateQuery}
          onClear={() => updateQuery("")}
          placeholder="Tìm nghề truyền thống (ví dụ: gốm, dệt lụa...)"
          searchLabel="Tìm nghề truyền thống"
        >
          <div className="tourist-traditional-filters tourist-artisans-selects">
            <label className={place !== "Tất cả địa điểm" ? "has-selection" : ""}>
              <MapPin className="tourist-artisans-option-icon" size={16} />
              <select aria-label="Lọc theo làng nghề" value={place} onChange={(event) => { setPlace(event.target.value); setPage(1); }}>
                <option>Tất cả địa điểm</option>
                {locations.map((item) => <option key={item}>{item}</option>)}
              </select>
              <ChevronDown size={14} />
            </label>
            <label className={selectedCraft !== "Tất cả nghề" ? "has-selection" : ""}>
              <BookOpen className="tourist-artisans-option-icon" size={16} />
              <select aria-label="Lọc theo nghề truyền thống" value={selectedCraft} onChange={(event) => { setSelectedCraft(event.target.value); setPage(1); }}>
                <option>Tất cả nghề</option>
                {craftOptions.map((item) => <option key={item}>{item}</option>)}
              </select>
              <ChevronDown size={14} />
            </label>
            <label className={sort !== "Mặt định" ? "has-selection" : ""}>
              <ArrowDownUp className="tourist-artisans-option-icon" size={16} />
              <select aria-label="Sắp xếp nghề truyền thống" value={sort} onChange={(event) => setSort(event.target.value)}>
                <option>Sắp xếp</option>
                <option>Nhiều nghệ nhân</option>
                <option>Tên A-Z</option>
              </select>
              <ChevronDown size={14} />
            </label>
          </div>
        </SearchFilterBar>

        <div className="tourist-traditional-layout">
          <div>
            <div className="tourist-traditional-count">
              {loading ? "Đang tải nghề truyền thống..." : `${visibleCrafts.length} nghề truyền thống`}
            </div>
            {loading ? (
              <p className="tourist-traditional-empty" role="status">Đang tải dữ liệu từ cơ sở dữ liệu...</p>
            ) : pageCrafts.length ? (
              <div className="tourist-traditional-grid">
                {pageCrafts.map((craft) => (
                  <CraftCard
                    key={craft.id}
                    craft={craft}
                    saved={favoriteIds.includes(craft.id)}
                    onFavorite={onFavorite}
                  />
                ))}
              </div>
            ) : (
              <p className="tourist-traditional-empty">
                {query || place !== "Tất cả địa điểm" || selectedCraft !== "Tất cả nghề"
                  ? "Chưa tìm thấy nghề truyền thống phù hợp. Hãy thử từ khóa hoặc bộ lọc khác."
                  : "Chưa có nghề truyền thống được đăng tải."}
              </p>
            )}
            {pageCount > 1 && (
              <nav className="tourist-traditional-pagination" aria-label="Phân trang nghề truyền thống">
                <button type="button" aria-label="Trang trước" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>‹</button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    type="button"
                    key={pageNumber}
                    className={pageNumber === currentPage ? "active" : ""}
                    aria-current={pageNumber === currentPage ? "page" : undefined}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button type="button" aria-label="Trang sau" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>›</button>
              </nav>
            )}
          </div>
          <aside className="tourist-traditional-sidebar">
            <FeaturedCraft craft={crafts[0]} />
          </aside>
        </div>
      </div>
    </div>
  );
}
