import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Handshake,
  ImagePlus,
  Package,
  Plus,
  Sprout,
  Star,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/path.js";
import "../../styles/ArtisanDashboard.css";

const stats = [
  { label: "Tổng số sản phẩm đã đăng", value: "24", change: "+2", icon: Package, tone: "terracotta" },
  { label: "Câu chuyện văn hóa", value: "8", change: "+1", icon: BookOpen, tone: "green" },
  { label: "Hoạt động trải nghiệm", value: "3", change: "+1", icon: CalendarDays, tone: "terracotta" },
  { label: "Đánh giá và nhận xét", value: "45", change: "+5", icon: Star, tone: "green" },
];

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
    description: "Lưu lại những khoảnh khắc nghề",
    icon: ImagePlus,
    disabled: true,
  },
];

export default function ArtisanDashboard() {
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
            <Link className="artisan-primary-button" to={ROUTES.ARTISAN_PROFILE}>
              <UserRound size={15} />
              Cập nhật hồ sơ
            </Link>
            <Link className="artisan-secondary-button" to={ROUTES.ARTISAN_STORY}>
              <BookOpen size={15} />
              Chia sẻ câu chuyện của bạn
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
        {stats.map(({ label, value, change, icon: Icon, tone }) => (
          <article className={`artisan-stat-card artisan-stat-${tone}`} key={label}>
            <span className="artisan-stat-icon"><Icon size={19} /></span>
            <div className="artisan-stat-copy">
              <span>{label}</span>
              <div><strong>{value}</strong><small>↑ {change}</small></div>
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
              <Link className="artisan-filter-button" to={ROUTES.ARTISAN_ADD_PRODUCT}>
                Tất cả nội dung <ChevronRight size={14} />
              </Link>
            </div>
            <div className="artisan-empty-state">
              <span className="artisan-empty-illustration"><BookOpen size={36} /></span>
              <h3>Chưa có nội dung để hiển thị</h3>
              <p>
                Hãy bắt đầu đăng một sản phẩm, câu chuyện hoặc hoạt động mới nhé!
              </p>
              <Link className="artisan-primary-button" to={ROUTES.ARTISAN_ADD_PRODUCT}>
                <Plus size={15} />
                Thêm nội dung mới
              </Link>
            </div>
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
