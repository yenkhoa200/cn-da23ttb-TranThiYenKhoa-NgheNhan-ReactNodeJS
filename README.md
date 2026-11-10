# 🌿 Đề tài: Xây dựng ứng dụng hỗ trợ nghệ nhân giới thiệu và truyền tải giá trị văn hóa trong du lịch cộng đồng
## 1. Giới thiệu dự án

**Xây dựng ứng dụng hỗ trợ nghệ nhân giới thiệu và truyền tải giá trị văn hóa trong du lịch cộng đồng** là ứng dụng web hỗ trợ nghệ nhân giới thiệu, quảng bá nghề truyền thống và truyền tải những giá trị văn hóa đến cộng đồng thông qua hoạt động du lịch cộng đồng.

Dự án hướng đến việc kết nối ba đối tượng: **Du khách – Nghệ nhân – Admin**, tạo ra một không gian trực tuyến để du khách khám phá làng nghề, tìm hiểu sản phẩm thủ công, câu chuyện văn hóa và tham gia các hoạt động trải nghiệm do nghệ nhân cung cấp.

Thông qua ứng dụng, nghệ nhân có thể chủ động giới thiệu bản thân, nghề truyền thống, sản phẩm, quá trình gìn giữ nghề và những giá trị văn hóa gắn liền với nghề. Đồng thời, du khách có thể dễ dàng tiếp cận thông tin, lưu nội dung yêu thích, đăng ký hoạt động trải nghiệm và chia sẻ đánh giá.

## 2. Mục tiêu dự án

- Hỗ trợ nghệ nhân giới thiệu bản thân và quảng bá nghề truyền thống trên nền tảng trực tuyến.
- Lưu giữ và truyền tải những câu chuyện, kiến thức và giá trị văn hóa truyền thống.
- Giúp du khách tìm kiếm, khám phá các làng nghề, nghệ nhân và sản phẩm thủ công.
- Tạo điều kiện để du khách đăng ký tham gia các hoạt động trải nghiệm văn hóa.
- Góp phần nâng cao khả năng tiếp cận thông tin và quảng bá du lịch cộng đồng.

## 3. Đối tượng sử dụng

Hệ thống gồm 3 nhóm người dùng:

### 3.1. Du khách (Tourist)

- Đăng ký, đăng nhập và quản lý thông tin cá nhân.
- Tìm kiếm và xem thông tin nghệ nhân.
- Khám phá làng nghề truyền thống.
- Xem thông tin về nghề truyền thống và sản phẩm thủ công.
- Đọc các câu chuyện, kiến thức và giá trị văn hóa.
- Tìm kiếm và xem các hoạt động trải nghiệm.
- Xem hình ảnh, video về nghệ nhân, nghề truyền thống và hoạt động.
- Lưu các nội dung yêu thích.
- Đăng ký tham gia hoạt động trải nghiệm.
- Đánh giá và gửi nhận xét về nội dung hoặc hoạt động trải nghiệm.

### 3.2. Nghệ nhân (Artisan)

- Đăng ký, đăng nhập và quản lý tài khoản.
- Quản lý hồ sơ cá nhân và thông tin nghề nghiệp.
- Giới thiệu nghề truyền thống và quá trình gìn giữ nghề.
- Quản lý thông tin sản phẩm thủ công và hình ảnh.
- Chia sẻ câu chuyện, kiến thức và giá trị văn hóa.
- Đăng tải và quản lý hình ảnh, video.
- Tạo và quản lý các hoạt động trải nghiệm.
- Theo dõi danh sách du khách đăng ký tham gia hoạt động.
- Xem đánh giá và nhận xét từ du khách.

### 3.3. Quản trị viên (Admin)

- Quản lý tài khoản du khách và nghệ nhân.
- Quản lý thông tin nghệ nhân.
- Quản lý làng nghề và nghề truyền thống.
- Quản lý sản phẩm và hình ảnh.
- Quản lý nội dung văn hóa và câu chuyện.
- Quản lý hoạt động trải nghiệm.
- Quản lý hình ảnh và video.
- Quản lý đánh giá và nhận xét.
- Kiểm tra, chỉnh sửa hoặc xóa nội dung không phù hợp.
- Khóa và mở khóa tài khoản khi cần thiết.

## 4. Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Frontend | ReactJS |
| Build tool | Vite |
| Backend | Node.js |
| Backend Framework | Express.js |
| Cơ sở dữ liệu | PostgreSQL |
| Giao tiếp dữ liệu | RESTful API |
| Định dạng dữ liệu | JSON |
| Xác thực | JWT (JSON Web Token) |
| Quản lý mã nguồn | Git và GitHub |
| Môi trường phát triển | Visual Studio Code |

## 5. Kiến trúc hệ thống

Dự án được xây dựng theo mô hình Client – Server, kết hợp tổ chức Backend theo mô hình phân lớp.

**Luồng hoạt động:**

```text
        NGƯỜI DÙNG
             |
             v
    REACTJS (FRONTEND)
             |
             v
      RESTful API
             |
             v
    NODE.JS + EXPRESS
             |
      +------+------+
      |             |
      v             v
  Middleware    Controllers
      |             |
      +------+------+
             |
             v
       Services / Models
             |
             v
       POSTGRESQL
```

