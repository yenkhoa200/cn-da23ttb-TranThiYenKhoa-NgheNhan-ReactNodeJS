
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowDownUp,
  BadgeCheck,
  ChevronDown,
  Heart,
  MapPin,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import SearchFilterBar from "../../components/common/SearchFilterBar.jsx";


// ============================================================
// 1. HÀM TẠO ĐƯỜNG DẪN CHI TIẾT NGHỆ NHÂN
// ============================================================

// Tạo URL đến trang chi tiết của nghệ nhân dựa trên ID.
const routeFor = (artisan) => `/tourist/artisan/${artisan.id}`;


// ============================================================
// 2. COMPONENT BANNER GIỚI THIỆU NGHỆ NHÂN
// ============================================================

function ArtisanHero() {
  return (
    <section className="tourist-artisans-hero">
      <div className="tourist-artisans-hero-inner">

        {/* Họa tiết trang trí bên trái */}
        <span
          className="tourist-artisans-hero-decoration"
          aria-hidden="true"
        >
          ❧
        </span>

        {/* Tiêu đề và nội dung giới thiệu */}
        <div>
          <h1>Nghệ nhân</h1>

          <p>
            Khám phá những nghệ nhân tài hoa –<br />
            người gìn giữ và lan tỏa giá trị văn hóa Việt.
          </p>
        </div>

        {/* Họa tiết trang trí bên phải */}
        <span
          className="tourist-artisans-hero-decoration right"
          aria-hidden="true"
        >
          ❧
        </span>

      </div>
    </section>
  );
}


// ============================================================
// 3. COMPONENT THẺ THÔNG TIN NGHỆ NHÂN
// ============================================================

function ArtisanCard({ artisan, favoriteIds, onFavorite }) {

  // Kiểm tra nghệ nhân hiện tại đã được người dùng yêu thích chưa.
  const saved = favoriteIds.includes(artisan.id);

  return (
    <article className="tourist-artisan-card">

      {/* Ảnh đại diện nghệ nhân */}
      <Link
        to={routeFor(artisan)}
        className="tourist-artisan-card-image"
      >
        {artisan.image ? (
          <img
            src={artisan.image}
            alt={artisan.name}
            loading="lazy"
          />
        ) : (
          // Hiển thị icon mặc định nếu nghệ nhân chưa có ảnh.
          <span
            className="tourist-artisan-card-placeholder"
            aria-hidden="true"
          >
            <Users size={28} />
          </span>
        )}
      </Link>

      {/* Nút thêm hoặc bỏ nghệ nhân khỏi danh sách yêu thích */}
      <button
        type="button"
        className={`tourist-artisan-card-heart${saved ? " is-saved" : ""}`}
        aria-label={
          saved
            ? `Bỏ lưu ${artisan.name}`
            : `Lưu ${artisan.name} yêu thích`
        }
        onClick={() => onFavorite(artisan)}
      >
        <Heart
          size={20}
          fill={saved ? "currentColor" : "none"}
        />
      </button>

      {/* Nội dung thông tin nghệ nhân */}
      <div className="tourist-artisan-card-body">

        {/* Tên nghệ nhân và biểu tượng xác minh */}
        <Link
          className="tourist-artisan-card-name"
          to={routeFor(artisan)}
        >
          {artisan.name}

          {artisan.verified && (
            <BadgeCheck
              size={14}
              fill="currentColor"
            />
          )}
        </Link>

        {/* Nghề truyền thống của nghệ nhân */}
        <span>
          <Users size={13} />
          Nghề: {artisan.craft}
        </span>

        {/* Địa phương của nghệ nhân */}
        <span>
          <MapPin size={13} />
          {artisan.place}
        </span>

        {/* Khu vực đánh giá và nút xem chi tiết */}
        <div className="tourist-artisan-card-bottom">

          {/* Hiển thị điểm đánh giá nếu có */}
          {artisan.rating ? (
            <small>
              <Star
                size={14}
                fill="currentColor"
              />
              {artisan.rating}
              <i>({artisan.reviews} đánh giá)</i>
            </small>
          ) : (
            <small>Chưa có đánh giá</small>
          )}

          {/* Chuyển đến trang chi tiết nghệ nhân */}
          <Link to={routeFor(artisan)}>
            Xem chi tiết
            <ArrowRight size={13} />
          </Link>

        </div>
      </div>
    </article>
  );
}


// ============================================================
// 4. COMPONENT KHÁM PHÁ THÊM
// ============================================================

