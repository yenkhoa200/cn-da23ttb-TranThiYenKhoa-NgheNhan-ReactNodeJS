import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  Flag,
  Leaf,
  Package,
  Star,
  UserCheck,
  Users,
} from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import "../../styles/AdminDashboard.css";

const metrics = [
  { label: "Tổng số tài khoản", value: "2.486", change: "+12%", icon: Users, tone: "amber", line: "0,25 40,21 58,15 75,18 100,4" },
  { label: "Nghệ nhân", value: "186", change: "+8%", icon: UserCheck, tone: "clay", line: "0,22 20,19 42,21 62,10 82,13 100,3" },
  { label: "Du khách", value: "2.938", change: "+15%", icon: CircleUserRound, tone: "moss", line: "0,21 18,13 35,18 53,7 73,11 100,2" },
  { label: "Nghề truyền thống", value: "48", change: "+2%", icon: Leaf, tone: "moss", line: "0,23 18,16 36,20 55,11 77,14 100,3" },
  { label: "Sản phẩm", value: "1.352", change: "+10%", icon: Package, tone: "olive", line: "0,20 20,22 38,11 57,16 77,7 100,2" },
  { label: "Câu chuyện văn hóa", value: "238", change: "+6%", icon: BookOpen, tone: "orange", line: "0,23 17,17 40,20 57,10 79,13 100,3" },
  { label: "Hoạt động trải nghiệm", value: "74", change: "+9%", icon: CalendarDays, tone: "moss", line: "0,21 20,18 40,21 58,12 78,15 100,3" },
  { label: "Đánh giá", value: "896", change: "+14%", icon: Star, tone: "amber", line: "0,24 18,16 37,18 57,8 78,12 100,2" },
];

const monthlyRegistrations = [
  ["T1", 23, 18], ["T2", 28, 21], ["T3", 35, 24], ["T4", 31, 25],
  ["T5", 38, 27], ["T6", 42, 30], ["T7", 39, 29], ["T8", 48, 34],
  ["T9", 53, 38], ["T10", 50, 37], ["T11", 55, 39], ["T12", 62, 43],
];

const popularCrafts = [
  { name: "Gốm sứ Bát Tràng", score: 72 },
  { name: "Lụa Vạn Phúc", score: 61 },
  { name: "Tranh Đông Hồ", score: 53 },
  { name: "Chiếu cói Kim Sơn", score: 45 },
];

function initials(name = "") {
  return name.split(" ").slice(-2).map((part) => part[0]).join("");
}

