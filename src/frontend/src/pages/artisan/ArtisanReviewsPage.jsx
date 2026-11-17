import {
  ChevronLeft,
  ChevronRight,
  MessageSquareText,
  Search,
  Star,
  ThumbsUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import artisanProfileService, {
  getProfileImageUrl,
} from "../../services/artisanProfileService.js";
import "../../styles/ArtisanReviewsPage.css";

const pageSize = 6;

const targetLabels = {
  artisan: "Nghệ nhân",
  product: "Sản phẩm",
  activity: "Hoạt động trải nghiệm",
};

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("vi");
}

function formatReviewDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa rõ ngày";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function RatingStars({ rating, compact = false }) {
  return (
    <span
      className={`artisan-review-stars${compact ? " compact" : ""}`}
      aria-label={`${rating} trên 5 sao`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={compact ? 14 : 18}
          fill={index < rating ? "currentColor" : "none"}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export default function ArtisanReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [query, setQuery] = useState("");
  const [activeTarget, setActiveTarget] = useState("all");
  const [activeRating, setActiveRating] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let active = true;

    artisanProfileService.getReviews()
      .then((items) => {
        if (active) {
          setReviews(items.map((item) => ({
            ...item,
            visitorAvatar: item.visitorAvatar
              ? getProfileImageUrl(item.visitorAvatar)
              : "",
          })));
        }
      })
      .catch((error) => {
        if (active) setErrorMessage(error.message || "Không thể tải đánh giá.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const averageRating = reviews.length
    ? reviews.reduce((total, review) => total + Number(review.rating), 0) / reviews.length
    : 0;
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => Number(review.rating) === rating).length,
  }));
  const filteredReviews = useMemo(() => {
    const searchTerm = query.trim().toLocaleLowerCase("vi");
    return reviews
      .filter((review) => activeTarget === "all" || review.targetType === activeTarget)
      .filter((review) => activeRating === "all" || Number(review.rating) === Number(activeRating))
      .filter((review) => !searchTerm
        || `${review.visitorName} ${review.subject} ${review.comment}`
          .toLocaleLowerCase("vi")
          .includes(searchTerm))
      .sort((a, b) => {
        if (sortOrder === "highest") return Number(b.rating) - Number(a.rating);
        if (sortOrder === "lowest") return Number(a.rating) - Number(b.rating);
        const dateDifference = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return sortOrder === "oldest" ? -dateDifference : dateDifference;
      });
  }, [activeRating, activeTarget, query, reviews, sortOrder]);

  const pageCount = Math.max(1, Math.ceil(filteredReviews.length / pageSize));
  const visibleReviews = filteredReviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, pageCount));
  }, [pageCount]);

  const updateFilter = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  return (
    <main className="artisan-reviews-page">
      <section className="artisan-reviews-hero">
        <div className="artisan-reviews-hero-icon"><MessageSquareText size={24} /></div>
        <div>
          <span className="artisan-reviews-eyebrow">LẮNG NGHE ĐỂ GÌN GIỮ GIÁ TRỊ</span>
          <h1>Đánh giá &amp; nhận xét</h1>
          <p>Xem cảm nhận của du khách về bạn, sản phẩm và các hoạt động trải nghiệm.</p>
        </div>
      </section>

      <section className="artisan-reviews-overview" aria-label="Tổng quan đánh giá">
        <article className="artisan-review-summary-card">
          <span className="artisan-review-summary-label">ĐIỂM ĐÁNH GIÁ TRUNG BÌNH</span>
          <div className="artisan-review-average">
            <strong>{averageRating.toFixed(1)}</strong>
            <div>
              <RatingStars rating={Math.round(averageRating)} />
              <span>{reviews.length} đánh giá đã được duyệt</span>
            </div>
          </div>
          <div className="artisan-review-recommend"><ThumbsUp size={15} /> Phản hồi từ du khách</div>
        </article>

        <article className="artisan-review-distribution">
          <h2>Phân bố số sao</h2>
          {ratingDistribution.map(({ rating, count }) => (
            <div className="artisan-review-distribution-row" key={rating}>
              <span>{rating} <Star size={12} fill="currentColor" /></span>
              <div className="artisan-review-bar" aria-hidden="true">
                <i style={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }} />
              </div>
              <span>{count}</span>
            </div>
          ))}
        </article>
      </section>

      <section className="artisan-reviews-panel">
        <div className="artisan-reviews-panel-heading">
          <div>
            <h2>Nhận xét từ du khách</h2>
            <p>Đánh giá hiển thị sau khi được quản trị viên duyệt.</p>
          </div>
          <span className="artisan-reviews-count">{filteredReviews.length} nhận xét</span>
        </div>

        <div className="artisan-reviews-tabs" role="tablist" aria-label="Lọc theo nội dung được đánh giá">
          {[
            ["all", "Tất cả"],
            ["artisan", "Nghệ nhân"],
            ["product", "Sản phẩm"],
            ["activity", "Hoạt động"],
          ].map(([value, label]) => (
            <button
              key={value}
              className={activeTarget === value ? "active" : ""}
              type="button"
              role="tab"
              aria-selected={activeTarget === value}
              onClick={() => updateFilter(setActiveTarget, value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="artisan-reviews-toolbar">
          <label className="artisan-reviews-search">
            <Search size={17} aria-hidden="true" />
            <span className="sr-only">Tìm nhận xét</span>
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm theo du khách, nội dung, sản phẩm..."
            />
          </label>
          <label className="artisan-reviews-select">
            <span>Số sao</span>
            <select
              value={activeRating}
              onChange={(event) => updateFilter(setActiveRating, event.target.value)}
            >
              <option value="all">Tất cả</option>
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>{rating} sao</option>
              ))}
            </select>
          </label>
          <label className="artisan-reviews-select">
            <span>Sắp xếp</span>
            <select
              value={sortOrder}
              onChange={(event) => updateFilter(setSortOrder, event.target.value)}
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="highest">Điểm cao nhất</option>
              <option value="lowest">Điểm thấp nhất</option>
            </select>
          </label>
        </div>

        {loading ? (
          <div className="artisan-reviews-state">Đang tải đánh giá...</div>
        ) : errorMessage ? (
          <div className="artisan-reviews-state error" role="alert">{errorMessage}</div>
        ) : visibleReviews.length ? (
          <div className="artisan-review-list">
            {visibleReviews.map((review) => (
              <article className="artisan-review-card" key={review.id}>
                <div className="artisan-review-avatar">
                  {review.visitorAvatar
                    ? <img src={review.visitorAvatar} alt="" loading="lazy" />
                    : <span>{getInitials(review.visitorName) || "K"}</span>}
                </div>
                <div className="artisan-review-card-content">
                  <div className="artisan-review-card-heading">
                    <div>
                      <h3>{review.visitorName || "Du khách"}</h3>
                      <span className="artisan-review-date">{formatReviewDate(review.createdAt)}</span>
                    </div>
                    <RatingStars rating={Number(review.rating)} compact />
                  </div>
                  <div className="artisan-review-subject">
                    <span>{targetLabels[review.targetType] || "Đánh giá"}</span>
                    <strong>{review.subject}</strong>
                  </div>
                  <p className="artisan-review-comment">{review.comment || "Du khách không để lại nhận xét."}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="artisan-reviews-empty">
            <span><MessageSquareText size={23} /></span>
            <strong>{reviews.length ? "Không tìm thấy nhận xét phù hợp" : "Chưa có đánh giá nào"}</strong>
            <p>{reviews.length
              ? "Hãy thử thay đổi từ khóa hoặc bộ lọc."
              : "Đánh giá đã được duyệt về bạn, sản phẩm và hoạt động sẽ hiển thị tại đây."}</p>
          </div>
        )}

        {!loading && !errorMessage && filteredReviews.length > 0 && (
          <div className="artisan-reviews-pagination">
            <span>
              Hiển thị {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredReviews.length)}
              {" "}trên {filteredReviews.length} nhận xét
            </span>
            <div>
              <button
                type="button"
                aria-label="Trang trước"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
              >
                <ChevronLeft size={17} />
              </button>
              <strong>{currentPage} / {pageCount}</strong>
              <button
                type="button"
                aria-label="Trang sau"
                disabled={currentPage === pageCount}
                onClick={() => setCurrentPage((page) => page + 1)}
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
