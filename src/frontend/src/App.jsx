import "./App.css";
import logoImg from "./assets/logo_v1.png";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "./routes/paths.js";


const crafts = [
  {
    title: "Bát Tràng",
    category: "Gốm truyền thống",
    location: "Giữ hồn đất thành những tác phẩm gốm.",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Vạn Phúc",
    category: "Dệt thủ công",
    location: "Theo sợi tơ, tìm về một miền ký ức.",
    image:
      "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Thanh Hà",
    category: "Làng nghề di sản",
    location: "Nhịp sống bình yên bên dòng Thu Bồn.",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=85",
  },
];

const artisans = [
  {
    name: "Nguyễn Văn Lâm",
    craft: "Nghệ nhân gốm truyền thống",
    place: "Bát Tràng, Hà Nội",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=85",
  },
  {
    name: "Trần Thị Hương",
    craft: "Nghệ nhân dệt lụa",
    place: "Vạn Phúc, Hà Nội",
    image:
      "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=600&q=85",
  },
  {
    name: "Lê Văn Bình",
    craft: "Nghệ nhân mây tre đan",
    place: "Phú Vinh, Hà Nội",
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=85",
  },
  {
    name: "Phạm Thị Liên",
    craft: "Nghệ nhân nón lá",
    place: "Tây Hồ, Huế",
    image:
      "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=600&q=85",
  },
];

const products = [
  {
    title: "Bình gốm men tro",
    category: "Gốm Bát Tràng",
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "Khăn lụa tơ tằm",
    category: "Tơ tằm · Dệt thủ công",
    image:
      "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "Giỏ mây đan tay",
    category: "Mây tre · Bền vững",
    image:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "Nón lá xứ Huế",
    category: "Lá nón · Thủ công",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=85",
  },
];

const activities = [
  {
    title: "Tự tay chế tác gốm cùng nghệ nhân",
    place: "Làng gốm truyền thống",
    price: "380.000đ",
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Học dệt vải thổ cẩm và khám phá hoa văn",
    place: "Không gian văn hóa bản địa",
    price: "650.000đ",
    image:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Trải nghiệm tinh hoa làng nghề",
    place: "Làng nghề Việt Nam",
    price: "250.000đ",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85",
  },
];

const stories = [
  {
    tag: "Nghề thủ công",
    title: "Hành trình gìn giữ nghề truyền thống qua nhiều thế hệ",
    image:
      "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=800&q=85",
  },
  {
    tag: "Di sản văn hóa",
    title: "Ý nghĩa hoa văn và câu chuyện đằng sau mỗi sản phẩm",
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=85",
  },
  {
    tag: "Làng nghề xưa",
    title: "Quý giá những ký ức được lưu giữ bằng đôi bàn tay",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=85",
  },
];

function SectionHeading({ eyebrow, title, description, link }) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {link && <a className="text-link" href="#stories">{link} ↗</a>}
    </div>
  );
}

function Header() {
  return (
    <header className="site-header">
      <Link className="brand" to={ROUTES.HOME} aria-label="Tinh Hoa Việt - Trang chủ">
        <img src={logoImg} alt="Tinh Hoa Việt Logo" className="brand-logo" />
        <span>
          <strong>Tinh Hoa Việt</strong>
          <small>Nền tảng di sản - Tinh hoa tương lai</small>
        </span>
      </Link>

      <nav className="main-nav">
        <Link className="active" to={ROUTES.HOME}>Trang chủ</Link>
        <a href="#artisans">Nghệ nhân</a>
        <a href="#crafts">Làng nghề</a>
        <a href="#products">Sản phẩm thủ công</a>
        <a href="#stories">Câu chuyện văn hóa</a>
        <a href="#activities">Hoạt động trải nghiệm</a>
      </nav>

      <div className="header-actions">
        <button className="header-search" type="button" aria-label="Tìm kiếm">⌕</button>
        <Link className="login-link" to={ROUTES.LOGIN}>Đăng nhập</Link>
        <Link className="button button-small" to={ROUTES.REGISTER}>Đăng ký</Link>
      </div>
    </header>
  );
}

function SearchPanel() {
  return (
    <form
      className="search-panel"
      onSubmit={(event) => {
        event.preventDefault();
        document.getElementById("crafts")?.scrollIntoView({
          behavior: "smooth",
        });
      }}
    >
      <div className="search-tabs">
        <span>Tìm kiếm:</span>
        <span className="selected">Nghệ nhân</span>
        <span>Làng nghề</span>
        <span>Sản phẩm</span>
        <span>Câu chuyện văn hóa</span>
        <span>Hoạt động trải nghiệm</span>
      </div>

      <div className="search-fields">
        <input
          type="search"
          aria-label="Tìm nghệ nhân, làng nghề hoặc sản phẩm"
          placeholder="Bạn muốn khám phá nghệ nhân, làng nghề hay câu chuyện nào?"
        />

        <button className="button search-button" type="submit">
          Tìm kiếm
        </button>
      </div>
    </form>
  );
}


