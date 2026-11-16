-- =====================================================================
-- DỮ LIỆU MẪU ĐẦY ĐỦ CHO Nghe_Nhan_db
-- Chạy SAU khi đã tạo xong các bảng. Có thể chạy lại nhiều lần.
-- Mật khẩu tất cả tài khoản: 123456
-- =====================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

TRUNCATE TABLE
    reviews, favorites, experience_bookings, media_files,
    experience_activities, cultural_contents, products,
    craft_village_crafts, artisan_craft_villages, artisan_crafts,
    traditional_crafts, craft_villages, artisans, accounts
RESTART IDENTITY CASCADE;

-- ---------------------------------------------------------------------
-- 1. ACCOUNTS (id: 1 admin | 2,4,5,6,7 nghệ nhân | 3,8,9,10 du khách)
-- ---------------------------------------------------------------------
INSERT INTO accounts (full_name, email, password_hash, phone_number, avatar_url, role, account_status) VALUES
 ('Quản trị viên',    'admin@vanhoa.vn',     crypt('123456', gen_salt('bf')), '0900000001', 'https://i.pravatar.cc/200?img=1',  'quan_tri', 'hoat_dong'),
 ('Nguyễn Văn An',    'an@nghenhan.vn',      crypt('123456', gen_salt('bf')), '0900000002', 'https://i.pravatar.cc/200?img=12', 'artisans', 'hoat_dong'),
 ('Trần Thị Hà',      'ha@khach.vn',         crypt('123456', gen_salt('bf')), '0900000003', 'https://i.pravatar.cc/200?img=5',  'du_khach', 'hoat_dong'),
 ('Lê Thị Mai',       'mai@nghenhan.vn',     crypt('123456', gen_salt('bf')), '0900000004', 'https://i.pravatar.cc/200?img=47', 'artisans', 'hoat_dong'),
 ('Phạm Văn Bình',    'binh@nghenhan.vn',    crypt('123456', gen_salt('bf')), '0900000005', 'https://i.pravatar.cc/200?img=15', 'artisans', 'hoat_dong'),
 ('Hoàng Thị Lan',    'lan@nghenhan.vn',     crypt('123456', gen_salt('bf')), '0900000006', 'https://i.pravatar.cc/200?img=45', 'artisans', 'hoat_dong'),
 ('Vũ Minh Khoa',     'khoa@nghenhan.vn',    crypt('123456', gen_salt('bf')), '0900000007', 'https://i.pravatar.cc/200?img=33', 'artisans', 'hoat_dong'),
 ('Đỗ Quang Huy',     'huy@khach.vn',        crypt('123456', gen_salt('bf')), '0900000008', 'https://i.pravatar.cc/200?img=52', 'du_khach', 'hoat_dong'),
 ('Bùi Thu Trang',    'trang@khach.vn',      crypt('123456', gen_salt('bf')), '0900000009', 'https://i.pravatar.cc/200?img=44', 'du_khach', 'hoat_dong'),
 ('Lý Gia Bảo',       'bao@khach.vn',        crypt('123456', gen_salt('bf')), '0900000010', 'https://i.pravatar.cc/200?img=68', 'du_khach', 'bi_khoa');

-- ---------------------------------------------------------------------
-- 2. LÀNG NGHỀ & NGHỀ TRUYỀN THỐNG
-- ---------------------------------------------------------------------
INSERT INTO craft_villages (craft_village_name, craft_village_address, province_city, craft_village_history, craft_village_introduction, avatar_url) VALUES
 ('Làng gốm Bát Tràng',   'Xã Bát Tràng, huyện Gia Lâm',      'Hà Nội',   'Hình thành từ thế kỷ 14-15, nổi tiếng với gốm men lam, men rạn.', 'Làng gốm truyền thống hơn 500 năm bên bờ sông Hồng.', 'https://picsum.photos/seed/battrang/800/600'),
 ('Làng lụa Vạn Phúc',    'Phường Vạn Phúc, quận Hà Đông',    'Hà Nội',   'Có lịch sử hơn 1.000 năm, từng tiến vua.', 'Làng nghề dệt lụa tơ tằm nổi tiếng với các hoa văn tinh xảo.', 'https://picsum.photos/seed/vanphuc/800/600'),
 ('Làng sơn mài Hạ Thái', 'Xã Duyên Thái, huyện Thường Tín', 'Hà Nội',   'Nghề sơn mài do ông Trần Lâm truyền dạy từ thế kỷ 17.', 'Cái nôi của nghề sơn mài truyền thống Việt Nam.', 'https://picsum.photos/seed/hathai/800/600'),
 ('Làng tranh Đông Hồ',   'Xã Song Hồ, huyện Thuận Thành',    'Bắc Ninh', 'Dòng tranh dân gian ra đời từ khoảng thế kỷ 16.', 'Làng nghề làm tranh khắc gỗ in màu từ nguyên liệu tự nhiên.', 'https://picsum.photos/seed/donghoo/800/600'),
 ('Làng mây tre Phú Vinh','Xã Phú Vinh, huyện Chương Mỹ',    'Hà Nội',   'Nghề đan mây tre truyền thống hơn 300 năm.', 'Làng nghề nổi tiếng với các sản phẩm mây tre đan xuất khẩu.', 'https://picsum.photos/seed/phuvinh/800/600');

