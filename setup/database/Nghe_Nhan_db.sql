CREATE DATABASE Nghe_Nhan_db;

-- =====================================================================
-- 1. TÀI KHOẢN & HỒ SƠ NGHỆ NHÂN
-- =====================================================================

CREATE TABLE accounts (
    account_id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name         VARCHAR(100) NOT NULL,
    email          VARCHAR(255) NOT NULL,
    password_hash  VARCHAR(255) NOT NULL,            -- lưu mã băm (bcrypt/argon2), KHÔNG lưu mật khẩu thô
    phone_number            VARCHAR(15),
    avatar_url   VARCHAR(500),
    role        VARCHAR(20)  NOT NULL DEFAULT 'du_khach',
    account_status  VARCHAR(20)  NOT NULL DEFAULT 'hoat_dong',
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT chk_account_role   CHECK (role IN ('artisans', 'du_khach', 'quan_tri')),
    CONSTRAINT chk_account_status CHECK (account_status IN ('hoat_dong', 'bi_khoa')),
    CONSTRAINT chk_account_email     CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
    CONSTRAINT chk_account_phone       CHECK (phone_number IS NULL OR phone_number ~ '^[0-9+]{9,15}$')
);
CREATE UNIQUE INDEX uq_accounts_email ON accounts (lower(email));

-- Quan hệ 1-1 với accounts: dùng chung khóa chính
CREATE TABLE artisans (
    artisan_id             BIGINT PRIMARY KEY
                      REFERENCES accounts (account_id) ON DELETE CASCADE,
    date_of_birth         DATE,
    address           VARCHAR(255),
    introduction        TEXT,
    years_of_experience         SMALLINT CHECK (years_of_experience >= 0),
    craft_background TEXT,
    verification_status VARCHAR(20) NOT NULL DEFAULT 'chua_xac_minh',
    verified_by_admin_id BIGINT REFERENCES accounts (account_id) ON DELETE SET NULL,
    verified_at     TIMESTAMPTZ,
    CONSTRAINT chk_artisan_verification_status CHECK (verification_status IN
        ('chua_xac_minh', 'cho_xac_minh', 'da_xac_minh', 'tu_choi')),
    CONSTRAINT chk_artisan_date_of_birth CHECK (date_of_birth IS NULL OR date_of_birth < CURRENT_DATE)
);

-- =====================================================================
-- 2. LÀNG NGHỀ & NGHỀ TRUYỀN THỐNG
-- =====================================================================

CREATE TABLE craft_villages (
    craft_village_id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    craft_village_name           VARCHAR(150) NOT NULL,
    craft_village_address       VARCHAR(255),
    province_city   VARCHAR(100) NOT NULL,
    craft_village_history       TEXT,
    craft_village_introduction    TEXT,
    avatar_url     VARCHAR(500),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_craft_village_name_province UNIQUE (craft_village_name, province_city)
);

CREATE TABLE traditional_crafts (
    craft_id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    craft_name            VARCHAR(150) NOT NULL UNIQUE,
    description               TEXT,
    origin           TEXT,
    production_process TEXT,
    cultural_value     TEXT,
    avatar_url        VARCHAR(500),
    activity_status VARCHAR(20) NOT NULL DEFAULT 'hoat_dong',
    CONSTRAINT chk_craft_activity_status CHECK (activity_status IN ('hoat_dong', 'tam_ngung'))
);

-- Nghệ nhân <-> Nghề (N-N): "được giữ gìn"
CREATE TABLE artisan_crafts (
    artisan_id      BIGINT NOT NULL REFERENCES artisans (artisan_id) ON DELETE CASCADE,
    craft_id    BIGINT NOT NULL REFERENCES traditional_crafts (craft_id) ON DELETE CASCADE,
    start_year SMALLINT CHECK (start_year BETWEEN 1900 AND 2100),
    PRIMARY KEY (artisan_id, craft_id)
);

