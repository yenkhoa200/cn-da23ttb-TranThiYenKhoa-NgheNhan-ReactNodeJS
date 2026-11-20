import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  Eye,
  Flower2,
  Grid2X2,
  Image as ImageIcon,
  List,
  Play,
  Search,
  Video,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useArtisanToast } from "../../contexts/ArtisanToastContext.js";
import artisanProfileService, {
  getProfileImageUrl,
} from "../../services/artisanProfileService.js";
import "../../styles/ArtisanMediaLibraryPage.css";

const pageSize = 8;

function mediaTitle(media) {
  return media.caption?.trim() || decodeURIComponent(media.url.split("/").pop() || "Tư liệu nghệ nhân");
}

function formatUploadDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa rõ ngày tải lên";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatVideoTime(seconds) {
  if (!Number.isFinite(seconds)) return "";
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function MediaPreview({ media, onOpen, compact = false }) {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState("");

  return (
    <button
      className={`artisan-media-preview${compact ? " compact" : ""}`}
      type="button"
      onClick={onOpen}
      aria-label={`Xem ${media.type === "video" ? "video" : "ảnh"}: ${mediaTitle(media)}`}
    >
      {media.type === "video" ? (
        <>
          <video
            ref={videoRef}
            src={media.url}
            preload="metadata"
            muted
            playsInline
            onLoadedMetadata={() => setDuration(formatVideoTime(videoRef.current?.duration))}
          />
          <span className="artisan-media-play"><Play size={22} fill="currentColor" /></span>
          {duration && <span className="artisan-media-duration">{duration}</span>}
        </>
      ) : (
        <img src={media.url} alt={mediaTitle(media)} loading="lazy" />
      )}
    </button>
  );
}

