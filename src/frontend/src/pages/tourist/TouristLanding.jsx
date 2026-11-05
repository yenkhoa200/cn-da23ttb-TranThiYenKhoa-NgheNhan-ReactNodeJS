import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  CalendarDays,
  Compass,
  Heart,
  Leaf,
  MapPin,
  Search,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const discoveryCards = [
  {
    title: "Nghệ nhân Nguyễn Thị Lan",
    category: "Làng gốm Bát Tràng",
    place: "Hà Nội",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=85",
    to: "/tourist/artisan/artisan-lan",
    icon: UserRound,
  },
  {
    title: "Làng lụa Hội An",
    category: "Di sản & làng nghề",
    place: "Quảng Nam",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=900&q=85",
    to: "/tourist/craft/craft-hoi-an",
    icon: Compass,
  },
  {
    title: "Nghề mây tre đan",
    category: "Thủ công truyền thống",
    place: "Hà Nội",
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=85",
    to: "/tourist/craft/craft-phu-vinh",
    icon: Bookmark,
  },
  {
    title: "Phố cổ Hội An",
    category: "Di sản văn hóa",
    place: "Quảng Nam",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=85",
    to: "/tourist/story/story-pho-co",
    icon: MapPin,
  },
];

const featuredStories = [
  {
    title: "Giữ lửa lò, giữ hồn đất Bát Tràng",
    category: "Câu chuyện làng nghề",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=85",
    to: "/tourist/story/story-gom",
  },
  {
    title: "Sợi tơ và những hoa văn kể chuyện",
    category: "Tri thức văn hóa",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=800&q=85",
    to: "/tourist/story/story-lua",
  },
  {
    title: "Nét đẹp nghề thủ công qua đôi bàn tay",
    category: "Nghề truyền thống",
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=800&q=85",
    to: "/tourist/stories",
  },
  {
    title: "Những miền di sản lưu giữ ký ức Việt",
    category: "Di sản văn hóa",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=85",
    to: "/tourist/stories",
  },
];

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=2000&q=90",
    alt: "Ngôi đình cổ giữa không gian xanh của làng quê Việt",
    eyebrow: "HÀNH TRÌNH DI SẢN VIỆT",
    titleLead: "Kết nối trực tiếp du khách",
    titleEmphasis: "với nghệ nhân và các làng nghề truyền thống",
    description: "Trải nghiệm, tìm hiểu và tiếp nối tinh hoa văn hóa Việt.",
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

export default function TouristLanding({ query, onQuery, onSearch }) {
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
                  <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Tìm kiếm nghệ nhân, làng nghề, hoạt động..." aria-label="Tìm kiếm nghệ nhân, làng nghề, hoạt động" />
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

        <section className="tourist-section tourist-discovery-section">
          <div className="tourist-section-title">
            <div>
              <span className="tourist-discovery-leaf"><Leaf size={29} /></span>
              <h2>Khám phá nét đẹp văn hóa Việt</h2>
            </div>
            <Link className="tourist-more tourist-pill-link" to="/tourist/crafts">Xem thêm <ArrowRight size={15} /></Link>
          </div>
          <div className="tourist-home-discovery-grid">
            {discoveryCards.map((card) => {
              const Icon = card.icon;
              return (
              <Link className="tourist-home-discovery-card" to={card.to} key={card.title}>
                <img src={card.image} alt={card.title} loading="lazy" />
                <span className="tourist-home-discovery-shade" />
                <span className="tourist-home-discovery-copy">
                  <small><Icon size={14} /> {card.title}</small>
                  <span><MapPin size={12} /> {card.place}</span>
                </span>
                <span className="tourist-home-discovery-arrow"><ArrowRight size={17} /></span>
              </Link>
            );})}
          </div>
        </section>

        <section className="tourist-section tourist-news-section">
          <div className="tourist-section-title">
            <div>
              <span className="tourist-news-mark">✿</span>
              <h2>Tin tức & Câu chuyện văn hóa</h2>
            </div>
            <Link className="tourist-more tourist-pill-link" to="/tourist/stories">Xem thêm <ArrowRight size={15} /></Link>
          </div>
          <div className="tourist-news-grid">
            {featuredStories.map((story) => (
              <Link className="tourist-news-card" to={story.to} key={story.title}>
                <img src={story.image} alt={story.title} loading="lazy" />
                <span className="tourist-news-card-copy">
                  <small>{story.category}</small>
                  <strong>{story.title}</strong>
                </span>
                <span className="tourist-news-card-arrow"><ArrowRight size={16} /></span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