INSERT INTO traditional_crafts (craft_name, description, origin, production_process, cultural_value, avatar_url, activity_status) VALUES
 ('Nghề làm gốm',        'Chế tác đồ gốm thủ công từ đất sét.',             'Hình thành từ thế kỷ 14-15.', 'Chọn đất - nhào luyện - tạo hình - phơi - tráng men - nung.', 'Gắn liền với đời sống tín ngưỡng và sinh hoạt của người Việt.', 'https://picsum.photos/seed/craft_gom/800/600', 'hoat_dong'),
 ('Nghề dệt lụa',        'Dệt vải lụa từ tơ tằm bằng khung cửi truyền thống.','Có từ hơn 1.000 năm trước.',  'Nuôi tằm - ươm tơ - nhuộm - dệt - hoàn thiện.', 'Biểu tượng của sự tinh tế trong trang phục Việt.', 'https://picsum.photos/seed/craft_lua/800/600', 'hoat_dong'),
 ('Nghề sơn mài',        'Vẽ và mài nhiều lớp sơn ta trên nền gỗ.',         'Du nhập và phát triển từ thế kỷ 17.', 'Làm cốt - bó vải - sơn lót - vẽ - mài - phủ bóng.', 'Dòng nghệ thuật độc đáo, giàu bản sắc dân tộc.', 'https://picsum.photos/seed/craft_sonmai/800/600', 'hoat_dong'),
 ('Nghề làm tranh Đông Hồ','Khắc ván gỗ và in tranh bằng màu tự nhiên.',     'Ra đời khoảng thế kỷ 16.',   'Khắc ván - pha màu tự nhiên - in từng màu - phơi tranh.', 'Phản ánh đời sống, ước vọng của người dân vùng Kinh Bắc.', 'https://picsum.photos/seed/craft_donghoo/800/600', 'hoat_dong'),
 ('Nghề đan mây tre',    'Đan lát các vật dụng từ mây, tre.',               'Có từ lâu đời ở đồng bằng Bắc Bộ.', 'Chọn tre - chẻ nan - xử lý - đan - hoàn thiện.', 'Gắn bó với đời sống nông thôn Việt Nam.', 'https://picsum.photos/seed/craft_maytre/800/600', 'tam_ngung');

-- ---------------------------------------------------------------------
-- 3. HỒ SƠ NGHỆ NHÂN (artisan_id = account_id)
-- ---------------------------------------------------------------------
INSERT INTO artisans (artisan_id, date_of_birth, address, introduction, years_of_experience, craft_background, verification_status, verified_by_admin_id, verified_at) VALUES
 (2, '1968-03-12', 'Bát Tràng, Gia Lâm, Hà Nội',         'Nghệ nhân gốm 30 năm kinh nghiệm.',                   30, 'Truyền nghề từ ông nội, chuyên men lam và men rạn.',           'da_xac_minh',  1, now() - interval '60 days'),
 (4, '1972-07-25', 'Vạn Phúc, Hà Đông, Hà Nội',          'Nghệ nhân dệt lụa, giữ gìn họa tiết cổ.',            25, 'Học nghề từ mẹ, từng tham gia nhiều hội chợ làng nghề.',        'da_xac_minh',  1, now() - interval '45 days'),
 (5, '1965-11-02', 'Hạ Thái, Thường Tín, Hà Nội',        'Nghệ nhân sơn mài với hơn 35 năm gắn bó.',           35, 'Từng học tại trường Mỹ nghệ, sáng tác tranh sơn mài đề tài làng quê.', 'da_xac_minh', 1, now() - interval '30 days'),
 (6, '1980-01-18', 'Phú Vinh, Chương Mỹ, Hà Nội',        'Nghệ nhân trẻ đam mê đan mây tre.',                  15, 'Học nghề từ cha, sáng tạo mẫu mã hiện đại.',                    'cho_xac_minh', NULL, NULL),
 (7, '1970-09-09', 'Song Hồ, Thuận Thành, Bắc Ninh',     'Truyền nhân dòng tranh Đông Hồ đời thứ 5.',          28, 'Gia đình nhiều đời làm tranh khắc gỗ.',                         'da_xac_minh',  1, now() - interval '20 days');

