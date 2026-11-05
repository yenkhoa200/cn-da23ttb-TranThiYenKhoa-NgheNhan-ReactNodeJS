const STORAGE_KEY = "artisan-experiences";

export const DEFAULT_ARTISAN_EXPERIENCES = [
  {
    id: 1,
    craft: "Nghề gốm Bát Tràng",
    title: "Một ngày làm gốm Bát Tràng",
    location: "Làng gốm Bát Tràng, Hà Nội",
    schedule: "2026-11-08T09:00",
    duration: "120 phút",
    capacity: 12,
    status: "published",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=85",
    description:
      "Du khách tìm hiểu quy trình làm gốm truyền thống, tự tay tạo hình sản phẩm trên bàn xoay và mang tác phẩm về làm kỷ niệm.",
  },
  {
    id: 2,
    craft: "Nghề dệt lụa Vạn Phúc",
    title: "Chạm vào sợi lụa Vạn Phúc",
    location: "Làng lụa Vạn Phúc, Hà Nội",
    schedule: "2026-11-15T14:00",
    duration: "90 phút",
    capacity: 10,
    status: "published",
    image:
      "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1000&q=85",
    description:
      "Khám phá hành trình từ kén tằm đến tấm lụa, tìm hiểu khung cửi truyền thống và thử dệt một hoa văn đơn giản.",
  },
  {
    id: 3,
    craft: "Nghề làm tranh Đông Hồ",
    title: "In tranh dân gian Đông Hồ",
    location: "Làng tranh Đông Hồ, Bắc Ninh",
    schedule: "2026-11-22T09:00",
    duration: "120 phút",
    capacity: 15,
    status: "draft",
    image:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1000&q=85",
    description:
      "Tìm hiểu giấy điệp, màu tự nhiên và ván khắc gỗ; tự tay in một bức tranh dân gian mang dấu ấn riêng.",
  },
  {
    id: 4,
    craft: "Nghề mây tre đan Phú Vinh",
    title: "Đan giỏ tre cùng làng nghề Phú Vinh",
    location: "Làng nghề Phú Vinh, Hà Nội",
    schedule: "2026-11-29T08:30",
    duration: "150 phút",
    capacity: 8,
    status: "draft",
    image:
      "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=1000&q=85",
    description:
      "Gặp gỡ nghệ nhân, làm quen với cách chọn và xử lý nan tre, sau đó hoàn thiện một chiếc giỏ nhỏ bằng kỹ thuật đan truyền thống.",
  },
];

export function readArtisanExperiences(fallback = []) {
  const savedExperiences = localStorage.getItem(STORAGE_KEY);
  if (savedExperiences) return JSON.parse(savedExperiences);
  if (fallback.length > 0) saveArtisanExperiences(fallback);
  return fallback;
}

export function saveArtisanExperiences(experiences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(experiences));
}
