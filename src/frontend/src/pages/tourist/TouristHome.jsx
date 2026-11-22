import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/path.js";
import logoImg from "../../assets/icons/logo_v1.png";
import productService from "../../services/productService.js";
import artisanExperienceService from "../../services/artisanExperienceService.js";
import { getProfileImageUrl } from "../../services/artisanProfileService.js";
import experienceBookingService from "../../services/experienceBookingService.js";
import touristContentService from "../../services/touristContentService.js";
import TouristLayout from "../../components/layout/TouristLayout.jsx";
import TouristLanding from "./TouristLanding.jsx";
import TouristBookingHistory from "./TouristBookingHistory.jsx";
import TouristViews from "./TouristViews.jsx";
import TouristVillagePages from "./TouristVillagePages.jsx";
import TouristVillageDetail from "./TouristVillageDetail.jsx";
import TouristTraditionalCrafts from "./TouristTraditionalCrafts.jsx";
import TouristTraditionalCraftDetail from "./TouristTraditionalCraftDetail.jsx";

const artisans = [
  {
    id: "artisan-lan",
    name: "Bà Trần Thị Mai",
    craft: "Làm nón lá",
    place: "Làng Chuông, Hà Nội",
    rating: "4.8",
    reviews: 124,
    years: 35,
    product: "Nón lá",
    phone: "0971 223 369",
    image: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=600&q=85",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=85",
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=85",
    ],
    description: "Bà Trần Thị Mai dành nhiều năm gìn giữ nghề nón truyền thống của làng Chuông. Từ những vòng tre nhỏ, bà tỉ mỉ rút từng khâu để tạo nên chiếc nón lá bền đẹp, mang đậm nét duyên của người phụ nữ Việt.",
  },
  {
    id: "artisan-binh",
    name: "Ông Nguyễn Văn Bình",
    craft: "Điêu khắc gỗ",
    place: "Định Thôn, Hà Nội",
    rating: "4.7",
    reviews: 98,
    years: 28,
    product: "Tượng gỗ thủ công",
    phone: "0912 456 780",
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=85",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=85",
      "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=600&q=85",
    ],
    description: "Ông Bình dành gần ba thập kỷ với nghề chạm khắc gỗ. Từ khối gỗ mộc mạc, ông thổi hồn vào từng đường nét, gìn giữ những hoa văn và kỹ thuật được truyền lại qua nhiều thế hệ.",
  },
  {
    id: "artisan-mai",
    name: "Bà Phạm Thị Hương",
    craft: "Thêu tay",
    place: "Quất Động, Hà Nội",
    rating: "4.9",
    reviews: 87,
    years: 32,
    product: "Tranh thêu tay",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=900&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=85",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=85",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=600&q=85",
    ],
    phone: "0986 312 405",
    description: "Bà Hương gắn bó với từng mũi kim đường chỉ từ thuở nhỏ. Những bức tranh thêu của bà kết hợp kỹ thuật truyền thống với cảm hứng từ thiên nhiên, mang vẻ đẹp tinh tế của làng nghề Quất Động.",
  },
  {
    id: "artisan-tung",
    name: "Ông Lê Văn Tùng",
    craft: "Gốm sứ",
    place: "Bát Tràng, Hà Nội",
    rating: "4.8",
    reviews: 112,
    years: 30,
    product: "Gốm men lam",
    phone: "0903 221 654",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=85",
    gallery: ["https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=85", "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=85", "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=600&q=85", "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=600&q=85"],
    description: "Ông Tùng lớn lên bên lò gốm Bát Tràng, am hiểu cách chọn đất, pha men và canh lửa. Mỗi sản phẩm của ông là sự kết hợp giữa kinh nghiệm lâu năm và nét sáng tạo riêng.",
  },
  {
    id: "artisan-quyen",
    name: "Ông Đỗ Văn Quyền",
    craft: "Đàn bầu",
    place: "Phú Thọ",
    rating: "4.7",
    reviews: 73,
    years: 26,
    product: "Đàn bầu thủ công",
    phone: "0914 556 209",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=85",
    gallery: ["https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1000&q=85", "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=85", "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=85", "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=600&q=85"],
    description: "Nghệ nhân Quyền dành trọn tâm huyết chế tác và biểu diễn đàn bầu. Qua từng thanh âm sâu lắng, ông góp phần lan tỏa vẻ đẹp của âm nhạc dân tộc đến với người trẻ.",
  },
  {
    id: "artisan-lan2",
    name: "Bà Nguyễn Thị Lan",
    craft: "Làm nón lá",
    place: "Huế",
    rating: "4.8",
    reviews: 91,
    years: 24,
    product: "Nón bài thơ",
    phone: "0935 442 118",
    image: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=900&q=85",
    gallery: ["https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=1000&q=85", "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=600&q=85", "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=85", "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=85"],
    description: "Bà Lan lưu giữ kỹ thuật làm nón bài thơ xứ Huế, tỉ mỉ chọn từng tàu lá và khâu từng mũi cước để tạo nên chiếc nón thanh thoát, bền đẹp.",
  },
  {
    id: "artisan-hung",
    name: "Ông Trần Văn Hùng",
    craft: "Làm mặt nạ",
    place: "Hội An, Đà Nẵng",
    rating: "4.9",
    reviews: 105,
    years: 22,
    product: "Mặt nạ tuồng",
    phone: "0908 731 662",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=900&q=85",
    gallery: ["https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1000&q=85", "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=600&q=85", "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=85", "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=85"],
    description: "Ông Hùng sáng tạo những chiếc mặt nạ rực rỡ lấy cảm hứng từ nghệ thuật tuồng và văn hóa phố Hội. Mỗi tác phẩm đều được vẽ tay và hoàn thiện với sự chăm chút.",
  },
  {
    id: "artisan-hoa",
    name: "Bà Lê Thị Hoa",
    craft: "Làm gốm",
    place: "Thanh Hà, Hội An",
    rating: "4.7",
    reviews: 76,
    years: 27,
    product: "Gốm đất nung",
    phone: "0977 631 845",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=85",
    gallery: ["https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=85", "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=85", "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=600&q=85", "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=600&q=85"],
    description: "Bà Hoa tiếp nối nghề gốm Thanh Hà, gìn giữ cách tạo hình thủ công và kỹ thuật nung gốm đất đỏ đặc trưng của vùng đất Hội An.",
  },
];

