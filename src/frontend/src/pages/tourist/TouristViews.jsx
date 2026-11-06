import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Heart,
  MapPin,
  MessageCircle,
  Play,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/path.js";
import { ArtisanDetail } from "./TouristArtisanDetail.jsx";
import { ArtisanListing } from "./TouristArtisanPages.jsx";
import { ActivityDetail } from "./TouristExperienceDetail.jsx";
import { ActivityListing } from "./TouristExperiencePages.jsx";
import TouristCulturePages from "./TouristCulturePages.jsx";
import TouristProductDetail from "./TouristProductDetail.jsx";
import TouristProductPages from "./TouristProductPages.jsx";

const viewTitles = {
  search: ["Tìm kiếm", "Khám phá nghệ nhân, làng nghề, sản phẩm và hoạt động."],
  artisans: ["Nghệ nhân", "Gặp gỡ những người đang gìn giữ tinh hoa nghề Việt."],
  crafts: ["Làng nghề & sản phẩm", "Khám phá nghề truyền thống và câu chuyện phía sau mỗi sản phẩm."],
  products: ["Sản phẩm thủ công", "Những sản phẩm mang theo kỹ thuật và bản sắc của làng nghề Việt."],
  stories: ["Câu chuyện văn hóa", "Những tri thức và giá trị được trao truyền qua nhiều thế hệ."],
  activities: ["Hoạt động trải nghiệm", "Tìm một trải nghiệm chân thực cùng nghệ nhân địa phương."],
  gallery: ["Thư viện hình ảnh & video", "Ngắm nhìn người thợ, sản phẩm và nhịp sống làng nghề."],
  favorites: ["Nội dung yêu thích", "Những nghệ nhân, câu chuyện và trải nghiệm bạn đã lưu."],
  reviews: ["Đánh giá & nhận xét", "Chia sẻ cảm nhận để cùng lan tỏa những trải nghiệm đáng nhớ."],
  profile: ["Thông tin cá nhân", "Quản lý thông tin và hoạt động của tài khoản du khách."],
};

const itemRoute = (item) => {
  if (item.name) return `/tourist/artisan/${item.id}`;
  if (item.id?.startsWith("craft-")) return `/tourist/craft/${item.id}`;
  if (item.id?.startsWith("product-")) return `/tourist/product/${item.id}`;
  if (item.id?.startsWith("story-")) return `/tourist/story/${item.id}`;
  if (item.id?.startsWith("activity-")) return `/tourist/activity/${item.id}`;
  return `/tourist/${item.type === "Video" ? "video" : "image"}/${encodeURIComponent(item.title)}`;
};

function PageHeading({ title, description, backTo = ROUTES.TOURIST }) {
  return (
    <div className="tourist-view-heading">
      <div>
        <div className="tourist-breadcrumb"><Link to={ROUTES.TOURIST}>Trang chủ</Link><span>›</span>{title}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <Link className="tourist-back-link" to={backTo}><ArrowLeft size={15} /> Trang trước</Link>
    </div>
  );
}

function ResultCard({ item, favoriteIds, onFavorite, variant = "default" }) {
  const isSaved = favoriteIds.includes(item.id);
  const title = item.name || item.title;
  const subtitle = item.craft || item.category || item.place;
  return (
    <article className={`tourist-result-card tourist-result-${variant}`}>
      <Link className="tourist-result-image" to={itemRoute(item)}>
        <img src={item.image} alt={title} loading="lazy" />
        {item.type === "Video" && <span className="tourist-result-play"><Play size={16} fill="currentColor" /></span>}
      </Link>
      <button className={`tourist-favorite tourist-result-heart ${isSaved ? "is-saved" : ""}`} type="button" aria-label={isSaved ? "Bỏ yêu thích" : "Lưu yêu thích"} onClick={() => onFavorite(item)}>
        <Heart size={16} fill={isSaved ? "currentColor" : "none"} />
      </button>
      <div className="tourist-result-content">
        {item.rating && <div className="tourist-rating"><Star size={13} fill="currentColor" /> {item.rating} <span>({item.reviews} đánh giá)</span></div>}
        {item.category && <span className="tourist-result-category">{item.category}</span>}
        <Link className="tourist-result-title" to={itemRoute(item)}>{title}</Link>
        {subtitle && <span className="tourist-result-subtitle">{subtitle}</span>}
        {item.place && <span className="tourist-location"><MapPin size={13} /> {item.place}</span>}
        <Link className="tourist-text-button" to={itemRoute(item)}>Khám phá <ArrowRight size={14} /></Link>
      </div>
    </article>
  );
}

