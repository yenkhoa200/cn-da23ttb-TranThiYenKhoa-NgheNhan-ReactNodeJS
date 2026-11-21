import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Handshake,
  ImagePlus,
  Package,
  Plus,
  Sprout,
  Star,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/path.js";
import artisanExperienceService from "../../services/artisanExperienceService.js";
import artisanProfileService from "../../services/artisanProfileService.js";
import artisanStoryService from "../../services/artisanStoryService.js";
import productService from "../../services/productService.js";
import "../../styles/ArtisanDashboard.css";

const recentItemLimit = 5;

function getStatusLabel(status) {
  const labels = {
    da_dang: "Đã đăng",
    dang_mo: "Đang mở",
    nhap: "Bản nháp",
    draft: "Bản nháp",
    published: "Đang mở",
    cho_duyet: "Chờ duyệt",
    tam_ngung: "Tạm ngưng",
    bi_an: "Đã ẩn",
  };
  return labels[status] || status || "Chưa rõ";
}

function getTimestamp(value) {
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function formatRecentDate(value) {
  if (!value) return "Chưa có ngày cập nhật";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Chưa có ngày cập nhật"
    : date.toLocaleString("vi-VN");
}

const actions = [
  {
    label: "Thêm sản phẩm",
    description: "Giới thiệu tác phẩm thủ công",
    icon: Package,
    to: ROUTES.ARTISAN_ADD_PRODUCT,
  },
  {
    label: "Viết câu chuyện",
    description: "Kể về nghề và văn hóa của bạn",
    icon: BookOpen,
    to: ROUTES.ARTISAN_STORY,
  },
  {
    label: "Tạo trải nghiệm",
    description: "Kết nối du khách với nghề",
    icon: Handshake,
    to: ROUTES.ARTISAN_EXPERIENCES,
  },
  {
    label: "Tải hình ảnh, video",
    description: "Quản lý ảnh và video đã tải lên",
    icon: ImagePlus,
    to: ROUTES.ARTISAN_MEDIA,
  },
];

export default function ArtisanDashboard() {
  const [dashboardData, setDashboardData] = useState({
    products: [],
    stories: [],
    experiences: [],
    reviews: [],
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showAllRecent, setShowAllRecent] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      productService.getMine(),
      artisanStoryService.list(),
      artisanExperienceService.list(),
      artisanProfileService.getReviews(),
    ])
      .then(([products, stories, experiences, reviews]) => {
        if (!active) return;
        setDashboardData({ products, stories, experiences, reviews });
        setLoadError("");
      })
      .catch((error) => {
        if (active) setLoadError(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const recentItems = useMemo(() => [
    ...dashboardData.products.map((item) => ({
      id: item.id,
      type: "Sản phẩm",
      title: item.title,
      description: item.description || item.category,
      status: item.status,
      updatedAt: item.created_at,
      icon: Package,
      to: ROUTES.ARTISAN_ADD_PRODUCT,
    })),
    ...dashboardData.stories.map((item) => ({
      id: item.ma_nd,
      type: "Câu chuyện văn hóa",
      title: item.tieu_de,
      description: item.tom_tat || item.noi_dung_chi_tiet,
      status: item.trang_thai_kiem_duyet,
      updatedAt: item.ngay_cap_nhat || item.ngay_dang,
      icon: BookOpen,
      to: ROUTES.ARTISAN_STORY,
    })),
    ...dashboardData.experiences.map((item) => ({
      id: item.id,
      type: "Hoạt động trải nghiệm",
      title: item.title,
      description: item.description || item.location,
      status: item.status,
      updatedAt: item.created_at,
      icon: CalendarDays,
      to: ROUTES.ARTISAN_EXPERIENCES,
    })),
  ].sort((a, b) => getTimestamp(b.updatedAt) - getTimestamp(a.updatedAt)), [dashboardData]);

  const publishedProductCount = dashboardData.products.filter((item) => item.status === "da_dang").length;
  const publishedStoryCount = dashboardData.stories.filter((item) => item.trang_thai_kiem_duyet === "da_dang").length;
  const openExperienceCount = dashboardData.experiences.filter(
    (item) => item.status === "published" || item.status === "dang_mo",
  ).length;
  const stats = [
    {
      label: "Tổng số sản phẩm đã đăng",
      value: publishedProductCount,
      detail: "Đang hiển thị",
      icon: Package,
      tone: "terracotta",
    },
    {
      label: "Câu chuyện văn hóa",
      value: dashboardData.stories.length,
      detail: `${publishedStoryCount} đã đăng`,
      icon: BookOpen,
      tone: "green",
    },
    {
      label: "Hoạt động trải nghiệm",
      value: dashboardData.experiences.length,
      detail: `${openExperienceCount} đang mở`,
      icon: CalendarDays,
      tone: "terracotta",
    },
    {
      label: "Đánh giá và nhận xét",
      value: dashboardData.reviews.length,
      detail: "Đã được duyệt",
      icon: Star,
      tone: "green",
    },
  ];
  const visibleRecentItems = showAllRecent ? recentItems : recentItems.slice(0, recentItemLimit);

  return (
    <main className="artisan-dashboard-page">
      <section className="artisan-welcome">
        <div className="artisan-welcome-copy">
          <span className="artisan-eyebrow">GÌN GIỮ NGHỀ · LAN TỎA VĂN HÓA</span>
          <h2>Chào mừng Nghệ nhân trở lại!</h2>
          <p>
            “Cùng gìn giữ và lan tỏa giá trị văn hóa Việt”
          </p>
          <div className="artisan-welcome-actions">
            <Link className="artisan-primary-button" to={ROUTES.ARTISAN_STORY}>
              <UserRound size={15} />
              Chia sẻ câu chuyện của bạn
            </Link>
            <Link className="artisan-secondary-button" to={ROUTES.ARTISAN_PROFILE}>
              <BookOpen size={15} />
              Cập nhật hồ sơ
            </Link>
          </div>
        </div>
        <div className="artisan-welcome-landscape" aria-hidden="true" />
        <div className="artisan-welcome-image">
          <img
            src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=760&q=85"
            alt="Nghệ nhân đang làm việc tại xưởng thủ công"
          />
        </div>
      </section>

      <section className="artisan-stats-grid" aria-label="Tổng quan nội dung">
        {stats.map(({ label, value, detail, icon: Icon, tone }) => (
          <article className={`artisan-stat-card artisan-stat-${tone}`} key={label}>
            <span className="artisan-stat-icon"><Icon size={19} /></span>
            <div className="artisan-stat-copy">
              <span>{label}</span>
              <div><strong>{loading ? "—" : value}</strong><small>{loading ? "Đang tải" : detail}</small></div>
            </div>
          </article>
        ))}
      </section>

      <section className="artisan-dashboard-lower">
        <div className="artisan-dashboard-main-column">
          <section className="artisan-quick-actions">
            <div className="artisan-card-heading">
              <h2><Handshake size={17} />Bạn muốn chia sẻ điều gì?</h2>
              <Link to={ROUTES.ARTISAN_ADD_PRODUCT}>Xem tất cả <ChevronRight size={14} /></Link>
            </div>
            <div className="artisan-action-grid">
              {actions.map(({ label, description, icon: Icon, to, disabled }, index) => {
                const content = (
                  <>
                    <span className="artisan-action-icon"><Icon size={20} /></span>
                    <span className="artisan-action-copy">
                      <strong>{label}</strong>
                      <small>{description}</small>
                    </span>
                    {disabled && <span className="artisan-action-soon">Sắp có</span>}
                  </>
                );

                return disabled ? (
                  <div className={`artisan-action-card artisan-action-tone-${index + 1} artisan-action-disabled`} key={label} aria-disabled="true" title="Tính năng sẽ sớm được cập nhật">
                    {content}
                  </div>
                ) : (
                  <Link className={`artisan-action-card artisan-action-tone-${index + 1}`} key={label} to={to}>
                    {content}
                  </Link>
                );
              })}
            </div>
          </section>

          <article className="artisan-recent-card">
            <div className="artisan-card-heading">
              <h2><CalendarDays size={17} />Nội dung gần đây</h2>
              {recentItems.length > recentItemLimit && (
                <button
                  className="artisan-filter-button"
                  type="button"
                  aria-expanded={showAllRecent}
                  onClick={() => setShowAllRecent((showing) => !showing)}
                >
                  {showAllRecent ? "Thu gọn" : `Hiện tất cả (${recentItems.length})`}
                  {showAllRecent ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              )}
            </div>
            {loadError && <p className="artisan-dashboard-error" role="alert">{loadError}</p>}
            {loading ? (
              <p className="artisan-dashboard-message" role="status">Đang tải số liệu và nội dung...</p>
            ) : recentItems.length === 0 ? (
              <div className="artisan-empty-state">
                <span className="artisan-empty-illustration"><BookOpen size={36} /></span>
                <h3>Chưa có nội dung để hiển thị</h3>
                <p>Hãy bắt đầu đăng một sản phẩm, câu chuyện hoặc hoạt động mới nhé!</p>
                <Link className="artisan-primary-button" to={ROUTES.ARTISAN_ADD_PRODUCT}>
                  <Plus size={15} />
                  Thêm nội dung mới
                </Link>
              </div>
            ) : (
              <div className="artisan-recent-list">
                {visibleRecentItems.map(({ id, type, title, description, status, updatedAt, icon: Icon, to }) => (
                  <Link className="artisan-recent-item" to={to} key={`${type}-${id}`}>
                    <span className="artisan-recent-icon"><Icon size={17} /></span>
                    <span className="artisan-recent-copy">
                      <strong>{title || "Chưa có tiêu đề"}</strong>
                      <small>{type}{description ? ` · ${description}` : ""}</small>
                      <time dateTime={updatedAt || undefined}>{formatRecentDate(updatedAt)}</time>
                    </span>
                    <span className={`artisan-recent-status artisan-recent-status-${status}`}>
                      {getStatusLabel(status)}
                    </span>
                    <ChevronRight className="artisan-recent-chevron" size={15} />
                  </Link>
                ))}
              </div>
            )}
          </article>
        </div>

        <aside className="artisan-guide-card">
          <div className="artisan-guide-heading">
            <span className="artisan-guide-heading-icon"><Sprout size={18} /></span>
            <h2>Cùng bắt đầu chia sẻ</h2>
          </div>
          <p className="artisan-guide-intro">
            Những gợi ý nhỏ để đưa câu chuyện của bạn đến gần hơn với du khách.
          </p>
          <Link className="artisan-guide-item" to={ROUTES.ARTISAN_PROFILE}>
            <span className="artisan-guide-icon"><UserRound size={15} /></span>
            <span>
              <strong>Giới thiệu về bạn và nghề</strong>
              <small>Bổ sung thông tin để du khách hiểu thêm câu chuyện của bạn.</small>
            </span>
            <ChevronRight size={15} />
          </Link>
          <Link className="artisan-guide-item" to={ROUTES.ARTISAN_STORY}>
            <span className="artisan-guide-icon"><ImagePlus size={15} /></span>
            <span>
              <strong>Kể chuyện bằng hình ảnh</strong>
              <small>Chia sẻ đôi tay làm nghề, chất liệu và khoảnh khắc tại xưởng.</small>
            </span>
            <ChevronRight size={15} />
          </Link>
        </aside>
      </section>
    </main>
  );
}