INSERT INTO artisan_crafts (artisan_id, craft_id, start_year) VALUES
 (2, 1, 1995), (4, 2, 2000), (5, 3, 1990), (6, 5, 2010), (7, 4, 1998), (2, 3, 2015);

INSERT INTO artisan_craft_villages (artisan_id, craft_village_id) VALUES
 (2, 1), (4, 2), (5, 3), (6, 5), (7, 4);

INSERT INTO craft_village_crafts (craft_village_id, craft_id) VALUES
 (1, 1), (2, 2), (3, 3), (4, 4), (5, 5);

-- ---------------------------------------------------------------------
-- 4. SẢN PHẨM
-- ---------------------------------------------------------------------
INSERT INTO products (artisan_id, craft_id, product_name, product_description, materials, crafting_process, cultural_significance, display_status) VALUES
 (2, 1, 'Bình gốm men lam Bát Tràng',   'Bình hoa men lam vẽ tay họa tiết hoa sen.',     'Đất sét cao lanh, men lam',  'Nặn - vẽ - tráng men - nung 1.300 độ C.',  'Hoa sen tượng trưng cho sự thanh cao.',      'da_dang'),
 (2, 1, 'Bộ ấm chén men rạn',           'Bộ ấm chén men rạn cổ, mỗi chiếc một vân riêng.','Đất sét, men rạn',           'Nặn - tráng men - nung - xử lý rạn.',      'Thú uống trà của người Việt.',               'da_dang'),
 (4, 2, 'Khăn lụa tơ tằm Vạn Phúc',     'Khăn lụa dệt tay, họa tiết hoa văn truyền thống.','Tơ tằm tự nhiên',            'Ươm tơ - nhuộm - dệt tay trên khung cửi.', 'Biểu tượng của vẻ đẹp dịu dàng.',            'da_dang'),
 (4, 2, 'Áo dài lụa thêu tay',          'Áo dài lụa thêu hoa văn thủ công.',             'Lụa tơ tằm, chỉ thêu',      'Dệt - cắt may - thêu tay.',                'Trang phục truyền thống của phụ nữ Việt.',   'cho_duyet'),
 (5, 3, 'Tranh sơn mài Làng quê',       'Tranh sơn mài khổ 60x80cm về cảnh làng quê.',   'Sơn ta, vàng bạc, gỗ',      'Bó vải - sơn lót - vẽ - mài nhiều lần.',   'Tái hiện vẻ đẹp làng quê Bắc Bộ.',           'da_dang'),
 (5, 3, 'Hộp trang sức sơn mài',        'Hộp gỗ phủ sơn mài, khảm trai.',                'Gỗ, sơn ta, vỏ trai',       'Làm cốt - sơn - khảm - mài.',              'Kết hợp giữa mỹ nghệ và ứng dụng.',          'nhap'),
 (7, 4, 'Tranh Đông Hồ Đám cưới chuột', 'Tranh khắc gỗ in màu tự nhiên về đám cưới chuột.','Giấy điệp, màu tự nhiên',  'Khắc ván - in từng màu - phơi.',           'Phản ánh khát vọng và sự châm biếm dí dỏm.', 'da_dang'),
 (7, 4, 'Tranh Đông Hồ Vinh hoa phú quý','Tranh chúc phúc ngày Tết.',                    'Giấy điệp, màu tự nhiên',  'Khắc ván - in từng màu - phơi.',           'Lời chúc may mắn đầu năm.',                  'bi_an'),
 (6, 5, 'Giỏ mây đan thủ công',         'Giỏ mây đan hoa văn truyền thống.',             'Mây, tre',                  'Chẻ nan - đan - hoàn thiện.',              'Gắn bó với đời sống nông thôn.',             'cho_duyet');