function ResultsGrid({ items, favoriteIds, onFavorite, emptyText, variant }) {
  if (!items.length) return <p className="tourist-empty">{emptyText}</p>;
  return (
    <div className={`tourist-results-grid tourist-results-${variant || "default"}-grid`}>
      {items.map((item) => <ResultCard key={item.id || item.title} item={item} favoriteIds={favoriteIds} onFavorite={onFavorite} variant={variant} />)}
    </div>
  );
}

function ListingView({ view, data, favoriteIds, onFavorite, query, onQuery, searchType, onSearchType, mediaType, onMediaType, onOpenMedia }) {
  const [title, description] = viewTitles[view];
  const datasets = {
    artisans: data.artisans,
    crafts: data.crafts,
    products: data.products,
    stories: data.stories,
    activities: data.activities,
    favorites: data.savedItems,
  };
  const labels = {
    artisans: "Nghệ nhân",
    crafts: "Làng nghề",
    products: "Sản phẩm",
    stories: "Văn hóa",
    activities: "Hoạt động",
    favorites: "Đã lưu",
  };
  const resultSets = view === "search"
    ? [
        ["Tất cả", data.allItems],
        ["Nghệ nhân", data.artisans],
        ["Làng nghề", data.crafts],
        ["Câu chuyện", data.stories],
        ["Hoạt động", data.activities],
      ]
    : [[labels[view], datasets[view] || []]];
  const selectedItems = view === "favorites"
    ? data.savedItems
    : view === "search"
      ? resultSets.find(([label]) => label === searchType)?.[1] || data.allItems
      : datasets[view] || [];
  const visibleItems = selectedItems.filter((item) =>
    `${item.name || item.title} ${item.craft || ""} ${item.category || ""} ${item.place || ""}`
      .toLocaleLowerCase("vi")
      .includes(query.trim().toLocaleLowerCase("vi")),
  );
  const filteredMedia = data.mediaItems.filter((item) => mediaType === "Tất cả" || item.type === mediaType);

  return (
    <div className="tourist-view">
      <PageHeading title={title} description={description} />
      {view === "search" && (
        <div className="tourist-search-view-box">
          <label className="tourist-search-box">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Nhập từ khóa bạn muốn khám phá..." aria-label="Nhập từ khóa tìm kiếm" />
            {query && <button type="button" onClick={() => onQuery("")} aria-label="Xóa tìm kiếm">×</button>}
          </label>
        </div>
      )}
      {view === "gallery" ? (
        <>
          <div className="tourist-view-filters">
            {["Tất cả", "Hình ảnh", "Video"].map((filter) => <button key={filter} className={mediaType === filter ? "active" : ""} onClick={() => onMediaType(filter)} type="button">{filter}</button>)}
            <span>{filteredMedia.length} nội dung</span>
          </div>
          <div className="tourist-gallery-grid tourist-gallery-view-grid">
            {filteredMedia.map((media) => (
              <button className="tourist-gallery-item" key={media.title} onClick={() => onOpenMedia(media)}>
                <img src={media.image} alt={media.title} loading="lazy" />
                {media.type === "Video" && <span className="tourist-play"><Play size={18} fill="currentColor" /></span>}
                <span className="tourist-gallery-label">{media.title}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          {view === "search" && (
            <div className="tourist-view-filters">
              {resultSets.map(([label]) => <button key={label} type="button" className={searchType === label ? "active" : ""} onClick={() => onSearchType(label)}>{label}</button>)}
              <span>{visibleItems.length} kết quả</span>
            </div>
          )}
          {view === "favorites" && (
            <div className="tourist-view-filters">
              {["Tất cả", "Nghệ nhân", "Làng nghề", "Hoạt động"].map((filter) => <button key={filter} type="button" className={searchType === filter ? "active" : ""} onClick={() => onSearchType(filter)}>{filter}</button>)}
              <span>{visibleItems.length} nội dung</span>
            </div>
          )}
          <ResultsGrid
            items={view === "favorites" && searchType !== "Tất cả" ? visibleItems.filter((item) => {
              if (searchType === "Nghệ nhân") return Boolean(item.name);
              if (searchType === "Làng nghề") return item.id?.startsWith("craft-");
              return item.id?.startsWith("activity-");
            }) : visibleItems}
            favoriteIds={favoriteIds}
            onFavorite={onFavorite}
            variant={view === "favorites" ? "favorites" : "listing"}
            emptyText={view === "search" ? "Không tìm thấy nội dung phù hợp. Hãy thử từ khóa khác." : "Chưa có nội dung ở danh mục này."}
          />
        </>
      )}
    </div>
  );
}

function DetailView({ item, products, activities, mediaItems, favoriteIds, onFavorite, onReview }) {
  const [selectedTab, setSelectedTab] = useState("");
  if (!item) {
    return <div className="tourist-view"><PageHeading title="Không tìm thấy nội dung" description="Nội dung có thể đã bị gỡ hoặc đường dẫn không chính xác." /><Link className="tourist-primary-button" to={ROUTES.TOURIST}>Về trang chủ</Link></div>;
  }
  if (item.id?.startsWith("activity-")) {
    return <ActivityDetail item={item} favoriteIds={favoriteIds} onFavorite={onFavorite} onNotice={onReview} mediaItems={mediaItems} />;
  }
  const artisan = Boolean(item.name);
  const activity = item.id?.startsWith("activity-");
  const craft = item.id?.startsWith("craft-");
  const product = item.id?.startsWith("product-");
  const title = item.name || item.title;
  const isSaved = favoriteIds.includes(item.id);
  const detailTabs = craft
    ? ["Giới thiệu", "Quy trình", "Sản phẩm tiêu biểu"]
    : artisan
      ? ["Câu chuyện", "Sản phẩm", "Hoạt động", "Video"]
      : ["Giới thiệu", "Câu chuyện", "Hình ảnh & video"];
  const activeTab = detailTabs.includes(selectedTab) ? selectedTab : detailTabs[0];
  const tabDescription = activeTab === "Quy trình"
    ? "Từ khâu chọn nguyên liệu, tạo hình, hoàn thiện đến công đoạn nung, mỗi bước đều đòi hỏi kinh nghiệm và sự tỉ mỉ của người thợ."
    : activeTab === "Câu chuyện"
      ? item.description
      : product
        ? item.description
        : "Tìm hiểu thêm về những kỹ thuật thủ công, câu chuyện của người thợ và giá trị văn hóa được gìn giữ tại làng nghề.";
  const relatedProducts = products.filter((productItem) =>
    craft
      ? productItem.craftId === item.id
      : artisan && productItem.category.toLocaleLowerCase("vi").includes(item.craft.replace("Nghệ nhân ", "").toLocaleLowerCase("vi").split(" ")[0]),
  );
  const relatedActivities = activities.filter((activityItem) =>
    `${activityItem.title} ${activityItem.place}`.toLocaleLowerCase("vi")
      .includes(item.craft?.replace("Nghệ nhân ", "").toLocaleLowerCase("vi").split(" ")[0] || item.category?.toLocaleLowerCase("vi").split(" ")[0] || ""),
  );
  const relatedMedia = mediaItems.filter((mediaItem) =>
    activeTab === "Video" ? mediaItem.type === "Video" : true,
  );

  return (
    <div className="tourist-view">
      <div className="tourist-breadcrumb"><Link to={ROUTES.TOURIST}>Trang chủ</Link><span>›</span>{artisan ? "Nghệ nhân" : craft ? "Làng nghề" : activity ? "Hoạt động trải nghiệm" : "Văn hóa"}<span>›</span>{title}</div>
      <section className={`tourist-detail-layout ${artisan ? "tourist-artisan-detail" : ""}`}>
        <div className="tourist-detail-visual">
          <img src={item.image} alt={title} />
          {artisan && <div className="tourist-detail-thumbnails"><img src={item.image} alt="Ảnh nghệ nhân" /><img src={craftDataImage(item)} alt="Không gian làng nghề" /><img src={item.image} alt="Tác phẩm thủ công" /></div>}
        </div>
        <div className="tourist-detail-copy">
          <span className="tourist-eyebrow">{item.craft || item.category || (activity ? "TRẢI NGHIỆM VĂN HÓA" : "CÂU CHUYỆN VĂN HÓA")}</span>
          <h1>{title}{artisan && <span className="tourist-verified-mark"><Check size={12} /></span>}</h1>
          {item.rating && <div className="tourist-rating"><Star size={14} fill="currentColor" /> {item.rating} <span>({item.reviews} đánh giá)</span></div>}
          {item.place && <p className="tourist-detail-meta"><MapPin size={15} /> {item.place}</p>}
          {item.duration && <p className="tourist-detail-meta"><Clock3 size={15} /> Thời lượng: {item.duration}</p>}
          <p>{item.description}</p>
          <div className="tourist-detail-actions">
            <button type="button" className="tourist-primary-button" onClick={() => onFavorite(item)}><Heart size={15} fill={isSaved ? "currentColor" : "none"} /> {isSaved ? "Đang theo dõi" : artisan ? "Theo dõi nghệ nhân" : "Lưu yêu thích"}</button>
            {activity && <button type="button" className="tourist-secondary-button" onClick={() => onReview("Đăng ký trải nghiệm thành công! Chúng tôi sẽ liên hệ xác nhận.")}><CalendarDays size={15} /> Đăng ký trải nghiệm</button>}
          </div>
          <div className="tourist-detail-tabs">
            {detailTabs.map((tab) => <button type="button" key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setSelectedTab(tab)}>{tab}</button>)}
          </div>
          <div className="tourist-detail-tab-content">
            {activeTab === "Sản phẩm tiêu biểu" || activeTab === "Sản phẩm" ? (
              <div className="tourist-related-products">
                {relatedProducts.map((relatedProduct) => <Link to={itemRoute(relatedProduct)} key={relatedProduct.id}><img src={relatedProduct.image} alt={relatedProduct.title} /><span>{relatedProduct.category}</span><strong>{relatedProduct.title}</strong></Link>)}
                {!relatedProducts.length && <p>Thông tin sản phẩm đang được cập nhật.</p>}
              </div>
            ) : activeTab === "Hoạt động" ? (
              <div className="tourist-related-activities">
                {(relatedActivities.length ? relatedActivities : activities).slice(0, 2).map((activityItem) => <Link to={itemRoute(activityItem)} key={activityItem.id}><img src={activityItem.image} alt="" /><span><strong>{activityItem.title}</strong><small><MapPin size={12} /> {activityItem.place}</small></span><ArrowRight size={14} /></Link>)}
              </div>
            ) : activeTab === "Video" || activeTab === "Hình ảnh & video" ? (
              <div className="tourist-related-media">
                {relatedMedia.slice(0, 3).map((mediaItem) => <Link to={itemRoute(mediaItem)} key={mediaItem.title}><img src={mediaItem.image} alt={mediaItem.title} />{mediaItem.type === "Video" && <span><Play size={14} fill="currentColor" /></span>}</Link>)}
              </div>
            ) : (
              <>
                <p>{tabDescription}</p>
                <div className="tourist-detail-facts">
                  <span><Check size={14} /> Thông tin được cộng đồng xác thực</span>
                  <span><MessageCircle size={14} /> Chia sẻ và đánh giá trải nghiệm</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      <section className="tourist-detail-review">
        <div><span className="tourist-eyebrow">CẢM NHẬN CỦA DU KHÁCH</span><h2>Đánh giá & nhận xét</h2><p>Chia sẻ trải nghiệm của bạn với cộng đồng.</p></div>
        <Link className="tourist-primary-button" to="/tourist/reviews">Viết đánh giá <ArrowRight size={14} /></Link>
      </section>
    </div>
  );
}

function craftDataImage(item) {
  return item.id === "artisan-lan"
    ? "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=85"
    : item.image;
}

function ProfileView({ profile, profileDraft, onDraftChange, onSave, onNavigate }) {
  return (
    <div className="tourist-view">
      <PageHeading title="Thông tin cá nhân" description="Quản lý hồ sơ và các hoạt động khám phá của bạn." />
      <div className="tourist-profile-layout">
        <aside className="tourist-profile-sidebar">
          <div className="tourist-profile-avatar">YK</div>
          <strong>{profile.name}</strong>
          <span>Du khách · Thành viên từ 2025</span>
          <button type="button" className="active"><Check size={14} /> Thông tin cá nhân</button>
          <button type="button" onClick={() => onNavigate("favorites")}><Heart size={14} /> Yêu thích</button>
          <button type="button" onClick={() => onNavigate("reviews")}><Star size={14} /> Đánh giá của tôi</button>
        </aside>
        <form className="tourist-profile-edit" onSubmit={onSave}>
          <div className="tourist-panel-heading"><div><span className="tourist-eyebrow">HỒ SƠ CỦA BẠN</span><h2>Thông tin cá nhân</h2></div></div>
          <label>Họ và tên<input value={profileDraft.name} onChange={(event) => onDraftChange({ ...profileDraft, name: event.target.value })} required /></label>
          <label>Email<input type="email" value={profileDraft.email} onChange={(event) => onDraftChange({ ...profileDraft, email: event.target.value })} required /></label>
          <label>Số điện thoại<input value={profileDraft.phone} onChange={(event) => onDraftChange({ ...profileDraft, phone: event.target.value })} /></label>
          <button className="tourist-primary-button" type="submit"><Check size={15} /> Lưu thay đổi</button>
        </form>
      </div>
    </div>
  );
}

function ReviewsView({ reviews, rating, onRating, reviewText, onReviewText, onSubmit }) {
  return (
    <div className="tourist-view">
      <PageHeading title="Đánh giá & nhận xét" description="Chia sẻ cảm nhận về nội dung hoặc hoạt động trải nghiệm." />
      <div className="tourist-review-page-layout">
        <section className="tourist-review-write">
          <span className="tourist-eyebrow">Ý KIẾN CỦA BẠN</span>
          <h2>Chuyến đi của bạn thế nào?</h2>
          <p>Đánh giá giúp những du khách khác chọn được trải nghiệm phù hợp.</p>
          <form onSubmit={onSubmit}>
            <div className="tourist-star-picker" role="group" aria-label="Chọn số sao">
              {[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} onClick={() => onRating(value)} aria-label={`${value} sao`} aria-pressed={rating >= value}><Star size={23} fill={rating >= value ? "currentColor" : "none"} /></button>)}
            </div>
            <label htmlFor="review-message">Nhận xét của bạn</label>
            <textarea id="review-message" value={reviewText} onChange={(event) => onReviewText(event.target.value)} placeholder="Chia sẻ điều bạn yêu thích về nghệ nhân, làng nghề hoặc hoạt động..." required />
            <button className="tourist-primary-button" type="submit">Gửi đánh giá <ArrowRight size={15} /></button>
          </form>
        </section>
        <section className="tourist-review-summary">
          <span className="tourist-eyebrow">CỘNG ĐỒNG DU KHÁCH</span>
          <h2>Đánh giá trung bình</h2>
          <div className="tourist-review-score"><strong>4.8</strong><span><Star size={15} fill="currentColor" /> 1.248 đánh giá</span></div>
          {[["5 sao", "72%"], ["4 sao", "18%"], ["3 sao", "6%"], ["2 sao", "2%"], ["1 sao", "2%"]].map(([label, amount]) => <div className="tourist-rating-bar" key={label}><span>{label}</span><div><i style={{ width: amount }} /></div><small>{amount}</small></div>)}
          <div className="tourist-review-feed">
            {reviews.length ? reviews.map((review) => <article key={review.id}><strong>{review.name}</strong><span><Star size={12} fill="currentColor" /> {review.rating}/5</span><p>{review.content}</p></article>) : <p>Chưa có nhận xét mới. Hãy là người đầu tiên chia sẻ cảm nhận.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function TouristViews({ view, data, favoriteIds, onFavorite, query, onQuery, searchType, onSearchType, mediaType, onMediaType, onOpenMedia, reviews, rating, onRating, reviewText, onReviewText, onSubmitReview, profile, profileDraft, onDraftChange, onSaveProfile, onNavigate, onNotice }) {
  if (view === "stories") {
    return <TouristCulturePages stories={data.stories} artisans={data.artisans} crafts={data.crafts} products={data.products} activities={data.activities} favoriteIds={favoriteIds} onFavorite={onFavorite} query={query} onQuery={onQuery} />;
  }
  if (view === "products") {
    return <TouristProductPages products={data.products} crafts={data.crafts} favoriteIds={favoriteIds} onFavorite={onFavorite} query={query} onQuery={onQuery} />;
  }
  if (view === "product") {
    const product = data.products.find((item) => item.id === data.detailId);
    return <TouristProductDetail product={product} products={data.products} crafts={data.crafts} favoriteIds={favoriteIds} onFavorite={onFavorite} onNotice={onNotice} />;
  }
  if (view === "activity") {
    const activity = data.activities.find((item) => item.id === data.detailId);
    if (activity) return <ActivityDetail item={activity} favoriteIds={favoriteIds} onFavorite={onFavorite} onNotice={onNotice} mediaItems={data.mediaItems} />;
  }
  if (view === "artisans") {
    return <ArtisanListing artisans={data.artisans} crafts={data.crafts} products={data.products} stories={data.stories} favoriteIds={favoriteIds} onFavorite={onFavorite} query={query} onQuery={onQuery} />;
  }
  if (view === "artisan") {
    const artisan = data.artisans.find((item) => item.id === data.detailId);
    if (artisan) return <ArtisanDetail artisan={artisan} products={data.products} activities={data.activities} favoriteIds={favoriteIds} onFavorite={onFavorite} onNotice={onNotice} />;
  }
  if (view === "activities") {
    return <ActivityListing activities={data.activities} favoriteIds={favoriteIds} onFavorite={onFavorite} query={query} onQuery={onQuery} />;
  }
  if (view === "profile") {
    return <ProfileView profile={profile} profileDraft={profileDraft} onDraftChange={onDraftChange} onSave={onSaveProfile} onNavigate={onNavigate} />;
  }
  if (view === "reviews") {
    return <ReviewsView reviews={reviews} rating={rating} onRating={onRating} reviewText={reviewText} onReviewText={onReviewText} onSubmit={onSubmitReview} />;
  }
  if (["artisan", "craft", "product", "story", "activity", "image", "video"].includes(view)) {
    const item = [...data.allItems, ...data.mediaItems].find((candidate) =>
      candidate.id === data.detailId || candidate.title === decodeURIComponent(data.detailId || ""),
    );
    return <DetailView item={item} products={data.products} activities={data.activities} mediaItems={data.mediaItems} favoriteIds={favoriteIds} onFavorite={onFavorite} onReview={onNotice} />;
  }
  return <ListingView view={view} data={data} favoriteIds={favoriteIds} onFavorite={onFavorite} query={query} onQuery={onQuery} searchType={searchType} onSearchType={onSearchType} mediaType={mediaType} onMediaType={onMediaType} onOpenMedia={onOpenMedia} />;
}
