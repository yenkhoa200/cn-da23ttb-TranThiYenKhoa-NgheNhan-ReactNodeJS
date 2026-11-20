CREATE DATABASE nghenhan_db;

-- =====================================================================
-- 1. TÀI KHOẢN & HỒ SƠ NGHỆ NHÂN
-- =====================================================================

CREATE TABLE tai_khoan (
    ma_tk          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ho_ten         VARCHAR(100) NOT NULL,
    email          VARCHAR(255) NOT NULL,
    mat_khau_hash  VARCHAR(255) NOT NULL,            -- lưu mã băm (bcrypt/argon2), KHÔNG lưu mật khẩu thô
    sdt            VARCHAR(15),
    anh_dai_dien   VARCHAR(500),
    vai_tro        VARCHAR(20)  NOT NULL DEFAULT 'du_khach',
    trang_thai_tk  VARCHAR(20)  NOT NULL DEFAULT 'hoat_dong',
    ngay_tao       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT ck_tk_vai_tro   CHECK (vai_tro IN ('nghe_nhan', 'du_khach', 'quan_tri')),
    CONSTRAINT ck_tk_trang_thai CHECK (trang_thai_tk IN ('hoat_dong', 'bi_khoa')),
    CONSTRAINT ck_tk_email     CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
    CONSTRAINT ck_tk_sdt       CHECK (sdt IS NULL OR sdt ~ '^[0-9+]{9,15}$')
);
CREATE UNIQUE INDEX uq_tai_khoan_email ON tai_khoan (lower(email));

-- Quan hệ 1-1 với tai_khoan: dùng chung khóa chính
CREATE TABLE nghe_nhan (
    ma_nn             BIGINT PRIMARY KEY
                      REFERENCES tai_khoan (ma_tk) ON DELETE CASCADE,
    ngay_sinh         DATE,
    dia_chi           VARCHAR(255),
    gioi_thieu        TEXT,
    so_nam_kn         SMALLINT CHECK (so_nam_kn >= 0),
    qua_trinh_lam_nghe TEXT,
    trang_thai_xac_minh VARCHAR(20) NOT NULL DEFAULT 'chua_xac_minh',
    ma_quan_tri_xac_minh BIGINT REFERENCES tai_khoan (ma_tk) ON DELETE SET NULL,
    ngay_xac_minh     TIMESTAMPTZ,
    CONSTRAINT ck_nn_xac_minh CHECK (trang_thai_xac_minh IN
        ('chua_xac_minh', 'cho_xac_minh', 'da_xac_minh', 'tu_choi')),
    CONSTRAINT ck_nn_ngay_sinh CHECK (ngay_sinh IS NULL OR ngay_sinh < CURRENT_DATE)
);

-- =====================================================================
-- 2. LÀNG NGHỀ & NGHỀ TRUYỀN THỐNG
-- =====================================================================

CREATE TABLE lang_nghe (
    ma_ln            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ten_ln           VARCHAR(150) NOT NULL,
    dia_chi_ln       VARCHAR(255),
    tinh_thanh_pho   VARCHAR(100) NOT NULL,
    lich_su_ln       TEXT,
    gioi_thieu_ln    TEXT,
    anh_dai_dien     VARCHAR(500),
    ngay_tao         TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_lang_nghe UNIQUE (ten_ln, tinh_thanh_pho)
);

CREATE TABLE nghe_truyen_thong (
    ma_nghe             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ten_nghe            VARCHAR(150) NOT NULL UNIQUE,
    mo_ta               TEXT,
    nguon_goc           TEXT,
    quy_trinh_thuc_hien TEXT,
    gia_tri_van_hoa     TEXT,
    anh_dai_dien        VARCHAR(500),
    trang_thai_hoat_dong VARCHAR(20) NOT NULL DEFAULT 'hoat_dong',
    CONSTRAINT ck_nghe_trang_thai CHECK (trang_thai_hoat_dong IN ('hoat_dong', 'tam_ngung'))
);

-- Nghệ nhân <-> Nghề (N-N): "được giữ gìn"
CREATE TABLE nghe_nhan_nghe (
    ma_nn      BIGINT NOT NULL REFERENCES nghe_nhan (ma_nn) ON DELETE CASCADE,
    ma_nghe    BIGINT NOT NULL REFERENCES nghe_truyen_thong (ma_nghe) ON DELETE CASCADE,
    nam_bat_dau SMALLINT CHECK (nam_bat_dau BETWEEN 1900 AND 2100),
    PRIMARY KEY (ma_nn, ma_nghe)
);

-- Nghệ nhân <-> Làng nghề (N-N): "hoạt động tại"
CREATE TABLE nghe_nhan_lang_nghe (
    ma_nn  BIGINT NOT NULL REFERENCES nghe_nhan (ma_nn) ON DELETE CASCADE,
    ma_ln  BIGINT NOT NULL REFERENCES lang_nghe (ma_ln) ON DELETE CASCADE,
    PRIMARY KEY (ma_nn, ma_ln)
);

-- Làng nghề <-> Nghề (N-N): "có"
CREATE TABLE lang_nghe_nghe (
    ma_ln   BIGINT NOT NULL REFERENCES lang_nghe (ma_ln) ON DELETE CASCADE,
    ma_nghe BIGINT NOT NULL REFERENCES nghe_truyen_thong (ma_nghe) ON DELETE CASCADE,
    PRIMARY KEY (ma_ln, ma_nghe)
);

-- =====================================================================
-- 3. SẢN PHẨM, NỘI DUNG VĂN HÓA, HOẠT ĐỘNG TRẢI NGHIỆM
-- =====================================================================

CREATE TABLE san_pham (
    ma_sp             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ma_nn             BIGINT NOT NULL REFERENCES nghe_nhan (ma_nn) ON DELETE CASCADE,  -- "tạo ra"
    ma_nghe           BIGINT REFERENCES nghe_truyen_thong (ma_nghe) ON DELETE SET NULL, -- "làm ra"
    ten_sp            VARCHAR(200) NOT NULL,
    mo_ta_sp          TEXT,
    nguyen_lieu       TEXT,
    quy_trinh_che_tac TEXT,
    y_nghia_van_hoa   TEXT,
    ngay_dang         TIMESTAMPTZ NOT NULL DEFAULT now(),
    trang_thai_hien_thi VARCHAR(20) NOT NULL DEFAULT 'cho_duyet',
    CONSTRAINT ck_sp_trang_thai CHECK (trang_thai_hien_thi IN
        ('nhap', 'cho_duyet', 'da_dang', 'bi_an'))
);

