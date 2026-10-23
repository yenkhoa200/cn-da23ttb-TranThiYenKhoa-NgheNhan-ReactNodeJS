import "./App.css";
import logoImg from "./assets/logo.png";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "./routes/paths.js";


const crafts = [
  {
    title: "Gốm sứ & Điêu khắc đất",
    category: "Gốm truyền thống",
    location: "Bát Tràng, Hà Nội",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Dệt lụa & Thổ cẩm",
    category: "Dệt thủ công",
    location: "Vạn Phúc, Hà Nội",
    image:
      "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Mây tre & Mộc chạm khắc",
    category: "Thủ công mỹ nghệ",
    location: "Các làng nghề Việt Nam",
    image:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Tranh dân gian & Sơn mài",
    category: "Nghệ thuật truyền thống",
    location: "Đông Hồ, Bắc Ninh",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Đúc đồng & Kim hoàn bạc",
    category: "Kim loại thủ công",
    location: "Các làng nghề Việt Nam",
    image:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Ẩm thực dân gian & Trà thủ công",
    category: "Văn hóa ẩm thực",
    location: "Di sản ẩm thực Việt",
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=85",
  },
];

const artisans = [
  {
    name: "Trần Văn Độ",
    craft: "Nghệ nhân gốm truyền thống",
    place: "Bát Tràng, Hà Nội",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=85",
  },
  {
    name: "Thạch Thị Trúc",
    craft: "Nghệ nhân dệt thổ cẩm",
    place: "Trà Vinh",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85",
  },
  {
    name: "Nguyễn Đăng Chế",
    craft: "Nghệ nhân tranh dân gian",
    place: "Bắc Ninh",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=85",
  },
  {
    name: "Quách Phan Tuấn Anh",
    craft: "Nghệ nhân điêu khắc gỗ",
    place: "Miền Tây Nam Bộ",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=85",
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
        <a href="#crafts">Nghề làng</a>
        <a href="#artisans">Làng nghề & Nghệ nhân</a>
        <a href="#activities">Trải nghiệm</a>
        <a href="#stories">Khám phá văn hóa</a>
      </nav>

      <div className="header-actions">
      <Link className="login-link" to={ROUTES.LOGIN}>Đăng nhập</Link>
      <Link className="login-link" to={ROUTES.REGISTER}>Đăng ký</Link>
        {/*<a className="button button-small" href="#join">Đăng ký nghệ nhân</a>*/}
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
        <span className="selected">◉ Tất cả</span>
        <span>⌕ Tìm nghệ nhân</span>
        <span>▧ Nghề truyền thống</span>
        <span>♧ Làng nghề & Trải nghiệm</span>
      </div>

      <div className="search-fields">
        <label>
          <span>Ngành nghề / Nghệ nhân</span>
          <input
            type="search"
            placeholder="Tên nghệ nhân, nghề truyền thống..."
          />
        </label>

        <label>
          <span>Vùng miền / Địa điểm</span>
          <select defaultValue="">
            <option value="">Toàn quốc</option>
            <option>Miền Bắc</option>
            <option>Miền Trung</option>
            <option>Miền Nam</option>
            <option>Trà Vinh</option>
          </select>
        </label>

        <button className="button search-button" type="submit">
          <span>⌕</span> Khám phá
        </button>
      </div>

      <div className="popular-searches">
        <span>Gợi ý:</span>
        <a href="#crafts">Gốm Bát Tràng</a>
        <a href="#crafts">Dệt Chăm</a>
        <a href="#crafts">Đúc đồng</a>
        <a href="#crafts">Tranh Đông Hồ</a>
        <a href="#activities">Workshop</a>
      </div>
    </form>
  );
}


const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1600&q=85",
    title: "Tinh hoa nghề gốm Việt",
    description: "Khám phá hành trình tạo nên những sản phẩm thủ công độc đáo.",
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
        <div className="hero-inner">
          <h1>
            Kết nối nghệ nhân
            <br className="desktop-break" /> lan tỏa giá trị văn hóa Việt
          </h1>

          {/*slidebar */}
          <HeroSlider />

          <p className="hero-description">
            Kết nối trực tiếp du khách với nghệ nhân và các làng nghề
            truyền thống trên khắp miền đất nước - Trải nghiệm, tìm hiểu và
            tiếp nối tinh hoa văn hóa Việt.
          </p>
          <SearchPanel />
        </div>
      </section>

      <section className="stats-bar" aria-label="Hồn Việt qua những con số">
        <div className="stat">
          <strong>350+</strong>
          <span>Nghệ nhân & Thợ lành nghề</span>
        </div>
        <div className="stat">
          <strong>120+</strong>
          <span>Làng nghề di sản</span>
        </div>
        <div className="stat">
          <strong>15.000+</strong>
          <span>Du khách trải nghiệm</span>
        </div>
        <div className="stat">
          <strong>100%</strong>
          <span>Trực tiếp từ nghệ nhân</span>
        </div>
      </section>
    </>
  );
}

function CraftSection() {
  return (
    <section className="section" id="crafts">
      <SectionHeading
        eyebrow="✧ Tinh hoa làng nghề Việt"
        title="Khám phá tinh hoa nghề truyền thống Việt Nam"
        description="Mỗi sản phẩm là một câu chuyện, mỗi làng nghề là một di sản đang được tiếp nối."
        link="Khám phá tất cả"
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
    <section className="section section-tinted" id="artisans">
      <SectionHeading
        eyebrow="✧ Nghệ nhân Việt"
        title="Gặp gỡ những nghệ nhân tài hoa"
        description="Gặp gỡ những con người dành cả cuộc đời để gìn giữ tinh hoa nghề truyền thống."
        link="Xem danh sách nghệ nhân"
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

function ActivitySection() {
  return (
    <section className="section" id="activities">
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
  return (
    <section className="section stories-section" id="stories">
      <SectionHeading
        eyebrow="✧ Di sản sống trong đời sống"
        title="Câu chuyện Di sản & Phong tục làng nghề"
        description="Đọc để hiểu hơn về những câu chuyện và giá trị được lưu truyền qua nhiều thế hệ."
        link="Khám phá câu chuyện"
      />

      <div className="story-grid">
        {stories.map((story) => (
          <a className="story-card" href="#join" key={story.title}>
            <img src={story.image} alt={story.title} loading="lazy" />
            <div className="story-content">
              <span className="story-tag">{story.tag}</span>
              <h3>{story.title}</h3>
              <span className="read-more">5 phút đọc <span>Đọc tiếp ↗</span></span>
            </div>
          </a>
        ))}
      </div>
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
        <CraftSection />
        <ArtisanSection />
        <ActivitySection />
        <StorySection />
      </main>
      <Footer />
    </>
  );
}