const crafts = [
  {
    id: "craft-bat-trang",
    title: "Làng nghề gốm Bát Tràng",
    category: "Gốm sứ",
    place: "Gia Lâm, Hà Nội",
    location: "Gia Lâm, Hà Nội",
    rating: "4.8",
    reviews: "1.2k",
    history: "Hơn 700 năm lịch sử",
    historyDescription: "Bát Tràng hình thành bên bờ sông Hồng, nơi nguồn đất sét quý và giao thương thuận lợi tạo điều kiện cho nghề gốm phát triển. Qua nhiều thế kỷ, các thế hệ nghệ nhân đã bồi đắp kỹ thuật tạo dáng, men và nung gốm đặc trưng.",
    introduction: "Nơi đây không chỉ lưu giữ tinh hoa nghề gốm mà còn là điểm đến văn hóa hấp dẫn, thu hút du khách trong và ngoài nước.",
    tradition: "Từ chọn đất, luyện đất, tạo hình trên bàn xoay đến tráng men và canh lửa lò, mỗi công đoạn đều đòi hỏi kinh nghiệm cùng sự tỉ mỉ của người thợ.",
    visitingHours: "8:00 – 17:00 (hằng ngày)",
    transport: "Khoảng 20 km từ trung tâm Hà Nội",
    featuredImage: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=900&q=85",
    ],
    tagline: "Tinh hoa gốm Việt, lưu giữ qua bao thế hệ",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=85",
    description: "Hơn 700 năm, Bát Tràng vẫn đỏ lửa với những kỹ thuật làm gốm được lưu truyền qua nhiều thế hệ. Mỗi sản phẩm mang dấu ấn của đất, men và đôi tay người thợ.",
  },
  {
    id: "craft-van-phuc",
    title: "Làng lụa Vạn Phúc",
    category: "Dệt lụa",
    place: "Hà Đông, Hà Nội",
    location: "Hà Đông, Hà Nội",
    rating: "4.7",
    reviews: "856",
    history: "Hơn 1.000 năm lịch sử",
    historyDescription: "Làng lụa Vạn Phúc lưu giữ nghề dệt tơ lâu đời. Tiếng thoi đưa và những hoa văn trên lụa phản ánh sự khéo léo, óc sáng tạo và nhịp sống của nhiều thế hệ người thợ.",
    visitingHours: "8:00 – 18:00 (hằng ngày)",
    transport: "Khoảng 10 km từ trung tâm Hà Nội",
    featuredImage: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=1200&q=85",
    gallery: ["https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85", "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=85"],
    tagline: "Sợi tơ mềm kể chuyện một miền di sản",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=1000&q=85",
    description: "Tiếng thoi đưa ở Vạn Phúc kể câu chuyện về nghề dệt lụa lâu đời, nơi những sợi tơ mềm được biến thành hoa văn tinh tế.",
  },
  {
    id: "craft-chuong",
    title: "Làng nón Chuông",
    category: "Nón lá",
    place: "Thanh Oai, Hà Nội",
    location: "Thanh Oai, Hà Nội",
    rating: "4.6",
    reviews: "642",
    history: "Nghề nón truyền thống",
    visitingHours: "8:00 – 17:00 (hằng ngày)",
    transport: "Khoảng 30 km từ trung tâm Hà Nội",
    featuredImage: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=1200&q=85",
    gallery: ["https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=85", "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85"],
    tagline: "Nét duyên mộc mạc của chiếc nón làng Chuông",
    image: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=1000&q=85",
    description: "Từ vành tre, lá cọ đến đường khâu đều đặn, chiếc nón Chuông là kết tinh của sự tỉ mỉ và vẻ đẹp bình dị của làng quê Bắc Bộ.",
  },
  {
    id: "craft-hoi-an",
    title: "Làng lụa Hội An",
    category: "Dệt lụa",
    place: "Hội An, Quảng Nam",
    location: "Hội An, Quảng Nam",
    rating: "4.8",
    reviews: "979",
    history: "Di sản nghề phố Hội",
    visitingHours: "8:00 – 17:30 (hằng ngày)",
    transport: "Trong khu vực thành phố Hội An",
    featuredImage: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85",
    gallery: ["https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85", "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=85"],
    tagline: "Sắc lụa phố Hội, giao hòa cùng văn hóa",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=1000&q=85",
    description: "Tìm hiểu nghề dệt lụa và những hoa văn thủ công đã góp phần tạo nên sắc màu văn hóa phố Hội.",
  },
  {
    id: "craft-phu-vinh",
    title: "Nghề mây tre đan Phú Vinh",
    category: "Mây tre đan",
    place: "Chương Mỹ, Hà Nội",
    location: "Chương Mỹ, Hà Nội",
    rating: "4.7",
    reviews: "573",
    history: "Nghề đan lát lâu đời",
    featuredImage: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=85",
    gallery: ["https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=85", "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=900&q=85"],
    tagline: "Từ sợi mây tre mộc mạc đến tác phẩm tinh xảo",
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1000&q=85",
    description: "Khám phá kỹ thuật đan mây tre tinh xảo, biến những sợi nguyên liệu mộc mạc thành vật dụng và tác phẩm thủ công.",
  },
];

