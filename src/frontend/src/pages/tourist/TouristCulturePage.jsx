import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Grid2X2,
  Heart,
  House,
  Leaf,
  MapPin,
  Search,
  Sparkles,
  UserRound,
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

export function findCultureRelatedItems(source, items) {
  const normalize = (value) => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("vi");

  const sourceText = normalize([
    source.title,
    source.name,
    source.category,
    source.craft,
    source.place,
    source.description,
  ].filter(Boolean).join(" "));

  return items
    .map((item) => {
      const itemText = normalize([
        item.title,
        item.name,
        item.category,
        item.craft,
        item.place,
        item.description,
      ].filter(Boolean).join(" "));

      const sourceWords = new Set(sourceText.split(/[^a-z0-9]+/).filter((word) => word.length >= 3));
      const commonWords = [...sourceWords].filter((word) => itemText.includes(word)).length;
      return { item, commonWords };
    })
    .sort((a, b) => b.commonWords - a.commonWords)
    .map(({ item }) => item);
}

function StoryCard({ story, favoriteIds, onFavorite, featured = false }) {
  const saved = favoriteIds.includes(story.id);
  return (
    <article className={`culture-story-card${featured ? " is-featured" : ""}`}>
      <Link to={storyRoute(story)} className="culture-story-card__image">
        <img src={story.image} alt={story.title} loading="lazy" />
      </Link>
      {featured && (
        <span className="culture-story-card__featured-label"><Sparkles size={14} /> Câu chuyện nổi bật</span>
      )}
      <button
        type="button"
        className={`culture-story-card__favorite${saved ? " is-saved" : ""}`}
        aria-label={saved ? `Bỏ lưu ${story.title}` : `Lưu ${story.title} yêu thích`}
        onClick={() => onFavorite(story)}
      >
        <Heart size={17} fill={saved ? "currentColor" : "none"} />
      </button>
      <div className="culture-story-card__copy">
        <span className="culture-story-card__category">{storyCategory(story)}</span>
        <Link to={storyRoute(story)} className="culture-story-card__title">{story.title}</Link>
        <p>{story.description}</p>
        <Link to={storyRoute(story)} className="culture-story-card__read">
          {featured ? "Đọc câu chuyện" : "Đọc thêm"} <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}

export default function TouristCulturePage({
  stories,
  favoriteIds,
  onFavorite,
  query,
  onQuery,
}) {
  const [category, setCategory] = useState("Tất cả câu chuyện");
  const [page, setPage] = useState(1);

  const filteredStories = useMemo(() => stories.filter((story) => {
    const text = `${story.title} ${story.category} ${storyCategory(story)} ${story.description}`.toLocaleLowerCase("vi");
    const matchesQuery = text.includes(query.trim().toLocaleLowerCase("vi"));
    return matchesQuery && (category === "Tất cả câu chuyện" || storyCategory(story) === category);
  }), [stories, query, category]);

  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(filteredStories.length / pageSize));
  const visibleStories = filteredStories.slice((page - 1) * pageSize, page * pageSize);
  const heroStory = visibleStories[0] || stories[0];
  const discoveryStories = cultureCategories.slice(1).map((item) => ({
    category: item,
    story: stories.find((story) => storyCategory(story) === item),
  })).filter((item) => item.story).slice(0, 4);

  const updateCategory = (value) => {
    setCategory(value);
    setPage(1);
  };

  const updateQuery = (value) => {
    onQuery(value);
    setPage(1);
  };

  const categoryIcon = (item) => {
    if (item === "Tất cả câu chuyện") return <Grid2X2 size={16} />;
    if (item === "Lịch sử hình thành làng nghề") return <BookOpen size={16} />;
    if (item === "Nghề truyền thống") return <Sparkles size={16} />;
    if (item === "Phong tục và tập quán") return <UserRound size={16} />;
    if (item === "Lễ hội truyền thống") return <CalendarDays size={16} />;
    if (item === "Tri thức dân gian") return <Leaf size={16} />;
    if (item === "Giá trị văn hóa") return <MapPin size={16} />;
    return <House size={16} />;
  };

  return (
    <div className="tourist-culture-page culture-redesign tourist-villages-page">
      <section
        className="tourist-villages-hero culture-hero"
        style={heroStory?.image ? { "--culture-hero-image": `url("${heroStory.image}")` } : undefined}
      >
        <div className="culture-hero__content">
          <span className="culture-eyebrow"><Sparkles size={15} /> VĂN HÓA VIỆT NAM</span>
          <h1>Khám phá những câu chuyện, tri thức và giá trị văn hóa đặc sắc</h1>
          <p>Cùng tìm hiểu hành trình gìn giữ văn hóa qua lời kể của các nghệ nhân<br className="culture-desktop-break" /> và những giá trị truyền thống ngàn đời.</p>
        </div>
        <div className="culture-hero__caption">
          <span>Gìn giữ bản sắc</span>
          <strong>Lan tỏa giá trị Việt</strong>
        </div>
      </section>

      <main className="tourist-villages-main culture-main">
        <form className="culture-search" onSubmit={(event) => event.preventDefault()}>
          <Search size={19} aria-hidden="true" />
          <input
            aria-label="Tìm câu chuyện theo tên, chủ đề hoặc làng nghề"
            placeholder="Tìm câu chuyện, nghệ nhân, nghề truyền thống..."
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
          />
          {query && (
            <button className="culture-search__clear" type="button" aria-label="Xóa tìm kiếm" onClick={() => updateQuery("")}>×</button>
          )}
          <button className="culture-search__submit" type="submit">Tìm kiếm</button>
        </form>

        <section className="culture-topics" aria-label="Chủ đề văn hóa">
          <span className="culture-topics__title"><Grid2X2 size={16} /> Khám phá theo chủ đề:</span>
          <div className="culture-topics__list">
            {cultureCategories.map((item) => (
              <button
                type="button"
                key={item}
                className={`culture-topic${category === item ? " is-active" : ""}`}
                aria-pressed={category === item}
                onClick={() => updateCategory(item)}
              >
                {categoryIcon(item)}
                <span>{item}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="culture-topics__all"
            onClick={() => updateCategory("Tất cả câu chuyện")}
          >
            Xem tất cả <ArrowRight size={14} />
          </button>
        </section>

        <section className="culture-stories-section" id="danh-sach-cau-chuyen">
          {visibleStories.length ? (
            <>
              <div className={`culture-stories-layout${visibleStories.length === 1 ? " is-single" : ""}`}>
                <StoryCard story={visibleStories[0]} favoriteIds={favoriteIds} onFavorite={onFavorite} featured />
                {visibleStories.length > 1 && (
                  <div className="culture-stories-right">
                    <div className="culture-stories-right__heading">
                      <h2><Sparkles size={19} /> Những câu chuyện khác</h2>
                      <span>{filteredStories.length} câu chuyện</span>
                    </div>
                    <div className="culture-stories-side">
                      {visibleStories.slice(1, 4).map((story) => (
                        <StoryCard key={story.id} story={story} favoriteIds={favoriteIds} onFavorite={onFavorite} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {visibleStories.length > 4 && (
                <div className="culture-stories-extra">
                  {visibleStories.slice(4).map((story) => (
                    <StoryCard key={story.id} story={story} favoriteIds={favoriteIds} onFavorite={onFavorite} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="culture-empty">
              <BookOpen size={25} />
              <strong>Chưa tìm thấy câu chuyện phù hợp</strong>
              <span>Hãy thử một chủ đề khác hoặc thay đổi từ khóa tìm kiếm.</span>
            </div>
          )}
          {pageCount > 1 && (
            <nav className="culture-pagination" aria-label="Phân trang câu chuyện">
              <button type="button" disabled={page === 1} aria-label="Trang trước" onClick={() => setPage((current) => current - 1)}>‹</button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                <button
                  type="button"
                  className={page === number ? "is-active" : ""}
                  aria-current={page === number ? "page" : undefined}
                  key={number}
                  onClick={() => setPage(number)}
                >
                  {number}
                </button>
              ))}
              <button type="button" disabled={page === pageCount} aria-label="Trang sau" onClick={() => setPage((current) => current + 1)}>›</button>
            </nav>
          )}
        </section>

        <section className="culture-discovery">
          <div className="culture-discovery__content">
            <div className="culture-section-heading">
              <div>
                <span className="culture-eyebrow"><Leaf size={14} /> TRI THỨC & DI SẢN</span>
                <h2>Học hỏi và khám phá</h2>
              </div>
            </div>
            {discoveryStories.length > 0 ? (
              <div className="culture-discovery__grid">
                {discoveryStories.map(({ category: item, story }) => (
                  <Link to={storyRoute(story)} className="culture-discovery-card" key={item}>
                    <img src={story.image} alt="" loading="lazy" />
                    <span>{item}</span>
                    <strong>{story.title}</strong>
                    <i><ArrowRight size={15} /></i>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="culture-discovery__empty">Các chủ đề khám phá sẽ được cập nhật cùng những câu chuyện mới.</p>
            )}
          </div>
          <aside className="culture-discovery-promo">
            <span className="culture-discovery-promo__ornament" aria-hidden="true">✳</span>
            <span className="culture-eyebrow">DI SẢN SỐNG TRONG MỖI NGÀY</span>
            <h3>Văn hóa Việt</h3>
            <p>Mỗi câu chuyện là nhịp cầu kết nối quá khứ với hiện tại.</p>
            <Link to="/tourist/crafts">Khám phá làng nghề <ArrowRight size={15} /></Link>
          </aside>
        </section>
      </main>
    </div>
  );
}