CREATE TABLE nd_van_hoa (
    ma_nd           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ma_nn           BIGINT NOT NULL REFERENCES nghe_nhan (ma_nn) ON DELETE CASCADE,   -- "đăng"
    ma_nghe         BIGINT REFERENCES nghe_truyen_thong (ma_nghe) ON DELETE SET NULL, -- nghề liên quan
    tieu_de         VARCHAR(250) NOT NULL,
    loai_nd         VARCHAR(30)  NOT NULL DEFAULT 'cau_chuyen',
    tom_tat         TEXT,
    noi_dung_chi_tiet TEXT NOT NULL,
    y_nghia_van_hoa TEXT,
    ngay_dang       TIMESTAMPTZ NOT NULL DEFAULT now(),
    ngay_cap_nhat   TIMESTAMPTZ NOT NULL DEFAULT now(),
    trang_thai_kiem_duyet VARCHAR(20) NOT NULL DEFAULT 'nhap',
    ma_quan_tri_duyet BIGINT REFERENCES tai_khoan (ma_tk) ON DELETE SET NULL,
    ngay_duyet      TIMESTAMPTZ,
    CONSTRAINT ck_nd_loai CHECK (loai_nd IN
        ('cau_chuyen', 'kien_thuc', 'phong_tuc', 'ky_thuat', 'khac')),
    CONSTRAINT ck_nd_trang_thai CHECK (trang_thai_kiem_duyet IN
        ('nhap', 'cho_duyet', 'da_dang', 'bi_an'))
);

CREATE TABLE hoat_dong_trai_nghiem (
    ma_hd            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ma_nn            BIGINT NOT NULL REFERENCES nghe_nhan (ma_nn) ON DELETE CASCADE,   -- nghệ nhân phụ trách
    ma_nghe          BIGINT REFERENCES nghe_truyen_thong (ma_nghe) ON DELETE SET NULL, -- nghề liên quan
    ma_ln            BIGINT REFERENCES lang_nghe (ma_ln) ON DELETE SET NULL,           -- làng nghề tổ chức (nếu có)
    ten_hd           VARCHAR(200) NOT NULL,
    mo_ta_hd         TEXT,
    dia_diem_to_chuc VARCHAR(255) NOT NULL,
    thoi_luong_phut  SMALLINT NOT NULL CHECK (thoi_luong_phut > 0),
    sl_tham_gia_max  SMALLINT NOT NULL CHECK (sl_tham_gia_max > 0),
    thoi_gian_to_chuc VARCHAR(255),          -- mô tả khung giờ/ngày tổ chức (vd: "Thứ 7, 8h-11h")
    yeu_cau_tham_gia TEXT,
    trang_thai_hd    VARCHAR(20) NOT NULL DEFAULT 'cho_duyet',
    ngay_tao         TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT ck_hd_trang_thai CHECK (trang_thai_hd IN
        ('nhap', 'cho_duyet', 'dang_mo', 'tam_ngung', 'bi_an'))
);

-- =====================================================================
-- 4. ĐA PHƯƠNG TIỆN (gắn với đúng MỘT đối tượng)
-- =====================================================================

CREATE TABLE da_phuong_tien (
    ma_pt        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ma_tk_tai_len BIGINT NOT NULL REFERENCES tai_khoan (ma_tk) ON DELETE CASCADE, -- "lưu trữ"
    loai_tu_lieu VARCHAR(20) NOT NULL DEFAULT 'hinh_anh',
    duong_dan_tep VARCHAR(500) NOT NULL,
    chu_thich    VARCHAR(500),
    ngay_tai_len TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- đối tượng được minh họa
    ma_nn  BIGINT REFERENCES nghe_nhan (ma_nn) ON DELETE CASCADE,
    ma_sp  BIGINT REFERENCES san_pham (ma_sp) ON DELETE CASCADE,
    ma_nd  BIGINT REFERENCES nd_van_hoa (ma_nd) ON DELETE CASCADE,
    ma_hd  BIGINT REFERENCES hoat_dong_trai_nghiem (ma_hd) ON DELETE CASCADE,
    CONSTRAINT ck_pt_loai CHECK (loai_tu_lieu IN ('hinh_anh', 'video', 'tai_lieu')),
    CONSTRAINT ck_pt_mot_doi_tuong CHECK (num_nonnulls(ma_nn, ma_sp, ma_nd, ma_hd) = 1)
);
/*cloudinary_public_id: mã định danh file trên Cloudinary.
cloudinary_resource_type: loại tài nguyên Cloudinary (image, video hoặc raw)*/
ALTER TABLE da_phuong_tien
ADD COLUMN cloudinary_public_id VARCHAR(255),
ADD COLUMN cloudinary_resource_type VARCHAR(20);
-- =====================================================================
-- 5. ĐẶT LỊCH TRẢI NGHIỆM
-- =====================================================================

CREATE TABLE dat_lich_trai_nghiem (
    ma_dl            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ma_tk            BIGINT NOT NULL REFERENCES tai_khoan (ma_tk) ON DELETE CASCADE,            -- "đặt"
    ma_hd            BIGINT NOT NULL REFERENCES hoat_dong_trai_nghiem (ma_hd) ON DELETE CASCADE, -- "lượt đặt"
    ngay_dl          TIMESTAMPTZ NOT NULL DEFAULT now(),
    ngay_trai_nghiem DATE NOT NULL,
    gio_bd           TIME NOT NULL,
    gio_kt           TIME NOT NULL,
    sl_nguoi_tham_gia SMALLINT NOT NULL CHECK (sl_nguoi_tham_gia > 0),
    ghi_chu          TEXT,
    trang_thai_dl    VARCHAR(20) NOT NULL DEFAULT 'cho_xac_nhan',
    ngay_xac_nhan    TIMESTAMPTZ,
    CONSTRAINT ck_dl_gio CHECK (gio_kt > gio_bd),
    CONSTRAINT ck_dl_trang_thai CHECK (trang_thai_dl IN
        ('cho_xac_nhan', 'da_xac_nhan', 'bi_tu_choi', 'da_huy', 'hoan_thanh'))
);

-- =====================================================================
-- 6. YÊU THÍCH & ĐÁNH GIÁ (mỗi bản ghi trỏ tới đúng MỘT đối tượng)
-- =====================================================================