-- ---------------------------------------------------------------------
-- 5. NỘI DUNG VĂN HÓA
-- ---------------------------------------------------------------------
INSERT INTO cultural_contents (artisan_id, craft_id, title, content_type, summary, content, cultural_significance, moderation_status, approved_by_admin_id, approved_at) VALUES
 (2, 1, 'Câu chuyện men rạn Bát Tràng',        'cau_chuyen', 'Nguồn gốc của men rạn độc đáo.',       'Men rạn xuất hiện từ một lần nung thất bại nhưng lại tạo nên vẻ đẹp riêng. Tiếng "tách" khi men rạn được người thợ coi như âm thanh may mắn...', 'Thể hiện tinh thần sáng tạo từ sai lầm.', 'da_dang', 1, now() - interval '40 days'),
 (2, 1, 'Kỹ thuật nặn gốm bằng bàn xoay',      'ky_thuat',   'Hướng dẫn cơ bản cho người mới.',      'Bàn xoay giúp tạo hình đối xứng. Người thợ cần giữ tay vững, đất đủ ẩm và xoay đều...', 'Kỹ thuật được truyền qua nhiều thế hệ.', 'da_dang', 1, now() - interval '35 days'),
 (4, 2, 'Lụa Vạn Phúc và truyền thuyết tiến vua','cau_chuyen','Làng lụa gắn với những giai thoại xưa.',   'Tương truyền nghề dệt do bà Lê Thị Hoa truyền dạy cho dân làng, lụa Vạn Phúc từng được tiến vua...', 'Niềm tự hào của người dân Hà Đông.', 'da_dang', 1, now() - interval '25 days'),
 (5, 3, 'Vì sao sơn mài cần mài nhiều lần?',    'kien_thuc',  'Hiểu về quy trình mài sơn.',           'Mỗi lớp sơn phải khô hoàn toàn rồi mới mài, có tranh cần hàng chục lớp để đạt độ sâu và bóng...', 'Sự kiên nhẫn là tinh thần của nghề sơn mài.', 'da_dang', 1, now() - interval '15 days'),
 (7, 4, 'Phong tục treo tranh Đông Hồ ngày Tết','phong_tuc',  'Treo tranh đón xuân.',                 'Từ xưa, người Việt có thói quen treo tranh Đông Hồ trong nhà vào dịp Tết để cầu phúc lộc...', 'Gắn với phong tục đón Tết cổ truyền.', 'cho_duyet', NULL, NULL),
 (6, 5, 'Chọn tre đúng mùa để đan lát',         'kien_thuc',  'Kinh nghiệm chọn nguyên liệu.',        'Tre được khai thác vào mùa thu đông ít mối mọt, bền hơn...', 'Kinh nghiệm dân gian được đúc kết.', 'nhap', NULL, NULL);

-- ---------------------------------------------------------------------
-- 6. HOẠT ĐỘNG TRẢI NGHIỆM
-- ---------------------------------------------------------------------
INSERT INTO experience_activities (artisan_id, craft_id, craft_village_id, activity_name, activity_description, venue, duration_minutes, max_participants, schedule_description, participation_requirements, activity_status) VALUES
 (2, 1, 1, 'Trải nghiệm nặn gốm',            'Tự tay nặn một sản phẩm gốm.',                  'Xưởng gốm Bát Tràng',        120, 10, 'Thứ 7, 8h-10h',  'Trẻ em dưới 8 tuổi cần người lớn đi cùng.', 'dang_mo'),
 (2, 1, 1, 'Vẽ hoa văn lên gốm',             'Vẽ họa tiết men lam lên sản phẩm của riêng bạn.','Xưởng gốm Bát Tràng',        90,  8,  'Chủ nhật, 14h-15h30', NULL,                          'dang_mo'),
 (4, 2, 2, 'Tham quan và dệt lụa thủ công',  'Tìm hiểu quy trình dệt và thử dệt trên khung cửi.','Nhà dệt Vạn Phúc',          150, 12, 'Thứ 7, 9h-11h30', NULL,                           'dang_mo'),
 (5, 3, 3, 'Workshop sơn mài cơ bản',        'Vẽ và mài một tấm sơn mài nhỏ.',                'Xưởng sơn mài Hạ Thái',      180, 6,  'Chủ nhật, 8h-11h', 'Mặc quần áo thoải mái.',           'dang_mo'),
 (7, 4, 4, 'In tranh Đông Hồ',               'Tự tay in một bức tranh bằng ván khắc gỗ.',     'Nhà tranh Đông Hồ',          100, 15, 'Hàng ngày, 9h-17h', NULL,                          'tam_ngung'),
 (6, 5, 5, 'Học đan giỏ mây',                'Hướng dẫn đan một chiếc giỏ mây nhỏ.',          'Xưởng mây tre Phú Vinh',     120, 10, 'Thứ 6, 14h-16h',  NULL,                           'cho_duyet');