-- Nghệ nhân <-> Làng nghề (N-N): "hoạt động tại"
CREATE TABLE artisan_craft_villages (
    artisan_id  BIGINT NOT NULL REFERENCES artisans (artisan_id) ON DELETE CASCADE,
    craft_village_id  BIGINT NOT NULL REFERENCES craft_villages (craft_village_id) ON DELETE CASCADE,
    PRIMARY KEY (artisan_id, craft_village_id)
);

-- Làng nghề <-> Nghề (N-N): "có"
CREATE TABLE craft_village_crafts (
    craft_village_id   BIGINT NOT NULL REFERENCES craft_villages (craft_village_id) ON DELETE CASCADE,
    craft_id BIGINT NOT NULL REFERENCES traditional_crafts (craft_id) ON DELETE CASCADE,
    PRIMARY KEY (craft_village_id, craft_id)
);

-- =====================================================================
-- 3. SẢN PHẨM, NỘI DUNG VĂN HÓA, HOẠT ĐỘNG TRẢI NGHIỆM
-- =====================================================================
CREATE TABLE products (
    product_id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    artisan_id             BIGINT NOT NULL REFERENCES artisans (artisan_id) ON DELETE CASCADE,  -- "tạo ra"
    craft_id           BIGINT REFERENCES traditional_crafts (craft_id) ON DELETE SET NULL, -- "làm ra"
    product_name            VARCHAR(200) NOT NULL,
    product_description          TEXT,
    materials       TEXT,
    crafting_process TEXT,
    cultural_significance   TEXT,
    published_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    display_status VARCHAR(20) NOT NULL DEFAULT 'cho_duyet',
    CONSTRAINT chk_product_display_status CHECK (display_status IN
        ('nhap', 'cho_duyet', 'da_dang', 'bi_an'))
);
CREATE TABLE cultural_contents (
    content_id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    artisan_id           BIGINT NOT NULL REFERENCES artisans (artisan_id) ON DELETE CASCADE,   -- "đăng"
    craft_id         BIGINT REFERENCES traditional_crafts (craft_id) ON DELETE SET NULL, -- nghề liên quan
    title         VARCHAR(250) NOT NULL,
    content_type         VARCHAR(30)  NOT NULL DEFAULT 'cau_chuyen',
    summary         TEXT,
    content TEXT NOT NULL,
    cultural_significance TEXT,
    published_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    moderation_status VARCHAR(20) NOT NULL DEFAULT 'nhap',
    approved_by_admin_id BIGINT REFERENCES accounts (account_id) ON DELETE SET NULL,
    approved_at      TIMESTAMPTZ,
    CONSTRAINT chk_content_type CHECK (content_type IN
        ('cau_chuyen', 'kien_thuc', 'phong_tuc', 'ky_thuat', 'khac')),
    CONSTRAINT chk_content_moderation_status CHECK (moderation_status IN
        ('nhap', 'cho_duyet', 'da_dang', 'bi_an'))
);
CREATE TABLE experience_activities (
    activity_id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    artisan_id            BIGINT NOT NULL REFERENCES artisans (artisan_id) ON DELETE CASCADE,   -- nghệ nhân phụ trách
    craft_id          BIGINT REFERENCES traditional_crafts (craft_id) ON DELETE SET NULL, -- nghề liên quan
    craft_village_id            BIGINT REFERENCES craft_villages (craft_village_id) ON DELETE SET NULL,           -- làng nghề tổ chức (nếu có)
    activity_name           VARCHAR(200) NOT NULL,
    activity_description         TEXT,
    venue VARCHAR(255) NOT NULL,
    duration_minutes  SMALLINT NOT NULL CHECK (duration_minutes > 0),
    max_participants  SMALLINT NOT NULL CHECK (max_participants > 0),
    schedule_description VARCHAR(255),          -- mô tả khung giờ/ngày tổ chức (vd: "Thứ 7, 8h-11h")
    participation_requirements TEXT,
    activity_status    VARCHAR(20) NOT NULL DEFAULT 'cho_duyet',
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_activity_status CHECK (activity_status IN
        ('nhap', 'cho_duyet', 'dang_mo', 'tam_ngung', 'bi_an'))
);
-- =====================================================================
-- 4. ĐA PHƯƠNG TIỆN (gắn với đúng MỘT đối tượng)
-- =====================================================================