CREATE TABLE yeu_thich (
    ma_yt    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ma_tk    BIGINT NOT NULL REFERENCES tai_khoan (ma_tk) ON DELETE CASCADE,  -- "lưu"
    ngay_luu TIMESTAMPTZ NOT NULL DEFAULT now(),
    ma_nn    BIGINT REFERENCES nghe_nhan (ma_nn) ON DELETE CASCADE,
    ma_nghe  BIGINT REFERENCES nghe_truyen_thong (ma_nghe) ON DELETE CASCADE,
    ma_sp    BIGINT REFERENCES san_pham (ma_sp) ON DELETE CASCADE,
    ma_nd    BIGINT REFERENCES nd_van_hoa (ma_nd) ON DELETE CASCADE,
    ma_hd    BIGINT REFERENCES hoat_dong_trai_nghiem (ma_hd) ON DELETE CASCADE,
    CONSTRAINT ck_yt_mot_doi_tuong CHECK (num_nonnulls(ma_nn, ma_nghe, ma_sp, ma_nd, ma_hd) = 1),
    -- mỗi người chỉ yêu thích một đối tượng một lần
    CONSTRAINT uq_yt_nn    UNIQUE (ma_tk, ma_nn),
    CONSTRAINT uq_yt_nghe  UNIQUE (ma_tk, ma_nghe),
    CONSTRAINT uq_yt_sp    UNIQUE (ma_tk, ma_sp),
    CONSTRAINT uq_yt_nd    UNIQUE (ma_tk, ma_nd),
    CONSTRAINT uq_yt_hd    UNIQUE (ma_tk, ma_hd)
);

