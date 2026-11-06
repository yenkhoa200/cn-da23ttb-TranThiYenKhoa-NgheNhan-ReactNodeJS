import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  CalendarDays,
  Compass,
  Heart,
  MapPin,
  Search,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=2000&q=90",
    alt: "Nghệ nhân đang chế tác sản phẩm gốm thủ công",
    eyebrow: "HÀNH TRÌNH DI SẢN VIỆT",
    titleLead: "Chào mừng bạn đến với",
    titleEmphasis: "Tinh Hoa Việt!",
    description: "Tiếp tục hành trình khám phá những làng nghề, nghệ nhân và giá trị văn hóa truyền thống Việt Nam.",
    action: "Khám phá nghệ nhân",
    to: "/tourist/artisans",
  },
  {
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=2000&q=90",
    alt: "Nghệ nhân đang chế tác sản phẩm gốm thủ công",
    eyebrow: "GẶP GỠ NGƯỜI GIỮ NGHỀ",
    title: "Chạm vào tinh hoa được gìn giữ qua bao thế hệ",
    description: "Lắng nghe câu chuyện từ đôi tay tài hoa của nghệ nhân Việt.",
    action: "Gặp gỡ nghệ nhân",
    to: "/tourist/artisans",
  },
  {
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=2000&q=90",
    alt: "Những sản phẩm lụa thủ công với hoa văn truyền thống",
    eyebrow: "KHÁM PHÁ NÉT ĐẸP VĂN HÓA",
    title: "Mỗi làng nghề mở ra một câu chuyện văn hóa Việt",
    description: "Khám phá sản phẩm, tri thức và những trải nghiệm địa phương.",
    action: "Khám phá làng nghề",
    to: "/tourist/crafts",
  },
];

const categories = [
  { label: "Nghệ nhân", icon: UserRound, to: "/tourist/artisans" },
  { label: "Làng nghề", icon: Compass, to: "/tourist/crafts" },
  { label: "Sản phẩm", icon: Bookmark, to: "/tourist/products" },
  { label: "Văn hóa Việt", icon: BookOpen, to: "/tourist/stories" },
  { label: "Hoạt động trải nghiệm", icon: CalendarDays, to: "/tourist/activities" },
  { label: "Câu chuyện văn hóa", icon: Heart, to: "/tourist/stories" },
];

function HomeFeatureSection({ title, eyebrow, items, kind, link }) {
  const routeForItem = (item) => `/tourist/${kind === "artisans" ? "artisan" : kind === "crafts" ? "craft" : kind === "products" ? "product" : kind === "stories" ? "story" : "activity"}/${item.id}`;

  return (
    <section className={`tourist-section tourist-home-collection tourist-home-${kind}-section`}>
      <div className="tourist-section-title">
        <div>
          <span className="tourist-eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        <Link className="tourist-more" to={link}>Xem tất cả <ArrowRight size={15} /></Link>
      </div>
      <div className="tourist-home-feature-grid">
        {items.slice(0, 3).map((item) => {
          const itemTitle = item.name || item.title;
          const subtitle = item.craft || item.category;
          return (
            <Link className="tourist-home-feature-card" to={routeForItem(item)} key={item.id}>
              <div className="tourist-home-feature-image">
                <img src={item.image} alt={itemTitle} loading="lazy" />
                {item.category && <span>{item.category}</span>}
              </div>
              <div className="tourist-home-feature-copy">
                {subtitle && <small>{subtitle}</small>}
                <h3>{itemTitle}</h3>
                {item.place && <p><MapPin size={14} /> {item.place}</p>}
                {item.schedule && <p>{item.schedule} · {item.duration}</p>}
                {item.description && <p className="tourist-home-feature-description">{item.description}</p>}
                <span className="tourist-home-feature-link">Khám phá <ArrowRight size={14} /></span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function TouristLanding({ query, onQuery, onSearch, data }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const moveSlide = (direction) => {
    setActiveSlide((current) => (current + direction + heroSlides.length) % heroSlides.length);
  };

  return (
    <>
      <section
        className="tourist-hero"
        aria-label="Khám phá di sản Việt"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
        }}
      >
        {heroSlides.map((slide, index) => (
          <div
            className={`tourist-hero-slide ${index === activeSlide ? "is-active" : ""}`}
            key={slide.eyebrow}
            aria-hidden={index !== activeSlide}
          >
            <img className="tourist-hero-image" src={slide.image} alt={slide.alt} />
            <div className="tourist-hero-shade" />
            {index === activeSlide && (
              <div className="tourist-hero-content" key={slide.titleLead || slide.title}>
                <span className="tourist-hero-tag"><span /> {slide.eyebrow}</span>
                      <h1>
                  {slide.titleLead
                    ? <span>{slide.titleLead}<br /><em>{slide.titleEmphasis}</em></span>
                    : slide.title}
                </h1>
                <p>{slide.description}</p>
                <form className="tourist-hero-search" onSubmit={onSearch}>
                  <Search size={19} aria-hidden="true" />
                  <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Tìm kiếm nghệ nhân, làng nghề, sản phẩm, hoạt động..." aria-label="Tìm kiếm nghệ nhân, làng nghề, sản phẩm, hoạt động" />
                  <button type="submit">Tìm kiếm</button>
                </form>
              </div>
            )}
          </div>
        ))}
        <button className="tourist-hero-arrow tourist-hero-prev" type="button" onClick={() => moveSlide(-1)} aria-label="Ảnh trước"><ArrowLeft size={19} /></button>
        <button className="tourist-hero-arrow tourist-hero-next" type="button" onClick={() => moveSlide(1)} aria-label="Ảnh tiếp theo"><ArrowRight size={19} /></button>
        <div className="tourist-hero-dots" role="group" aria-label="Chọn ảnh trình chiếu">
          {heroSlides.map((slide, index) => (
            <button
              className={`tourist-hero-dot ${index === activeSlide ? "active" : ""}`}
              key={slide.eyebrow}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Chuyển đến ảnh ${index + 1}`}
              aria-current={index === activeSlide ? "true" : undefined}
            />
          ))}
        </div>
        <div className="tourist-hero-count" aria-live="polite"><strong>{String(activeSlide + 1).padStart(2, "0")}</strong> / {String(heroSlides.length).padStart(2, "0")}</div>
      </section>

      <div className="tourist-content tourist-landing-content">
        <section className="tourist-category-row" aria-label="Danh mục khám phá">
          {categories.map(({ label, icon: Icon, to }) => (
            <Link className="tourist-category" to={to} key={label}>
              <span className="tourist-category-icon"><Icon size={20} /></span>
              <strong>{label}</strong>
              <ArrowRight className="tourist-category-arrow" size={15} />
            </Link>
          ))}
        </section>

        <HomeFeatureSection title="Nghệ nhân nổi bật" eyebrow="Người gìn giữ tinh hoa" items={data.artisans} kind="artisans" link="/tourist/artisans" />
        <HomeFeatureSection title="Làng nghề truyền thống" eyebrow="Miền di sản" items={data.crafts} kind="crafts" link="/tourist/crafts" />
        <HomeFeatureSection title="Sản phẩm thủ công" eyebrow="Từ đôi tay đến đời sống" items={data.products} kind="products" link="/tourist/products" />
        <HomeFeatureSection title="Câu chuyện văn hóa" eyebrow="Tri thức được trao truyền" items={data.stories} kind="stories" link="/tourist/stories" />
        <HomeFeatureSection title="Hoạt động trải nghiệm" eyebrow="Sống cùng văn hóa" items={data.activities} kind="activities" link="/tourist/activities" />
      </div>
    </>
  );
}