export default function AdminOverviewPage() {
  const { records } = useOutletContext();
  const artisans = records.artisans.slice(0, 3);
  const pendingContent = [
    ...records.stories.filter((item) => item.status === "Chờ duyệt").map((item) => ({ ...item, category: "Bài viết" })),
    ...records.products.filter((item) => item.status === "Chờ duyệt").map((item) => ({ ...item, category: "Sản phẩm" })),
    ...records.experiences.filter((item) => item.status === "Chờ duyệt").map((item) => ({ ...item, category: "Hoạt động" })),
  ].slice(0, 3);

  return (
    <div className="admin-overview">
      <section className="admin-welcome">
        <div className="admin-welcome-copy">
          <span className="admin-eyebrow"><Leaf size={13} /> CHÀO MỪNG BẠN ĐẾN VỚI TINH HOA VIỆT</span>
          <h2><span className="admin-welcome-seal"><Leaf size={14} /></span>Cùng gìn giữ và lan tỏa giá trị văn hóa Việt</h2>
          <p>Kết nối du khách, nghệ nhân và làng nghề truyền thống</p>
        </div>
        <img className="admin-welcome-art" src="/admin-landscape.svg" alt="" aria-hidden="true" />
      </section>

      <section className="admin-metrics" aria-label="Thống kê tổng quan">
        {metrics.map(({ label, value, change, icon: Icon, tone, line }) => (
          <article className="admin-metric-card" key={label}>
            <span className={`admin-metric-icon ${tone}`}><Icon size={20} /></span>
            <div className="admin-metric-copy">
              <span className="admin-metric-label">{label}</span>
              <strong>{value}</strong>
              <small>↑ {change}</small>
            </div>
            <svg className="admin-metric-sparkline" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
              <polyline points={line} />
            </svg>
          </article>
        ))}
      </section>

      <section className="admin-overview-charts">
        <article className="admin-panel admin-registration-panel">
          <div className="admin-panel-heading">
            <h3><span className="admin-heading-icon"><Users size={15} /></span>Thống kê đăng ký theo tháng</h3>
            <button className="admin-subtle-button" type="button">12 tháng gần nhất <ChevronDown size={13} /></button>
          </div>
          <div className="admin-registration-chart" role="img" aria-label="Biểu đồ đăng ký hàng tháng, phân chia du khách và nghệ nhân">
            <div className="admin-chart-y-labels"><span>1.600</span><span>1.200</span><span>800</span><span>400</span><span>0</span></div>
            <div className="admin-registration-plot">
              <div className="admin-chart-legend"><span><i className="visitor-dot" />Du khách</span><span><i className="artisan-dot" />Nghệ nhân</span></div>
              <div className="admin-chart-gridlines"><i /><i /><i /><i /><i /></div>
              <div className="admin-month-columns">
                {monthlyRegistrations.map(([month, visitors, artisans]) => (
                  <div className="admin-month-column" key={month}>
                    <span className="admin-stacked-bar" style={{ "--visitor-height": `${visitors}%`, "--artisan-height": `${artisans}%` }}><i /><b /></span>
                    <small>{month}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article className="admin-panel admin-craft-panel">
          <div className="admin-panel-heading">
            <h3><span className="admin-heading-icon gold"><Star size={15} /></span>Top nghề được quan tâm</h3>
            <button className="admin-subtle-button" type="button">Tháng này <ChevronDown size={13} /></button>
          </div>
          <div className="admin-popular-list">
            {popularCrafts.map((craft, index) => {
              const image = records.crafts[index]?.image;
              return (
                <div className="admin-popular-row" key={craft.name}>
                  {image ? <img src={image} alt="" loading="lazy" /> : <span className="admin-popular-placeholder"><Leaf size={15} /></span>}
                  <strong>{craft.name}</strong>
                  <span className="admin-popular-track"><i style={{ width: `${craft.score}%` }} /></span>
                  <b>{craft.score}%</b>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="admin-overview-lists admin-overview-three-columns">
        <article className="admin-panel">
          <div className="admin-panel-heading">
            <h3><span className="admin-heading-icon"><Users size={15} /></span>Nghệ nhân mới đăng ký</h3>
            <Link to="/admin/artisans">Xem tất cả <ChevronRight size={13} /></Link>
          </div>
          <div className="admin-compact-list admin-artisan-list">
            {artisans.map((person, index) => {
              const account = records.accounts.find((item) => item.name === person.name);
              return (
                <div className="admin-compact-row" key={person.id}>
                  <span className={`admin-avatar admin-avatar-${index + 1}`}>{initials(person.name)}</span>
                  <div><strong>{person.name}</strong><small>{person.village} · {person.location}</small></div>
                  <time>{account?.created || "Gần đây"}</time>
                  <span className={`admin-status ${person.verification === "Đã xác minh" ? "success" : "pending"}`}>{person.verification}</span>
                </div>
              );
            })}
          </div>
        </article>

        <article className="admin-panel">
          <div className="admin-panel-heading">
            <h3>Nội dung chờ kiểm duyệt</h3>
            <Link to="/admin/reports">Xem tất cả <ChevronRight size={13} /></Link>
          </div>
          <div className="admin-compact-list admin-pending-list">
            {pendingContent.map((item, index) => {
              const image = item.image || records.crafts[index]?.image;
              return (
                <div className="admin-compact-row" key={`${item.category}-${item.id}`}>
                  {image ? <img className="admin-content-thumb" src={image} alt="" loading="lazy" /> : <span className="admin-compact-icon"><Flag size={15} /></span>}
                  <div><strong>{item.category}: “{item.name}”</strong><small>Đăng bởi: {item.artisan || "Nghệ nhân"} · Gần đây</small></div>
                  <span className="admin-status pending">Chờ duyệt</span>
                </div>
              );
            })}
            {pendingContent.length === 0 && <p className="admin-overview-empty">Không có nội dung chờ duyệt.</p>}
          </div>
        </article>

        <article className="admin-panel">
          <div className="admin-panel-heading">
            <h3><span className="admin-heading-icon gold"><Star size={15} /></span>Đánh giá mới nhất</h3>
            <Link to="/admin/reviews">Xem tất cả <ChevronRight size={13} /></Link>
          </div>
          <div className="admin-review-list admin-latest-reviews">
            {records.reviews.slice(0, 3).map((review, index) => (
              <div className="admin-review-row" key={review.id}>
                <span className={`admin-avatar admin-avatar-${index + 1}`}>{initials(review.visitor)}</span>
                <div className="admin-latest-review-copy">
                  <div className="admin-review-heading"><strong>{review.visitor}</strong><span className="admin-stars">{"★".repeat(Number.parseInt(review.rating, 10) || 0)}{"☆".repeat(5 - (Number.parseInt(review.rating, 10) || 0))}</span></div>
                  <p>{review.comment}</p>
                </div>
                <small>{index === 0 ? "2 giờ trước" : `${index + 2} giờ trước`}</small>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
