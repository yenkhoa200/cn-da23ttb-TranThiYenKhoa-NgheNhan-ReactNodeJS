# Tải tư liệu sản phẩm

Tệp được lưu trên ổ đĩa backend tại `src/backend/uploads/products/`. PostgreSQL
chỉ lưu đường dẫn, loại tư liệu, chú thích và tài khoản tải lên trong bảng
`da_phuong_tien` (có sẵn trong `setup/database/nghenhan_db.sql`). Backend tự
tạo thư mục lưu tệp khi khởi động và phục vụ tệp qua `/uploads`.

## API

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
