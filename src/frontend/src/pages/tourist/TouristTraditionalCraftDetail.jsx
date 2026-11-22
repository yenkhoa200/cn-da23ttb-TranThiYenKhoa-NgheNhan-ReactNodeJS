import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Compass,
  Heart,
  Landmark,
  MapPin,
  Share2,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const tabs = [
  ["Giới thiệu", Compass],
  ["Nguồn gốc", Clock3],
  ["Quy trình thực hiện", BookOpen],
  ["Giá trị văn hóa", Landmark],
  ["Địa phương & nghệ nhân", Users],
];

export default function TouristTraditionalCraftDetail({ craft, favoriteIds, onFavorite, onNotice }) {
  const [activeTab, setActiveTab] = useState("Giới thiệu");

  if (!craft) {
    return (
      <div className="tourist-village-not-found">
        <h1>Không tìm thấy nghề truyền thống</h1>
        <p>Nghề này có thể đã được cập nhật hoặc đường dẫn không chính xác.</p>
        <Link to="/tourist/traditional-crafts">Quay lại danh sách nghề <ArrowRight size={15} /></Link>
      </div>
    );
  }

  const saved = favoriteIds.includes(craft.id);
  const villages = craft.villages.split(",").map((village) => village.trim()).filter(Boolean);
  const shareCraft = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      onNotice("Đã sao chép liên kết nghề truyền thống.");
    } catch {
      onNotice("Không thể sao chép liên kết. Vui lòng thử lại.");
    }
  };

  return (
    <div className="tourist-village-detail-page tourist-traditional-detail-page">
      <div className="tourist-village-breadcrumb">
        <Link to="/tourist">Trang chủ</Link><span>›</span>
        <Link to="/tourist/traditional-crafts">Nghề truyền thống</Link><span>›</span>{craft.name}
      </div>

      <section
        className="tourist-village-detail-hero tourist-traditional-detail-hero"
        style={{ "--village-hero-image": `url("${craft.image}")` }}
      >
        <div className="tourist-village-detail-hero-copy">
          <span className="tourist-traditional-detail-label"><BookOpen size={15} /> DI SẢN NGHỀ VIỆT</span>
          <h1>{craft.name}</h1>
          <p>{craft.description || "Nghề thủ công lưu giữ tri thức và bản sắc văn hóa qua nhiều thế hệ."}</p>
          <div>
            {(craft.origin || craft.villages) && <span><MapPin size={16} /> {craft.origin || craft.villages}</span>}
            <span><Users size={16} /> {craft.artisanCount} nghệ nhân gìn giữ</span>
          </div>
        </div>
        <div className="tourist-village-detail-actions">
          <button type="button" className={saved ? "is-saved" : ""} onClick={() => onFavorite(craft)}>
            <Heart size={16} fill={saved ? "currentColor" : "none"} />
            {saved ? "Đã lưu yêu thích" : "Lưu vào yêu thích"}
          </button>
          <Link to="/tourist/activities"><CalendarDays size={16} /> Khám phá hoạt động</Link>
          <button type="button" onClick={shareCraft}><Share2 size={16} /> Chia sẻ</button>
        </div>
      </section>

      <nav className="tourist-village-tabs tourist-traditional-detail-tabs" aria-label="Thông tin nghề truyền thống" role="tablist">
        {tabs.map(([label, Icon]) => (
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === label}
            className={activeTab === label ? "active" : ""}
            key={label}
            onClick={() => setActiveTab(label)}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </nav>

      <div className="tourist-village-detail-layout">
        <div className="tourist-village-detail-main">
          <section className="tourist-village-tab-panel" role="tabpanel">
            {activeTab === "Giới thiệu" && (
              <>
                <div className="tourist-village-intro">
                  <div>
                    <span className="tourist-village-eyebrow">TINH HOA ĐƯỢC TRAO TRUYỀN</span>
                    <h2><span aria-hidden="true">❧</span> Giới thiệu nghề</h2>
                    <p>{craft.description || "Thông tin giới thiệu đang được nghệ nhân cập nhật."}</p>
                    {craft.origin && <p><strong>Nguồn gốc:</strong> {craft.origin}</p>}
                  </div>
                  <img src={craft.image} alt={craft.name} loading="lazy" />
                </div>
                <div className="tourist-village-highlights">
                  <div>
                    <h3><Landmark size={18} /> Nét đặc sắc</h3>
                    <p><CheckCircle2 size={15} /> Kỹ thuật thủ công được lưu truyền qua nhiều thế hệ</p>
                    <p><CheckCircle2 size={15} /> Gắn với bản sắc văn hóa và vùng đất Việt Nam</p>
                    <p><CheckCircle2 size={15} /> Được các nghệ nhân tiếp tục gìn giữ và phát triển</p>
                  </div>
                  <div className="tourist-traditional-detail-note">
                    <BookOpen size={27} />
                    <span><strong>Tri thức nghề</strong><small>{craft.technique || "Quy trình thực hiện đang được cập nhật."}</small></span>
                  </div>
                </div>
              </>
            )}
            {activeTab === "Nguồn gốc" && (
              <div className="tourist-village-history">
                <span className="tourist-village-eyebrow">DẤU ẤN THỜI GIAN</span>
                <h2><Clock3 size={21} /> Nguồn gốc nghề</h2>
                <p>{craft.origin || "Thông tin về nguồn gốc nghề đang được cập nhật."}</p>
                <div className="tourist-village-history-note">
                  <Landmark size={19} />
                  <span><strong>Không gian lưu giữ nghề</strong><small>{villages.length ? villages.join(", ") : "Địa phương gắn với nghề đang được cập nhật."}</small></span>
                </div>
              </div>
            )}
            {activeTab === "Quy trình thực hiện" && (
              <div className="tourist-village-tradition">
                <span className="tourist-village-eyebrow">BÍ QUYẾT CỦA NGƯỜI THỢ</span>
                <h2><BookOpen size={21} /> Quy trình thực hiện</h2>
                <p>{craft.technique || "Quy trình thực hiện nghề đang được cập nhật."}</p>
              </div>
            )}
            {activeTab === "Giá trị văn hóa" && (
              <div className="tourist-traditional-detail-values">
                <span className="tourist-village-eyebrow">BẢN SẮC VÀ DI SẢN</span>
                <h2><Landmark size={21} /> Giá trị văn hóa</h2>
                <p>{craft.culturalValue || "Giá trị văn hóa của nghề đang được cập nhật."}</p>
              </div>
            )}
            {activeTab === "Địa phương & nghệ nhân" && (
              <div className="tourist-village-tradition">
                <span className="tourist-village-eyebrow">CỘNG ĐỒNG GÌN GIỮ NGHỀ</span>
                <h2><Users size={21} /> Địa phương & nghệ nhân</h2>
                <p>{villages.length ? `Nghề được ghi nhận tại ${villages.join(", ")}.` : "Thông tin địa phương đang được cập nhật."}</p>
                <div className="tourist-traditional-detail-stats">
                  <span><Users size={18} /><strong>{craft.artisanCount}</strong><small>Nghệ nhân đang gìn giữ nghề</small></span>
                  <span><CalendarDays size={18} /><strong>{craft.activityCount}</strong><small>Hoạt động trải nghiệm đang mở</small></span>
                </div>
                <Link className="tourist-village-primary-link" to="/tourist/artisans">Gặp gỡ nghệ nhân <ArrowRight size={14} /></Link>
              </div>
            )}
          </section>
          {activeTab !== "Giá trị văn hóa" && (
            <section className="tourist-traditional-detail-value-card">
              <span className="tourist-village-eyebrow">GIÁ TRỊ VĂN HÓA</span>
              <h2><Landmark size={18} /> Ý nghĩa của nghề</h2>
              <p>{craft.culturalValue || "Giá trị văn hóa đang được cập nhật."}</p>
            </section>
          )}
        </div>

        <aside className="tourist-village-detail-sidebar">
          <section className="tourist-village-info-card tourist-traditional-detail-info">
            <h2><BookOpen size={19} /> Thông tin nghề</h2>
            <p><MapPin size={16} /><span><strong>Nguồn gốc</strong>{craft.origin || "Đang cập nhật"}</span></p>
            <p><Users size={16} /><span><strong>Nghệ nhân gìn giữ</strong>{craft.artisanCount}</span></p>
            <p><CalendarDays size={16} /><span><strong>Hoạt động trải nghiệm</strong>{craft.activityCount}</span></p>
            <p><Compass size={16} /><span><strong>Làng nghề liên quan</strong>{villages.length ? villages.join(", ") : "Đang cập nhật"}</span></p>
          </section>
          <section className="tourist-village-sidebar-artisans tourist-traditional-detail-sidebar">
            <h2><Users size={17} /> Cùng khám phá</h2>
            <Link to="/tourist/artisans"><span><strong>Nghệ nhân</strong><small>Gặp gỡ những người gìn giữ nghề</small></span><ArrowRight size={14} /></Link>
            <Link to="/tourist/activities"><span><strong>Hoạt động trải nghiệm</strong><small>Thử sức với nghề thủ công</small></span><ArrowRight size={14} /></Link>
          </section>
        </aside>
      </div>
      <div className="tourist-village-detail-footnote"><BookOpen size={15} /> Cùng cộng đồng gìn giữ và lan tỏa tinh hoa nghề Việt Nam.</div>
    </div>
  );
}