const products = [
  {
    id: "product-gom-vase",
    title: "Bình gốm men lam",
    category: "Gốm Bát Tràng",
    craftId: "craft-bat-trang",
    price: 650000,
    rating: "4.8",
    reviews: 124,
    material: "Đất sét cao cấp, men lam truyền thống",
    dimensions: "Cao 25cm, đường kính 15cm",
    highlights: ["Chất liệu: Đất sét cao cấp, nung ở nhiệt độ cao", "Kỹ thuật: Men lam truyền thống", "Kích thước: Cao khoảng 25cm, đường kính 15cm", "Phù hợp: Trang trí, làm quà tặng"],
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=85",
    description: "Bình gốm tạo hình thủ công, phủ men lam truyền thống và nung ở nhiệt độ cao.",
  },
  {
    id: "product-silk-scarf",
    title: "Khăn lụa tơ tằm",
    category: "Lụa Vạn Phúc",
    craftId: "craft-van-phuc",
    price: 450000,
    rating: "4.9",
    reviews: 76,
    material: "Tơ tằm tự nhiên",
    dimensions: "Dài 180cm, rộng 50cm",
    highlights: ["Chất liệu: Tơ tằm tự nhiên mềm nhẹ", "Kỹ thuật: Dệt lụa thủ công truyền thống", "Họa tiết thanh nhã, màu sắc hài hòa", "Phù hợp làm quà tặng và phụ kiện"],
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=700&q=85",
    description: "Khăn lụa dệt từ tơ tằm, nổi bật với chất vải mềm nhẹ và hoa văn thanh nhã.",
  },
  {
    id: "product-conical-hat",
    title: "Nón lá làng Chuông",
    category: "Nón lá",
    craftId: "craft-chuong",
    price: 120000,
    rating: "4.8",
    reviews: 49,
    material: "Lá cọ, vành tre",
    dimensions: "Đường kính khoảng 45cm",
    highlights: ["Chất liệu: Lá cọ và vành tre tuyển chọn", "Kỹ thuật: Khâu nón thủ công nhiều lớp", "Trọng lượng nhẹ, chắc chắn và thoáng mát", "Phù hợp sử dụng hằng ngày hoặc làm quà"],
    image: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=700&q=85",
    description: "Chiếc nón được làm từ vành tre, lá cọ và những đường khâu đều đặn của người thợ làng Chuông.",
  },
];

const stories = [
  {
    id: "story-gom",
    category: "Câu chuyện làng nghề",
    title: "Giữ lửa lò, giữ hồn đất Bát Tràng",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=85",
    description: "Trong sắc đỏ của lò nung, mỗi người thợ gửi vào đất một phần ký ức. Câu chuyện của Bát Tràng cũng là câu chuyện về những gia đình bền bỉ giữ nghề và làm mới truyền thống.",
  },
  {
    id: "story-lua",
    category: "Tri thức văn hóa",
    title: "Sợi tơ và những hoa văn kể chuyện",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=1000&q=85",
    description: "Mỗi hoa văn trên tấm lụa là một cách người thợ gửi gắm thiên nhiên và nhịp sống. Hãy cùng tìm hiểu ý nghĩa của những họa tiết đã đi cùng làng lụa qua bao thế hệ.",
  },
  {
    id: "story-non",
    category: "Giá trị văn hóa",
    title: "Chiếc nón lá trong đời sống người Việt",
    image: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=1000&q=85",
    description: "Mộc mạc mà hữu ích, chiếc nón lá hiện diện trong lao động, lễ hội và cả những câu ca. Nghề làm nón lưu giữ một lát cắt thân thuộc của văn hóa Việt.",
  },
  {
    id: "story-pho-co",
    category: "Di sản văn hóa",
    title: "Phố cổ Hội An",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1000&q=85",
    description: "Những mái nhà cổ, hội quán và phố đèn lồng lưu giữ dấu ấn của một thương cảng xưa, nơi nhiều dòng văn hóa gặp gỡ và giao thoa.",
  },
];