function DiscoverMore({
  crafts,
  traditionalCrafts,
  products,
  stories
}) {

  // Danh sách nội dung gợi ý cho du khách khám phá.
  const entries = [
    {
      title: "Làng nghề Việt Nam",
      image: crafts[0]?.image,
      href: "/tourist/crafts",
      action: "Tìm hiểu ngay"
    },
    {
      title: "Nghề truyền thống nổi bật",
      image: traditionalCrafts[0]?.image,
      href: "/tourist/traditional-crafts",
      action: "Khám phá"
    },
    {
      title: "Giá trị văn hóa qua bàn tay nghệ nhân",
      image: products[0]?.image || stories[0]?.image,
      href: "/tourist/stories",
      action: "Đọc ngay"
    },
  ].filter((entry) => entry.image);

  return (
    <aside className="tourist-artisans-discover">

      {/* Tiêu đề khu vực khám phá thêm */}
      <h2>
        <span aria-hidden="true">❧</span>
        Khám phá thêm
      </h2>

      {/* Hiển thị danh sách nội dung gợi ý */}
      {entries.map((entry) => (
        <Link
          to={entry.href}
          className="tourist-artisans-discover-card"
          key={entry.title}
        >

          {/* Hình ảnh nội dung gợi ý */}
          <img
            src={entry.image}
            alt=""
            loading="lazy"
          />

          {/* Tiêu đề và hành động khám phá */}
          <span>
            <strong>{entry.title}</strong>

            <small>
              {entry.action}
              <ArrowRight size={12} />
            </small>
          </span>

          {/* Icon chuyển hướng */}
          <i>
            <ArrowRight size={15} />
          </i>

        </Link>
      ))}
    </aside>
  );
}


// ============================================================
// 5. COMPONENT CHÍNH: DANH SÁCH NGHỆ NHÂN
// ============================================================