export default function ArtisanMediaLibraryPage() {
  const notify = useArtisanToast();
  const uploadInputRef = useRef(null);
  const [media, setMedia] = useState([]);
  const [activeTab, setActiveTab] = useState("hinh_anh");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    artisanProfileService.getMedia()
      .then((items) => {
        if (active) {
          setMedia(items.map((item) => ({
            ...item,
            url: getProfileImageUrl(item.url),
          })));
        }
      })
      .catch((error) => {
        if (active) setErrorMessage(error.message || "Không thể tải thư viện tư liệu.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const imageCount = media.filter((item) => item.type === "hinh_anh").length;
  const videoCount = media.filter((item) => item.type === "video").length;

  const categories = useMemo(
    () => [...new Set(media
      .filter((item) => item.type === activeTab)
      .map((item) => item.category)
      .filter(Boolean))],
    [activeTab, media],
  );

  const filteredMedia = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("vi");

    return media
      .filter((item) => item.type === activeTab)
      .filter((item) => {
        const matchesQuery = !query
          || `${mediaTitle(item)} ${item.category || ""}`.toLocaleLowerCase("vi").includes(query);
        const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
        return matchesQuery && matchesCategory;
      })
      .sort((a, b) => {
        const firstDate = new Date(a.uploaded_at).getTime();
        const secondDate = new Date(b.uploaded_at).getTime();
        return sortOrder === "newest" ? secondDate - firstDate : firstDate - secondDate;
      });
  }, [activeTab, categoryFilter, media, search, sortOrder]);

  const pageCount = Math.max(1, Math.ceil(filteredMedia.length / pageSize));
  const pageMedia = filteredMedia.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const changeTab = (tab) => {
    setActiveTab(tab);
    setCategoryFilter("all");
    setCurrentPage(1);
    setSelectedMedia(null);
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    if ((activeTab === "hinh_anh" && !isImage) || (activeTab === "video" && isImage)) {
      notify(`Vui lòng chọn ${activeTab === "hinh_anh" ? "tệp ảnh" : "tệp video"} phù hợp.`, "error");
      return;
    }

    setUploading(true);
    setErrorMessage("");
    try {
      const uploaded = await artisanProfileService.uploadMedia(file);
      setMedia((current) => [{
        ...uploaded,
        url: getProfileImageUrl(uploaded.url),
      }, ...current]);
      setCurrentPage(1);
      notify("Đã tải tư liệu lên thư viện.");
    } catch (error) {
      notify(error.message || "Không thể tải tư liệu lên.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="artisan-media-library-page">
      <section className="artisan-media-hero">
        <span className="artisan-media-hero-icon"><ImageIcon size={34} /></span>
        <div>
          <span className="artisan-media-eyebrow">KHÔNG GIAN NGHỆ NHÂN</span>
          <h1>Thư viện hình ảnh &amp; video</h1>
          <p>Lưu giữ và quản lý những khoảnh khắc đẹp về nghề truyền thống và hoạt động của bạn.</p>
        </div>
        <Flower2 className="artisan-media-hero-flower" size={88} aria-hidden="true" />
      </section>

      <section className="artisan-media-toolbar-top">
        <div className="artisan-media-tabs" role="tablist" aria-label="Loại tư liệu">
          <button
            className={activeTab === "hinh_anh" ? "active" : ""}
            type="button"
            role="tab"
            aria-selected={activeTab === "hinh_anh"}
            onClick={() => changeTab("hinh_anh")}
          >
            <ImageIcon size={17} /> Hình ảnh ({imageCount})
          </button>
          <button
            className={activeTab === "video" ? "active" : ""}
            type="button"
            role="tab"
            aria-selected={activeTab === "video"}
            onClick={() => changeTab("video")}
          >
            <Play size={16} fill="currentColor" /> Video ({videoCount})
          </button>
        </div>
        <button
          className="artisan-media-upload-button"
          type="button"
          disabled={uploading}
          onClick={() => uploadInputRef.current?.click()}
        >
          <CloudUpload size={17} />
          {uploading ? "Đang tải lên..." : "Tải lên ảnh/video"}
        </button>
        <input
          ref={uploadInputRef}
          className="artisan-media-file-input"
          type="file"
          accept={activeTab === "hinh_anh" ? "image/jpeg,image/png,image/webp" : "video/mp4,video/quicktime,video/webm"}
          onChange={handleUpload}
        />
      </section>

      <section className="artisan-media-filter-bar" aria-label="Tìm kiếm và lọc tư liệu">
        <label className="artisan-media-search">
          <Search size={17} />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
            placeholder={`Tìm kiếm ${activeTab === "hinh_anh" ? "hình ảnh" : "video"}...`}
            aria-label="Tìm kiếm trong thư viện"
          />
        </label>
        <label className="artisan-media-select">
          <span className="sr-only">Lọc theo danh mục</span>
          <select
            value={categoryFilter}
            onChange={(event) => {
              setCategoryFilter(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
          <ChevronDown size={15} />
        </label>
        <label className="artisan-media-select artisan-media-sort">
          <span className="sr-only">Sắp xếp theo thời gian tải lên</span>
          <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
            <option value="newest">Thời gian tải lên: mới nhất</option>
            <option value="oldest">Thời gian tải lên: cũ nhất</option>
          </select>
          <ChevronDown size={15} />
        </label>
        <div className="artisan-media-view-toggle" role="group" aria-label="Kiểu hiển thị">
          <button
            className={viewMode === "grid" ? "active" : ""}
            type="button"
            aria-label="Hiển thị dạng lưới"
            aria-pressed={viewMode === "grid"}
            onClick={() => setViewMode("grid")}
          >
            <Grid2X2 size={17} />
          </button>
          <button
            className={viewMode === "list" ? "active" : ""}
            type="button"
            aria-label="Hiển thị dạng danh sách"
            aria-pressed={viewMode === "list"}
            onClick={() => setViewMode("list")}
          >
            <List size={18} />
          </button>
        </div>
      </section>

      {errorMessage ? (
        <div className="artisan-media-state artisan-media-error" role="alert">
          <strong>Không tải được thư viện</strong>
          <span>{errorMessage}</span>
        </div>
      ) : loading ? (
        <div className="artisan-media-state" role="status">Đang tải thư viện tư liệu...</div>
      ) : pageMedia.length ? (
        <section className={`artisan-media-grid ${viewMode}`} aria-label={activeTab === "hinh_anh" ? "Hình ảnh nghệ nhân" : "Video nghệ nhân"}>
          {pageMedia.map((item) => (
            <article className="artisan-media-card" key={`${item.type}-${item.id}`}>
              <MediaPreview media={item} onOpen={() => setSelectedMedia(item)} compact={viewMode === "list"} />
              <div className="artisan-media-card-content">
                <span className="artisan-media-category">{item.category || "Tư liệu nghệ nhân"}</span>
                <h3>{mediaTitle(item)}</h3>
                <div className="artisan-media-card-meta">
                  <span><CalendarDays size={14} />{formatUploadDate(item.uploaded_at)}</span>
                  <button type="button" aria-label={`Xem ${mediaTitle(item)}`} onClick={() => setSelectedMedia(item)}>
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="artisan-media-state">
          {activeTab === "hinh_anh" ? <ImageIcon size={28} /> : <Video size={28} />}
          <strong>
            {search || categoryFilter !== "all"
              ? "Không tìm thấy tư liệu phù hợp"
              : `Chưa có ${activeTab === "hinh_anh" ? "hình ảnh" : "video"} trong thư viện`}
          </strong>
          <span>
            {search || categoryFilter !== "all"
              ? "Thử đổi từ khóa hoặc danh mục để xem thêm."
              : "Tải lên tư liệu để lưu giữ khoảnh khắc về nghề truyền thống của bạn."}
          </span>
        </div>
      )}

      {!loading && !errorMessage && (
        <footer className="artisan-media-pagination">
          <span>
            Hiển thị {filteredMedia.length ? (currentPage - 1) * pageSize + 1 : 0} – {Math.min(currentPage * pageSize, filteredMedia.length)}
            {" "}trong tổng số {filteredMedia.length} kết quả
          </span>
          <nav aria-label="Phân trang thư viện">
            <button
              type="button"
              aria-label="Trang trước"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            >
              <ChevronLeft size={17} />
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
              <button
                type="button"
                className={page === currentPage ? "active" : ""}
                aria-current={page === currentPage ? "page" : undefined}
                key={page}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              aria-label="Trang sau"
              disabled={currentPage === pageCount}
              onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
            >
              <ChevronRight size={17} />
            </button>
          </nav>
        </footer>
      )}

      {selectedMedia && (
        <div
          className="artisan-media-viewer-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedMedia(null);
          }}
        >
          <section className="artisan-media-viewer" role="dialog" aria-modal="true" aria-labelledby="artisan-media-viewer-title">
            <header>
              <div>
                <span>{selectedMedia.category || "Tư liệu nghệ nhân"}</span>
                <h2 id="artisan-media-viewer-title">{mediaTitle(selectedMedia)}</h2>
              </div>
              <button type="button" aria-label="Đóng" onClick={() => setSelectedMedia(null)}><X size={20} /></button>
            </header>
            {selectedMedia.type === "video" ? (
              <video src={selectedMedia.url} controls autoPlay preload="metadata" />
            ) : (
              <img src={selectedMedia.url} alt={mediaTitle(selectedMedia)} />
            )}
            <p><CalendarDays size={15} />Tải lên ngày {formatUploadDate(selectedMedia.uploaded_at)}</p>
          </section>
        </div>
      )}
    </main>
  );
}
