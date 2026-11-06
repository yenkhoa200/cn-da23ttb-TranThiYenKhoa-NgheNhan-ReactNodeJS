import { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Heart,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

const formatPrice = (price) => `${Number(price || 0).toLocaleString("vi-VN")}₫`;

function ProductCard({ product, village, favoriteIds, onFavorite }) {
  const saved = favoriteIds.includes(product.id);
  const place = village?.title || product.category;

  return (
    <article className="tourist-product-card">
      <Link to={`/tourist/product/${product.id}`} className="tourist-product-card-image">
        <img src={product.image} alt={product.title} loading="lazy" />
      </Link>
      <button
        type="button"
        className={`tourist-product-heart${saved ? " is-saved" : ""}`}
        aria-label={saved ? `Bỏ lưu ${product.title}` : `Lưu ${product.title} yêu thích`}
        onClick={() => onFavorite(product)}
      >
        <Heart size={19} fill={saved ? "currentColor" : "none"} />
      </button>
      <div className="tourist-product-card-body">
        <span className="tourist-product-category">{product.category}</span>
        <Link to={`/tourist/product/${product.id}`} className="tourist-product-name">{product.title}</Link>
        <Link className="tourist-product-place" to={village ? `/tourist/craft/${village.id}` : "/tourist/crafts"}>
          <MapPin size={14} /> {place}
        </Link>
        <div className="tourist-product-card-meta">
          <span><Star size={14} fill="currentColor" /> {product.rating || "4.8"} <small>({product.reviews || 48})</small></span>
          <strong>{formatPrice(product.price || 0)}</strong>
        </div>
        <Link className="tourist-product-detail-link" to={`/tourist/product/${product.id}`}>
          Xem chi tiết <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}

export default function TouristProductPages({ products, crafts, favoriteIds, onFavorite, query, onQuery }) {
  const [category, setCategory] = useState("Tất cả sản phẩm");
  const [villageId, setVillageId] = useState("Tất cả làng nghề");
  const [sort, setSort] = useState("Mới nhất");
  const categories = [...new Set(products.map((product) => product.category))];

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const village = crafts.find((item) => item.id === product.craftId);
      const searchText = `${product.title} ${product.category} ${village?.title || ""} ${village?.location || village?.place || ""}`;
      return searchText.toLocaleLowerCase("vi").includes(query.trim().toLocaleLowerCase("vi"))
        && (category === "Tất cả sản phẩm" || product.category === category)
        && (villageId === "Tất cả làng nghề" || product.craftId === villageId);
    });
    if (sort === "Giá thấp đến cao") result = [...result].sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    if (sort === "Giá cao đến thấp") result = [...result].sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    if (sort === "Đánh giá cao") result = [...result].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    return result;
  }, [products, crafts, query, category, villageId, sort]);

  return (
    <div className="tourist-products-page">
      <section className="tourist-products-hero">
        <div className="tourist-products-hero-inner">
          <span className="tourist-products-ornament" aria-hidden="true">❧</span>
          <div>
            <span className="tourist-products-eyebrow">TINH HOA TỪ LÀNG NGHỀ</span>
            <h1>Sản phẩm thủ công</h1>
            <p>Tinh hoa làng nghề Việt trong từng sản phẩm</p>
          </div>
        </div>
      </section>

      <div className="tourist-products-main">
        <div className="tourist-products-toolbar">
          <form className="tourist-products-search" onSubmit={(event) => event.preventDefault()}>
            <Search size={18} aria-hidden="true" />
            <input
              aria-label="Tìm kiếm sản phẩm"
              placeholder="Tìm kiếm sản phẩm..."
              value={query}
              onChange={(event) => onQuery(event.target.value)}
            />
            {query && <button type="button" aria-label="Xóa tìm kiếm" onClick={() => onQuery("")}>×</button>}
          </form>
          <div className="tourist-products-filters">
            <label>
              <SlidersHorizontal size={15} />
              <select aria-label="Lọc theo danh mục" value={category} onChange={(event) => setCategory(event.target.value)}>
                <option>Tất cả sản phẩm</option>
                {categories.map((option) => <option key={option}>{option}</option>)}
              </select>
              <ChevronDown size={14} />
            </label>
            <label>
              <MapPin size={15} />
              <select aria-label="Lọc theo làng nghề" value={villageId} onChange={(event) => setVillageId(event.target.value)}>
                <option>Tất cả làng nghề</option>
                {crafts.map((village) => <option value={village.id} key={village.id}>{village.title}</option>)}
              </select>
              <ChevronDown size={14} />
            </label>
            <label>
              <span className="tourist-products-price-mark">₫</span>
              <select aria-label="Sắp xếp sản phẩm" value={sort} onChange={(event) => setSort(event.target.value)}>
                <option>Mới nhất</option>
                <option>Giá thấp đến cao</option>
                <option>Giá cao đến thấp</option>
                <option>Đánh giá cao</option>
              </select>
              <ChevronDown size={14} />
            </label>
          </div>
        </div>

        <div className="tourist-products-layout">
          <aside className="tourist-products-sidebar">
            <section className="tourist-products-category-panel">
              <h2>Danh mục sản phẩm</h2>
              <button
                type="button"
                className={category === "Tất cả sản phẩm" ? "active" : ""}
                onClick={() => setCategory("Tất cả sản phẩm")}
              >✿ <span>Tất cả sản phẩm</span></button>
              {categories.map((item, index) => (
                <button
                  type="button"
                  className={category === item ? "active" : ""}
                  key={item}
                  onClick={() => setCategory(item)}
                >
                  {["◉", "❋", "⌂", "✧", "❀"][index % 5]} <span>{item}</span>
                </button>
              ))}
            </section>

            <section className="tourist-products-villages-panel">
              <h2>Làng nghề nổi bật</h2>
              {crafts.slice(0, 3).map((village) => (
                <Link to={`/tourist/craft/${village.id}`} key={village.id}>
                  <img src={village.image} alt="" loading="lazy" />
                  <span>{village.title}</span>
                </Link>
              ))}
              <Link className="tourist-products-all-villages" to="/tourist/crafts">Xem tất cả <ArrowRight size={13} /></Link>
            </section>
          </aside>

          <section className="tourist-products-results" aria-label="Danh sách sản phẩm">
            <div className="tourist-products-results-heading">
              <p><strong>{filteredProducts.length}</strong> sản phẩm thủ công</p>
              <span>Sản phẩm được tạo nên từ đôi tay và câu chuyện của người thợ Việt.</span>
            </div>
            {filteredProducts.length ? (
              <div className="tourist-products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    village={crafts.find((item) => item.id === product.craftId)}
                    favoriteIds={favoriteIds}
                    onFavorite={onFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="tourist-products-empty">
                <Search size={24} />
                <strong>Chưa tìm thấy sản phẩm phù hợp</strong>
                <span>Thử thay đổi từ khóa hoặc bộ lọc của bạn.</span>
                <button type="button" onClick={() => { onQuery(""); setCategory("Tất cả sản phẩm"); setVillageId("Tất cả làng nghề"); }}>
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
