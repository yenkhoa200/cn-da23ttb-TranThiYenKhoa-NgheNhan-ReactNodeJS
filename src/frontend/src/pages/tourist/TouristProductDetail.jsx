import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Headphones,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/path.js";

const formatPrice = (price) => `${Number(price || 0).toLocaleString("vi-VN")}₫`;

export default function TouristProductDetail({ product, products, crafts, favoriteIds, onFavorite, onNotice }) {
  const [photo, setPhoto] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState("Thông tin sản phẩm");

  if (!product) {
    return (
      <div className="tourist-view tourist-product-not-found">
        <h1>Không tìm thấy sản phẩm</h1>
        <p>Sản phẩm có thể đã được gỡ hoặc đường dẫn không chính xác.</p>
        <Link to="/tourist/products">Quay lại danh sách sản phẩm <ArrowRight size={15} /></Link>
      </div>
    );
  }

  const village = crafts.find((item) => item.id === product.craftId);
  const gallery = product.gallery?.length
    ? product.gallery
    : [product.image, ...(village?.gallery || [])].filter(Boolean).slice(0, 4);
  const safePhoto = Math.min(photo, gallery.length - 1);
  const saved = favoriteIds.includes(product.id);
  const relatedProducts = products.filter((item) => item.id !== product.id && item.craftId === product.craftId).slice(0, 3);
  const highlights = product.highlights || [
    `Chất liệu: ${product.material || "Nguyên liệu truyền thống được tuyển chọn"}`,
    "Kỹ thuật chế tác thủ công, gìn giữ qua nhiều thế hệ",
    "Mỗi sản phẩm mang dấu ấn riêng của người thợ",
    "Phù hợp làm vật trang trí và quà tặng",
  ];

  const addToCart = () => {
    onNotice(`Đã thêm ${quantity} ${product.title} vào giỏ hàng.`);
  };

  return (
    <div className="tourist-product-detail-page">
      <div className="tourist-product-breadcrumb">
        <Link to={ROUTES.TOURIST}>Trang chủ</Link><span>›</span>
        <Link to="/tourist/products">Sản phẩm</Link><span>›</span>
        <span>{product.category}</span><span>›</span><strong>{product.title}</strong>
      </div>

      <section className="tourist-product-overview">
        <div className="tourist-product-gallery">
          <div className="tourist-product-thumbnails">
            {gallery.map((image, index) => (
              <button
                type="button"
                className={safePhoto === index ? "active" : ""}
                key={`${image}-${index}`}
                aria-label={`Xem ảnh ${index + 1}`}
                onClick={() => setPhoto(index)}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
          <div className="tourist-product-main-image">
            <img src={gallery[safePhoto]} alt={product.title} />
            {gallery.length > 1 && (
              <>
                <button type="button" className="tourist-product-photo-prev" aria-label="Ảnh trước" onClick={() => setPhoto((safePhoto - 1 + gallery.length) % gallery.length)}><ChevronLeft size={20} /></button>
                <button type="button" className="tourist-product-photo-next" aria-label="Ảnh tiếp theo" onClick={() => setPhoto((safePhoto + 1) % gallery.length)}><ChevronRight size={20} /></button>
              </>
            )}
          </div>
        </div>

        <div className="tourist-product-detail-copy">
          <span className="tourist-product-detail-category">{product.category}</span>
          <h1>{product.title}</h1>
          {village && (
            <Link className="tourist-product-detail-location" to={`/tourist/craft/${village.id}`}>
              <MapPin size={17} /> {village.title}, {village.location || village.place}
            </Link>
          )}
          <div className="tourist-product-detail-rating">
            <span aria-label={`${product.rating || "4.8"} trên 5 sao`}>{"★".repeat(Math.round(Number(product.rating) || 5))}</span>
            <strong>{product.rating || "4.8"}/5</strong>
            <small>({product.reviews || 48} đánh giá)</small>
          </div>
          <strong className="tourist-product-detail-price">{formatPrice(product.price || 0)}</strong>
          <p className="tourist-product-detail-description">{product.description}</p>

          <div className="tourist-product-quantity">
            <span>Số lượng:</span>
            <div>
              <button type="button" aria-label="Giảm số lượng" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
              <output>{quantity}</output>
              <button type="button" aria-label="Tăng số lượng" onClick={() => setQuantity((value) => value + 1)}>+</button>
            </div>
          </div>

          <div className="tourist-product-detail-actions">
            <button type="button" className="tourist-product-cart-button" onClick={addToCart}><PackageCheck size={18} /> Thêm vào giỏ hàng</button>
            <button type="button" className={`tourist-product-save-button${saved ? " is-saved" : ""}`} onClick={() => onFavorite(product)}>
              <Heart size={18} fill={saved ? "currentColor" : "none"} /> {saved ? "Đã yêu thích" : "Lưu yêu thích"}
            </button>
          </div>

          <div className="tourist-product-promises">
            <span><ShieldCheck size={19} /> Sản phẩm thủ công<br />truyền thống</span>
            <span><Truck size={19} /> Giao hàng<br />toàn quốc</span>
            <span><Headphones size={19} /> Hỗ trợ<br />24/7</span>
          </div>
        </div>
      </section>

      <section className="tourist-product-detail-content">
        <div className="tourist-product-information">
          <div className="tourist-product-tabs" role="tablist" aria-label="Thông tin sản phẩm">
            {["Thông tin sản phẩm", "Câu chuyện làng nghề", `Đánh giá (${product.reviews || 48})`, "Có thể bạn sẽ thích"].map((item) => (
              <button type="button" role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} key={item} onClick={() => setTab(item)}>{item}</button>
            ))}
          </div>

          {tab === "Thông tin sản phẩm" && (
            <div className="tourist-product-information-panel">
              <h2><span aria-hidden="true">❧</span> Đặc điểm nổi bật</h2>
              <ul>{highlights.map((item) => <li key={item}><Check size={14} /> {item}</li>)}</ul>
              <h2>Mô tả chi tiết</h2>
              <p>{product.description} Từng công đoạn được thực hiện tỉ mỉ tại {village?.title || "làng nghề truyền thống"}, gửi gắm tình yêu nghề và nét đẹp văn hóa Việt trong mỗi sản phẩm.</p>
            </div>
          )}

          {tab === "Câu chuyện làng nghề" && (
            <div className="tourist-product-story-panel">
              <span className="tourist-product-story-eyebrow">CÂU CHUYỆN PHÍA SAU SẢN PHẨM</span>
              <h2>{village?.tagline || `Tinh hoa ${product.category} qua bàn tay người thợ`}</h2>
              <p>{village?.description || product.description}</p>
              {village && <Link to={`/tourist/craft/${village.id}`}>Khám phá làng nghề <ArrowRight size={15} /></Link>}
            </div>
          )}

          {tab.startsWith("Đánh giá") && (
            <div className="tourist-product-reviews-panel">
              <div className="tourist-product-review-score"><strong>{product.rating || "4.8"}</strong><span>★★★★★</span><small>{product.reviews || 48} đánh giá từ du khách</small></div>
              <article><strong>Nguyễn Minh Anh</strong><span>★★★★★</span><p>Sản phẩm đẹp, hoàn thiện tỉ mỉ. Câu chuyện làng nghề khiến món đồ trở nên ý nghĩa hơn.</p></article>
              <article><strong>Trần Hoài Phương</strong><span>★★★★★</span><p>Đúng như mô tả, đóng gói cẩn thận và mang đậm nét thủ công truyền thống.</p></article>
              <Link to="/tourist/reviews">Chia sẻ đánh giá của bạn <ArrowRight size={14} /></Link>
            </div>
          )}

          {tab === "Có thể bạn sẽ thích" && (
            <div className="tourist-product-related-grid">
              {relatedProducts.length ? relatedProducts.map((item) => (
                <Link to={`/tourist/product/${item.id}`} key={item.id}>
                  <img src={item.image} alt={item.title} />
                  <span>{item.category}</span><strong>{item.title}</strong>
                  <small>{formatPrice(item.price || 0)}</small>
                </Link>
              )) : <p>Các sản phẩm liên quan đang được cập nhật.</p>}
            </div>
          )}
        </div>

        <aside className="tourist-product-detail-aside">
          {village && (
            <>
              <section className="tourist-product-village-card">
                <h2>Thông tin làng nghề</h2>
                <div>
                  <img src={village.image} alt={village.title} />
                  <span><strong>{village.title}</strong><small>{village.location || village.place}</small></span>
                </div>
                <Link to={`/tourist/craft/${village.id}`}>Xem chi tiết làng nghề <ArrowRight size={14} /></Link>
              </section>
              <section className="tourist-product-map-card">
                <h2>Vị trí sản phẩm</h2>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(village.location || village.place || village.title)}`} target="_blank" rel="noreferrer">
                  <span><MapPin size={21} fill="currentColor" />{village.title}</span>
                  <strong>Xem bản đồ <ArrowRight size={12} /></strong>
                </a>
              </section>
            </>
          )}
        </aside>
      </section>
    </div>
  );
}
