import {
  Activity,
  Archive,
  BadgeCheck,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  ClipboardList,
  Eye,
  FileImage,
  Flag,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Pencil,
  Plus,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Star,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/icons/logo_v1.png";
import { ROUTES } from "../../routes/path.js";
import "../../styles/AdminDashboard.css";

const navigation = [
  { label: "Tổng quan", path: "/admin", icon: LayoutDashboard },
  { label: "Quản lý tài khoản", path: "/admin/accounts", icon: Users },
  { label: "Quản lý nghệ nhân", path: "/admin/artisans", icon: UserCheck },
  { label: "Nghề truyền thống", path: "/admin/crafts", icon: Leaf },
  { label: "Quản lý sản phẩm", path: "/admin/products", icon: Package },
  { label: "Nội dung văn hóa", path: "/admin/stories", icon: BookOpen },
  { label: "Hoạt động trải nghiệm", path: "/admin/experiences", icon: CalendarDays },
  { label: "Hình ảnh và video", path: "/admin/media", icon: FileImage },
  { label: "Quản lý đánh giá", path: "/admin/reviews", icon: MessageSquare },
  { label: "Nội dung vi phạm", path: "/admin/reports", icon: ShieldAlert },
];

// eslint-disable-next-line react-refresh/only-export-components
export const pageDefinitions = {
  accounts: {
    title: "Quản lý tài khoản",
    addLabel: "Thêm tài khoản",
    description: "Theo dõi và quản lý tài khoản trên hệ thống Tinh Hoa Việt.",
    searchPlaceholder: "Tìm họ tên, email hoặc số điện thoại...",
    filterLabel: "Vai trò",
    filterKey: "role",
    filterOptions: ["Quản trị viên", "Nghệ nhân", "Du khách"],
    fields: ["name", "email", "phone", "role", "created", "status"],
    columns: [
      ["name", "Họ và tên"], ["email", "Email"], ["phone", "Số điện thoại"],
      ["role", "Vai trò"], ["created", "Ngày tạo"], ["status", "Trạng thái"],
    ],
  },
  artisans: {
    title: "Quản lý nghệ nhân",
    addLabel: "Thêm nghệ nhân",
    description: "Xem hồ sơ, xác minh và quản lý cộng đồng nghệ nhân.",
    searchPlaceholder: "Tìm nghệ nhân, nghề hoặc địa phương...",
    filterLabel: "Xác minh",
    filterKey: "verification",
    filterOptions: ["Đã xác minh", "Chờ xác minh", "Từ chối"],
    fields: ["name", "craft", "village", "location", "experience", "bio", "journey", "products", "stories", "activities", "verification", "status"],
    columns: [
      ["name", "Nghệ nhân"], ["craft", "Nghề truyền thống"], ["village", "Làng nghề"],
      ["location", "Địa phương"], ["verification", "Xác minh"], ["status", "Tài khoản"],
    ],
  },
  crafts: {
    title: "Quản lý nghề truyền thống",
    description: "Lưu giữ thông tin về nghề và những làng nghề Việt Nam.",
    searchPlaceholder: "Tìm tên nghề hoặc địa phương...",
    filterLabel: "Trạng thái",
    filterKey: "status",
    filterOptions: ["Đang hoạt động", "Chờ duyệt", "Đã ẩn"],
    fields: ["name", "village", "location", "history", "process", "value", "image", "status"],
    columns: [
      ["code", "Mã nghề"], ["name", "Tên nghề"], ["village", "Làng nghề"],
      ["location", "Địa phương"], ["history", "Mô tả"], ["status", "Trạng thái"],
    ],
    addLabel: "Thêm nghề",
  },
  products: {
    title: "Quản lý sản phẩm",
    addLabel: "Thêm sản phẩm",
    description: "Kiểm duyệt sản phẩm thủ công do nghệ nhân đăng tải.",
    searchPlaceholder: "Tìm sản phẩm hoặc nghệ nhân...",
    filterLabel: "Trạng thái",
    filterKey: "status",
    filterOptions: ["Đã duyệt", "Chờ duyệt", "Đã ẩn"],
    fields: ["name", "artisan", "craft", "material", "process", "description", "image", "created", "status"],
    columns: [
      ["name", "Sản phẩm"], ["artisan", "Nghệ nhân"], ["craft", "Nghề"],
      ["material", "Chất liệu"], ["created", "Ngày đăng"], ["status", "Trạng thái"],
    ],
  },
  stories: {
    title: "Quản lý nội dung văn hóa",
    addLabel: "Thêm bài viết",
    description: "Kiểm duyệt câu chuyện và kiến thức văn hóa truyền thống.",
    searchPlaceholder: "Tìm tiêu đề, nghệ nhân hoặc chủ đề...",
    filterLabel: "Trạng thái",
    filterKey: "status",
    filterOptions: ["Đã duyệt", "Chờ duyệt", "Đã ẩn"],
    fields: ["name", "artisan", "topic", "created", "image", "content", "value", "status"],
    columns: [
      ["name", "Tiêu đề"], ["artisan", "Nghệ nhân"], ["topic", "Chủ đề"],
      ["created", "Ngày đăng"], ["status", "Trạng thái"],
    ],
  },
  experiences: {
    title: "Quản lý hoạt động trải nghiệm",
    addLabel: "Thêm hoạt động",
    description: "Theo dõi và kiểm duyệt các hoạt động giao lưu làng nghề.",
    searchPlaceholder: "Tìm hoạt động, nghệ nhân hoặc địa điểm...",
    filterLabel: "Trạng thái",
    filterKey: "status",
    filterOptions: ["Đã duyệt", "Chờ duyệt", "Đã ẩn"],
    fields: ["name", "artisan", "location", "duration", "schedule", "capacity", "description", "requirements", "status"],
    columns: [
      ["name", "Tên hoạt động"], ["artisan", "Nghệ nhân"], ["location", "Địa điểm"],
      ["duration", "Thời lượng"], ["schedule", "Thời gian"], ["capacity", "Số người"], ["status", "Trạng thái"],
    ],
  },
  media: {
    title: "Thư viện hình ảnh và video",
    addLabel: "Thêm tệp",
    description: "Quản lý nội dung đa phương tiện được chia sẻ trên nền tảng.",
    searchPlaceholder: "Tìm tên nội dung hoặc người đăng...",
    filterLabel: "Loại nội dung",
    filterKey: "type",
    filterOptions: ["Hình ảnh", "Video"],
    fields: ["name", "type", "artisan", "created", "preview", "video", "status"],
    columns: [
      ["name", "Nội dung"], ["type", "Loại"], ["artisan", "Người đăng"],
      ["created", "Ngày đăng"], ["status", "Trạng thái"],
    ],
  },
  reviews: {
    title: "Quản lý đánh giá",
    description: "Theo dõi phản hồi của du khách và xử lý nhận xét không phù hợp.",
    searchPlaceholder: "Tìm du khách, nghệ nhân hoặc nhận xét...",
    filterLabel: "Số sao",
    filterKey: "rating",
    filterOptions: ["5 sao", "4 sao", "3 sao", "2 sao", "1 sao"],
    fields: ["visitor", "subject", "rating", "comment", "created", "status"],
    columns: [
      ["visitor", "Du khách"], ["subject", "Được đánh giá"], ["rating", "Số sao"],
      ["comment", "Nhận xét"], ["created", "Ngày đánh giá"], ["status", "Trạng thái"],
    ],
  },
  reports: {
    title: "Kiểm duyệt nội dung vi phạm",
    description: "Tiếp nhận báo cáo và xử lý nội dung được cộng đồng phản ánh.",
    searchPlaceholder: "Tìm nội dung, người đăng hoặc lý do...",
    filterLabel: "Trạng thái",
    filterKey: "status",
    filterOptions: ["Chờ xử lý", "Đã duyệt", "Đã ẩn", "Đã xóa", "Không vi phạm"],
    fields: ["name", "type", "author", "reason", "reported", "status"],
    columns: [
      ["name", "Nội dung bị báo cáo"], ["type", "Phân loại"], ["author", "Người đăng"],
      ["reason", "Lý do báo cáo"], ["reported", "Thời gian"], ["status", "Trạng thái"],
    ],
  },
};

const initialData = {
  accounts: [
    { id: 1, name: "Nguyễn Hoàng An", email: "hoangan@gmail.com", phone: "0912 345 678", role: "Nghệ nhân", created: "12/10/2026", status: "Hoạt động" },
    { id: 2, name: "Trần Minh Châu", email: "minhchau@gmail.com", phone: "0988 234 567", role: "Du khách", created: "11/10/2026", status: "Hoạt động" },
    { id: 3, name: "Lê Văn Bình", email: "vanbinh@gmail.com", phone: "0905 123 456", role: "Nghệ nhân", created: "10/10/2026", status: "Hoạt động" },
    { id: 4, name: "Phạm Thị Liên", email: "thilien@gmail.com", phone: "0934 567 890", role: "Du khách", created: "09/10/2026", status: "Bị khóa" },
    { id: 5, name: "Đỗ Thanh Hà", email: "thanhha@gmail.com", phone: "0977 222 111", role: "Du khách", created: "08/10/2026", status: "Hoạt động" },
    { id: 6, name: "Vũ Đức Thắng", email: "ducthang@gmail.com", phone: "0911 555 666", role: "Quản trị viên", created: "07/10/2026", status: "Hoạt động" },
  ],
  artisans: [
    { id: 1, name: "Nguyễn Hoàng An", craft: "Gốm men tro", village: "Bát Tràng", location: "Gia Lâm, Hà Nội", experience: "28 năm", bio: "Sinh ra trong gia đình nhiều đời làm gốm, nghệ nhân An gắn bó với đất và lửa từ thuở nhỏ.", journey: "Gìn giữ kỹ thuật men tro truyền thống, truyền nghề cho thế hệ trẻ tại Bát Tràng.", products: "Bình gốm men tro · Bộ ấm trà đất đỏ", stories: "Giữ hồn đất trong từng dáng gốm", activities: "Một ngày làm thợ gốm", verification: "Đã xác minh", status: "Hoạt động" },
    { id: 2, name: "Trần Thị Hương", craft: "Dệt lụa tơ tằm", village: "Vạn Phúc", location: "Hà Đông, Hà Nội", experience: "19 năm", bio: "Nghệ nhân dệt lụa tâm huyết với những hoa văn cổ của làng Vạn Phúc.", journey: "Học nghề từ mẹ, hiện hướng dẫn các bạn trẻ làm quen với khung cửi truyền thống.", products: "Khăn lụa hoa sen", stories: "Tiếng thoi đưa bên khung cửi", activities: "Dệt lụa cùng nghệ nhân", verification: "Chờ xác minh", status: "Hoạt động" },
    { id: 3, name: "Lê Văn Bình", craft: "Mây tre đan", village: "Phú Vinh", location: "Chương Mỹ, Hà Nội", experience: "32 năm", bio: "Người thợ thủ công sáng tạo các sản phẩm mây tre gần gũi với đời sống.", journey: "Đưa kỹ thuật đan lát của Phú Vinh vào các sản phẩm sử dụng nguyên liệu bền vững.", products: "Giỏ mây đan tay", stories: "Màu xanh từ những nan tre", activities: "Đan giỏ tre truyền thống", verification: "Đã xác minh", status: "Hoạt động" },
    { id: 4, name: "Phạm Thị Liên", craft: "Nón lá", village: "Tây Hồ", location: "Huế", experience: "15 năm", bio: "Nghệ nhân làm nón gìn giữ nét thanh tao của chiếc nón lá xứ Huế.", journey: "Nối tiếp nghề gia đình, kể chuyện văn hóa Huế qua từng vành nón.", products: "Nón lá bài thơ", stories: "Nét Huế qua vành nón", activities: "Tự tay làm nón lá", verification: "Chờ xác minh", status: "Hoạt động" },
    { id: 5, name: "Đặng Minh Tâm", craft: "Sơn mài", village: "Hạ Thái", location: "Thường Tín, Hà Nội", experience: "21 năm", bio: "Nghệ nhân sơn mài với niềm say mê chất liệu và màu sắc truyền thống.", journey: "Thử nghiệm kết hợp kỹ thuật sơn mài truyền thống với ngôn ngữ tạo hình đương đại.", products: "Tranh sơn mài hoa sen", stories: "Sắc màu sơn mài truyền thống", activities: "Tìm hiểu nghệ thuật sơn mài", verification: "Từ chối", status: "Hoạt động" },
  ],
  crafts: [
    { id: 1, code: "NN001", name: "Gốm Bát Tràng", village: "Làng gốm Bát Tràng", location: "Gia Lâm, Hà Nội", history: "Di sản gốm hơn 700 năm bên dòng sông Hồng.", process: "Tạo dáng, phơi, tráng men và nung lò.", value: "Tinh hoa đất Việt", image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=700&q=80", status: "Đang hoạt động" },
    { id: 2, code: "NN002", name: "Dệt lụa Vạn Phúc", village: "Làng lụa Vạn Phúc", location: "Hà Đông, Hà Nội", history: "Làng nghề dệt lụa lâu đời của xứ Đoài.", process: "Ươm tơ, mắc cửi và dệt lụa.", value: "Nét đẹp tơ tằm", image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=700&q=80", status: "Đang hoạt động" },
    { id: 3, code: "NN003", name: "Mây tre đan Phú Vinh", village: "Làng mây tre Phú Vinh", location: "Chương Mỹ, Hà Nội", history: "Nghề đan lát được gìn giữ qua nhiều thế hệ.", process: "Chẻ nan, xử lý vật liệu và đan tạo hình.", value: "Sáng tạo từ thiên nhiên", image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=700&q=80", status: "Đang hoạt động" },
    { id: 4, code: "NN004", name: "Tranh Đông Hồ", village: "Làng tranh Đông Hồ", location: "Thuận Thành, Bắc Ninh", history: "Dòng tranh dân gian in mộc bản trên giấy điệp.", process: "Khắc ván, quét màu và in tranh.", value: "Tranh dân gian Việt", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=700&q=80", status: "Chờ duyệt" },
  ],
  products: [
    { id: 1, name: "Bình gốm men tro", artisan: "Nguyễn Hoàng An", craft: "Gốm Bát Tràng", material: "Đất sét, men tro", image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=80", created: "12/10/2026", status: "Đã duyệt", description: "Bình gốm tạo hình thủ công, phủ men tro truyền thống.", process: "Tạo dáng trên bàn xoay, phủ men và nung." },
    { id: 2, name: "Khăn lụa hoa sen", artisan: "Trần Thị Hương", craft: "Dệt lụa Vạn Phúc", material: "Tơ tằm tự nhiên", image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=700&q=80", created: "11/10/2026", status: "Chờ duyệt", description: "Khăn lụa dệt tay với họa tiết hoa sen.", process: "Ươm tơ và dệt trên khung cửi truyền thống." },
    { id: 3, name: "Giỏ mây đan tay", artisan: "Lê Văn Bình", craft: "Mây tre đan Phú Vinh", material: "Mây tự nhiên", image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=700&q=80", created: "10/10/2026", status: "Đã duyệt", description: "Giỏ đan thủ công, nhẹ và bền.", process: "Chọn mây, chẻ nan và đan tạo hình." },
    { id: 4, name: "Nón lá bài thơ", artisan: "Phạm Thị Liên", craft: "Nón lá Huế", material: "Lá cọ, tre", image: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=700&q=80", created: "09/10/2026", status: "Đã ẩn", description: "Nón lá xứ Huế với hình ảnh ẩn hiện khi soi nắng.", process: "Vót vành tre, xếp lá và khâu nón." },
  ],
  stories: [
    { id: 1, name: "Giữ hồn đất trong từng dáng gốm", artisan: "Nguyễn Hoàng An", topic: "Nghề gốm", created: "12/10/2026", content: "Câu chuyện về tình yêu đất và lửa trong mỗi mẻ gốm Bát Tràng.", value: "Sự kiên nhẫn và tinh thần tiếp nối nghề.", status: "Đã duyệt" },
    { id: 2, name: "Tiếng thoi đưa bên khung cửi", artisan: "Trần Thị Hương", topic: "Nghề dệt", created: "11/10/2026", content: "Ký ức tuổi thơ gắn với khung cửi và tiếng thoi đưa.", value: "Gìn giữ nghề dệt lụa của quê hương.", status: "Chờ duyệt" },
    { id: 3, name: "Màu xanh từ những nan tre", artisan: "Lê Văn Bình", topic: "Nghề đan", created: "08/10/2026", content: "Câu chuyện về người thợ và nguyên liệu mây tre gần gũi.", value: "Sống hài hòa cùng thiên nhiên.", status: "Đã duyệt" },
  ],
  experiences: [
    { id: 1, name: "Một ngày làm thợ gốm", artisan: "Nguyễn Hoàng An", location: "Bát Tràng, Hà Nội", duration: "3 giờ", schedule: "Thứ 7, Chủ nhật", capacity: "12 người", status: "Đã duyệt", description: "Trải nghiệm tạo hình và trang trí gốm cùng nghệ nhân.", requirements: "Trang phục gọn gàng; trẻ em cần có người lớn đi cùng." },
    { id: 2, name: "Dệt lụa cùng nghệ nhân", artisan: "Trần Thị Hương", location: "Vạn Phúc, Hà Nội", duration: "2 giờ", schedule: "Theo lịch hẹn", capacity: "8 người", status: "Chờ duyệt", description: "Tìm hiểu tơ tằm và thử dệt trên khung cửi.", requirements: "Đăng ký trước ít nhất một ngày." },
    { id: 3, name: "Đan giỏ tre truyền thống", artisan: "Lê Văn Bình", location: "Phú Vinh, Hà Nội", duration: "2,5 giờ", schedule: "Thứ 6 hằng tuần", capacity: "10 người", status: "Đã duyệt", description: "Tự tay đan một món đồ lưu niệm từ mây tre.", requirements: "Phù hợp với khách từ 10 tuổi trở lên." },
  ],
  media: [
    { id: 1, name: "Nghệ nhân bên bàn xoay", type: "Hình ảnh", artisan: "Nguyễn Hoàng An", created: "12/10/2026", status: "Đã duyệt", preview: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=700&q=80" },
    { id: 2, name: "Một vòng lò nung Bát Tràng", type: "Video", artisan: "Nguyễn Hoàng An", created: "11/10/2026", status: "Chờ duyệt", preview: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=80", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
    { id: 3, name: "Khung cửi làng lụa", type: "Hình ảnh", artisan: "Trần Thị Hương", created: "09/10/2026", status: "Đã duyệt", preview: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=700&q=80" },
    { id: 4, name: "Đan lát tại xưởng Phú Vinh", type: "Video", artisan: "Lê Văn Bình", created: "08/10/2026", status: "Đã ẩn", preview: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=700&q=80", video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  ],
  reviews: [
    { id: 1, visitor: "Trần Minh Châu", subject: "Một ngày làm thợ gốm", rating: "5 sao", comment: "Nghệ nhân hướng dẫn tận tình, trải nghiệm rất đáng nhớ.", created: "12/10/2026", status: "Hiển thị" },
    { id: 2, visitor: "Đỗ Thanh Hà", subject: "Nghệ nhân Nguyễn Hoàng An", rating: "5 sao", comment: "Tác phẩm đẹp và câu chuyện về nghề rất truyền cảm hứng.", created: "11/10/2026", status: "Hiển thị" },
    { id: 3, visitor: "Phạm Ngọc Mai", subject: "Dệt lụa cùng nghệ nhân", rating: "2 sao", comment: "Lịch hẹn thay đổi nhưng chưa được thông báo kịp thời.", created: "10/10/2026", status: "Chờ xử lý" },
    { id: 4, visitor: "Nguyễn Tuấn Kiệt", subject: "Nghệ nhân Lê Văn Bình", rating: "1 sao", comment: "Nhận xét cần được quản trị viên kiểm tra.", created: "08/10/2026", status: "Đã ẩn" },
  ],
  reports: [
    { id: 1, name: "Bình luận về sản phẩm gốm", type: "Đánh giá", author: "Tài khoản khách ẩn danh", reason: "Ngôn từ không phù hợp", reported: "12/10/2026 · 09:30", status: "Chờ xử lý" },
    { id: 2, name: "Video giới thiệu sản phẩm", type: "Video", author: "Tài khoản nghệ nhân", reason: "Nội dung không liên quan", reported: "11/10/2026 · 15:20", status: "Chờ xử lý" },
    { id: 3, name: "Bài viết về làng nghề", type: "Câu chuyện văn hóa", author: "Người dùng cộng đồng", reason: "Báo cáo nhầm nội dung", reported: "10/10/2026 · 11:10", status: "Không vi phạm" },
  ],
};

const overviewMetrics = [
  { label: "Tổng số tài khoản", value: "2.486", change: "+12,8%", icon: Users, tone: "brown" },
  { label: "Nghệ nhân", value: "186", change: "+8,2%", icon: UserCheck, tone: "green" },
  { label: "Du khách", value: "2.298", change: "+14,1%", icon: CircleUserRound, tone: "gold" },
  { label: "Nghề truyền thống", value: "48", change: "+3 nghề", icon: Leaf, tone: "green" },
  { label: "Sản phẩm", value: "1.352", change: "+9,6%", icon: Package, tone: "brown" },
  { label: "Câu chuyện văn hóa", value: "328", change: "+6,4%", icon: BookOpen, tone: "gold" },
  { label: "Hoạt động trải nghiệm", value: "74", change: "+5 hoạt động", icon: CalendarDays, tone: "green" },
  { label: "Đánh giá", value: "896", change: "+11,2%", icon: Star, tone: "gold" },
];

const registrationBars = [
  ["T5", 38], ["T6", 55], ["T7", 44], ["T8", 72], ["T9", 61], ["T10", 89],
];
const contentBars = [
  ["Sản phẩm", 80], ["Câu chuyện", 54], ["Trải nghiệm", 36], ["Hình ảnh", 68],
];

const initialActivity = [
  { text: "Đã xác minh hồ sơ nghệ nhân Nguyễn Hoàng An", time: "10 phút trước" },
  { text: "Đã duyệt câu chuyện “Giữ hồn đất trong từng dáng gốm”", time: "35 phút trước" },
  { text: "Tài khoản Trần Minh Châu vừa đăng ký", time: "1 giờ trước" },
  { text: "Đã ẩn một đánh giá bị báo cáo", time: "2 giờ trước" },
];

function getStatusTone(status = "") {
  if (/đã duyệt|đã xác minh|hoạt động|hiển thị|không vi phạm/i.test(status)) return "success";
  if (/chờ|đợi/i.test(status)) return "pending";
  if (/khóa|từ chối|ẩn|xóa|vi phạm/i.test(status)) return "danger";
  return "neutral";
}

// eslint-disable-next-line no-unused-vars
function DashboardOverview({ records, activities }) {
  return (
    <div className="admin-overview">
      <section className="admin-welcome">
        <div>
          <span className="admin-eyebrow"><Sparkles size={14} /> KHÔNG GIAN QUẢN TRỊ</span>
          <h2>Gìn giữ tinh hoa, kết nối cộng đồng.</h2>
          <p>Chúc bạn một ngày làm việc hiệu quả. Cùng quản lý và lan tỏa những giá trị nghề Việt.</p>
        </div>

      </section>

      <section className="admin-metrics" aria-label="Thống kê tổng quan">
        {overviewMetrics.map(({ label, value, change, icon: Icon, tone }) => (
          <article className="admin-metric-card" key={label}>
            <div className="admin-metric-top"><span>{label}</span><span className={`admin-metric-icon ${tone}`}><Icon size={18} /></span></div>
            <strong>{value}</strong>
            <small><span>↗ {change}</span> so với tháng trước</small>
          </article>
        ))}
      </section>

      <section className="admin-chart-grid">
        <article className="admin-panel admin-chart-panel">
          <div className="admin-panel-heading"><div><h3>Tài khoản đăng ký</h3><p>Tăng trưởng trong 6 tháng gần nhất</p></div><span className="admin-chart-total">+12,8%</span></div>
          <div className="admin-bar-chart" aria-label="Biểu đồ tài khoản đăng ký theo tháng">
            {registrationBars.map(([month, height]) => <div className="admin-bar-column" key={month}><span className="admin-bar-value">{height}</span><div className="admin-bar-track"><span style={{ height: `${height}%` }} /></div><small>{month}</small></div>)}
          </div>
          <div className="admin-chart-legend"><span /><small>Tài khoản mới</small></div>
        </article>
        <article className="admin-panel admin-chart-panel">
          <div className="admin-panel-heading"><div><h3>Nội dung được đăng tải</h3><p>Tổng quan nội dung cộng đồng chia sẻ</p></div><button className="admin-subtle-button" type="button">Tháng này <ChevronDown size={14} /></button></div>
          <div className="admin-content-bars">{contentBars.map(([label, percent], index) => <div className="admin-content-bar" key={label}><div><span>{label}</span><strong>{[342, 128, 74, 246][index]}</strong></div><span className="admin-progress-track"><span style={{ width: `${percent}%` }} /></span></div>)}</div>
          <div className="admin-chart-legend"><span className="admin-legend-gold" /><small>Nội dung mới trong tháng</small></div>
        </article>
      </section>

      <section className="admin-overview-lists">
        <article className="admin-panel">
          <div className="admin-panel-heading"><div><h3>Nghệ nhân mới đăng ký</h3><p>Hồ sơ đang chờ quản trị viên kiểm tra</p></div><Link to="/admin/artisans">Xem tất cả <ChevronRight size={14} /></Link></div>
          <div className="admin-compact-list">
            {records.artisans.slice(0, 3).map((person) => <div className="admin-compact-row" key={person.id}><span className="admin-avatar">{person.name.split(" ").slice(-1)[0].slice(0, 1)}</span><div><strong>{person.name}</strong><small>{person.craft} · {person.location}</small></div><span className={`admin-status ${getStatusTone(person.verification)}`}>{person.verification}</span></div>)}
          </div>
        </article>
        <article className="admin-panel">
          <div className="admin-panel-heading"><div><h3>Nội dung chờ kiểm duyệt</h3><p>Nội dung đang cần xem xét</p></div><Link to="/admin/reports">Xem tất cả <ChevronRight size={14} /></Link></div>
          <div className="admin-compact-list">
            {records.reports.filter((item) => item.status === "Chờ xử lý").slice(0, 3).map((item) => <div className="admin-compact-row" key={item.id}><span className="admin-compact-icon"><Flag size={16} /></span><div><strong>{item.name}</strong><small>{item.type} · {item.reason}</small></div><span className="admin-status pending">Chờ xử lý</span></div>)}
          </div>
        </article>
      </section>

      <section className="admin-overview-lists">
        <article className="admin-panel">
          <div className="admin-panel-heading"><div><h3>Đánh giá mới nhất</h3><p>Phản hồi gần đây từ du khách</p></div><Link to="/admin/reviews">Xem tất cả <ChevronRight size={14} /></Link></div>
          <div className="admin-review-list">{records.reviews.slice(0, 3).map((review) => <div className="admin-review-row" key={review.id}><div className="admin-review-heading"><strong>{review.visitor}</strong><span className="admin-stars">★ {review.rating}</span></div><p>{review.comment}</p><small>{review.subject} · {review.created}</small></div>)}</div>
        </article>
        <article className="admin-panel">
          <div className="admin-panel-heading"><div><h3>Hoạt động quản trị</h3><p>Các cập nhật mới nhất trên hệ thống</p></div><Activity size={17} /></div>
          <div className="admin-timeline">{activities.map((item, index) => <div className="admin-timeline-row" key={`${item.text}-${index}`}><span className="admin-timeline-dot" /><div><p>{item.text}</p><small>{item.time}</small></div></div>)}</div>
        </article>
      </section>
    </div>
  );
}

function AccountModal({ modal, onClose, onSave, onConfirm }) {
  if (!modal) return null;
  const isConfirm = modal.type === "confirm";
  const isView = modal.type === "view";
  const mediaPreview = modal.record?.preview || modal.record?.image;

  return (
    <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
        <div className="admin-modal-heading"><div><span className="admin-eyebrow">TINH HOA VIỆT · QUẢN TRỊ</span><h2 id="admin-modal-title">{modal.title}</h2></div><button className="admin-icon-button" type="button" onClick={onClose} aria-label="Đóng"><X size={18} /></button></div>
        {isConfirm ? <><p className="admin-confirm-copy">{modal.message}</p><div className="admin-modal-actions"><button className="admin-secondary-button" type="button" onClick={onClose}>Hủy</button><button className="admin-danger-button" type="button" onClick={onConfirm}>{modal.confirmLabel || "Xác nhận"}</button></div></> : isView ? <>{modal.record?.type === "Video" && modal.record.video ? <video className="admin-detail-media admin-detail-video" controls preload="metadata" poster={mediaPreview} aria-label={`Video: ${modal.record.name}`}><source src={modal.record.video} type="video/mp4" />Trình duyệt không hỗ trợ phát video.</video> : mediaPreview && <div className="admin-detail-media"><img src={mediaPreview} alt={modal.record.name} /></div>}<div className="admin-detail-list">{Object.entries(modal.record || {}).filter(([key]) => key !== "id" && key !== "preview" && key !== "image" && key !== "video").map(([key, value]) => <div key={key}><span>{modal.labels[key] || key}</span><strong>{value || "Chưa cập nhật"}</strong></div>)}</div><div className="admin-modal-actions"><button className="admin-primary-button" type="button" onClick={onClose}>Đóng</button></div></> : <form onSubmit={onSave}><div className="admin-form-grid">{modal.fields.map((field) => <label className={field.wide ? "wide" : ""} key={field.key}><span>{field.label}</span>{field.options ? <select name={field.key} defaultValue={modal.record?.[field.key] || field.options[0]}>{field.options.map((option) => <option key={option}>{option}</option>)}</select> : field.multiline ? <textarea name={field.key} rows="3" defaultValue={modal.record?.[field.key] || ""} placeholder={field.label} /> : <input type={field.url ? "url" : "text"} name={field.key} defaultValue={modal.record?.[field.key] || ""} placeholder={field.label} />}</label>)}</div><div className="admin-modal-actions"><button className="admin-secondary-button" type="button" onClick={onClose}>Hủy</button><button className="admin-primary-button" type="submit">{modal.type === "edit" ? "Lưu thay đổi" : "Thêm mới"}</button></div></form>}
      </section>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
function ManagementPage({ pageKey, records, onAdd, onEdit, onView, onAction, onConfirmAction }) {
  const definition = pageDefinitions[pageKey];
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredRecords = useMemo(() => records[pageKey].filter((record) => {
    const matchesQuery = Object.values(record).some((value) => String(value).toLowerCase().includes(query.toLowerCase()));
    const matchesFilter = filter === "Tất cả" || (pageKey === "reviews" ? record.rating === filter : record[definition.filterKey] === filter);
    return matchesQuery && matchesFilter;
  }), [definition.filterKey, filter, pageKey, query, records]);
  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const visibleRecords = filteredRecords.slice((page - 1) * pageSize, page * pageSize);
  const showApproval = ["products", "stories", "experiences"].includes(pageKey);

  const openAddForm = () => onAdd(pageKey, definition);
  const recordByName = (name) => records[pageKey].find((record) => record.name === name);
  const renderCell = (key, value) => key === "status" || key === "verification"
    ? <span className={`admin-status ${getStatusTone(value)}`}>{value}</span>
    : key === "rating" ? <span className="admin-stars">★ {value}</span>
      : key === "name" && ["accounts", "artisans"].includes(pageKey)
        ? <span className="admin-name-with-avatar"><span>{value.split(" ").slice(-2).map((part) => part[0]).join("")}</span>{value}</span>
        : key === "name" && recordByName(value)?.image
          ? <span className="admin-name-with-image"><img src={recordByName(value).image} alt="" loading="lazy" />{value}</span>
      : value || <span className="admin-empty-value">—</span>;
  const toggleLabel = (record) => {
    if (pageKey === "accounts" || pageKey === "artisans") {
      return record.status === "Bị khóa" ? "Mở khóa tài khoản" : "Khóa tài khoản";
    }
    return record.status === "Đã ẩn" ? "Hiển thị lại nội dung" : "Ẩn nội dung";
  };
  const renderActions = (record) => (
    <div className="admin-row-actions">
      <button type="button" title="Xem chi tiết" aria-label={`Xem ${record.name || record.visitor || record.email}`} onClick={() => onView(pageKey, record, definition)}><Eye size={15} /></button>
      <button type="button" title="Chỉnh sửa" aria-label={`Chỉnh sửa ${record.name || record.visitor || record.email}`} onClick={() => onEdit(pageKey, definition, record)}><Pencil size={15} /></button>
      {showApproval && record.status === "Chờ duyệt" && <button className="approve" type="button" title="Duyệt" aria-label={`Duyệt ${record.name}`} onClick={() => onAction(pageKey, record, "approve")}><BadgeCheck size={15} /></button>}
      {pageKey === "artisans" && record.verification === "Chờ xác minh" && <button className="approve" type="button" title="Xác minh" aria-label={`Xác minh ${record.name}`} onClick={() => onAction(pageKey, record, "verify")}><BadgeCheck size={15} /></button>}
      {pageKey === "artisans" && record.verification === "Chờ xác minh" && <button className="warning" type="button" title="Từ chối xác minh" aria-label={`Từ chối xác minh ${record.name}`} onClick={() => onAction(pageKey, record, "reject")}><X size={15} /></button>}
      {pageKey === "reports" && record.status === "Chờ xử lý" && <button className="approve" type="button" title="Không vi phạm" aria-label={`Đánh dấu không vi phạm ${record.name}`} onClick={() => onAction(pageKey, record, "clear")}><Shield size={15} /></button>}
      <button className={record.status === "Bị khóa" || record.status === "Đã ẩn" ? "approve" : "warning"} type="button" title={toggleLabel(record)} aria-label={`${toggleLabel(record)} ${record.name || record.visitor || record.email}`} onClick={() => onAction(pageKey, record, "toggle")}><Archive size={15} /></button>
      <button className="delete" type="button" title="Xóa" aria-label={`Xóa ${record.name || record.visitor || record.email}`} onClick={() => onConfirmAction(pageKey, record)}><Trash2 size={15} /></button>
    </div>
  );

  return (
    <section className="admin-management">
      <div className="admin-management-heading"><div><span className="admin-eyebrow">DỮ LIỆU HỆ THỐNG</span><h2>{definition.title}</h2><p>{definition.description}</p></div>{!["reviews", "reports"].includes(pageKey) && <button className="admin-primary-button" type="button" onClick={openAddForm}><Plus size={16} />{definition.addLabel || "Thêm nội dung"}</button>}</div>
      <div className="admin-toolbar"><label className="admin-search"><Search size={17} /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder={definition.searchPlaceholder} /></label><label className="admin-filter"><span>{definition.filterLabel}</span><select value={filter} onChange={(event) => { setFilter(event.target.value); setPage(1); }}><option>Tất cả</option>{definition.filterOptions.map((option) => <option key={option}>{option}</option>)}</select></label><span className="admin-result-count">{filteredRecords.length} kết quả</span></div>
      {pageKey === "media" ? <div className="admin-media-grid">{visibleRecords.length ? visibleRecords.map((record) => <article className="admin-media-card" key={record.id}><div className="admin-media-preview"><img src={record.preview} alt={record.name} loading="lazy" />{record.type === "Video" && <span className="admin-media-play">▶</span>}<span className="admin-media-type">{record.type}</span></div><div className="admin-media-card-body"><div><strong>{record.name}</strong><small>{record.artisan} · {record.created}</small></div><span className={`admin-status ${getStatusTone(record.status)}`}>{record.status}</span><div className="admin-media-card-actions">{renderActions(record)}</div></div></article>) : <div className="admin-media-empty"><FileImage size={24} /><strong>Không tìm thấy dữ liệu phù hợp</strong><small>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.</small></div>}</div> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr>{definition.columns.map(([key, label]) => <th key={key}>{label}</th>)}<th className="admin-actions-heading">Thao tác</th></tr></thead><tbody>
        {visibleRecords.map((record) => <tr key={record.id}>{definition.columns.map(([key]) => <td key={key} className={key === "comment" || key === "reason" ? "admin-cell-truncate" : ""}>{renderCell(key, record[key])}</td>)}<td>{renderActions(record)}</td></tr>)}
        {visibleRecords.length === 0 && <tr><td className="admin-empty-row" colSpan={definition.columns.length + 1}><span><ClipboardList size={23} /></span><strong>Không tìm thấy dữ liệu phù hợp</strong><small>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.</small></td></tr>}
      </tbody></table></div>}
      <div className="admin-pagination"><span>Hiển thị {filteredRecords.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filteredRecords.length)} trên {filteredRecords.length} mục</span><div><button type="button" disabled={page <= 1} aria-label="Trang trước" onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft size={16} /></button><span>Trang {page} / {pageCount}</span><button type="button" disabled={page >= pageCount} aria-label="Trang sau" onClick={() => setPage((current) => Math.min(pageCount, current + 1))}><ChevronRight size={16} /></button></div></div>
    </section>
  );
}

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [records, setRecords] = useState(initialData);
  const [activities, setActivities] = useState(initialActivity);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const isOverview = location.pathname === "/admin" || location.pathname === "/admin/";
  const pageKey = location.pathname.split("/")[2];
  const currentPage = pageDefinitions[pageKey];
  const currentTitle = isOverview ? "Tổng quan" : currentPage?.title || "Tổng quan";
  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  };
  const logActivity = (message) => setActivities((current) => [{ text: message, time: "Vừa xong" }, ...current].slice(0, 5));

  const openForm = (pageName, definition, record = null) => {
    const isCraft = pageName === "crafts";
    const fieldLabels = {
      name: "Tên nội dung", email: "Email", phone: "Số điện thoại", role: "Vai trò", created: "Ngày tạo",
      status: "Trạng thái", craft: "Nghề truyền thống", village: "Làng nghề", location: "Địa phương / địa điểm",
      history: "Lịch sử hình thành", process: "Quy trình thực hiện", value: "Giá trị văn hóa",
      experience: "Số năm kinh nghiệm", bio: "Giới thiệu bản thân", journey: "Quá trình gìn giữ nghề",
      verification: "Trạng thái xác minh", products: "Sản phẩm đã đăng",
      stories: "Câu chuyện văn hóa", activities: "Hoạt động trải nghiệm",
      artisan: "Nghệ nhân đăng tải", material: "Chất liệu", topic: "Chủ đề",
      content: "Nội dung", description: "Mô tả", requirements: "Yêu cầu tham gia", duration: "Thời lượng",
      schedule: "Thời gian tổ chức", capacity: "Số người tối đa", type: "Loại nội dung", visitor: "Du khách",
      subject: "Nghệ nhân / hoạt động", rating: "Số sao", comment: "Nội dung nhận xét",
      author: "Người đăng", reason: "Lý do báo cáo", reported: "Thời gian báo cáo",
      image: "Đường dẫn hình ảnh", preview: "Đường dẫn hình ảnh xem trước", video: "Đường dẫn video",
    };
    const fields = definition.fields.filter((key) => key !== "id" && key !== "code").map((key) => {
      const field = { key, label: fieldLabels[key] || key, wide: ["content", "history", "process", "value", "comment", "reason", "bio", "journey", "description", "requirements", "image", "preview", "video"].includes(key), multiline: ["content", "history", "process", "value", "comment", "reason", "bio", "journey", "description", "requirements"].includes(key), url: key === "image" || key === "preview" || key === "video" };
      if (key === "status") field.options = ({
        accounts: ["Hoạt động", "Bị khóa"],
        artisans: ["Hoạt động", "Bị khóa"],
        crafts: ["Đang hoạt động", "Chờ duyệt", "Đã ẩn"],
        products: ["Đã duyệt", "Chờ duyệt", "Đã ẩn"],
        stories: ["Đã duyệt", "Chờ duyệt", "Đã ẩn"],
        experiences: ["Đã duyệt", "Chờ duyệt", "Đã ẩn"],
        media: ["Đã duyệt", "Chờ duyệt", "Đã ẩn"],
        reviews: ["Hiển thị", "Chờ xử lý", "Đã ẩn"],
        reports: ["Chờ xử lý", "Đã duyệt", "Đã ẩn", "Đã xóa", "Không vi phạm"],
      })[pageName] || ["Đang hoạt động", "Chờ duyệt", "Đã ẩn"];
      if (key === "role") field.options = ["Quản trị viên", "Nghệ nhân", "Du khách"];
      if (key === "verification") field.options = ["Đã xác minh", "Chờ xác minh", "Từ chối"];
      if (key === "type") field.options = ["Sản phẩm", "Câu chuyện văn hóa", "Hoạt động trải nghiệm", "Hình ảnh", "Video", "Đánh giá"];
      if (key === "rating") field.options = ["5 sao", "4 sao", "3 sao", "2 sao", "1 sao"];
      if (isCraft && key === "status") field.options = ["Đang hoạt động", "Chờ duyệt", "Đã ẩn"];
      return field;
    });
    setModal({ type: record ? "edit" : "add", title: record ? "Chỉnh sửa thông tin" : `Thêm ${isCraft ? "nghề truyền thống" : "nội dung"}`, pageKey: pageName, fields, record });
  };

  const handleSave = (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.currentTarget).entries());
    const { pageKey: targetKey, record } = modal;
    setRecords((current) => {
      if (record) return { ...current, [targetKey]: current[targetKey].map((item) => item.id === record.id ? { ...item, ...formData } : item) };
      const nextId = Math.max(0, ...current[targetKey].map((item) => item.id)) + 1;
      const newRecord = { id: nextId, ...formData };
      if (targetKey === "crafts") newRecord.code = `NN${String(nextId).padStart(3, "0")}`;
      return { ...current, [targetKey]: [newRecord, ...current[targetKey]] };
    });
    const message = record ? "Đã cập nhật dữ liệu mẫu." : "Đã thêm dữ liệu mẫu.";
    setModal(null);
    notify(message);
    logActivity(message);
  };

  const updateRecord = (pageName, record, patch, message) => {
    setRecords((current) => ({ ...current, [pageName]: current[pageName].map((item) => item.id === record.id ? { ...item, ...patch } : item) }));
    setModal(null);
    notify(message);
    logActivity(message);
  };

  const handleAction = (pageName, record, action) => {
    if (action === "toggle" || action === "reject" || action === "clear" || action === "verify") {
      const actionLabel = action === "verify" ? "Xác minh hồ sơ"
        : action === "reject" ? "Từ chối xác minh"
        : action === "clear" ? "Đánh dấu không vi phạm"
          : pageName === "accounts" || pageName === "artisans"
            ? (record.status === "Bị khóa" ? "Mở khóa tài khoản" : "Khóa tài khoản")
            : record.status === "Đã ẩn" ? "Hiển thị lại nội dung" : "Ẩn nội dung";
      setModal({
        type: "confirm",
        action,
        title: `Xác nhận ${actionLabel.toLowerCase()}`,
        pageKey: pageName,
        record,
        message: `Bạn có chắc muốn ${actionLabel.toLowerCase()} “${record.name || record.visitor || record.email}”?`,
        confirmLabel: actionLabel,
      });
      return;
    }
    if (action === "approve") return updateRecord(pageName, record, { status: "Đã duyệt" }, `Đã duyệt ${record.name}.`);
  };

  const openDetails = (pageName, record, definition) => {
    const labels = Object.fromEntries(definition.fields.map((field) => [field, ({
      name: pageName === "accounts" || pageName === "artisans" ? "Họ và tên" : "Tên nội dung", code: "Mã nghề", email: "Email", phone: "Số điện thoại",
      role: "Vai trò", created: "Ngày tạo", status: "Trạng thái", craft: "Nghề truyền thống",
      village: "Làng nghề", location: "Địa phương / địa điểm", history: "Lịch sử hình thành",
      process: "Quy trình thực hiện", value: "Giá trị văn hóa", experience: "Năm kinh nghiệm",
      verification: "Xác minh", bio: "Giới thiệu bản thân",
      journey: "Quá trình gìn giữ nghề", products: "Sản phẩm đã đăng",
      stories: "Câu chuyện văn hóa", activities: "Hoạt động trải nghiệm",
      artisan: "Nghệ nhân", material: "Chất liệu", topic: "Chủ đề",
      content: "Nội dung", description: "Mô tả", requirements: "Yêu cầu tham gia",
      duration: "Thời lượng", schedule: "Thời gian", capacity: "Sức chứa",
      type: "Loại nội dung", visitor: "Du khách", subject: "Được đánh giá", rating: "Số sao",
      comment: "Nhận xét", author: "Người đăng", reason: "Lý do báo cáo", reported: "Thời gian báo cáo",
      image: "Hình ảnh", preview: "Hình ảnh xem trước", video: "Video",
    })[field] || field]));
    setModal({ type: "view", title: pageName === "artisans" ? "Hồ sơ nghệ nhân" : "Chi tiết nội dung", record, labels });
  };

  const confirmDelete = (pageName, record) => setModal({ type: "confirm", action: "delete", title: "Xác nhận xóa nội dung", pageKey: pageName, record, message: `Bạn có chắc muốn xóa “${record.name || record.visitor || record.email}”? Thao tác này chỉ tác động lên dữ liệu mẫu của phiên hiện tại.`, confirmLabel: "Xóa nội dung" });
  const confirmModalAction = () => {
    const { pageKey: targetKey, record } = modal;
    if (modal.action === "verify") return updateRecord(targetKey, record, { verification: "Đã xác minh" }, `Đã xác minh nghệ nhân ${record.name}.`);
    if (modal.action === "reject") return updateRecord(targetKey, record, { verification: "Từ chối" }, `Đã từ chối xác minh hồ sơ ${record.name}.`);
    if (modal.action === "clear") return updateRecord(targetKey, record, { status: "Không vi phạm" }, "Đã đóng báo cáo: nội dung không vi phạm.");
    if (modal.action === "toggle") {
      if (targetKey === "accounts") return updateRecord(targetKey, record, { status: record.status === "Bị khóa" ? "Hoạt động" : "Bị khóa" }, record.status === "Bị khóa" ? "Đã mở khóa tài khoản." : "Đã khóa tài khoản.");
      if (targetKey === "artisans") return updateRecord(targetKey, record, { status: record.status === "Bị khóa" ? "Hoạt động" : "Bị khóa" }, record.status === "Bị khóa" ? "Đã mở khóa tài khoản nghệ nhân." : "Đã khóa tài khoản nghệ nhân.");
      if (targetKey === "reports") return updateRecord(targetKey, record, { status: "Đã ẩn" }, "Đã ẩn nội dung được báo cáo.");
      if (targetKey === "reviews") return updateRecord(targetKey, record, { status: record.status === "Đã ẩn" ? "Hiển thị" : "Đã ẩn" }, record.status === "Đã ẩn" ? "Đã hiển thị lại đánh giá." : "Đã ẩn đánh giá.");
      return updateRecord(targetKey, record, { status: record.status === "Đã ẩn" ? "Đã duyệt" : "Đã ẩn" }, record.status === "Đã ẩn" ? "Đã hiển thị lại nội dung." : "Đã ẩn nội dung.");
    }
    setRecords((current) => ({ ...current, [targetKey]: current[targetKey].filter((item) => item.id !== record.id) }));
    setModal(null);
    notify("Đã xóa nội dung mẫu.");
    logActivity("Đã xóa một nội dung mẫu.");
  };

  const handleQuickSearch = (event) => {
    event.preventDefault();
    const matchingMenu = navigation.find((item) => item.label.toLowerCase().includes(search.trim().toLowerCase()));
    if (matchingMenu && search.trim()) navigate(matchingMenu.path);
    else if (search.trim()) notify("Nhập tên mục quản lý để chuyển nhanh đến trang tương ứng.");
  };

  // Giữ dữ liệu và các thao tác quản trị ở shell để điều hướng giữa các trang không làm mất trạng thái.
  const outletContext = {
    records,
    activities,
    modal,
    openForm,
    openDetails,
    handleAction,
    confirmDelete,
    closeModal: () => setModal(null),
    saveRecord: handleSave,
    confirmModalAction,
  };

  return (
    <div className={`admin-shell${isSidebarOpen ? " admin-menu-open" : ""}`}>
        <aside className="admin-sidebar">
            <Link className="admin-brand" to="/admin" onClick={() => setSidebarOpen(false)}>
                <img src={logo} alt="" /><span><strong>Tinh Hoa Việt</strong></span>
            </Link>
            <div className="admin-nav-caption">
                <button className="admin-sidebar-toggle" type="button" 
                aria-label="Đóng menu" onClick={() => setSidebarOpen(false)}><X size={17} />
                </button>
            </div>
            <nav className="admin-navigation" aria-label="Điều hướng quản trị">
            {navigation.map(({ label, path, icon: Icon }) => (
                <NavLink
                key={path}
                to={path}
                end={path === "/admin"}
                className={({ isActive }) => `admin-nav-link${isActive ? " active" : ""}`}
                onClick={() => setSidebarOpen(false)}
                >
                <Icon size={17} />
                <span>{label}</span>
                {label === "Nội dung vi phạm" && (
                    <i>{records.reports.filter((item) => item.status === "Chờ xử lý").length}</i>
                )}
                </NavLink>
            ))}
            </nav>

        </aside>

        <main className="admin-main">
            <header className="admin-header">
            <button 
                className="admin-mobile-menu" 
                type="button" 
                aria-label="Mở menu" 
                onClick={() => setSidebarOpen(true)}
            >
                <Menu size={20} />
            </button>
            
            <div className="admin-header-title">
                <h1>{currentTitle}</h1>
            </div>
            
            <form className="admin-header-search" onSubmit={handleQuickSearch}>
                <Search size={17} />
                <input 
                aria-label="Tìm kiếm nhanh" 
                value={search} 
                onChange={(event) => setSearch(event.target.value)} 
                placeholder="Tìm nhanh chức năng..." 
                />
            </form>
            
            <div className="admin-header-actions">
                <button className="admin-notification" type="button" aria-label="Thông báo">
                <Bell size={18} />
                <i />
                </button>
                
                <span className="admin-header-divider" />
                
                <div className="admin-profile-wrap">
                <button 
                    className="admin-profile" 
                    type="button" 
                    onClick={() => setAccountMenuOpen((open) => !open)}
                >
                    <span className="admin-profile-avatar">QT</span>
                    <span>
                    <strong>Admin</strong>
                    <small>Quản trị viên</small>
                    </span>
                    <ChevronDown size={15} />
                </button>
                
                {accountMenuOpen && (
                    <div className="admin-profile-menu">
                    <strong>Quản trị viên</strong>
                    <small>admin@tinhhoaviet.vn</small>
                    <Link to={ROUTES.LOGIN} onClick={() => setAccountMenuOpen(false)}>
                        <LogOut size={14} />Đăng xuất
                    </Link>
                    </div>
                )}
                </div>
            </div>
            </header>

            <div className="admin-content">
                <div className="admin-breadcrumb">
                    <span>Trang quản trị</span>
                    <ChevronRight size={13} /><strong>{currentTitle}</strong>
                </div>

            <Outlet context={outletContext} />
            <footer className="admin-footer">
                <span>© 2026 Tinh Hoa Việt. Gìn giữ tinh hoa nghề Việt.</span>
                <span><i /> Hệ thống đang hoạt động</span>
            </footer>
            </div>
        </main>
        {isSidebarOpen && <button type="button" 
        className="admin-backdrop" aria-label="Đóng menu" 
        onClick={() => setSidebarOpen(false)} />
        }
      <AccountModal modal={modal} onClose={() => setModal(null)} onSave={handleSave} onConfirm={confirmModalAction} />
      {toast && <div className="admin-toast" role="status"><BadgeCheck size={17} />{toast}</div>}
    </div>
  );
}