CREATE TABLE danh_gia (
    ma_dg        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ma_tk        BIGINT NOT NULL REFERENCES tai_khoan (ma_tk) ON DELETE CASCADE,  -- "viết"
    diem_danh_gia SMALLINT NOT NULL CHECK (diem_danh_gia BETWEEN 1 AND 5),
    noi_dung_danh_gia TEXT,
    ngay_danh_gia TIMESTAMPTZ NOT NULL DEFAULT now(),
    trang_thai_kiem_duyet VARCHAR(20) NOT NULL DEFAULT 'cho_duyet',
    ma_quan_tri_duyet BIGINT REFERENCES tai_khoan (ma_tk) ON DELETE SET NULL,
    ngay_duyet   TIMESTAMPTZ,
    ma_nn  BIGINT REFERENCES nghe_nhan (ma_nn) ON DELETE CASCADE,
    ma_sp  BIGINT REFERENCES san_pham (ma_sp) ON DELETE CASCADE,
    ma_nd  BIGINT REFERENCES nd_van_hoa (ma_nd) ON DELETE CASCADE,
    ma_hd  BIGINT REFERENCES hoat_dong_trai_nghiem (ma_hd) ON DELETE CASCADE,
    CONSTRAINT ck_dg_mot_doi_tuong CHECK (num_nonnulls(ma_nn, ma_sp, ma_nd, ma_hd) = 1),
    CONSTRAINT ck_dg_trang_thai CHECK (trang_thai_kiem_duyet IN
        ('cho_duyet', 'da_duyet', 'bi_an', 'tu_choi')),
    CONSTRAINT uq_dg_nn UNIQUE (ma_tk, ma_nn),
    CONSTRAINT uq_dg_sp UNIQUE (ma_tk, ma_sp),
    CONSTRAINT uq_dg_nd UNIQUE (ma_tk, ma_nd),
    CONSTRAINT uq_dg_hd UNIQUE (ma_tk, ma_hd)
);
/*
-- =====================================================================
-- 7. INDEX (hỗ trợ tìm kiếm / khóa ngoại)
-- =====================================================================

CREATE INDEX ix_nghe_nhan_nghe_nghe   ON nghe_nhan_nghe (ma_nghe);
CREATE INDEX ix_nn_ln_ln              ON nghe_nhan_lang_nghe (ma_ln);
CREATE INDEX ix_ln_nghe_nghe          ON lang_nghe_nghe (ma_nghe);
CREATE INDEX ix_lang_nghe_tinh        ON lang_nghe (tinh_thanh_pho);

CREATE INDEX ix_sp_nn                 ON san_pham (ma_nn);
CREATE INDEX ix_sp_nghe               ON san_pham (ma_nghe);
CREATE INDEX ix_sp_tt                 ON san_pham (trang_thai_hien_thi);

CREATE INDEX ix_nd_nn                 ON nd_van_hoa (ma_nn);
CREATE INDEX ix_nd_nghe               ON nd_van_hoa (ma_nghe);
CREATE INDEX ix_nd_tt                 ON nd_van_hoa (trang_thai_kiem_duyet);

CREATE INDEX ix_hd_nn                 ON hoat_dong_trai_nghiem (ma_nn);
CREATE INDEX ix_hd_nghe               ON hoat_dong_trai_nghiem (ma_nghe);
CREATE INDEX ix_hd_ln                 ON hoat_dong_trai_nghiem (ma_ln);
CREATE INDEX ix_hd_tt                 ON hoat_dong_trai_nghiem (trang_thai_hd);

CREATE INDEX ix_pt_tk                 ON da_phuong_tien (ma_tk_tai_len);
CREATE INDEX ix_pt_nn                 ON da_phuong_tien (ma_nn) WHERE ma_nn IS NOT NULL;
CREATE INDEX ix_pt_sp                 ON da_phuong_tien (ma_sp) WHERE ma_sp IS NOT NULL;
CREATE INDEX ix_pt_nd                 ON da_phuong_tien (ma_nd) WHERE ma_nd IS NOT NULL;
CREATE INDEX ix_pt_hd                 ON da_phuong_tien (ma_hd) WHERE ma_hd IS NOT NULL;

CREATE INDEX ix_dl_tk                 ON dat_lich_trai_nghiem (ma_tk);
CREATE INDEX ix_dl_hd_ngay            ON dat_lich_trai_nghiem (ma_hd, ngay_trai_nghiem);

CREATE INDEX ix_dg_nn ON danh_gia (ma_nn) WHERE ma_nn IS NOT NULL;
CREATE INDEX ix_dg_sp ON danh_gia (ma_sp) WHERE ma_sp IS NOT NULL;
CREATE INDEX ix_dg_nd ON danh_gia (ma_nd) WHERE ma_nd IS NOT NULL;
CREATE INDEX ix_dg_hd ON danh_gia (ma_hd) WHERE ma_hd IS NOT NULL;

-- =====================================================================
-- 8. TRIGGER / HÀM NGHIỆP VỤ
-- =====================================================================

-- 8.1 Tự cập nhật ngày cập nhật nội dung văn hóa
CREATE OR REPLACE FUNCTION fn_set_ngay_cap_nhat() RETURNS trigger AS $$
BEGIN
    NEW.ngay_cap_nhat := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_nd_cap_nhat
BEFORE UPDATE ON nd_van_hoa
FOR EACH ROW EXECUTE FUNCTION fn_set_ngay_cap_nhat();

-- 8.2 Chỉ tài khoản vai trò 'nghe_nhan' mới có hồ sơ nghệ nhân,
--     chỉ tài khoản 'du_khach' mới đặt lịch, người duyệt phải là 'quan_tri'
CREATE OR REPLACE FUNCTION fn_kiem_tra_vai_tro() RETURNS trigger AS $$
DECLARE
    v_vai_tro VARCHAR(20);
BEGIN
    IF TG_TABLE_NAME = 'nghe_nhan' THEN
        SELECT vai_tro INTO v_vai_tro FROM tai_khoan WHERE ma_tk = NEW.ma_nn;
        IF v_vai_tro <> 'nghe_nhan' THEN
            RAISE EXCEPTION 'Tài khoản % không có vai trò nghệ nhân', NEW.ma_nn;
        END IF;
    ELSIF TG_TABLE_NAME = 'dat_lich_trai_nghiem' THEN
        SELECT vai_tro INTO v_vai_tro FROM tai_khoan WHERE ma_tk = NEW.ma_tk;
        IF v_vai_tro <> 'du_khach' THEN
            RAISE EXCEPTION 'Chỉ tài khoản du khách mới được đặt lịch';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_nn_vai_tro
BEFORE INSERT OR UPDATE OF ma_nn ON nghe_nhan
FOR EACH ROW EXECUTE FUNCTION fn_kiem_tra_vai_tro();

CREATE TRIGGER trg_dl_vai_tro
BEFORE INSERT ON dat_lich_trai_nghiem
FOR EACH ROW EXECUTE FUNCTION fn_kiem_tra_vai_tro();

-- 8.3 Kiểm tra đặt lịch: (a) hoạt động đang mở, (b) không vượt số người tối đa,
--     (c) du khách không bị trùng lịch với booking khác
CREATE OR REPLACE FUNCTION fn_kiem_tra_dat_lich() RETURNS trigger AS $$
DECLARE
    v_max      SMALLINT;
    v_tt_hd    VARCHAR(20);
    v_da_dat   INTEGER;
BEGIN
    -- chỉ kiểm tra với các booking còn hiệu lực
    IF NEW.trang_thai_dl NOT IN ('cho_xac_nhan', 'da_xac_nhan') THEN
        RETURN NEW;
    END IF;

    -- khóa theo hoạt động để tránh 2 người đặt cùng lúc làm vượt sức chứa
    PERFORM pg_advisory_xact_lock(NEW.ma_hd);

    SELECT sl_tham_gia_max, trang_thai_hd INTO v_max, v_tt_hd
    FROM hoat_dong_trai_nghiem WHERE ma_hd = NEW.ma_hd;

    IF TG_OP = 'INSERT' AND v_tt_hd <> 'dang_mo' THEN
        RAISE EXCEPTION 'Hoạt động hiện không nhận đặt lịch';
    END IF;

    IF NEW.sl_nguoi_tham_gia > v_max THEN
        RAISE EXCEPTION 'Số người (%) vượt quá giới hạn tối đa (%) của hoạt động',
            NEW.sl_nguoi_tham_gia, v_max;
    END IF;

    -- tổng số người đã đặt trong khung giờ giao nhau
    SELECT COALESCE(SUM(sl_nguoi_tham_gia), 0) INTO v_da_dat
    FROM dat_lich_trai_nghiem
    WHERE ma_hd = NEW.ma_hd
      AND ngay_trai_nghiem = NEW.ngay_trai_nghiem
      AND trang_thai_dl IN ('cho_xac_nhan', 'da_xac_nhan')
      AND ma_dl IS DISTINCT FROM NEW.ma_dl
      AND gio_bd < NEW.gio_kt AND gio_kt > NEW.gio_bd;

    IF v_da_dat + NEW.sl_nguoi_tham_gia > v_max THEN
        RAISE EXCEPTION 'Vượt sức chứa: đã có % người, yêu cầu thêm %, tối đa %',
            v_da_dat, NEW.sl_nguoi_tham_gia, v_max;
    END IF;

    -- du khách không được trùng lịch của chính mình
    IF EXISTS (
        SELECT 1 FROM dat_lich_trai_nghiem
        WHERE ma_tk = NEW.ma_tk
          AND ngay_trai_nghiem = NEW.ngay_trai_nghiem
          AND trang_thai_dl IN ('cho_xac_nhan', 'da_xac_nhan')
          AND ma_dl IS DISTINCT FROM NEW.ma_dl
          AND gio_bd < NEW.gio_kt AND gio_kt > NEW.gio_bd
    ) THEN
        RAISE EXCEPTION 'Bạn đã có lịch trải nghiệm khác trùng khung giờ này';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_dl_kiem_tra
BEFORE INSERT OR UPDATE ON dat_lich_trai_nghiem
FOR EACH ROW EXECUTE FUNCTION fn_kiem_tra_dat_lich();

-- =====================================================================
-- 9. VIEW HỖ TRỢ HIỂN THỊ
-- =====================================================================

-- Điểm đánh giá trung bình (chỉ tính đánh giá đã duyệt)
CREATE VIEW v_diem_trung_binh AS
SELECT 'nghe_nhan' AS loai, ma_nn AS ma_doi_tuong,
       ROUND(AVG(diem_danh_gia), 2) AS diem_tb, COUNT(*) AS so_luot
FROM danh_gia WHERE ma_nn IS NOT NULL AND trang_thai_kiem_duyet = 'da_duyet' GROUP BY ma_nn
UNION ALL
SELECT 'san_pham', ma_sp, ROUND(AVG(diem_danh_gia), 2), COUNT(*)
FROM danh_gia WHERE ma_sp IS NOT NULL AND trang_thai_kiem_duyet = 'da_duyet' GROUP BY ma_sp
UNION ALL
SELECT 'nd_van_hoa', ma_nd, ROUND(AVG(diem_danh_gia), 2), COUNT(*)
FROM danh_gia WHERE ma_nd IS NOT NULL AND trang_thai_kiem_duyet = 'da_duyet' GROUP BY ma_nd
UNION ALL
SELECT 'hoat_dong', ma_hd, ROUND(AVG(diem_danh_gia), 2), COUNT(*)
FROM danh_gia WHERE ma_hd IS NOT NULL AND trang_thai_kiem_duyet = 'da_duyet' GROUP BY ma_hd;

-- Hồ sơ nghệ nhân công khai (đã xác minh)
CREATE VIEW v_nghe_nhan_cong_khai AS
SELECT nn.ma_nn, tk.ho_ten, tk.anh_dai_dien, nn.dia_chi, nn.gioi_thieu,
       nn.so_nam_kn, nn.qua_trinh_lam_nghe,
       COALESCE(string_agg(DISTINCT ntt.ten_nghe, ', '), '') AS cac_nghe
FROM nghe_nhan nn
JOIN tai_khoan tk ON tk.ma_tk = nn.ma_nn AND tk.trang_thai_tk = 'hoat_dong'
LEFT JOIN nghe_nhan_nghe nnn ON nnn.ma_nn = nn.ma_nn
LEFT JOIN nghe_truyen_thong ntt ON ntt.ma_nghe = nnn.ma_nghe
WHERE nn.trang_thai_xac_minh = 'da_xac_minh'
GROUP BY nn.ma_nn, tk.ho_ten, tk.anh_dai_dien;

-- Số chỗ còn lại của từng hoạt động theo ngày
CREATE VIEW v_cho_con_lai AS
SELECT hd.ma_hd, hd.ten_hd, dl.ngay_trai_nghiem,
       hd.sl_tham_gia_max,
       COALESCE(SUM(dl.sl_nguoi_tham_gia), 0) AS da_dat,
       hd.sl_tham_gia_max - COALESCE(SUM(dl.sl_nguoi_tham_gia), 0) AS con_lai
FROM hoat_dong_trai_nghiem hd
LEFT JOIN dat_lich_trai_nghiem dl
       ON dl.ma_hd = hd.ma_hd AND dl.trang_thai_dl IN ('cho_xac_nhan', 'da_xac_nhan')
GROUP BY hd.ma_hd, hd.ten_hd, dl.ngay_trai_nghiem, hd.sl_tham_gia_max;
*/
-- =====================================================================
-- 10. DỮ LIỆU MẪU TỐI THIỂU (để thử nghiệm)
-- =====================================================================
-- mã hóa pass bằng lệnh extension pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;
--kiểm tra đã tạo chưa
SELECT * FROM pg_extension WHERE extname = 'pgcrypto';