-- ---------------------------------------------------------------------
-- 7. MEDIA (mỗi dòng gắn đúng MỘT đối tượng)
-- ---------------------------------------------------------------------
INSERT INTO media_files (uploaded_by_account_id, media_type, file_url, caption, artisan_id, product_id, content_id, activity_id) VALUES
 (2, 'hinh_anh', 'https://picsum.photos/seed/art2/800/600',   'Nghệ nhân Nguyễn Văn An tại xưởng',   2, NULL, NULL, NULL),
 (4, 'hinh_anh', 'https://picsum.photos/seed/art4/800/600',   'Nghệ nhân Lê Thị Mai bên khung cửi',  4, NULL, NULL, NULL),
 (2, 'hinh_anh', 'https://picsum.photos/seed/prod1/800/600',  'Bình gốm men lam',                    NULL, 1, NULL, NULL),
 (2, 'hinh_anh', 'https://picsum.photos/seed/prod2/800/600',  'Bộ ấm chén men rạn',                  NULL, 2, NULL, NULL),
 (4, 'hinh_anh', 'https://picsum.photos/seed/prod3/800/600',  'Khăn lụa tơ tằm',                     NULL, 3, NULL, NULL),
 (5, 'hinh_anh', 'https://picsum.photos/seed/prod5/800/600',  'Tranh sơn mài Làng quê',              NULL, 5, NULL, NULL),
 (7, 'hinh_anh', 'https://picsum.photos/seed/prod7/800/600',  'Tranh Đám cưới chuột',                NULL, 7, NULL, NULL),
 (2, 'hinh_anh', 'https://picsum.photos/seed/cont1/800/600',  'Men rạn Bát Tràng',                   NULL, NULL, 1, NULL),
 (2, 'video',    'https://example.com/videos/nan-gom.mp4',    'Video hướng dẫn nặn gốm',             NULL, NULL, 2, NULL),
 (5, 'tai_lieu', 'https://example.com/docs/son-mai.pdf',      'Tài liệu quy trình sơn mài',          NULL, NULL, 4, NULL),
 (2, 'hinh_anh', 'https://picsum.photos/seed/act1/800/600',   'Buổi trải nghiệm nặn gốm',            NULL, NULL, NULL, 1),
 (4, 'hinh_anh', 'https://picsum.photos/seed/act3/800/600',   'Du khách thử dệt lụa',                NULL, NULL, NULL, 3),
 (5, 'hinh_anh', 'https://picsum.photos/seed/act4/800/600',   'Workshop sơn mài',                    NULL, NULL, NULL, 4);

-- ---------------------------------------------------------------------
-- 8. ĐẶT LỊCH TRẢI NGHIỆM
-- ---------------------------------------------------------------------
INSERT INTO experience_bookings (account_id, activity_id, experience_date, start_time, end_time, participant_count, notes, booking_status, confirmed_at) VALUES
 (3, 1, '2026-10-10', '08:00', '10:00', 2, 'Đi cùng con nhỏ.',        'hoan_thanh',   now() - interval '35 days'),
 (8, 1, '2026-10-17', '08:00', '10:00', 4, 'Nhóm bạn đi chơi.',       'hoan_thanh',   now() - interval '28 days'),
 (9, 3, '2026-10-24', '09:00', '11:30', 1, NULL,                      'hoan_thanh',   now() - interval '21 days'),
 (3, 2, '2026-11-22', '14:00', '15:30', 2, NULL,                      'da_xac_nhan',  now() - interval '2 days'),
 (8, 4, '2026-11-29', '08:00', '11:00', 3, 'Muốn học vẽ cơ bản.',     'cho_xac_nhan', NULL),
 (9, 1, '2026-11-28', '08:00', '10:00', 2, NULL,                      'cho_xac_nhan', NULL),
 (3, 3, '2026-11-14', '09:00', '11:30', 5, 'Đoàn công ty.',           'da_huy',       NULL),
 (8, 2, '2026-12-06', '14:00', '15:30', 20,'Số lượng lớn.',           'bi_tu_choi',   NULL);