CREATE TABLE media_files (
    media_id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uploaded_by_account_id BIGINT NOT NULL REFERENCES accounts (account_id) ON DELETE CASCADE, -- "lưu trữ"
    media_type VARCHAR(20) NOT NULL DEFAULT 'hinh_anh',
    file_url VARCHAR(500) NOT NULL,
    caption    VARCHAR(500),
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- đối tượng được minh họa
    artisan_id  BIGINT REFERENCES artisans (artisan_id) ON DELETE CASCADE,
    product_id  BIGINT REFERENCES products (product_id) ON DELETE CASCADE,
    content_id  BIGINT REFERENCES cultural_contents (content_id) ON DELETE CASCADE,
    activity_id  BIGINT REFERENCES experience_activities (activity_id) ON DELETE CASCADE,
    CONSTRAINT chk_media_type CHECK (media_type IN ('hinh_anh', 'video', 'tai_lieu')),
    CONSTRAINT chk_media_single_target CHECK (num_nonnulls(artisan_id, product_id, content_id, activity_id) = 1)
);
-- =====================================================================
-- 5. ĐẶT LỊCH TRẢI NGHIỆM
-- =====================================================================

CREATE TABLE experience_bookings (
    booking_id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id            BIGINT NOT NULL REFERENCES accounts (account_id) ON DELETE CASCADE,            -- "đặt"
    activity_id            BIGINT NOT NULL REFERENCES experience_activities (activity_id) ON DELETE CASCADE, -- "lượt đặt"
    booked_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    experience_date DATE NOT NULL,
    start_time           TIME NOT NULL,
    end_time           TIME NOT NULL,
    participant_count SMALLINT NOT NULL CHECK (participant_count > 0),
    notes          TEXT,
    booking_status    VARCHAR(20) NOT NULL DEFAULT 'cho_xac_nhan',
    confirmed_at    TIMESTAMPTZ,
    CONSTRAINT chk_booking_time_range CHECK (end_time > start_time),
    CONSTRAINT chk_booking_status CHECK (booking_status IN
        ('cho_xac_nhan', 'da_xac_nhan', 'bi_tu_choi', 'da_huy', 'hoan_thanh'))
);
-- =====================================================================
-- 6. YÊU THÍCH & ĐÁNH GIÁ (mỗi bản ghi trỏ tới đúng MỘT đối tượng)
-- =====================================================================

CREATE TABLE favorites (
    favorite_id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id    BIGINT NOT NULL REFERENCES accounts (account_id) ON DELETE CASCADE,  -- "lưu"
    saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    artisan_id    BIGINT REFERENCES artisans (artisan_id) ON DELETE CASCADE,
    craft_id  BIGINT REFERENCES traditional_crafts (craft_id) ON DELETE CASCADE,
    product_id    BIGINT REFERENCES products (product_id) ON DELETE CASCADE,
    content_id    BIGINT REFERENCES cultural_contents (content_id) ON DELETE CASCADE,
    activity_id    BIGINT REFERENCES experience_activities (activity_id) ON DELETE CASCADE,
    CONSTRAINT chk_favorite_single_target CHECK (num_nonnulls(artisan_id, craft_id, product_id, content_id, activity_id) = 1),
    -- mỗi người chỉ yêu thích một đối tượng một lần
    CONSTRAINT uq_favorite_artisan    UNIQUE (account_id, artisan_id),
    CONSTRAINT uq_favorite_craft  UNIQUE (account_id, craft_id),
    CONSTRAINT uq_favorite_product    UNIQUE (account_id, product_id),
    CONSTRAINT uq_favorite_content    UNIQUE (account_id, content_id),
    CONSTRAINT uq_favorite_activity    UNIQUE (account_id, activity_id)
);