INSERT INTO tai_khoan (ho_ten, email, mat_khau_hash, sdt, vai_tro) VALUES
	('Quản trị viên',   'admin@vanhoa.vn',   crypt('123456', gen_salt('bf')), '0900000001', 'quan_tri'),
	('Nguyễn Văn Thợ',   'tho@vanhoa.vn',     crypt('123456', gen_salt('bf')), '0900000002', 'nghe_nhan'),
	('Trần Thị Khách',   'khach@vanhoa.vn',   crypt('123456', gen_salt('bf')), '0900000003', 'du_khach');




BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- =====================================================================
-- 1. TÀI KHOẢN & HỒ SƠ NGHỆ NHÂN
-- =====================================================================
-- Giả định các tài khoản đầu tiên sẽ có ma_tk = 1..8 theo thứ tự chèn
INSERT INTO tai_khoan (ho_ten, email, mat_khau_hash, sdt, anh_dai_dien, vai_tro, trang_thai_tk)
VALUES
    ('Nguyễn Minh Quản', 'admin@gmail.vn', crypt('1234567', gen_salt('bf')), '0901112233', 'https://res.cloudinary.com/zr8oa4fd/image/upload/v1795170038/admin.png', 'quan_tri', 'hoat_dong'),
    ('Thạch Sang', 'thachsangnn@gmail.vn', crypt('1234567', gen_salt('bf')), '0912345678', 'https://res.cloudinary.com/zr8oa4fd/image/upload/v1795169788/nn2_chan.jpg', 'nghe_nhan', 'hoat_dong'),
    ('Ngô Thị Pho ', 'ngothipho.det@nghenhan.vn', crypt('1234567', gen_salt('bf')), '0913456789', 'https://res.cloudinary.com/zr8oa4fd/image/upload/v1794881460/nn1.jpg', 'nghe_nhan', 'hoat_dong'),
    ('Phạm Anh Đạo', 'phâmnhdao.sonmai@nghenhan.vn', crypt('1234567', gen_salt('bf')), '0914567890', 'https://res.cloudinary.com/zr8oa4fd/image/upload/v1795171463/nn4_gom.jpg', 'nghe_nhan', 'hoat_dong'),
    ('Đặng Thị Lan', 'dangthilan.nonla@nghenhan.vn', crypt('1234567', gen_salt('bf')), '0915678901', 'https://res.cloudinary.com/zr8oa4fd/image/upload/v1795172525/k1.jpg', 'du_khach', 'hoat_dong'),
    ('Hoàng Gia Huy', 'huy.hoang@dukhach.vn', crypt('1234567', gen_salt('bf')), '0987654321', 'https://res.cloudinary.com/zr8oa4fd/image/upload/v1795172681/k5.jpg', 'du_khach', 'hoat_dong'),
    ('Vũ Mai Phương', 'phuong.vu@dukhach.vn', crypt('1234567', gen_salt('bf')), '0988776655', 'https://res.cloudinary.com/zr8oa4fd/image/upload/v1794881227/samples/man-on-a-escalator.jpg', 'du_khach', 'hoat_dong'),
    ('Bùi Quốc Tuấn', 'tuan.bui@dukhach.vn', crypt('1234567', gen_salt('bf')), '0123456789', 'https://res.cloudinary.com/zr8oa4fd/image/upload/v1795172681/k4.jpg', 'du_khach', 'bi_khoa');