-- ---------------------------------------------------------------------
-- 9. YÊU THÍCH
-- ---------------------------------------------------------------------
INSERT INTO favorites (account_id, artisan_id, craft_id, product_id, content_id, activity_id) VALUES
 (3, 2,    NULL, NULL, NULL, NULL),
 (3, NULL, 1,    NULL, NULL, NULL),
 (3, NULL, NULL, 1,    NULL, NULL),
 (3, NULL, NULL, NULL, NULL, 1),
 (8, 4,    NULL, NULL, NULL, NULL),
 (8, NULL, 2,    NULL, NULL, NULL),
 (8, NULL, NULL, 3,    NULL, NULL),
 (8, NULL, NULL, NULL, 1,    NULL),
 (9, NULL, 3,    NULL, NULL, NULL),
 (9, NULL, NULL, 5,    NULL, NULL),
 (9, NULL, NULL, NULL, 4,    NULL),
 (9, NULL, NULL, NULL, NULL, 3);

-- ---------------------------------------------------------------------
-- 10. ĐÁNH GIÁ
-- ---------------------------------------------------------------------
INSERT INTO reviews (account_id, rating, review_content, moderation_status, approved_by_admin_id, approved_at, artisan_id, product_id, content_id, activity_id) VALUES
 (3, 5, 'Nghệ nhân rất nhiệt tình, con mình rất thích!',   'da_duyet',  1, now() - interval '30 days', NULL, NULL, NULL, 1),
 (8, 4, 'Trải nghiệm vui, hơi đông người một chút.',       'da_duyet',  1, now() - interval '25 days', NULL, NULL, NULL, 1),
 (9, 5, 'Được tự tay dệt lụa, quá tuyệt vời.',             'da_duyet',  1, now() - interval '18 days', NULL, NULL, NULL, 3),
 (3, 5, 'Bình gốm đẹp, men lam rất tinh xảo.',             'da_duyet',  1, now() - interval '20 days', NULL, 1,    NULL, NULL),
 (8, 4, 'Khăn lụa mềm mại, giao hàng nhanh.',              'da_duyet',  1, now() - interval '12 days', NULL, 3,    NULL, NULL),
 (9, 5, 'Bài viết về men rạn rất hay và dễ hiểu.',         'cho_duyet', NULL, NULL,                    NULL, NULL, 1,    NULL),
 (3, 5, 'Nghệ nhân An có nhiều kiến thức về gốm.',         'da_duyet',  1, now() - interval '10 days', 2,    NULL, NULL, NULL),
 (8, 1, 'Nội dung không phù hợp.',                          'bi_an',     1, now() - interval '5 days',  NULL, NULL, 2,    NULL),
 (9, 3, 'Tranh sơn mài đẹp nhưng giá hơi cao.',            'tu_choi',   1, now() - interval '3 days',  NULL, 5,    NULL, NULL);

-- Kiểm tra nhanh số dòng
SELECT 'accounts' t, count(*) FROM accounts UNION ALL
SELECT 'artisans', count(*) FROM artisans UNION ALL
SELECT 'craft_villages', count(*) FROM craft_villages UNION ALL
SELECT 'traditional_crafts', count(*) FROM traditional_crafts UNION ALL
SELECT 'products', count(*) FROM products UNION ALL
SELECT 'cultural_contents', count(*) FROM cultural_contents UNION ALL
SELECT 'experience_activities', count(*) FROM experience_activities UNION ALL
SELECT 'media_files', count(*) FROM media_files UNION ALL
SELECT 'experience_bookings', count(*) FROM experience_bookings UNION ALL
SELECT 'favorites', count(*) FROM favorites UNION ALL
SELECT 'reviews', count(*) FROM reviews;