CREATE TABLE reviews (
    review_id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id        BIGINT NOT NULL REFERENCES accounts (account_id) ON DELETE CASCADE,  -- "viết"
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_content TEXT,
    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    moderation_status VARCHAR(20) NOT NULL DEFAULT 'cho_duyet',
    approved_by_admin_id BIGINT REFERENCES accounts (account_id) ON DELETE SET NULL,
    approved_at   TIMESTAMPTZ,
    artisan_id  BIGINT REFERENCES artisans (artisan_id) ON DELETE CASCADE,
    product_id  BIGINT REFERENCES products (product_id) ON DELETE CASCADE,
    content_id  BIGINT REFERENCES cultural_contents (content_id) ON DELETE CASCADE,
    activity_id  BIGINT REFERENCES experience_activities (activity_id) ON DELETE CASCADE,
    CONSTRAINT chk_review_single_target CHECK (num_nonnulls(artisan_id, product_id, content_id, activity_id) = 1),
    CONSTRAINT chk_review_moderation_status CHECK (moderation_status IN
        ('cho_duyet', 'da_duyet', 'bi_an', 'tu_choi')),
    CONSTRAINT uq_review_artisan UNIQUE (account_id, artisan_id),
    CONSTRAINT uq_review_product UNIQUE (account_id, product_id),
    CONSTRAINT uq_review_content UNIQUE (account_id, content_id),
    CONSTRAINT uq_review_activity UNIQUE (account_id, activity_id)
);

-- =====================================================================
-- 10. DỮ LIỆU MẪU TỐI THIỂU (để thử nghiệm)
-- =====================================================================
-- mã hóa pass bằng lệnh extension pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;
--kiểm tra đã tạo chưa
SELECT * FROM pg_extension WHERE extname = 'pgcrypto';

TRUNCATE TABLE
    reviews, favorites, experience_bookings, media_files,
    experience_activities, cultural_contents, products,
    craft_village_crafts, artisan_craft_villages, artisan_crafts,
    traditional_crafts, craft_villages, artisans, accounts
RESTART IDENTITY CASCADE;

INSERT INTO accounts (full_name, email, password_hash, phone_number, role) VALUES
	('Quản trị viên',   'admin@vanhoa.vn',   crypt('123456', gen_salt('bf')), '0900000001', 'quan_tri'),
	('Nguyễn Văn An',   'An@nghenhan.vn',     crypt('123456', gen_salt('bf')), '0900000002', 'artisans'),
	('Trần Thị Hà',   'ha@khach.vn',   crypt('123456', gen_salt('bf')), '0900000003', 'du_khach');

INSERT INTO craft_villages (craft_village_name, craft_village_address, province_city, craft_village_introduction)
VALUES ('Làng gốm Bát Tràng', 'Xã Bát Tràng, Gia Lâm', 'Hà Nội', 'Làng gốm truyền thống hơn 500 năm.');

INSERT INTO traditional_crafts (craft_name, description, origin)
VALUES ('Nghề làm gốm', 'Chế tác đồ gốm thủ công từ đất sét.', 'Hình thành từ thế kỷ 14-15.');

INSERT INTO artisans (artisan_id, address, introduction, years_of_experience, verification_status)
VALUES (2, 'Bát Tràng, Hà Nội', 'Nghệ nhân gốm 30 năm kinh nghiệm.', 30, 'da_xac_minh');

INSERT INTO artisan_crafts VALUES (2, 1, 1995);
INSERT INTO artisan_craft_villages VALUES (2, 1);
INSERT INTO craft_village_crafts VALUES (1, 1);

INSERT INTO experience_activities
 (artisan_id, craft_id, craft_village_id, activity_name, activity_description, venue, duration_minutes, max_participants, activity_status)
VALUES (2, 1, 1, 'Trải nghiệm nặn gốm', 'Tự tay nặn một sản phẩm gốm.', 'Xưởng gốm Bát Tràng', 120, 10, 'dang_mo');