INSERT INTO nghe_nhan (
    ma_nn, ngay_sinh, dia_chi, gioi_thieu, so_nam_kn,
    qua_trinh_lam_nghe, trang_thai_xac_minh, ma_quan_tri_xac_minh, ngay_xac_minh
)
VALUES
    (
        2, '1965-04-12', 'Xóm 3, Bát Tràng, Gia Lâm, Hà Nội',
        'Nghệ nhân gốm thủ công chuyên dòng men rạn và men lam cổ truyền.',
        38,
        'Học nghề từ năm 12 tuổi cùng gia đình, mở xưởng gốm truyền thống và đào tạo nhiều thợ trẻ.',
        'da_xac_minh', 1, '2026-03-10 09:30:00+07'
    ),
    (
        3, '1972-09-21', 'Làng lụa Vạn Phúc, Hà Đông, Hà Nội',
        'Nghệ nhân dệt lụa tơ tằm hoa văn cổ, giữ gìn kỹ thuật dệt cửi gỗ.',
        30,
        'Gắn bó với khung cửi từ nhỏ, phục dựng nhiều mẫu hoa văn lụa truyền thống.',
        'da_xac_minh', 1, '2026-03-15 14:00:00+07'
    ),
    (
        4, '1968-11-05', 'Hạ Thái, Thường Tín, Hà Nội',
        'Nghệ nhân sơn mài truyền thống với kỹ thuật mài nước và thếp vàng bạc.',
        34,
        'Tốt nghiệp mỹ thuật ứng dụng và tiếp nối nghề sơn mài gia truyền tại Hạ Thái.',
        'da_xac_minh', 1, '2026-04-02 10:15:00+07'
    ),
    (
        5, '1980-02-18', 'Làng Chuông, Thanh Oai, Hà Nội',
        'Nghệ nhân làm nón lá truyền thống, kết hợp thêu hoa văn nhẹ nhàng.',
        20,
        'Học chằm nón từ mẹ và phát triển dòng nón lá phục vụ trải nghiệm du lịch văn hóa.',
        'cho_xac_minh', NULL, NULL
    );

-- =====================================================================
-- 2. LÀNG NGHỀ & NGHỀ TRUYỀN THỐNG
-- =====================================================================
-- ma_ln: 1..3; ma_nghe: 1..4
INSERT INTO lang_nghe (ten_ln, dia_chi_ln, tinh_thanh_pho, lich_su_ln, gioi_thieu_ln, anh_dai_dien)
VALUES
    (
        'Làng gốm Bát Tràng', 'Xã Bát Tràng, huyện Gia Lâm', 'Hà Nội',
        'Hình thành từ khoảng thế kỷ XIV–XV, nổi tiếng với gốm gia dụng, gốm thờ và gốm mỹ nghệ.',
        'Điểm đến văn hóa nổi bật với không gian làm gốm, chợ gốm và các xưởng thủ công lâu đời.',
        'https://res.cloudinary.com/zr8oa4fd/image/upload/v1795173129/lgbatrang.jpg'
    ),
    (
        'Làng lụa Vạn Phúc', 'Phường Vạn Phúc, quận Hà Đông', 'Hà Nội',
        'Có lịch sử hơn nghìn năm dệt lụa tơ tằm với nhiều hoa văn tinh xảo.',
        'Nổi tiếng với các sản phẩm lụa vân, lụa sa, gấm và phố lụa trưng bày đặc sắc.',
        'https://res.cloudinary.com/zr8oa4fd/image/upload/v1795173127/lluavanphuc.jpg'
    ),
    (
        'Làng sơn mài Hạ Thái', 'Xã Duyên Thái, huyện Thường Tín', 'Hà Nội',
        'Phát triển mạnh từ thế kỷ XVII, gắn liền với kỹ thuật sơn ta và khảm trai, thếp vàng.',
        'Nơi lưu giữ quy trình ủ sơn, mài bóng và trang trí thủ công đòi hỏi sự kiên nhẫn cao.',
        'https://res.cloudinary.com/zr8oa4fd/image/upload/v1795173128/lsonmai.jpg'
    );

INSERT INTO nghe_truyen_thong (
    ten_nghe, mo_ta, nguon_goc, quy_trinh_thuc_hien, gia_tri_van_hoa, anh_dai_dien, trang_thai_hoat_dong
)
VALUES
    (
        'Nghề làm gốm thủ công',
        'Chế tác đồ gốm từ đất sét cao lanh và đất sét dẻo qua bàn xoay hoặc khuôn.',
        'Gắn liền với vùng ven sông Hồng giàu nguồn đất sét chất lượng.',
        'Chọn đất -> nhào trộn -> tạo hình -> phơi/sấy -> tráng men -> nung lò.',
        'Phản ánh thẩm mỹ, tín ngưỡng và đời sống sinh hoạt truyền thống của người Việt.',
        'https://res.cloudinary.com/zr8oa4fd/image/upload/v1795171463/nn4_gom.jpg', 'hoat_dong'
    ),
    (
        'Nghề dệt lụa tơ tằm',
        'Dệt sợi tơ tằm tự nhiên thành vải lụa mềm mại, bóng nhẹ.',
        'Truyền thống trồng dâu nuôi tằm và dệt vải lâu đời ở đồng bằng Bắc Bộ.',
        'Ươm tơ -> mắc cửi -> dệt vải -> nhuộm màu -> hoàn thiện thành phẩm.',
        'Biểu tượng của sự tinh tế, khéo léo và bản sắc trang phục truyền thống.',
        'https://res.cloudinary.com/zr8oa4fd/image/upload/v1795173397/ndet.jpg', 'hoat_dong'
    ),
    (
        'Nghề sơn mài truyền thống',
        'Trang trí cốt gỗ hoặc tre bằng sơn ta, son, vàng quỳ, vỏ trứng và kỹ thuật mài.',
        'Phát triển từ nghề sơn thếp cổ truyền kết hợp sáng tạo tạo hình.',
        'Làm cốt -> bó hom -> sơn lót -> trang trí -> phủ bóng -> mài nước.',
        'Mang giá trị nghệ thuật tạo hình cao và tính bền bỉ theo thời gian.',
        'https://res.cloudinary.com/zr8oa4fd/image/upload/v1795173128/lsonmai.jpg', 'hoat_dong'
    ),
    (
        'Nghề làm nón lá',
        'Chằm lá cọ hoặc lá buông trên khung tre thành chiếc nón che nắng mưa.',
        'Nghề thủ công dân gian phổ biến gắn với đời sống nông nghiệp.',
        'Chuốt vành -> chọn lá -> ủi lá -> xếp lá -> chằm nón -> nức vành.',
        'Gắn bó mật thiết với hình ảnh người phụ nữ và văn hóa Việt Nam.',
        'https://res.cloudinary.com/zr8oa4fd/image/upload/v1795173397/ndannon.jpg', 'hoat_dong'
    );

