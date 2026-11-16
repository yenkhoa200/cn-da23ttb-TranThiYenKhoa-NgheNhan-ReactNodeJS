import {
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Eye,
  MapPin,
  Plus,
  Search,
  Sprout,
  Trash2,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import artisanCraftService from "../../services/artisanCraftService.js";
import { getProfileImageUrl } from "../../services/artisanProfileService.js";
import { useArtisanToast } from "../../contexts/ArtisanToastContext.js";
import { ROUTES } from "../../routes/path.js";
import "../../styles/ArtisanCraft.css";

const PAGE_SIZE = 5;

function isActiveCraft(status) {
  return ["hoat_dong", "dang_hoat_dong"].includes(String(status || "").toLowerCase());
}

export default function ArtisanCrafts() {
  const [crafts, setCrafts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState("");
  const [startYear, setStartYear] = useState("");
  const [expandedId, setExpandedId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const notify = useArtisanToast();

  useEffect(() => {
    let active = true;
    artisanCraftService.getAll()
      .then((data) => {
        if (active) setCrafts(data);
      })
      .catch((error) => {
        if (active) notify(error.message, "error");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [notify]);

  const availableCrafts = useMemo(() => crafts.filter((craft) => !craft.selected), [crafts]);
  const selectedCrafts = useMemo(() => crafts.filter((craft) => craft.selected), [crafts]);
  const filteredCrafts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("vi");
    return crafts.filter((craft) => {
      const matchesSearch = !query
        || `${craft.name} ${craft.description || ""} ${craft.villages || ""}`
          .toLocaleLowerCase("vi")
          .includes(query);
      const matchesFilter = filter === "all"
        || (filter === "selected" && craft.selected)
        || (filter === "unselected" && !craft.selected);
      return matchesSearch && matchesFilter;
    });
  }, [crafts, filter, search]);

  const pageCount = Math.max(1, Math.ceil(filteredCrafts.length / PAGE_SIZE));
  const visiblePage = Math.min(currentPage, pageCount);
  const pageCrafts = filteredCrafts.slice((visiblePage - 1) * PAGE_SIZE, visiblePage * PAGE_SIZE);
  const relatedActivities = selectedCrafts.reduce((sum, craft) => sum + Number(craft.activity_count || 0), 0);
  const activeSelectedCrafts = selectedCrafts.filter((craft) => isActiveCraft(craft.status)).length;

  const handleSelect = async (event) => {
    event.preventDefault();
    if (!selectedId) {
      notify("Hãy chọn một nghề truyền thống trong danh mục.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const result = await artisanCraftService.select(selectedId, startYear);
      setCrafts((current) => current.map((craft) => (
        String(craft.id) === String(selectedId)
          ? { ...craft, selected: true, start_year: result.start_year ?? craft.start_year ?? null }
          : craft
      )));
      setSelectedId("");
      setStartYear("");
      notify("Đã thêm nghề vào hồ sơ cá nhân.");
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async (craft) => {
    if (!window.confirm(`Bỏ "${craft.name}" khỏi danh sách nghề của bạn?`)) return;

    try {
      await artisanCraftService.remove(craft.id);
      setCrafts((current) => current.map((item) => (
        String(item.id) === String(craft.id)
          ? { ...item, selected: false, start_year: null }
          : item
      )));
      notify("Đã bỏ nghề khỏi hồ sơ cá nhân.");
    } catch (error) {
      notify(error.message, "error");
    }
  };

  return (
    <main className="artisan-crafts-page">
      <section className="artisan-crafts-banner">
        <div>
          <span className="artisan-crafts-eyebrow">GÌN GIỮ · TIẾP NỐI · PHÁT TRIỂN</span>
          <h1>Quản lý nghề truyền thống</h1>
          <p>Chọn nghề bạn đang gìn giữ, tìm hiểu kỹ thuật và chia sẻ giá trị nghề Việt.</p>
        </div>
      </section>

      <section className="artisan-crafts-stats" aria-label="Thống kê nghề truyền thống">
        <article className="artisan-craft-stat stat-green">
          <span className="artisan-craft-stat-icon"><Sprout size={19} /></span>
          <div><small>Nghề trong danh mục</small><strong>{crafts.length}</strong></div>
        </article>
        <article className="artisan-craft-stat stat-orange">
          <span className="artisan-craft-stat-icon"><Check size={19} /></span>
          <div><small>Nghề bạn đã chọn</small><strong>{selectedCrafts.length}</strong></div>
        </article>
        <article className="artisan-craft-stat stat-green">
          <span className="artisan-craft-stat-icon"><Wrench size={19} /></span>
          <div><small>Nghề đang hoạt động</small><strong>{activeSelectedCrafts}</strong></div>
        </article>
        <article className="artisan-craft-stat stat-purple">
          <span className="artisan-craft-stat-icon"><CalendarDays size={19} /></span>
          <div><small>Hoạt động liên quan</small><strong>{relatedActivities}</strong></div>
        </article>
      </section>

      <div className="artisan-crafts-content">
        <section className="artisan-craft-list-panel">
          <div className="artisan-craft-list-heading">
            <div>
              <span className="artisan-crafts-section-mark"><Sprout size={17} /></span>
              <h2>Danh sách nghề truyền thống</h2>
            </div>
            <div className="artisan-craft-controls">
              <label className="artisan-craft-search">
                <Search size={16} aria-hidden="true" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Tìm kiếm nghề truyền thống..."
                  aria-label="Tìm kiếm nghề truyền thống"
                />
              </label>
              <label className="artisan-craft-filter">
                <span className="sr-only">Lọc nghề</span>
                <select value={filter} onChange={(event) => {
                  setFilter(event.target.value);
                  setCurrentPage(1);
                }}>
                  <option value="all">Tất cả</option>
                  <option value="selected">Nghề của tôi</option>
                  <option value="unselected">Chưa lựa chọn</option>
                </select>
              </label>
            </div>
          </div>

          {isLoading ? (
            <p className="artisan-craft-empty" role="status">Đang tải danh sách nghề...</p>
          ) : pageCrafts.length ? (
            <div className="artisan-craft-list">
              {pageCrafts.map((craft) => (
                <article className="artisan-craft-card" key={craft.id}>
                  <div className="artisan-craft-photo">
                    {craft.image
                      ? <img src={getProfileImageUrl(craft.image)} alt={craft.name} onError={(event) => event.currentTarget.remove()} />
                      : <Sprout size={34} aria-hidden="true" />}
                  </div>
                  <div className="artisan-craft-info">
                    <span className="artisan-craft-tag">Nghề truyền thống</span>
                    <h3>{craft.name}</h3>
                    <p className="artisan-craft-description">{craft.description || "Chưa có mô tả cho nghề này."}</p>
                    <div className="artisan-craft-meta">
                      {craft.villages && <span><MapPin size={14} />{craft.villages}</span>}
                      {craft.start_year && <span><CalendarDays size={14} />Gắn bó từ năm {craft.start_year}</span>}
                    </div>
                    {expandedId === String(craft.id) && (
                      <div className="artisan-craft-details">
                        {craft.origin && <p><strong>Nguồn gốc:</strong> {craft.origin}</p>}
                        {craft.technique && <p><strong>Kỹ thuật và quy trình:</strong> {craft.technique}</p>}
                        {craft.cultural_value && <p><strong>Giá trị văn hóa, gìn giữ và phát triển:</strong> {craft.cultural_value}</p>}
                        {!craft.origin && !craft.technique && !craft.cultural_value && (
                          <p>Danh mục chưa có thông tin chi tiết cho nghề này.</p>
                        )}
                        <Link to={ROUTES.ARTISAN_PROFILE}>Cập nhật hành trình gìn giữ nghề trong hồ sơ cá nhân</Link>
                      </div>
                    )}
                  </div>
                  <div className="artisan-craft-actions">
                    <span className={`artisan-craft-status${craft.selected ? " is-selected" : ""}`}>
                      <CircleCheck size={14} />
                      {craft.selected ? "Đang theo đuổi" : (isActiveCraft(craft.status) ? "Đang hoạt động" : "Tạm ngưng")}
                    </span>
                    <button
                      type="button"
                      className="artisan-craft-view"
                      onClick={() => setExpandedId((current) => current === String(craft.id) ? "" : String(craft.id))}
                    >
                      <Eye size={14} />{expandedId === String(craft.id) ? "Thu gọn" : "Xem kỹ thuật"}
                    </button>
                    {craft.selected && (
                      <button type="button" className="artisan-craft-remove" onClick={() => handleRemove(craft)}>
                        <Trash2 size={14} /> Bỏ lựa chọn
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="artisan-craft-empty">
              {crafts.length ? "Không tìm thấy nghề phù hợp." : "Chưa có nghề truyền thống trong danh mục."}
            </p>
          )}

          {pageCount > 1 && (
            <nav className="artisan-craft-pagination" aria-label="Phân trang danh sách nghề">
              <button type="button" aria-label="Trang trước" disabled={visiblePage === 1} onClick={() => setCurrentPage(visiblePage - 1)}>
                <ChevronLeft size={17} />
              </button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                <button
                  type="button"
                  key={page}
                  className={page === visiblePage ? "active" : ""}
                  aria-current={page === visiblePage ? "page" : undefined}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button type="button" aria-label="Trang sau" disabled={visiblePage === pageCount} onClick={() => setCurrentPage(visiblePage + 1)}>
                <ChevronRight size={17} />
              </button>
            </nav>
          )}
        </section>

        <aside className="artisan-craft-select-panel">
          <div className="artisan-craft-select-heading">
            <Sprout size={18} />
            <h2>Chọn nghề truyền thống</h2>
          </div>
          <p>Chọn nghề bạn đang thực hành hoặc gìn giữ để thêm vào hồ sơ cá nhân.</p>
          <form onSubmit={handleSelect}>
            <label className="artisan-craft-select-label" htmlFor="craft-select">Nghề trong danh mục <span>*</span></label>
            <select
              id="craft-select"
              required
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              disabled={!availableCrafts.length || isSaving}
            >
              <option value="" disabled>Chọn nghề truyền thống...</option>
              {availableCrafts.map((craft) => (
                <option key={craft.id} value={craft.id}>{craft.name}</option>
              ))}
            </select>
            <label className="artisan-craft-select-label" htmlFor="craft-start-year">Năm bắt đầu gắn bó</label>
            <input
              id="craft-start-year"
              type="number"
              min="1900"
              max="2100"
              placeholder="Ví dụ: 1995"
              value={startYear}
              onChange={(event) => setStartYear(event.target.value)}
              disabled={!availableCrafts.length || isSaving}
            />
            <button type="submit" disabled={!availableCrafts.length || isSaving}>
              <Plus size={16} />{isSaving ? "Đang lưu..." : "Thêm vào hồ sơ"}
            </button>
          </form>
          {!availableCrafts.length && !isLoading && (
            <p className="artisan-craft-all-selected">Bạn đã lựa chọn tất cả nghề trong danh mục.</p>
          )}
          <div className="artisan-craft-preservation-note">
            <BookOpen size={16} />
            <span>Kỹ thuật, nguồn gốc và giá trị gìn giữ được lấy từ danh mục nghề. Câu chuyện riêng của bạn có thể cập nhật tại <Link to={ROUTES.ARTISAN_PROFILE}>Hồ sơ cá nhân</Link>.</span>
          </div>
        </aside>
      </div>
    </main>
  );
}
