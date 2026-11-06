import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Heart,
  Landmark,
  Search,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const cultureCategories = [
  "Tất cả câu chuyện",
  "Lịch sử hình thành làng nghề",
  "Nghề truyền thống",
  "Phong tục và tập quán",
  "Lễ hội truyền thống",
  "Tri thức dân gian",
  "Giá trị văn hóa",
  "Di sản văn hóa",
];

const storyCategory = (story) => {
  if (story.category === "Câu chuyện làng nghề") return "Lịch sử hình thành làng nghề";
  if (story.category === "Tri thức văn hóa") return "Nghề truyền thống";
  if (story.category === "Giá trị văn hóa") return "Giá trị văn hóa";
  if (story.category === "Di sản văn hóa") return "Di sản văn hóa";
  return story.category;
};

const storyRoute = (story) => `/tourist/story/${story.id}`;

function StoryCard({ story, favoriteIds, onFavorite, featured = false }) {
  const saved = favoriteIds.includes(story.id);
  return (
    <article className={`tourist-culture-story-card${featured ? " is-featured" : ""}`}>
      <Link to={storyRoute(story)} className="tourist-culture-story-image">
        <img src={story.image} alt={story.title} loading="lazy" />
      </Link>
      <button
        type="button"
        className={`tourist-culture-story-heart${saved ? " is-saved" : ""}`}
        aria-label={saved ? `Bỏ lưu ${story.title}` : `Lưu ${story.title} yêu thích`}
        onClick={() => onFavorite(story)}
      >
        <Heart size={17} fill={saved ? "currentColor" : "none"} />
      </button>
      <div className="tourist-culture-story-copy">
        <span className="tourist-culture-story-category">{storyCategory(story)}</span>
        <Link to={storyRoute(story)} className="tourist-culture-story-title">{story.title}</Link>
        <p>{story.description}</p>
        <Link to={storyRoute(story)} className="tourist-culture-read-link">
          {featured ? "Đọc câu chuyện" : "Đọc thêm"} <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}

function Timeline({ crafts }) {
  const featuredCraft = crafts[0];
  const stages = [
    {
      phase: "Khởi nguồn",
      image: featuredCraft?.featuredImage || featuredCraft?.image,
      description: featuredCraft?.historyDescription
        ? `${featuredCraft.historyDescription} Mốc năm cụ thể chưa được xác định trong dữ liệu giới thiệu hiện có.`
        : "Nghề thủ công hình thành từ nhu cầu và điều kiện sống của cộng đồng địa phương; mốc thời gian cụ thể cần đối chiếu tư liệu.",
    },
    {
      phase: "Bồi đắp kỹ thuật",
      image: featuredCraft?.gallery?.[0] || featuredCraft?.image,
      description: featuredCraft?.tradition || "Kỹ thuật và bí quyết nghề được người thợ tích lũy, hoàn thiện qua thực hành và kinh nghiệm.",
    },
    {
      phase: "Trao truyền qua thế hệ",
      image: featuredCraft?.gallery?.[1] || featuredCraft?.image,
      description: "Gia đình và cộng đồng tiếp nối tri thức nghề, truyền lại kỹ năng, câu chuyện và những giá trị gắn với địa phương.",
    },
    {
      phase: "Gìn giữ hôm nay",
      image: featuredCraft?.gallery?.[2] || featuredCraft?.image,
      description: "Nghệ nhân và người làm nghề tiếp tục gìn giữ kỹ thuật truyền thống, đồng thời đưa di sản đến gần hơn với du khách.",
    },
  ];

  return (
    <section className="tourist-culture-timeline-section">
      <div className="tourist-culture-section-heading">
        <span className="tourist-culture-eyebrow"><Landmark size={14} /> DÒNG CHẢY DI SẢN</span>
        <h2>Những chặng đường gìn giữ nghề</h2>
        <p>Các giai đoạn được trình bày khái quát; năm và sự kiện cụ thể cần được đối chiếu tư liệu địa phương.</p>
      </div>
      <div className="tourist-culture-timeline">
        {stages.map((stage, index) => (
          <article className="tourist-culture-timeline-item" key={stage.phase}>
            <div className="tourist-culture-timeline-marker"><span>{String(index + 1).padStart(2, "0")}</span></div>
            <div className="tourist-culture-timeline-card">
              {stage.image && <img src={stage.image} alt="" loading="lazy" />}
              <div>
                <span>Giai đoạn khái quát · chưa xác định năm</span>
                <h3>{stage.phase}</h3>
                <p>{stage.description}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function RelatedCulture({ artisans, crafts, products, activities }) {
  const relatedItems = [
    ...artisans.slice(0, 1).map((item) => ({
      title: item.name,
      subtitle: item.craft,
      image: item.image,
      href: `/tourist/artisan/${item.id}`,
      kind: "Nghệ nhân tiêu biểu",
    })),
    ...crafts.slice(0, 1).map((item) => ({
      title: item.title,
      subtitle: item.location || item.place,
      image: item.image,
      href: `/tourist/craft/${item.id}`,
      kind: "Làng nghề gắn với di sản",
    })),
    ...products.slice(0, 1).map((item) => ({
      title: item.title,
      subtitle: item.category,
      image: item.image,
      href: `/tourist/product/${item.id}`,
      kind: "Sản phẩm mang giá trị văn hóa",
    })),
    ...activities.slice(0, 1).map((item) => ({
      title: item.title,
      subtitle: item.place,
      image: item.image,
      href: `/tourist/activity/${item.id}`,
      kind: "Trải nghiệm văn hóa",
    })),
  ];

  return (
    <section className="tourist-culture-related-section">
      <div className="tourist-culture-section-heading">
        <span className="tourist-culture-eyebrow"><Sparkles size={14} /> KHÁM PHÁ GẦN HƠN</span>
        <h2>Khám phá văn hóa qua các làng nghề</h2>
        <p>Gặp gỡ người gìn giữ nghề, tìm hiểu nơi chốn và tự mình chạm vào những giá trị văn hóa.</p>
      </div>
      <div className="tourist-culture-related-grid">
        {relatedItems.map((item) => (
          <Link to={item.href} className="tourist-culture-related-card" key={item.kind}>
            <img src={item.image} alt="" loading="lazy" />
            <span>{item.kind}</span>
            <strong>{item.title}</strong>
            <small>{item.subtitle}</small>
            <i><ArrowRight size={15} /></i>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function TouristCulturePages({
  stories,
  artisans,
  crafts,
  products,
  activities,
  favoriteIds,
  onFavorite,
  query,
  onQuery,
}) {
  const [category, setCategory] = useState("Tất cả câu chuyện");
  const [page, setPage] = useState(1);
  const featuredStories = stories.slice(0, 3);
  const categoriesInStories = [...new Set(stories.map(storyCategory))];

  const filteredStories = useMemo(() => stories.filter((story) => {
    const text = `${story.title} ${story.category} ${storyCategory(story)} ${story.description}`.toLocaleLowerCase("vi");
    const matchesQuery = text.includes(query.trim().toLocaleLowerCase("vi"));
    return matchesQuery && (category === "Tất cả câu chuyện" || storyCategory(story) === category);
  }), [stories, query, category]);

  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(filteredStories.length / pageSize));
  const visibleStories = filteredStories.slice((page - 1) * pageSize, page * pageSize);

  const updateCategory = (value) => {
    setCategory(value);
    setPage(1);
  };

  return (
    <div className="tourist-culture-page">
      <section className="tourist-culture-hero">
        <div className="tourist-culture-hero-inner">
          <span className="tourist-culture-hero-flower" aria-hidden="true">❧</span>
          <span className="tourist-culture-hero-eyebrow">TRI THỨC ĐƯỢC TRAO TRUYỀN</span>
          <h1>Câu chuyện văn hóa Việt</h1>
          <p>Khám phá những câu chuyện, tri thức và giá trị văn hóa<br className="tourist-culture-desktop-break" /> được gìn giữ và lưu truyền qua nhiều thế hệ.</p>
          <form className="tourist-culture-search" onSubmit={(event) => event.preventDefault()}>
            <Search size={19} aria-hidden="true" />
            <input
              aria-label="Tìm câu chuyện theo tên, chủ đề hoặc làng nghề"
              placeholder="Tìm câu chuyện theo tên, chủ đề hoặc làng nghề..."
              value={query}
              onChange={(event) => { onQuery(event.target.value); setPage(1); }}
            />
            {query && <button type="button" aria-label="Xóa tìm kiếm" onClick={() => { onQuery(""); setPage(1); }}>×</button>}
          </form>
        </div>
      </section>

      <div className="tourist-culture-main">
        <section className="tourist-culture-featured-section">
          <div className="tourist-culture-section-heading">
            <span className="tourist-culture-eyebrow"><BookOpen size={14} /> NHỮNG CÂU CHUYỆN ĐƯỢC KỂ</span>
            <h2>Câu chuyện nổi bật</h2>
          </div>
          {featuredStories.length ? (
            <div className="tourist-culture-featured-grid">
              <StoryCard story={featuredStories[0]} favoriteIds={favoriteIds} onFavorite={onFavorite} featured />
              <div className="tourist-culture-featured-side">
                {featuredStories.slice(1, 3).map((story) => (
                  <StoryCard key={story.id} story={story} favoriteIds={favoriteIds} onFavorite={onFavorite} />
                ))}
              </div>
            </div>
          ) : <p className="tourist-culture-empty">Câu chuyện đang được cập nhật.</p>}
        </section>

        <section className="tourist-culture-categories-section" aria-label="Danh mục câu chuyện">
          <div className="tourist-culture-section-heading">
            <span className="tourist-culture-eyebrow"><Sparkles size={14} /> CHỌN ĐIỀU BẠN MUỐN KHÁM PHÁ</span>
            <h2>Danh mục câu chuyện</h2>
          </div>
          <div className="tourist-culture-categories">
            {cultureCategories.map((item) => (
              <button
                type="button"
                key={item}
                className={category === item ? "active" : ""}
                onClick={() => updateCategory(item)}
              >
                {item === "Tất cả câu chuyện" ? <BookOpen size={15} /> : <span aria-hidden="true">✦</span>}
                {item}
                {item !== "Tất cả câu chuyện" && categoriesInStories.includes(item) && <small>{stories.filter((story) => storyCategory(story) === item).length}</small>}
              </button>
            ))}
          </div>
        </section>

        <Timeline crafts={crafts} />

        <section className="tourist-culture-list-section" id="danh-sach-cau-chuyen">
          <div className="tourist-culture-section-heading tourist-culture-list-heading">
            <div>
              <span className="tourist-culture-eyebrow"><BookOpen size={14} /> THƯ VIỆN VĂN HÓA</span>
              <h2>Đọc và khám phá</h2>
            </div>
            <span>{filteredStories.length} câu chuyện</span>
          </div>
          <div className="tourist-culture-list-toolbar">
            <label>
              <Search size={16} />
              <input
                aria-label="Tìm trong danh sách câu chuyện"
                placeholder="Tìm theo tên, chủ đề hoặc làng nghề..."
                value={query}
                onChange={(event) => { onQuery(event.target.value); setPage(1); }}
              />
            </label>
            <select aria-label="Lọc danh mục câu chuyện" value={category} onChange={(event) => updateCategory(event.target.value)}>
              {cultureCategories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          {visibleStories.length ? (
            <div className="tourist-culture-list-grid">
              {visibleStories.map((story) => <StoryCard key={story.id} story={story} favoriteIds={favoriteIds} onFavorite={onFavorite} />)}
            </div>
          ) : (
            <div className="tourist-culture-empty">
              <BookOpen size={25} />
              <strong>Chưa có câu chuyện trong danh mục này</strong>
              <span>Hãy thử danh mục khác hoặc tìm kiếm với từ khóa khác.</span>
            </div>
          )}
          {pageCount > 1 && (
            <nav className="tourist-culture-pagination" aria-label="Phân trang câu chuyện">
              <button type="button" disabled={page === 1} aria-label="Trang trước" onClick={() => setPage((current) => current - 1)}>‹</button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                <button type="button" className={page === number ? "active" : ""} aria-current={page === number ? "page" : undefined} key={number} onClick={() => setPage(number)}>{number}</button>
              ))}
              <button type="button" disabled={page === pageCount} aria-label="Trang sau" onClick={() => setPage((current) => current + 1)}>›</button>
            </nav>
          )}
        </section>

        <section className="tourist-culture-reflection">
          <CalendarDays size={23} />
          <div>
            <span>DI SẢN SỐNG TRONG MỖI NGÀY</span>
            <h2>Mỗi câu chuyện là một nhịp cầu nối quá khứ và hiện tại</h2>
            <p>Cùng lắng nghe người thợ, ghé thăm làng nghề và tiếp nối những giá trị văn hóa Việt.</p>
          </div>
          <Link to="/tourist/crafts">Khám phá làng nghề <ArrowRight size={15} /></Link>
        </section>

        <RelatedCulture artisans={artisans} crafts={crafts} products={products} activities={activities} />
      </div>
    </div>
  );
}