INSERT INTO nghe_nhan_nghe (ma_nn, ma_nghe, nam_bat_dau)
VALUES
    (2, 1, 1977),
    (3, 2, 1986),
    (4, 3, 1984),
    (5, 4, 2005);

INSERT INTO nghe_nhan_lang_nghe (ma_nn, ma_ln)
VALUES
    (2, 1),
    (3, 2),
    (4, 3);

INSERT INTO lang_nghe_nghe (ma_ln, ma_nghe)
VALUES
    (1, 1),
    (2, 2),
    (3, 3);

-- =====================================================================
-- 3. SẢN PHẨM, NỘI DUNG VĂN HÓA, HOẠT ĐỘNG TRẢI NGHIỆM
-- =====================================================================
-- ma_sp: 1..4; ma_nd: 1..3; ma_hd: 1..3
INSERT INTO san_pham (
    ma_nn, ma_nghe, ten_sp, mo_ta_sp, nguyen_lieu,
    quy_trinh_che_tac, y_nghia_van_hoa, trang_thai_hien_thi
)
VALUES
    (
        2, 1, 'Bình gốm men rạn cổ Bát Tràng',
        'Bình dáng củ tỏi phủ lớp men rạn đặc trưng, họa tiết vẽ tay.',
        'Đất sét Bát Tràng, men tro thực vật, màu oxit truyền thống.',
        'Tạo dáng trên bàn xoay, khắc tỉa, tráng men rạn và nung ở nhiệt độ cao.',
        'Giữ gìn nét cổ kính của dòng men rạn đặc trưng vùng gốm Bát Tràng.',
        'da_dang'
    ),
    (
        3, 2, 'Khăn lụa tơ tằm hoa sen Vạn Phúc',
        'Khăn lụa dệt thủ công nhẹ mát, dệt chìm họa tiết hoa sen.',
        '100% sợi tơ tằm tự nhiên, thuốc nhuộm an toàn.',
        'Xe tơ, mắc khung dệt hoa văn, dệt thủ công và vò mềm.',
        'Tôn vinh vẻ đẹp thanh tao của hoa sen và kỹ thuật dệt lụa truyền thống.',
        'da_dang'
    ),
    (
        4, 3, 'Tranh sơn mài Phố cổ Hà Nội',
        'Tranh sơn mài khắc họa mái ngói rêu phong và nhịp sống phố cổ.',
        'Ván gỗ đã xử lý, sơn ta, vỏ trứng, vàng quỳ.',
        'Vẽ phác thảo, gắn vỏ trứng và vàng, phủ nhiều lớp sơn và mài nước thủ công.',
        'Lưu giữ ký ức đô thị cổ qua chất liệu sơn mài giàu chiều sâu.',
        'da_dang'
    ),
    (
        5, 4, 'Nón lá thêu hoa cúc Làng Chuông',
        'Nón lá thanh mảnh có điểm xuyết họa tiết hoa cúc thêu tay.',
        'Lá nón tuyển chọn, tre già làm vành, chỉ thêu.',
        'Phơi ủi lá, vào khung, chằm đều tay và thêu họa tiết.',
        'Làm mới món đồ truyền thống thân thuộc cho nhu cầu quà tặng và trải nghiệm.',
        'cho_duyet'
    );

INSERT INTO nd_van_hoa (
    ma_nn, ma_nghe, tieu_de, loai_nd, tom_tat, noi_dung_chi_tiet,
    y_nghia_van_hoa, trang_thai_kiem_duyet, ma_quan_tri_duyet, ngay_duyet
)
VALUES
    (
        2, 1, 'Vì sao men rạn Bát Tràng tạo nên những đường vân độc bản?',
        'ky_thuat',
        'Giải thích sự chênh lệch hệ số giãn nở giữa xương gốm và lớp men.',
        'Men rạn hình thành khi quá trình làm nguội tạo ra ứng suất vi mô giữa lớp men và cốt gốm. Mỗi sản phẩm có đường rạn khác nhau, tạo nên dấu ấn riêng không lặp lại.',
        'Thể hiện kinh nghiệm làm gốm đúc kết qua nhiều thế hệ.',
        'da_dang', 1, '2026-04-10 11:00:00+07'
    ),
    (
        3, 2, 'Nhịp khung cửi gỗ và ký ức làng lụa Vạn Phúc',
        'cau_chuyen',
        'Câu chuyện về những người thợ dệt giữ gìn nghề qua thăng trầm.',
        'Tiếng thoi đưa đều đặn trong những căn nhà cổ ở Vạn Phúc gợi nhớ thời kỳ nghề dệt phát triển rực rỡ và nỗ lực thích nghi của thế hệ hôm nay.',
        'Giúp người xem hiểu giá trị tinh thần đằng sau từng mét lụa.',
        'da_dang', 1, '2026-04-12 16:20:00+07'
    ),
    (
        4, 3, 'Kiên nhẫn trong từng lớp sơn và lần mài nước',
        'kien_thuc',
        'Tổng quan về thời gian chờ khô và độ tỉ mỉ của tranh sơn mài.',
        'Sơn ta cần độ ẩm phù hợp để khô đều, xen kẽ giữa nhiều lớp phủ và mài nhẹ bằng đá/than mịn để lộ chiều sâu màu sắc.',
        'Giúp người yêu nghệ thuật trân trọng công sức lao động thủ công.',
        'cho_duyet', NULL, NULL
    );

INSERT INTO hoat_dong_trai_nghiem (
    ma_nn, ma_nghe, ma_ln, ten_hd, mo_ta_hd, dia_diem_to_chuc,
    thoi_luong_phut, sl_tham_gia_max, thoi_gian_to_chuc, yeu_cau_tham_gia, trang_thai_hd
)
VALUES
    (
        2, 1, 1, 'Trải nghiệm vuốt nặn gốm cùng nghệ nhân Bát Tràng',
        'Người tham gia tự tay nhào đất, thử vuốt nặn sản phẩm gốm nhỏ và nghe giới thiệu về men gốm.',
        'Xưởng gốm truyền thống Bát Tràng, Gia Lâm, Hà Nội',
        120, 15, 'Thứ 7 và Chủ nhật, 08:30 - 10:30',
        'Không cần kinh nghiệm trước; mặc trang phục gọn gàng.', 'dang_mo'
    ),
    (
        3, 2, 2, 'Tham quan khung cửi và tìm hiểu dệt lụa Vạn Phúc',
        'Tìm hiểu quy trình từ sợi tơ đến mặt lụa hoàn chỉnh và quan sát thao tác dệt trực tiếp.',
        'Không gian dệt lụa Vạn Phúc, Hà Đông, Hà Nội',
        90, 20, 'Thứ 6 - Chủ nhật, 14:00 - 15:30',
        'Đăng ký trước ít nhất 1 ngày để chuẩn bị đón tiếp.', 'dang_mo'
    ),
    (
        4, 3, 3, 'Khám phá quy trình sơn mài tại xưởng Hạ Thái',
        'Quan sát các công đoạn làm cốt, trang trí và thử mài mẫu sơn mài dưới sự hướng dẫn của nghệ nhân.',
        'Xưởng sơn mài Hạ Thái, Thường Tín, Hà Nội',
        150, 10, 'Thứ 7 hàng tuần, 09:00 - 11:30',
        'Phù hợp cho người từ 12 tuổi trở lên.', 'dang_mo'
    );