export function ArtisanListing({
  artisans,
  crafts,
  traditionalCrafts,
  products,
  stories,
  favoriteIds,
  onFavorite,
  query,
  onQuery
}) {

  // ----------------------------------------------------------
  // 5.1. QUẢN LÝ TRẠNG THÁI CỦA CÁC BỘ LỌC
  // ----------------------------------------------------------

  // Nghề truyền thống đang được chọn.
  const [craft, setCraft] = useState("Nghề truyền thống");

  // Địa phương đang được chọn.
  const [place, setPlace] = useState("Địa phương");

  // Tiêu chí sắp xếp danh sách nghệ nhân.
  const [sort, setSort] = useState("Sắp xếp");

  // ----------------------------------------------------------
  // 5.2. TẠO DANH SÁCH LỰA CHỌN CHO BỘ LỌC
  // ----------------------------------------------------------

  // Lấy danh sách nghề truyền thống từ dữ liệu nghệ nhân.
  // Set giúp loại bỏ các nghề bị trùng lặp.
  const craftOptions = [
    ...new Set(artisans.map((item) => item.craft))
  ];

  // Lấy danh sách địa phương từ dữ liệu nghệ nhân.
  // split(",")[0] lấy phần địa phương đứng trước dấu phẩy.
  const placeOptions = [
    ...new Set(
      artisans.map((item) => item.place.split(",")[0])
    )
  ];


  // ----------------------------------------------------------
  // 5.3. TÌM KIẾM, LỌC VÀ SẮP XẾP NGHỆ NHÂN
  // ----------------------------------------------------------

  // useMemo giúp ghi nhớ kết quả, chỉ tính toán lại
  // khi một trong các dữ liệu phụ thuộc thay đổi.
  const filtered = useMemo(() => {

    // Lọc nghệ nhân theo từ khóa, nghề truyền thống
    // và địa phương.
    let items = artisans.filter((item) => {

      // Gộp tên, nghề và địa phương thành một chuỗi.
      const text = `${item.name} ${item.craft} ${item.place}`
        .toLocaleLowerCase("vi");

      return (
        // Tìm kiếm theo tên nghệ nhân, nghề hoặc địa phương.
        text.includes(query.trim().toLocaleLowerCase("vi"))

        // Lọc theo nghề truyền thống.
        && (
          craft === "Nghề truyền thống"
          || item.craft === craft
        )

        // Lọc theo địa phương.
        && (
          place === "Địa phương"
          || item.place.startsWith(place)
        )
      );
    });


    // Sắp xếp nghệ nhân theo điểm đánh giá cao.
    if (sort === "Đánh giá cao") {
      items = [...items].sort(
        (a, b) => Number(b.rating) - Number(a.rating)
      );
    }

    // Sắp xếp tên nghệ nhân theo thứ tự A - Z.
    if (sort === "Tên A–Z") {
      items = [...items].sort(
        (a, b) => a.name.localeCompare(b.name, "vi")
      );
    }

    // Trả về danh sách nghệ nhân sau khi xử lý.
    return items;

  }, [artisans, craft, place, query, sort]);


  // ==========================================================
  // 5.4. GIAO DIỆN HIỂN THỊ
  // ==========================================================

  return (
    <div className="tourist-artisans-page">

      {/* Banner giới thiệu nghệ nhân */}
      <ArtisanHero />

      <div className="tourist-artisans-main">

        {/* ----------------------------------------------------
            THANH TÌM KIẾM VÀ BỘ LỌC
        ---------------------------------------------------- */}

        <SearchFilterBar
          value={query}
          onChange={onQuery}
          searchLabel="Tìm kiếm nghệ nhân"
          placeholder="Nhập tên nghệ nhân hoặc từ khóa..."
        >
          <div className="tourist-artisans-selects">

                {/* Bộ lọc theo nghề truyền thống */}
                <label
                  className={
                    craft !== "Nghề truyền thống"
                      ? "has-selection"
                      : ""
                  }
                >
                  <span className="tourist-artisans-option-icon">
                    ❀
                  </span>

                  <select
                    aria-label="Lọc theo nghề truyền thống"
                    value={craft}
                    onChange={(event) => setCraft(event.target.value)}
                  >
                    <option>Nghề truyền thống</option>

                    {craftOptions.map((option) => (
                      <option key={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  <ChevronDown size={14} />
                </label>


                {/* Bộ lọc theo địa phương */}
                <label
                  className={
                    place !== "Địa phương"
                      ? "has-selection"
                      : ""
                  }
                >
                  <MapPin
                    className="tourist-artisans-option-icon"
                    size={16}
                    strokeWidth={2.6}
                  />

                  <select
                    aria-label="Lọc theo địa phương"
                    value={place}
                    onChange={(event) => setPlace(event.target.value)}
                  >
                    <option>Địa phương</option>

                    {placeOptions.map((option) => (
                      <option key={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  <ChevronDown size={14} />
                </label>


                {/* Bộ lọc sắp xếp danh sách nghệ nhân */}
                <label
                  className={
                    sort !== "Sắp xếp"
                      ? "has-selection"
                      : ""
                  }
                >
                  <ArrowDownUp
                    className="tourist-artisans-option-icon"
                    size={16}
                    strokeWidth={2.6}
                  />

                  <select
                    aria-label="Sắp xếp nghệ nhân"
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                  >
                    <option>Sắp xếp</option>
                    <option>Đánh giá cao</option>
                    <option>Tên A-Z</option>
                  </select>

                  <ChevronDown size={14} />
                </label>

          </div>
        </SearchFilterBar>


        {/* ----------------------------------------------------
            KHU VỰC DANH SÁCH NGHỆ NHÂN VÀ KHÁM PHÁ THÊM
        ---------------------------------------------------- */}

        <div className="tourist-artisans-layout">

          {/* Khu vực danh sách nghệ nhân */}
          <section aria-label="Danh sách nghệ nhân">

            {/* Hiển thị tổng số nghệ nhân sau khi lọc */}
            <span className="tourist-artisans-count">
              {filtered.length} nghệ nhân
            </span>

            {/* Hiển thị danh sách nghệ nhân nếu có kết quả */}
            {filtered.length ? (
              <div className="tourist-artisans-grid">

                {filtered.map((item) => (
                  <ArtisanCard
                    key={item.id}
                    artisan={item}
                    favoriteIds={favoriteIds}
                    onFavorite={onFavorite}
                  />
                ))}

              </div>
            ) : (

              // Thông báo khi không tìm thấy nghệ nhân phù hợp.
              <p className="tourist-empty">
                Không tìm thấy nghệ nhân phù hợp.
                Hãy thử từ khóa hoặc bộ lọc khác.
              </p>
            )}


            {/* Phân trang danh sách nghệ nhân */}
            {filtered.length > 0 && (
              <nav
                className="tourist-artisans-pagination"
                aria-label="Phân trang nghệ nhân"
              >

                <button
                  type="button"
                  aria-label="Trang trước"
                  disabled
                >
                  <ArrowLeft size={15} />
                </button>

                <button
                  type="button"
                  className="active"
                  aria-current="page"
                > 1  </button>

                <button type="button" disabled> 2 </button>

                <button type="button" disabled> 3 </button>

                <button
                  type="button"
                  aria-label="Trang sau"
                  disabled
                >
                  <ArrowRight size={15} />
                </button>

              </nav>
            )}

          </section>


          {/* Khu vực nội dung khám phá thêm */}
          <DiscoverMore
            crafts={crafts}
            traditionalCrafts={traditionalCrafts}
            products={products}
            stories={stories}
          />

        </div>
      </div>
    </div>
  );
}


{/*
routeFor()	Tạo đường dẫn đến trang chi tiết nghệ nhân
ArtisanHero()	Hiển thị banner Nghệ nhân
ArtisanCard()	Hiển thị thông tin từng nghệ nhân
DiscoverMore()	Hiển thị nội dung khám phá thêm
ArtisanListing()	Component chính quản lý danh sách
useState()	Quản lý trạng thái tìm kiếm bộ lọc và yêu thích
useMemo()	Xử lý tìm kiếm, lọc và sắp xếp
filtered	Danh sách nghệ nhân sau khi xử lý */}