const activities = [
  {
    id: "activity-gom",
    title: "Trải nghiệm làm gốm Bát Tràng",
    category: "Thủ công mỹ nghệ",
    place: "Làng gốm Bát Tràng, Hà Nội",
    duration: "1.5 giờ",
    durationHours: 1.5,
    rating: "4.8",
    reviews: 120,
    maxParticipants: 20,
    schedule: "Thứ 7, Chủ nhật hằng tuần",
    minimumAge: "Từ 6 tuổi trở lên",
    gallery: [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=88",
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=600&q=85",
      "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=600&q=85",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=85",
    ],
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=85",
    description: "Khám phá quy trình tạo hình, tự tay nặn một món đồ gốm và nghe nghệ nhân kể chuyện về đất, men và lò nung.",
  },
  {
    id: "activity-lua",
    title: "Trải nghiệm dệt vải thủ công",
    category: "Trải nghiệm làng nghề",
    place: "Làng dệt Nam Định",
    duration: "2 giờ",
    durationHours: 2,
    rating: "4.7",
    reviews: 72,
    maxParticipants: 12,
    schedule: "Thứ 7 và Chủ nhật",
    minimumAge: "Từ 10 tuổi trở lên",
    gallery: [
      "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=1200&q=88",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=85",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=85",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=600&q=85",
    ],
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=1000&q=85",
    description: "Tìm hiểu hành trình từ sợi tơ đến tấm vải, thử đưa thoi và khám phá cách người thợ tạo nên hoa văn truyền thống.",
  },
  {
    id: "activity-calligraphy",
    title: "Tham gia lớp thư pháp Việt",
    category: "Nghệ thuật dân gian",
    place: "Đình làng, Hà Nội",
    duration: "1.5 giờ",
    durationHours: 1.5,
    rating: "4.7",
    reviews: 76,
    maxParticipants: 15,
    schedule: "Thứ 7 hằng tuần",
    minimumAge: "Từ 8 tuổi trở lên",
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1000&q=85",
    description: "Làm quen với nghệ thuật thư pháp, tự tay viết nét chữ đầu tiên và lắng nghe câu chuyện về chữ Việt.",
  },
  {
    id: "activity-festival",
    title: "Tham gia lễ hội truyền thống",
    category: "Lễ hội & sự kiện",
    place: "Làng cổ Phù Vinh, Bắc Ninh",
    duration: "2 giờ",
    durationHours: 2,
    rating: "4.9",
    reviews: 210,
    maxParticipants: 30,
    schedule: "Theo lịch lễ hội địa phương",
    minimumAge: "Phù hợp mọi lứa tuổi",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1000&q=85",
    description: "Hòa mình vào không khí lễ hội, tìm hiểu phong tục địa phương và những giá trị văn hóa được gìn giữ qua nhiều thế hệ.",
  },
  {
    id: "activity-banh-chung",
    title: "Tự tay làm bánh chưng",
    category: "Ẩm thực truyền thống",
    place: "Làng nghề Tranh Đông, Hà Nội",
    duration: "1.5 giờ",
    durationHours: 1.5,
    rating: "4.8",
    reviews: 95,
    maxParticipants: 16,
    schedule: "Thứ 7, Chủ nhật hằng tuần",
    minimumAge: "Từ 6 tuổi trở lên",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=85",
    description: "Cùng chuẩn bị lá dong, gạo nếp và nhân đỗ, rồi tự tay gói chiếc bánh chưng mang hương vị Tết Việt.",
  },
  {
    id: "activity-ao-dai",
    title: "Trải nghiệm may áo dài truyền thống",
    category: "Văn hóa truyền thống",
    place: "Làng lụa Hội An, Quảng Nam",
    duration: "2 giờ",
    durationHours: 2,
    rating: "4.9",
    reviews: 98,
    maxParticipants: 10,
    schedule: "Thứ 3 đến Chủ nhật",
    minimumAge: "Từ 12 tuổi trở lên",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85",
    description: "Khám phá chất liệu lụa, tìm hiểu trang phục truyền thống và thử các công đoạn may áo dài cùng người thợ địa phương.",
  },
];