-- =====================================================================
-- 4. ĐA PHƯƠNG TIỆN (mỗi bản ghi gắn với đúng 1 đối tượng: ma_nn, ma_sp, ma_nd, ma_hd)
-- =====================================================================
INSERT INTO da_phuong_tien (
    ma_tk_tai_len, loai_tu_lieu, duong_dan_tep, chu_thich,
    ma_nn, ma_sp, ma_nd, ma_hd
)
VALUES
    (2, 'hinh_anh', 'https://res.cloudinary.com/zr8oa4fd/image/upload/v1794881460/nn1.jpg', 'Nghệ nhân Trần Văn Bát tại xưởng gốm', 2, NULL, NULL, NULL),
    (2, 'hinh_anh', 'https://res.cloudinary.com/zr8oa4fd/image/upload/v1795174156/a1.jpg', 'Bình gốm men rạn cổ hoàn thiện', NULL, 1, NULL, NULL),
    (3, 'hinh_anh', 'https://res.cloudinary.com/zr8oa4fd/image/upload/v1795173127/lluavanphuc.jpg', 'Khăn lụa tơ tằm hoa sen Vạn Phúc', NULL, 2, NULL, NULL),
    (2, 'video', 'https://res.cloudinary.com/zr8oa4fd/video/upload/v1795174051/vdchieu.mp4', 'Video giới thiệu kỹ thuật dệt chiếu', NULL, NULL, 1, NULL),
    (2, 'hinh_anh', 'https://res.cloudinary.com/zr8oa4fd/image/upload/v1795174156/a1.jpg', 'Khách tham gia trải nghiệm dệt chiếu', NULL, NULL, NULL, 1);

-- =====================================================================
-- 5. ĐẶT LỊCH TRẢI NGHIỆM
-- =====================================================================
INSERT INTO dat_lich_trai_nghiem (
    ma_tk, ma_hd, ngay_trai_nghiem, gio_bd, gio_kt,
    sl_nguoi_tham_gia, ghi_chu, trang_thai_dl, ngay_xac_nhan
)
VALUES
    (
        6, 1, '2026-11-28', '08:30:00', '10:30:00',
        2, 'Đi cùng bạn, muốn thử làm cốc gốm nhỏ.', 'da_xac_nhan', '2026-11-20 10:00:00+07'
    ),
    (
        7, 2, '2026-11-29', '14:00:00', '15:30:00',
        3, 'Nhóm bạn yêu thích văn hóa truyền thống.', 'cho_xac_nhan', NULL
    ),
    (
        6, 3, '2026-12-05', '09:00:00', '11:30:00',
        1, 'Quan tâm kỹ thuật sơn mài.', 'cho_xac_nhan', NULL
    );

-- =====================================================================
-- 6. YÊU THÍCH & ĐÁNH GIÁ (mỗi bản ghi trỏ tới đúng 1 đối tượng)
-- =====================================================================
INSERT INTO yeu_thich (ma_tk, ma_nn, ma_nghe, ma_sp, ma_nd, ma_hd)
VALUES
    (6, 2, NULL, NULL, NULL, NULL),
    (6, NULL, NULL, 1, NULL, NULL),
    (6, NULL, NULL, NULL, NULL, 1),
    (7, NULL, 2, NULL, NULL, NULL),
    (7, NULL, NULL, NULL, 2, NULL);

INSERT INTO danh_gia (
    ma_tk, diem_danh_gia, noi_dung_danh_gia, trang_thai_kiem_duyet,
    ma_quan_tri_duyet, ngay_duyet, ma_nn, ma_sp, ma_nd, ma_hd
)
VALUES
    (
        6, 5, 'Nghệ nhân hướng dẫn rất tận tình, không gian xưởng ấm cúng.',
        'da_duyet', 1, '2026-11-18 15:30:00+07', 2, NULL, NULL, NULL
    ),
    (
        6, 5, 'Men gốm đẹp và sắc nét, đóng gói cẩn thận.',
        'da_duyet', 1, '2026-11-19 09:15:00+07', NULL, 1, NULL, NULL
    ),
    (
        7, 4, 'Bài viết dễ hiểu, giúp mình hình dung rõ quy trình dệt lụa.',
        'cho_duyet', NULL, NULL, NULL, NULL, 2, NULL
    );

COMMIT;



-- Xóa dữ liệu và cascade sang các bảng phụ thuộc (cẩn thận vì xóa dây chuyền rất rộng)
TRUNCATE TABLE hoat_dong_trai_nghiem RESTART IDENTITY CASCADE;


SELECT * FROM tai_khoan ORDER BY 1;
SELECT * FROM nghe_nhan ORDER BY 1;
SELECT * FROM lang_nghe ORDER BY 1;
SELECT * FROM nghe_truyen_thong ORDER BY 1;
SELECT * FROM nghe_nhan_nghe ORDER BY 1;
SELECT * FROM nghe_nhan_lang_nghe ORDER BY 1;
SELECT * FROM lang_nghe_nghe ORDER BY 1;
SELECT * FROM san_pham ORDER BY 1;
SELECT * FROM nd_van_hoa ORDER BY 1;
SELECT * FROM hoat_dong_trai_nghiem ORDER BY 1;
SELECT * FROM da_phuong_tien ORDER BY 1;
SELECT * FROM dat_lich_trai_nghiem ORDER BY 1;
SELECT * FROM yeu_thich ORDER BY 1;
SELECT * FROM danh_gia ORDER BY 1;

