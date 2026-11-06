import { useState } from "react";
import {
  ArrowRight,
  Bookmark,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Compass,
  Heart,
  Image,
  Landmark,
  MapPin,
  Package,
  Share2,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const tabs = [
  ["Giới thiệu", Compass],
  ["Lịch sử hình thành", Clock3],
  ["Nghề truyền thống", Landmark],
  ["Sản phẩm tiêu biểu", Package],
  ["Hoạt động trải nghiệm", CalendarDays],
  ["Hình ảnh & Video", Image],
  ["Bản đồ", MapPin],
];

function VillageMap({ village }) {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(village.location || village.place)}`;
  return (
    <a className="tourist-village-map" href={mapUrl} target="_blank" rel="noreferrer">
      <span><MapPin size={31} fill="currentColor" /></span>
      <strong>{village.title}</strong>
      <small>Mở vị trí trên Google Maps <ArrowRight size={13} /></small>
    </a>
  );
}

function VillageProducts({ products }) {
  if (!products.length) return <p className="tourist-village-tab-empty">Sản phẩm của làng nghề đang được cập nhật.</p>;
  return (
    <div className="tourist-village-products-grid">
      {products.map((product) => (
        <Link to={`/tourist/product/${product.id}`} key={product.id}>
          <img src={product.image} alt={product.title} loading="lazy" />
          <span>{product.category}</span>
          <strong>{product.title}</strong>
        </Link>
      ))}
    </div>
  );
}

function VillageActivities({ activities }) {
  if (!activities.length) return <p className="tourist-village-tab-empty">Hoạt động trải nghiệm tại làng đang được cập nhật.</p>;
  return (
    <div className="tourist-village-activities-grid">
      {activities.map((activity) => (
        <Link to={`/tourist/activity/${activity.id}`} key={activity.id}>
          <img src={activity.image} alt={activity.title} loading="lazy" />
          <strong>{activity.title}</strong>
          <span><MapPin size={13} /> {activity.place}</span>
          <span><CalendarDays size={13} /> {activity.schedule || activity.duration}</span>
          <small>Xem hoạt động <ArrowRight size={13} /></small>
        </Link>
      ))}
    </div>
  );
}

export default function TouristVillageDetail({ village, artisans, products, activities, favoriteIds, onFavorite, onNotice }) {
  const [activeTab, setActiveTab] = useState("Giới thiệu");
  const [photo, setPhoto] = useState(0);

  if (!village) {
    return (
      <div className="tourist-village-not-found">
        <h1>Không tìm thấy làng nghề</h1>
        <p>Làng nghề có thể đã được cập nhật hoặc đường dẫn không chính xác.</p>
        <Link to="/tourist/crafts">Quay lại danh sách làng nghề <ArrowRight size={15} /></Link>
      </div>
    );
  }

  const saved = favoriteIds.includes(village.id);
  const locationName = village.location || village.place;
  const gallery = village.gallery?.length
    ? village.gallery
    : [village.image, ...(village.featuredImage ? [village.featuredImage] : []), ...artisans.slice(0, 3).map((artisan) => artisan.image)];
  const villageProducts = products.filter((product) => product.craftId === village.id);
  const placeTerm = locationName.split(",")[0].toLocaleLowerCase("vi");
  const villageArtisans = artisans.filter((artisan) =>
    `${artisan.place} ${artisan.craft}`.toLocaleLowerCase("vi").includes(placeTerm)
    || (village.category === "Gốm sứ" && artisan.craft.toLocaleLowerCase("vi").includes("gốm")),
  );
  const villageActivities = activities.filter((activity) =>
    `${activity.title} ${activity.place}`.toLocaleLowerCase("vi").includes(placeTerm)
    || activity.title.toLocaleLowerCase("vi").includes(village.category.toLocaleLowerCase("vi").split(" ")[0]),
  );
  const shareVillage = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      onNotice("Đã sao chép liên kết làng nghề.");
    } catch {
      onNotice("Không thể sao chép liên kết. Vui lòng thử lại.");
    }
  };

  return (
    <div className="tourist-village-detail-page">
      <div className="tourist-village-breadcrumb">
        <Link to="/tourist">Trang chủ</Link><span>›</span><Link to="/tourist/crafts">Làng nghề</Link><span>›</span>{village.title}
      </div>

      <section className="tourist-village-detail-hero" style={{ "--village-hero-image": `url("${village.featuredImage || village.image}")` }}>
        <div className="tourist-village-detail-hero-copy">
          <span className="tourist-village-detail-rating"><Star size={17} fill="currentColor" /> {village.rating || "4.8"}/5 <small>({village.reviews || "860"} đánh giá)</small></span>
          <h1>{village.title}</h1>
          <p>{village.tagline || "Tinh hoa nghề Việt, lưu giữ qua bao thế hệ"}</p>
          <div><span><MapPin size={16} /> {locationName}</span><span><Landmark size={17} /> {village.history || "Di sản nghề truyền thống"}</span></div>
        </div>
        <div className="tourist-village-detail-actions">
          <button type="button" className={saved ? "is-saved" : ""} onClick={() => onFavorite(village)}><Heart size={16} fill={saved ? "currentColor" : "none"} /> {saved ? "Đã lưu yêu thích" : "Lưu vào yêu thích"}</button>
          <Link to="/tourist/activities"><CalendarDays size={16} /> Khám phá hoạt động</Link>
          <button type="button" onClick={shareVillage}><Share2 size={16} /> Chia sẻ</button>
        </div>
      </section>

      <nav className="tourist-village-tabs" aria-label="Thông tin làng nghề" role="tablist">
        {tabs.map(([label, Icon]) => (
          <button type="button" role="tab" aria-selected={activeTab === label} className={activeTab === label ? "active" : ""} key={label} onClick={() => setActiveTab(label)}>
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
                    <span className="tourist-village-eyebrow">NÉT ĐẸP DI SẢN</span>
                    <h2><span aria-hidden="true">❧</span> Giới thiệu chung</h2>
                    <p>{village.description}</p>
                    <p>{village.introduction || `${village.title} là nơi những người thợ gìn giữ kỹ thuật thủ công và tri thức nghề được truyền lại qua nhiều thế hệ. Mỗi sản phẩm mang dấu ấn của vùng đất, nguyên liệu bản địa và sự khéo léo của nghệ nhân.`}</p>
                    <Link to="/tourist/stories" className="tourist-village-primary-link">Tìm hiểu thêm <ArrowRight size={14} /></Link>
                  </div>
                  <img src={village.featuredImage || village.image} alt={`Không gian ${village.title}`} loading="lazy" />
                </div>
                <div className="tourist-village-highlights">
                  <div>
                    <h3><Star size={18} fill="currentColor" /> Điểm nổi bật</h3>
                    <p><CheckCircle2 size={15} /> Nghề truyền thống được gìn giữ qua nhiều thế hệ</p>
                    <p><CheckCircle2 size={15} /> Sản phẩm thủ công mang bản sắc địa phương</p>
                    <p><CheckCircle2 size={15} /> Có cơ hội gặp gỡ nghệ nhân và trải nghiệm thực tế</p>
                    <p><CheckCircle2 size={15} /> Không gian văn hóa đậm dấu ấn vùng miền</p>
                  </div>
                  <div className="tourist-village-highlight-images">
                    {gallery.slice(0, 3).map((image, index) => <button type="button" key={`${image}-${index}`} onClick={() => { setPhoto(index); setActiveTab("Hình ảnh & Video"); }}><img src={image} alt={`Khoảnh khắc ${index + 1} tại ${village.title}`} loading="lazy" /></button>)}
                  </div>
                </div>
              </>
            )}
            {activeTab === "Lịch sử hình thành" && (
              <div className="tourist-village-history">
                <span className="tourist-village-eyebrow">DẤU ẤN THỜI GIAN</span>
                <h2><Clock3 size={21} /> Lịch sử hình thành</h2>
                <p>{village.historyDescription || village.description}</p>
                <p>{village.title} tiếp nối mạch nghề qua nhiều thế hệ. Những kỹ thuật, bí quyết chọn nguyên liệu và cách hoàn thiện sản phẩm được truyền dạy trong gia đình, cộng đồng làng nghề và vẫn được người thợ gìn giữ đến hôm nay.</p>
                <div className="tourist-village-history-note"><Landmark size={19} /><span><strong>Giá trị được trao truyền</strong><small>Tri thức nghề, phong tục địa phương và tinh thần sáng tạo của người Việt.</small></span></div>
              </div>
            )}
            {activeTab === "Nghề truyền thống" && (
              <div className="tourist-village-tradition">
                <span className="tourist-village-eyebrow">NGƯỜI GIỮ LỬA NGHỀ</span>
                <h2><Building2 size={21} /> Nghề {village.category}</h2>
                <p>{village.tradition || village.description}</p>
                <div className="tourist-village-artisan-grid">
                  {villageArtisans.length ? villageArtisans.map((artisan) => (
                    <Link to={`/tourist/artisan/${artisan.id}`} key={artisan.id}>
                      <img src={artisan.image} alt={artisan.name} loading="lazy" />
                      <span><strong>{artisan.name}</strong><small>{artisan.craft} · {artisan.place}</small></span>
                      <ArrowRight size={15} />
                    </Link>
                  )) : <p className="tourist-village-tab-empty">Thông tin nghệ nhân tại làng đang được cập nhật.</p>}
                </div>
              </div>
            )}
            {activeTab === "Sản phẩm tiêu biểu" && <VillageProducts products={villageProducts} />}
            {activeTab === "Hoạt động trải nghiệm" && <VillageActivities activities={villageActivities} />}
            {activeTab === "Hình ảnh & Video" && (
              <div className="tourist-village-gallery-panel">
                <div className="tourist-village-gallery-feature"><img src={gallery[photo] || gallery[0]} alt={`Hình ảnh ${village.title}`} /><span><Image size={15} /> Không gian làng nghề</span></div>
                <div className="tourist-village-gallery-thumbnails">{gallery.map((image, index) => <button type="button" key={`${image}-${index}`} className={photo === index ? "active" : ""} aria-label={`Xem ảnh ${index + 1}`} onClick={() => setPhoto(index)}><img src={image} alt="" loading="lazy" /></button>)}</div>
              </div>
            )}
            {activeTab === "Bản đồ" && <VillageMap village={village} />}
          </section>
          {activeTab !== "Sản phẩm tiêu biểu" && <VillageProducts products={villageProducts} />}
        </div>

        <aside className="tourist-village-detail-sidebar">
          <section className="tourist-village-info-card">
            <h2><MapPin size={19} fill="currentColor" /> Thông tin địa điểm</h2>
            <p><Building2 size={16} /><span><strong>Địa chỉ</strong>{locationName}</span></p>
            <p><Clock3 size={16} /><span><strong>Thời gian tham quan</strong>{village.visitingHours || "8:00 – 17:00 (hằng ngày)"}</span></p>
            <p><Compass size={16} /><span><strong>Cách di chuyển</strong>{village.transport || "Có thể di chuyển bằng ô tô hoặc xe máy"}</span></p>
            <VillageMap village={village} />
          </section>
          <section className="tourist-village-sidebar-activities">
            <div><h2><CalendarDays size={17} /> Các hoạt động tại làng nghề</h2><Link to="/tourist/activities">Xem tất cả <ArrowRight size={13} /></Link></div>
            {villageActivities.slice(0, 3).map((activity) => (
              <Link to={`/tourist/activity/${activity.id}`} key={activity.id}>
                <img src={activity.image} alt={activity.title} loading="lazy" />
                <strong>{activity.title}</strong>
              </Link>
            ))}
            {!villageActivities.length && <p>Hoạt động trải nghiệm sẽ sớm được cập nhật.</p>}
          </section>
          <section className="tourist-village-sidebar-artisans">
            <h2><Users size={17} /> Nghệ nhân tại làng</h2>
            {villageArtisans.slice(0, 2).map((artisan) => <Link to={`/tourist/artisan/${artisan.id}`} key={artisan.id}><img src={artisan.image} alt="" /><span><strong>{artisan.name}</strong><small>{artisan.craft}</small></span><ArrowRight size={14} /></Link>)}
          </section>
        </aside>
      </div>
      <div className="tourist-village-detail-footnote"><Bookmark size={15} /> Cùng du khách gìn giữ và lan tỏa tinh hoa làng nghề Việt Nam.</div>
    </div>
  );
}