const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=1600&q=85",
    title: "Khám phá tinh hoa nghề Việt",
    description: "Kết nối cùng nghệ nhân, khám phá những câu chuyện và giá trị văn hóa được gìn giữ qua nhiều thế hệ.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=1600&q=85",
    title: "Lưu giữ hồn nghề truyền thống",
    description: "Tìm hiểu những giá trị văn hóa được gìn giữ qua nhiều thế hệ.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=85",
    title: "Trải nghiệm văn hóa Việt",
    description: "Gặp gỡ nghệ nhân và tự tay khám phá tinh hoa làng nghề.",
  },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <div className="hero-slider">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.title}
          className={`hero-slide ${
            index === current ? "active" : ""
          }`}
          aria-hidden={index !== current}
        >
          <img src={slide.image} alt={slide.title} />

          <div className="hero-slide-overlay">
            <span>KHÁM PHÁ TINH HOA VIỆT</span>
            <h2>{slide.title}</h2>
            <p>{slide.description}</p>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="slider-arrow slider-prev"
        onClick={prevSlide}
        aria-label="Ảnh trước"
      >
        &#10094;
      </button>

      <button
        type="button"
        className="slider-arrow slider-next"
        onClick={nextSlide}
        aria-label="Ảnh tiếp theo"
      >
        &#10095;
      </button>

      <div className="slider-dots">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            className={`slider-dot ${
              index === current ? "active" : ""
            }`}
            onClick={() => setCurrent(index)}
            aria-label={`Chuyển đến ảnh ${index + 1}`}
            aria-current={index === current ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  );
}


function Hero() {
  return (
    <>
      <section className="hero" id="home">
        <HeroSlider />
      </section>

      <div className="search-wrap">
        <SearchPanel />
      </div>
    </>
  );
}

