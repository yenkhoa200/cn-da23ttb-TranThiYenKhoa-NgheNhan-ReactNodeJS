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

-- =====================================================================
-- 10. DỮ LIỆU MẪU TỐI THIỂU (để thử nghiệm)
-- =====================================================================

INSERT INTO tai_khoan (ho_ten, email, mat_khau_hash, sdt, vai_tro) VALUES
 ('Quản trị viên',   'admin@vanhoa.vn',  'HASH_DEMO', '0900000001', 'quan_tri'),
 ('Nguyễn Văn Thợ',  'tho@vanhoa.vn',    'HASH_DEMO', '0900000002', 'nghe_nhan'),
 ('Trần Thị Khách',  'khach@vanhoa.vn',  'HASH_DEMO', '0900000003', 'du_khach');

INSERT INTO lang_nghe (ten_ln, dia_chi_ln, tinh_thanh_pho, gioi_thieu_ln)
VALUES ('Làng gốm Bát Tràng', 'Xã Bát Tràng, Gia Lâm', 'Hà Nội', 'Làng gốm truyền thống hơn 500 năm.');

INSERT INTO nghe_truyen_thong (ten_nghe, mo_ta, nguon_goc)
VALUES ('Nghề làm gốm', 'Chế tác đồ gốm thủ công từ đất sét.', 'Hình thành từ thế kỷ 14-15.');

INSERT INTO nghe_nhan (ma_nn, dia_chi, gioi_thieu, so_nam_kn, trang_thai_xac_minh)
VALUES (2, 'Bát Tràng, Hà Nội', 'Nghệ nhân gốm 30 năm kinh nghiệm.', 30, 'da_xac_minh');

INSERT INTO nghe_nhan_nghe VALUES (2, 1, 1995);
INSERT INTO nghe_nhan_lang_nghe VALUES (2, 1);
INSERT INTO lang_nghe_nghe VALUES (1, 1);

INSERT INTO hoat_dong_trai_nghiem
 (ma_nn, ma_nghe, ma_ln, ten_hd, mo_ta_hd, dia_diem_to_chuc, thoi_luong_phut, sl_tham_gia_max, trang_thai_hd)
VALUES (2, 1, 1, 'Trải nghiệm nặn gốm', 'Tự tay nặn một sản phẩm gốm.', 'Xưởng gốm Bát Tràng', 120, 10, 'dang_mo');

INSERT INTO dat_lich_trai_nghiem (ma_tk, ma_hd, ngay_trai_nghiem, gio_bd, gio_kt, sl_nguoi_tham_gia)
VALUES (3, 1, CURRENT_DATE + 7, '09:00', '11:00', 3);