const mediaItems = [
  { title: "Đôi tay tạo hình gốm", type: "Video", image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=700&q=85" },
  { title: "Sắc màu lụa Vạn Phúc", type: "Hình ảnh", image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=700&q=85" },
  { title: "Một góc làng nghề", type: "Hình ảnh", image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=700&q=85" },
  { title: "Bàn xoay của nghệ nhân", type: "Video", image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=85" },
  { title: "Sản phẩm từ đôi tay", type: "Hình ảnh", image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=700&q=85" },
  { title: "Nét đẹp nghề truyền thống", type: "Video", image: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=700&q=85" },
];

function readStorage(key, fallback) {
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function publicMediaUrl(url) {
  return url ? getProfileImageUrl(url) : "";
}

export default function TouristHome() {
  const location = useLocation();
  const navigate = useNavigate();
  const segments = location.pathname.split("/").filter(Boolean);
  const view = segments[1] || "home";
  const detailId = segments[2] || "";
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("Tất cả");
  const [mediaType, setMediaType] = useState("Tất cả");
  const [databaseProducts, setDatabaseProducts] = useState([]);
  const [databaseActivities, setDatabaseActivities] = useState([]);
  const [databaseArtisans, setDatabaseArtisans] = useState([]);
  const [databaseStories, setDatabaseStories] = useState([]);
  const [databaseTraditionalCrafts, setDatabaseTraditionalCrafts] = useState([]);
  const [databaseLoaded, setDatabaseLoaded] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(() => readStorage("tourist-favorites", []));
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState(() => readStorage("tourist-reviews", []));
  const [authUser, setAuthUser] = useState(() => readStorage("auth-user", null));
  const [bookingNotifications, setBookingNotifications] = useState(() => {
    const scope = authUser?.id || authUser?.email || "guest";
    const notifications = readStorage(`tourist-booking-notifications:${scope}`, []);
    return {
      scope: String(scope),
      items: Array.isArray(notifications) ? notifications : [],
    };
  });
  const [bookingNotificationError, setBookingNotificationError] = useState("");
  const seenBookingEventsRef = useRef(null);
  const [notice, setNotice] = useState("");
  const [profile, setProfile] = useState(() => {
    const savedProfile = readStorage("tourist-profile", {});
    const account = readStorage("auth-user", null);

    return {
      name: "Trần Thị Yến Khoa",
      email: "khoatty@gmail.com",
      phone: "0987 654 321",
      ...savedProfile,
      ...(account?.role === "DU_KHACH" ? {
        name: account.name,
        email: account.email,
        phone: account.phone,
      } : {}),
    };
  });
  const [profileDraft, setProfileDraft] = useState(profile);

  useEffect(() => {
    let ignore = false;
    Promise.allSettled([
      productService.getAll(),
      artisanExperienceService.listPublic(),
      touristContentService.getArtisans(),
      touristContentService.getStories(),
      touristContentService.getTraditionalCrafts(),
    ]).then((results) => {
        if (ignore) return;
        const [productsResult, activitiesResult, artisansResult, storiesResult, craftsResult] = results;
        const errors = [];
        if (productsResult.status === "fulfilled") setDatabaseProducts(productsResult.value);
        else errors.push(productsResult.reason.message);
        if (activitiesResult.status === "fulfilled") setDatabaseActivities(activitiesResult.value);
        else errors.push(activitiesResult.reason.message);
        if (artisansResult.status === "fulfilled") setDatabaseArtisans(artisansResult.value);
        else errors.push(artisansResult.reason.message);
        if (storiesResult.status === "fulfilled") setDatabaseStories(storiesResult.value);
        else errors.push(storiesResult.reason.message);
        if (craftsResult.status === "fulfilled") setDatabaseTraditionalCrafts(craftsResult.value);
        else errors.push(craftsResult.reason.message);
        setDatabaseLoaded(true);
        if (errors.length) setNotice(errors.join(" "));
      });
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem("tourist-favorites", JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  useEffect(() => {
    window.localStorage.setItem("tourist-reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    window.localStorage.setItem("tourist-profile", JSON.stringify(profile));
  }, [profile]);

  const liveProducts = useMemo(() => databaseProducts.map((item) => {
    const gallery = (item.media || [])
      .filter((entry) => entry.type === "hinh_anh")
      .map((entry) => publicMediaUrl(entry.url))
      .filter(Boolean);
    const relatedCraft = item.craft
      ? crafts.find((craft) => craft.category === item.craft)
        || crafts.find((craft) => craft.title.toLocaleLowerCase("vi").includes(item.craft.toLocaleLowerCase("vi")))
      : null;
    const video = (item.media || []).find((entry) => entry.type === "video")?.url;
    return {
      id: `product-${item.id}`,
      title: item.title,
      category: item.category,
      price: Number(item.price || 0),
      description: item.description,
      artisan: item.artisan,
      craft: item.craft || item.category,
      craftId: relatedCraft?.id,
      image: gallery[0] || logoImg,
      gallery,
      video,
      material: item.material,
      process: item.process,
      artisanId: `artisan-${item.artisan_id}`,
    };
  }), [databaseProducts]);
  const visibleProducts = databaseLoaded ? liveProducts : products;
  const liveActivities = useMemo(() => databaseActivities
    .map((item) => {
      const gallery = (item.media || [])
        .filter((entry) => entry.type === "hinh_anh")
        .map((entry) => publicMediaUrl(entry.url))
        .filter(Boolean);
      return {
        id: `activity-${item.id}`,
        title: item.title,
        category: item.category || "Nghề truyền thống",
        artisan: item.artisan || "",
        artisanId: `artisan-${item.artisan_id}`,
        place: item.place,
        duration: `${item.duration} phút`,
        durationHours: Number(item.duration) / 60,
        maxParticipants: item.max_participants,
        schedule: item.schedule,
        minimumAge: item.requirements || "Không có yêu cầu đặc biệt",
        image: publicMediaUrl(item.image) || gallery[0] || logoImg,
        gallery,
        description: item.description || "",
      };
    }), [databaseActivities]);
  const visibleActivities = databaseLoaded ? liveActivities : activities;
  const liveArtisans = useMemo(() => databaseArtisans.map((item) => {
    const gallery = (item.media || [])
      .filter((entry) => entry.type === "hinh_anh")
      .map((entry) => publicMediaUrl(entry.url))
      .filter(Boolean);
    const images = [...new Set([publicMediaUrl(item.image), ...gallery].filter(Boolean))];
    return {
      id: `artisan-${item.id}`,
      name: item.name,
      craft: item.craft || "Nghề truyền thống",
      place: item.place || "Đang cập nhật địa điểm",
      rating: item.rating,
      reviews: Number(item.reviews || 0),
      years: item.years,
      careerHistory: item.career_history,
      craftVillageDescription: item.craft_village_description,
      experienceDescription: item.experience_description,
      product: item.craft || "Nghề truyền thống",
      image: images[0] || logoImg,
      gallery: images,
      description: item.description,
      verified: item.verified,
    };
  }), [databaseArtisans]);
  const visibleArtisans = databaseLoaded ? liveArtisans : artisans;
  const liveStories = useMemo(() => databaseStories.map((item) => {
    const media = item.media || [];
    const gallery = media
      .filter((entry) => entry.type === "hinh_anh")
      .map((entry) => publicMediaUrl(entry.url))
      .filter(Boolean);
    const categoryMap = {
      cau_chuyen: "Câu chuyện làng nghề",
      kien_thuc: "Tri thức văn hóa",
      phong_tuc: "Phong tục và tập quán",
      ky_thuat: "Nghề truyền thống",
      khac: "Giá trị văn hóa",
    };
    return {
      id: `story-${item.id}`,
      category: categoryMap[item.category] || "Giá trị văn hóa",
      title: item.title,
      image: gallery[0] || publicMediaUrl(item.artisan_image) || logoImg,
      gallery,
      description: item.description || item.content || "",
      content: item.content,
      culturalValue: item.cultural_value,
      artisan: item.artisan,
      artisanId: `artisan-${item.artisan_id}`,
      video: media.find((entry) => entry.type === "video")?.url,
    };
  }), [databaseStories]);
  const visibleStories = databaseLoaded ? liveStories : stories;
  const visibleTraditionalCrafts = databaseTraditionalCrafts.map((item) => ({
    id: `traditional-craft-${item.id}`,
    name: item.name,
    description: item.description || "",
    origin: item.origin || "",
    technique: item.technique || "",
    culturalValue: item.cultural_value || "",
    image: publicMediaUrl(item.image) || logoImg,
    villages: item.villages || "",
    artisanCount: Number(item.artisan_count || 0),
    activityCount: Number(item.activity_count || 0),
  }));
  const liveMediaItems = useMemo(() => [
    ...databaseArtisans.flatMap((item) => (item.media || [])
      .filter((entry) => ["hinh_anh", "video"].includes(entry.type))
      .map((entry) => ({
        id: `artisan-media-${entry.id}`,
        title: entry.caption || item.name,
        type: entry.type === "video" ? "Video" : "Hình ảnh",
        image: entry.type === "hinh_anh" ? publicMediaUrl(entry.url) : publicMediaUrl(item.image) || logoImg,
        videoUrl: entry.type === "video" ? publicMediaUrl(entry.url) : "",
      }))),
    ...databaseStories.flatMap((item) => (item.media || [])
      .filter((entry) => ["hinh_anh", "video"].includes(entry.type))
      .map((entry) => ({
        id: `story-media-${entry.id}`,
        title: entry.caption || item.title,
        type: entry.type === "video" ? "Video" : "Hình ảnh",
        image: entry.type === "hinh_anh" ? publicMediaUrl(entry.url) : publicMediaUrl(item.artisan_image) || logoImg,
        videoUrl: entry.type === "video" ? publicMediaUrl(entry.url) : "",
      }))),
    ...databaseProducts.flatMap((item) => (item.media || [])
      .filter((entry) => ["hinh_anh", "video"].includes(entry.type))
      .map((entry) => ({
        id: `product-media-${entry.id}`,
        title: entry.caption || item.title,
        type: entry.type === "video" ? "Video" : "Hình ảnh",
        image: entry.type === "hinh_anh" ? publicMediaUrl(entry.url) : logoImg,
        videoUrl: entry.type === "video" ? publicMediaUrl(entry.url) : "",
      }))),
    ...databaseActivities.flatMap((item) => (item.media || [])
      .filter((entry) => ["hinh_anh", "video"].includes(entry.type))
      .map((entry) => ({
        id: `activity-media-${entry.id}`,
        title: entry.caption || item.title,
        type: entry.type === "video" ? "Video" : "Hình ảnh",
        image: entry.type === "hinh_anh" ? publicMediaUrl(entry.url) : publicMediaUrl(item.image) || logoImg,
        videoUrl: entry.type === "video" ? publicMediaUrl(entry.url) : "",
      }))),
  ], [databaseActivities, databaseArtisans, databaseProducts, databaseStories]);
  const visibleMediaItems = databaseLoaded ? liveMediaItems : mediaItems;
  const allItems = useMemo(
    () => [...visibleArtisans, ...crafts, ...visibleTraditionalCrafts, ...visibleProducts, ...visibleStories, ...visibleActivities],
    [visibleArtisans, visibleTraditionalCrafts, visibleProducts, visibleStories, visibleActivities],
  );
  const savedItems = useMemo(() => allItems.filter((item) => favoriteIds.includes(item.id)), [favoriteIds, allItems]);
  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };
  const isTourist = Boolean(window.localStorage.getItem("auth-token"))
    && ["DU_KHACH", "du_khach"].includes(String(authUser?.role || "").toUpperCase());
  const notificationScope = authUser?.id || authUser?.email || "guest";
  const notificationStorageKey = `tourist-booking-notifications:${notificationScope}`;
  const seenBookingEventsKey = `tourist-booking-events-seen:${notificationScope}`;

  useEffect(() => {
    if (!isTourist) {
      seenBookingEventsRef.current = null;
      return undefined;
    }

    let active = true;
    const savedNotifications = readStorage(notificationStorageKey, []);
    const savedEventIds = readStorage(seenBookingEventsKey, null);
    seenBookingEventsRef.current = Array.isArray(savedEventIds) ? new Set(savedEventIds) : null;

    const pollBookingNotifications = async () => {
      try {
        const bookings = await experienceBookingService.listMine();
        if (!active) return;
        const scope = String(notificationScope);
        const storedNotifications = Array.isArray(savedNotifications) ? savedNotifications : [];
        setBookingNotifications((current) => current.scope === scope
          ? current
          : { scope, items: storedNotifications });

        const statusMessages = {
          confirmed: "Nghệ nhân đã xác nhận lịch đặt",
          rejected: "Nghệ nhân đã từ chối yêu cầu đặt lịch",
          cancelled: "Lịch đặt trải nghiệm đã bị hủy",
          completed: "Hoạt động trải nghiệm đã được ghi nhận hoàn thành",
        };
        const events = bookings.flatMap((booking) => (booking.status_history || [])
          .filter((event) => statusMessages[event.status])
          .map((event) => ({
            id: `${booking.id}:${event.status}:${event.changedAt}`,
            bookingId: String(booking.id),
            activityTitle: booking.activity_title,
            status: event.status,
            changedAt: event.changedAt,
            message: `${statusMessages[event.status]}: ${booking.activity_title}.`,
            reason: event.reason || "",
          })));
        const currentIds = events.map((event) => event.id);
        const seenIds = seenBookingEventsRef.current;
        if (seenIds === null) {
          seenBookingEventsRef.current = new Set(currentIds);
          window.localStorage.setItem(seenBookingEventsKey, JSON.stringify(currentIds));
          setBookingNotificationError("");
          return;
        }

        const newEvents = events.filter((event) => !seenIds.has(event.id));
        const nextSeenIds = new Set([...seenIds, ...currentIds]);
        seenBookingEventsRef.current = nextSeenIds;
        window.localStorage.setItem(seenBookingEventsKey, JSON.stringify([...nextSeenIds]));
        setBookingNotificationError("");

        if (newEvents.length) {
          setBookingNotifications((current) => {
            const currentItems = current.scope === scope ? current.items : storedNotifications;
            const existingIds = new Set(currentItems.map((item) => item.id));
            const added = newEvents
              .filter((event) => !existingIds.has(event.id))
              .map((event) => ({ ...event, read: false }));
            const updated = [...added.reverse(), ...currentItems].slice(0, 20);
            window.localStorage.setItem(notificationStorageKey, JSON.stringify(updated));
            return { scope, items: updated };
          });
          setNotice(newEvents[newEvents.length - 1].message);
          window.setTimeout(() => setNotice(""), 2600);
        }
      } catch (error) {
        if (active) setBookingNotificationError(error.message);
      }
    };

    pollBookingNotifications();
    const intervalId = window.setInterval(pollBookingNotifications, 15000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [isTourist, notificationScope, notificationStorageKey, seenBookingEventsKey]);

  const markBookingNotificationsRead = () => {
    setBookingNotifications((current) => {
      const savedItems = readStorage(notificationStorageKey, []);
      const currentItems = current.scope === String(notificationScope)
        ? current.items
        : Array.isArray(savedItems) ? savedItems : [];
      const updated = currentItems.map((item) => ({ ...item, read: true }));
      window.localStorage.setItem(notificationStorageKey, JSON.stringify(updated));
      return { scope: String(notificationScope), items: updated };
    });
  };

  const toggleFavorite = (item) => {
    const saved = favoriteIds.includes(item.id);
    setFavoriteIds((current) => saved ? current.filter((id) => id !== item.id) : [...current, item.id]);
    showNotice(saved ? "Đã xóa khỏi danh sách yêu thích." : "Đã lưu vào danh sách yêu thích.");
  };

  const submitReview = (event) => {
    event.preventDefault();
    const content = reviewText.trim();
    if (!content) return;
    setReviews((current) => [{ id: Date.now(), rating, content, name: profile.name }, ...current]);
    setReviewText("");
    showNotice("Cảm ơn bạn đã gửi nhận xét!");
  };

  const saveProfile = (event) => {
    event.preventDefault();
    setProfile(profileDraft);
    showNotice("Thông tin cá nhân đã được cập nhật.");
  };

  const submitActivityBooking = async (booking) => {
    if (!isTourist) {
      navigate(ROUTES.LOGIN, {
        state: { from: { pathname: location.pathname }, accountType: "visitor" },
      });
      return;
    }

    try {
      await experienceBookingService.create(detailId, booking);
      showNotice("Đã gửi yêu cầu đặt lịch. Nghệ nhân sẽ sớm phản hồi.");
      navigate(ROUTES.TOURIST_BOOKINGS);
    } catch (error) {
      showNotice(error.message);
    }
  };

  const submitSearch = (event) => {
    event.preventDefault();
    setSearchType("Tất cả");
    navigate("/tourist/search");
  };

  const data = {
    artisans: visibleArtisans,
    crafts,
    traditionalCrafts: visibleTraditionalCrafts,
    products: visibleProducts,
    stories: visibleStories,
    activities: visibleActivities,
    mediaItems: visibleMediaItems,
    allItems,
    savedItems,
    detailId,
  };

  const goToView = (destination) => navigate(`/tourist/${destination}`);
  const activeView = view;
  const logout = () => {
    window.localStorage.removeItem("auth-token");
    window.localStorage.removeItem("auth-user");
    setAuthUser(null);
    navigate(ROUTES.HOME);
  };

  return (
    <TouristLayout
      view={view}
      isTourist={isTourist}
      favoriteIds={favoriteIds}
      profile={profile}
      onLogout={logout}
      notifications={isTourist && bookingNotifications.scope === String(notificationScope) ? bookingNotifications.items : []}
      notificationError={isTourist ? bookingNotificationError : ""}
      onNotificationsRead={markBookingNotificationsRead}
      overlays={(
        <>
          {notice && <div className="tourist-toast" role="status">{notice}</div>}
          {selectedMedia && (
            <div className="tourist-modal-backdrop" role="presentation" onClick={() => setSelectedMedia(null)}>
              <section className="tourist-detail-modal tourist-media-modal" role="dialog" aria-modal="true" aria-labelledby="tourist-modal-title" onClick={(event) => event.stopPropagation()}>
                <button type="button" className="tourist-modal-close" onClick={() => setSelectedMedia(null)} aria-label="Đóng"><X size={19} /></button>
                {selectedMedia.videoUrl
                  ? <video className="tourist-modal-image" src={selectedMedia.videoUrl} controls />
                  : <img className="tourist-modal-image" src={selectedMedia.image} alt="" />}
                <div className="tourist-modal-content"><span className="tourist-eyebrow">{selectedMedia.type}</span><h2 id="tourist-modal-title">{selectedMedia.title}</h2><p>{selectedMedia.description}</p></div>
              </section>
            </div>
          )}
        </>
      )}
    >
        {view === "bookings" ? (
          isTourist
            ? <div className="tourist-content tourist-view-content"><TouristBookingHistory /></div>
            : <Navigate to={ROUTES.LOGIN} replace state={{ from: { pathname: ROUTES.TOURIST_BOOKINGS }, accountType: "visitor" }} />
        ) : view === "home" ? (
          <TouristLanding
            query={query}
            onQuery={setQuery}
            onSearch={submitSearch}
            data={data}
          />
        ) : view === "crafts" ? (
          <TouristVillagePages
            crafts={crafts}
            favoriteIds={favoriteIds}
            onFavorite={toggleFavorite}
            query={query}
            onQuery={setQuery}
          />
        ) : view === "traditional-crafts" ? (
          <TouristTraditionalCrafts
            crafts={visibleTraditionalCrafts}
            query={query}
            onQuery={setQuery}
            loading={!databaseLoaded}
            favoriteIds={favoriteIds}
            onFavorite={toggleFavorite}
          />
        ) : view === "traditional-craft" ? (
          <TouristTraditionalCraftDetail
            craft={visibleTraditionalCrafts.find((item) => item.id === detailId)}
            favoriteIds={favoriteIds}
            onFavorite={toggleFavorite}
            onNotice={showNotice}
          />
        ) : view === "craft" ? (
          <TouristVillageDetail
            village={crafts.find((item) => item.id === detailId)}
            artisans={artisans}
            products={products}
            activities={activities}
            favoriteIds={favoriteIds}
            onFavorite={toggleFavorite}
            onNotice={showNotice}
          />
        ) : (
          <div className={`tourist-content tourist-view-content${view === "activities" ? " tourist-activities-content" : ""}${view === "activity" ? " tourist-activity-detail-content" : ""}${view === "artisans" ? " tourist-artisans-content" : ""}${view === "artisan" ? " tourist-artisan-detail-content" : ""}${["products", "product"].includes(view) ? " tourist-product-content" : ""}`}>
            <TouristViews
              view={activeView}
              data={data}
              favoriteIds={favoriteIds}
              onFavorite={toggleFavorite}
              query={query}
              onQuery={setQuery}
              searchType={searchType}
              onSearchType={setSearchType}
              mediaType={mediaType}
              onMediaType={setMediaType}
              onOpenMedia={(item) => setSelectedMedia({ ...item, description: item.description || "" })}
              reviews={reviews}
              rating={rating}
              onRating={setRating}
              reviewText={reviewText}
              onReviewText={setReviewText}
              onSubmitReview={submitReview}
              profile={profile}
              profileDraft={profileDraft}
              onDraftChange={setProfileDraft}
              onSaveProfile={saveProfile}
              onNavigate={goToView}
              onNotice={showNotice}
              onBooking={submitActivityBooking}
            />
          </div>
        )}
    </TouristLayout>
  );
}