function CraftSection() {
  return (
    <section className="section section-green" id="crafts">
      <SectionHeading
        eyebrow="✧ Miền di sản"
        title="Mỗi làng nghề, một miền văn hóa"
        description="Chạm lời kể của những nghệ nhân và khám phá bản sắc từng vùng đất."
        link="Xem tất cả"
      />

      <div className="craft-grid">
        {crafts.map((craft) => (
          <a className="craft-card" href="#stories" key={craft.title}>
            <img src={craft.image} alt={craft.title} loading="lazy" />
            <div className="craft-overlay" />
            <span className="image-tag">{craft.category}</span>
            <span className="round-arrow" aria-hidden="true">↗</span>
            <div className="craft-info">
              <h3>{craft.title}</h3>
              <p>{craft.location}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function ArtisanSection() {
  return (
    <section className="section" id="artisans">
      <SectionHeading
        eyebrow="✧ Người gìn giữ tinh hoa"
        title="Những người gìn giữ tinh hoa nghề Việt"
        description="Đằng sau mỗi tác phẩm là một đôi tay khéo léo và một đời gắn bó với nghề."
        link="Xem tất cả"
      />

      <div className="artisan-grid">
        {artisans.map((artisan) => (
          <article className="artisan-card" key={artisan.name}>
            <div className="artisan-image">
              <img src={artisan.image} alt={artisan.name} loading="lazy" />
              <span className="verified">✦ Nghệ nhân tiêu biểu</span>
              <button
                className="favorite-button"
                type="button"
                aria-label={`Yêu thích ${artisan.name}`}
                onClick={(event) => {
                  event.currentTarget.classList.toggle("is-favorite");
                }}
              >
                ♡
              </button>
            </div>

            <div className="artisan-content">
              <span className="artisan-rating">★ 4.9 <small>(120 nhận xét)</small></span>
              <h3>{artisan.name}</h3>
              <p>{artisan.craft}</p>
              <span className="artisan-place">⌖ {artisan.place}</span>
              <a className="outline-button" href="#join">Xem hồ sơ nghệ nhân ↗</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProductSection() {
  return (
    <section className="section product-section" id="products">
      <SectionHeading
        eyebrow="✧ Từ đôi tay đến đời sống"
        title="Mang một chút hồn Việt về nhà"
        description="Những vật phẩm mộc mạc, chứa đựng sự tỉ mỉ và vẻ đẹp của chất liệu bản địa."
        link="Xem tất cả"
      />

      <div className="product-grid">
        {products.map((product) => (
          <a className="product-card" href="#join" key={product.title}>
            <img src={product.image} alt={product.title} loading="lazy" />
            <div className="product-info">
              <span>{product.category}</span>
              <h3>{product.title}</h3>
              <span className="product-arrow" aria-hidden="true">↗</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function ActivitySection() {
  return (
    <section className="section section-tinted" id="activities">
      <SectionHeading
        eyebrow="✧ Trải nghiệm sống cùng văn hóa"
        title="Workshop văn hóa & Trải nghiệm làng nghề sắp diễn ra"
        description="Tự tay khám phá tinh hoa nghề Việt, lưu giữ dấu ấn văn hóa truyền thống."
        link="Xem tất cả hoạt động"
      />

      <div className="activity-grid">
        {activities.map((activity) => (
          <article className="activity-card" key={activity.title}>
            <div className="activity-image">
              <img src={activity.image} alt={activity.title} loading="lazy" />
              <span className="image-tag">✦ Trải nghiệm thực tế</span>
            </div>
            <div className="activity-content">
              <span className="activity-location">⌖ {activity.place}</span>
              <h3>{activity.title}</h3>
              <p>Khám phá kỹ thuật truyền thống cùng nghệ nhân địa phương.</p>
              <div className="activity-bottom">
                <div>
                  <small>Giá tham khảo từ</small>
                  <strong>{activity.price}</strong>
                </div>
                <a className="button" href="#join">Đăng ký tham gia</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function StorySection() {
  const [featuredStory, ...sideStories] = stories;

  return (
    <section className="section stories-section" id="stories">
      <SectionHeading
        eyebrow="✧ Lắng nghe di sản"
        title="Có những câu chuyện còn mãi"
        description="Những câu chuyện về đôi bàn tay, ký ức và tình yêu dành cho nghề."
        link="Đọc thêm câu chuyện"
      />

      <div className="story-layout">
        <a className="story-feature" href="#join">
          <img src={featuredStory.image} alt={featuredStory.title} loading="lazy" />
          <span className="story-tag">{featuredStory.tag}</span>
          <h3>Giữ hồn đất trong từng dáng gốm</h3>
          <p>Từ nắm đất ven sông đến chiếc bình trên kệ, hành trình ấy bắt đầu bằng sự kiên nhẫn và tình yêu với nghề.</p>
          <span className="read-more">Đọc câu chuyện ↗</span>
        </a>
        <div className="story-side-list">
          {sideStories.map((story) => (
            <a className="story-side-card" href="#join" key={story.title}>
            <img src={story.image} alt={story.title} loading="lazy" />
            <div className="story-content">
              <span className="story-tag">{story.tag}</span>
              <h3>{story.title}</h3>
            </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function JoinSection() {
  return (
    <section className="join-section" id="join">
      <div className="join-copy">
        <span className="join-eyebrow">✧ Kết nối ký ức, nuôi dưỡng bản sắc</span>
        <h2>Cùng viết tiếp câu chuyện nghề Việt</h2>
        <p>Dù bạn là người yêu văn hóa hay người gìn giữ nghề, Hồn Việt luôn là một mái nhà cho câu chuyện của bạn.</p>
        <div className="join-actions">
          <a className="button join-primary" href="#artisans">Tham gia Hồn Việt ↗</a>
          <Link className="join-button join-secondary" to={ROUTES.ARTISAN_REGISTER}>Dành cho nghệ nhân</Link>
        </div>
      </div>
      <img
        src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=85"
        alt="Nghệ nhân hướng dẫn làm gốm"
        loading="lazy"
      />
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <a className="brand" href="#home">
          <img src={logoImg} alt="Tinh Hoa Việt Logo" className="brand-logo" />
            <span>
              <strong>Tinh hoa  Việt</strong>
              <small>Nền tảng di sản - Tinh hoa tương lai</small>
            </span>
          </a>
          <p>
            Hành trình kết nối những giá trị văn hóa và nghề truyền thống,
            để tinh hoa Việt tiếp tục được gìn giữ và lan tỏa.
          </p>
        </div>

        <div className="footer-column">
          <h4>Về Hồn Việt</h4>
          <a href="#home">Giới thiệu</a>
          <a href="#crafts">Làng nghề Việt</a>
          <a href="#artisans">Đội ngũ nghệ nhân</a>
          <a href="#join">Liên hệ</a>
        </div>

        <div className="footer-column">
          <h4>Dành cho du khách</h4>
          <a href="#crafts">Khám phá làng nghề</a>
          <a href="#activities">Hoạt động trải nghiệm</a>
          <a href="#stories">Câu chuyện văn hóa</a>
        </div>

        <div className="footer-column">
          <h4>Hợp tác & Nghệ nhân</h4>
          <a href="#join">Đăng ký nghệ nhân</a>
          <a href="#join">Trở thành đối tác</a>
          <a href="mailto:hello@honviet.vn">Hỗ trợ</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Hồn Việt · Gìn giữ tinh hoa nghề Việt.</span>
        <div>
          <a href="#home">Điều khoản sử dụng</a>
          <a href="#home">Chính sách bảo mật</a>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ArtisanSection />
        <CraftSection />
        <ProductSection />
        <StorySection />
        <ActivitySection />
        <JoinSection />
      </main>
      <Footer />
    </>
  );
}