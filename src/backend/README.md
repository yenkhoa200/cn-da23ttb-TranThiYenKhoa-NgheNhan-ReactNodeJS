# Tải tư liệu sản phẩm

Tệp được lưu trên ổ đĩa backend tại `src/backend/uploads/products/`. PostgreSQL
chỉ lưu đường dẫn, loại tư liệu, chú thích và tài khoản tải lên trong bảng
`da_phuong_tien` (có sẵn trong `setup/database/nghenhan_db.sql`). Backend tự
tạo thư mục lưu tệp khi khởi động và phục vụ tệp qua `/uploads`.

## API

### Thư viện ảnh và video nghệ nhân

- `GET /api/artisan/profile/media` trả về ảnh và video do nghệ nhân hiện tại tải
  lên, gồm cả tư liệu gắn với sản phẩm.
- `POST /api/artisan/profile/media` nhận `multipart/form-data` với trường `file`;
  chấp nhận JPG, PNG, WEBP, MP4, MOV và WEBM, tối đa 50 MB. Có thể gửi thêm
  `caption` tối đa 500 ký tự.
- Ảnh/video tải trực tiếp lên thư viện được lưu tại
  `src/backend/uploads/artisans/`; cơ sở dữ liệu chỉ lưu đường dẫn và thông tin
  tư liệu.

### Đánh giá và nhận xét nghệ nhân

`GET /api/artisan/profile/reviews` trả về các đánh giá đã được duyệt dành cho
hồ sơ nghệ nhân, sản phẩm và hoạt động trải nghiệm thuộc nghệ nhân đang đăng
nhập. API yêu cầu xác thực bằng tài khoản nghệ nhân.

### Tải tư liệu sản phẩm

`POST /api/products/:id/media`

- Yêu cầu đăng nhập bằng tài khoản nghệ nhân.
- Gửi `multipart/form-data` với trường tệp tên `file`; có thể gửi thêm trường
  `caption` tối đa 500 ký tự.
- Chấp nhận JPG, PNG, WEBP, MP4, MOV, WEBM và PDF; tối đa 50 MB mỗi tệp.
- Chỉ chủ sở hữu sản phẩm mới có thể tải tư liệu lên.

Ví dụ gọi từ frontend:

```js
const media = await productService.uploadMedia(productId, file, "Ảnh sản phẩm");
console.log(media.url);
```

Giá trị `url` có dạng `/uploads/products/<tên-tệp>` và có thể lưu/hiển thị thay
cho dữ liệu tệp. Dùng `productService.uploadMedia()` sau khi đã tạo sản phẩm để
có `productId`.

Lưu ý: thư mục local phù hợp cho phát triển hoặc triển khai một máy chủ có ổ đĩa
bền vững. Nếu dùng nhiều máy chủ, container có ổ đĩa tạm thời hoặc cần CDN, hãy
chuyển lưu trữ tệp sang dịch vụ object storage và chỉ lưu URL của dịch vụ đó vào
`da_phuong_tien`.