- **Frontend:** Hiển thị giao diện và tiếp nhận thao tác từ người dùng.
- **Backend:** Tiếp nhận yêu cầu, xử lý nghiệp vụ và kiểm tra quyền truy cập.
- **Database:** Lưu trữ thông tin tài khoản, nghệ nhân, làng nghề, sản phẩm, nội dung văn hóa và hoạt động trải nghiệm.
- **JWT:** Hỗ trợ xác thực người dùng và phân quyền theo vai trò.

## 6. Cấu trúc thư mục dự án

```text
cn-da23ttb-TranThiYenKhoa-NgheNhan-ReactNodeJS/
│
├── README.ms
│
├── progress-report/
│
├── setup/
│
├── src/
│   │
│   ├── frontend/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── tourist/
│   │   │   ├── artisan/
│   │   │   ├── admin/
│   │   │   ├── services/
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   ├── .env
│   │   └── package.json
│   │
│   └── backend/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── validators/
│       ├── app.js
│       ├── server.js
│       ├── .env
│       └── package.json
```

*Lưu ý: Cấu trúc trên thể hiện cách tổ chức thư mục dự kiến; có thể điều chỉnh theo cấu trúc thực tế của mã nguồn.*

## 7. Cài đặt và chạy dự án

### 7.1. Yêu cầu môi trường

Cài đặt các công cụ sau trước khi chạy dự án:

- Node.js và npm.
- PostgreSQL.
- Visual Studio Code.
- Git.

### 7.2. Cài đặt Frontend

Mở Terminal tại thư mục Frontend:

```bash
cd src/frontend
```

Cài đặt các thư viện:

```bash
npm install
```

Khởi chạy ứng dụng:

```bash
npm run dev
```

Frontend mặc định sử dụng địa chỉ:

```text
http://localhost:5173
```

### 7.3. Cài đặt Backend

Mở Terminal mới tại thư mục Backend:

```bash
cd src/backend
```

Cài đặt các thư viện:

```bash
npm install
```

Khởi chạy Backend:

```bash
npm run dev
```

*Lệnh chạy Backend phụ thuộc vào script được khai báo trong package.json.*

### 7.4. Cấu hình cơ sở dữ liệu

- Cài đặt và khởi động PostgreSQL.
- Tạo cơ sở dữ liệu cho dự án.
- Thực thi các câu lệnh SQL để tạo bảng và quan hệ dữ liệu.
- Cấu hình thông tin kết nối trong file `.env` của Backend.

Ví dụ cấu hình:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tinhhoa_viet
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
```

Không chia sẻ mật khẩu cơ sở dữ liệu hoặc JWT_SECRET lên GitHub.

## 8. Các chức năng chính của hệ thống

| Phân hệ | Chức năng |
|---|---|
| Tài khoản | Đăng ký, đăng nhập, xác thực và phân quyền |
| Nghệ nhân | Quản lý hồ sơ và thông tin nghề nghiệp |
| Làng nghề | Giới thiệu và quản lý thông tin làng nghề |
| Nghề truyền thống | Lưu trữ thông tin các nghề truyền thống |
| Sản phẩm | Quản lý và giới thiệu sản phẩm thủ công |
| Nội dung văn hóa | Chia sẻ câu chuyện và kiến thức văn hóa |
| Hoạt động trải nghiệm | Tạo, quản lý và đăng ký hoạt động |
| Yêu thích | Lưu các nội dung du khách quan tâm |
| Đánh giá | Gửi và quản lý đánh giá, nhận xét |
| Quản trị | Quản lý người dùng và kiểm duyệt nội dung |

## 9. Phạm vi dự án

Dự án tập trung vào việc giới thiệu, kết nối và truyền tải giá trị văn hóa thông qua các hoạt động du lịch cộng đồng.

**Các chức năng nằm ngoài phạm vi triển khai hiện tại:**

- Thanh toán trực tuyến.
- Thương mại điện tử và xử lý đơn hàng.
- Quản lý tour du lịch chuyên nghiệp.
- Hệ thống điều phối hướng dẫn viên.

Sản phẩm thủ công được giới thiệu nhằm giúp du khách tìm hiểu giá trị và đặc trưng của nghề truyền thống, không tập trung vào giao dịch mua bán trực tuyến.

## 10. Định hướng phát triển

Trong tương lai, hệ thống có thể được mở rộng với một số chức năng:

- Tích hợp bản đồ và hướng dẫn đường đi đến làng nghề.
- Bổ sung trải nghiệm tham quan làng nghề bằng công nghệ thực tế ảo.
- Tăng cường nội dung đa phương tiện như video và hình ảnh 360 độ.
- Hỗ trợ đa ngôn ngữ để tiếp cận du khách quốc tế.
- Phát triển thêm các hình thức tương tác nhằm quảng bá và bảo tồn giá trị văn hóa.

## 11. Thông tin dự án

| Thông tin | Nội dung |
|---|---|
| Tên đề tài | Xây dựng ứng dụng hỗ trợ nghệ nhân giới thiệu và truyền tải giá trị văn hóa trong du lịch cộng đồng |
| Tên ứng dụng | Tinh Hoa Việt |
| Loại dự án | Đồ án chuyên ngành |
| Ngành | Công nghệ thông tin |
| Lĩnh vực | Du lịch cộng đồng và bảo tồn văn hóa |
| Sinh viên thực hiện | Trần Thị Yến Khoa |
| Lớp | DA23TTB |
| Giảng viên hướng dẫn | TS. Thạch Kọng Saoane |

---

**Tinh Hoa Việt – Kết nối nghệ nhân, lan tỏa giá trị văn hóa và gìn giữ tinh hoa nghề truyền thống Việt Nam.**