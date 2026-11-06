
-- ============================================
-- 1. TAO CO SO DU LIEU
-- ============================================

CREATE DATABASE vanhoa_db;

-- Sau khi tao database, ket noi vao vanhoa_db
-- roi chay cac lenh CREATE TABLE ben duoi.


-- ============================================
-- 2. BANG TAI KHOAN
-- ============================================

CREATE TABLE tai_khoan (
    ma_tai_khoan INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ho_ten VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mat_khau VARCHAR(255) NOT NULL,
    so_dien_thoai VARCHAR(20),
    vai_tro VARCHAR(20) NOT NULL
        CHECK (vai_tro IN ('ADMIN', 'NGHE_NHAN', 'DU_KHACH')),
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'HOAT_DONG'
        CHECK (trang_thai IN ('HOAT_DONG', 'BI_KHOA', 'CHO_XAC_MINH')),
    ngay_tao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- 3. BANG LANG NGHE
-- ============================================

CREATE TABLE lang_nghe (
    ma_lang_nghe INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ten_lang_nghe VARCHAR(200) NOT NULL,
    dia_chi TEXT,
    tinh_thanh_pho VARCHAR(100),
    mo_ta TEXT,
    lich_su_hinh_thanh TEXT,
    hinh_anh_dai_dien TEXT,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- 4. BANG HO SO NGHE NHAN
-- ============================================

CREATE TABLE ho_so_nghe_nhan (
    ma_ho_so INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ma_tai_khoan INTEGER NOT NULL UNIQUE,
    ma_lang_nghe INTEGER,
    nghe_danh VARCHAR(150),
    ngay_sinh DATE,
    gioi_tinh VARCHAR(20)
        CHECK (gioi_tinh IN ('NAM', 'NU', 'KHAC')),
    anh_dai_dien TEXT,
    tieu_su TEXT,
    so_nam_lam_nghe INTEGER DEFAULT 0
        CHECK (so_nam_lam_nghe >= 0),
    kinh_nghiem_va_thanh_tuu TEXT,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ma_tai_khoan)
        REFERENCES tai_khoan(ma_tai_khoan)
        ON DELETE CASCADE,

    FOREIGN KEY (ma_lang_nghe)
        REFERENCES lang_nghe(ma_lang_nghe)
        ON DELETE SET NULL
);


-- ============================================
-- 5. BANG NGHE TRUYEN THONG
-- ============================================

CREATE TABLE nghe_truyen_thong (
    ma_nghe INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ten_nghe VARCHAR(200) NOT NULL,
    nguon_goc TEXT,
    lich_su_hinh_thanh TEXT,
    mo_ta_nghe TEXT,
    quy_trinh_thuc_hien TEXT,
    gia_tri_van_hoa TEXT,
    nguyen_lieu_va_cong_cu TEXT,
    trang_thai_hien_thi VARCHAR(20) DEFAULT 'HIEN_THI'
        CHECK (trang_thai_hien_thi IN ('HIEN_THI', 'AN')),
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- 6. BANG LIEN KET NGHE NHAN - NGHE TRUYEN THONG
-- QUAN HE N-N
-- ============================================

CREATE TABLE nghe_nhan_nghe (
    ma_ho_so INTEGER NOT NULL,
    ma_nghe INTEGER NOT NULL,
    vai_tro_trong_nghe VARCHAR(100),
    
    PRIMARY KEY (ma_ho_so, ma_nghe),

    FOREIGN KEY (ma_ho_so)
        REFERENCES ho_so_nghe_nhan(ma_ho_so)
        ON DELETE CASCADE,

    FOREIGN KEY (ma_nghe)
        REFERENCES nghe_truyen_thong(ma_nghe)
        ON DELETE CASCADE
);


-- ============================================
-- 7. BANG SAN PHAM THU CONG
-- ============================================

CREATE TABLE san_pham (
    ma_san_pham INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ma_ho_so INTEGER NOT NULL,
    ma_nghe INTEGER,
    ten_san_pham VARCHAR(200) NOT NULL,
    mo_ta_san_pham TEXT,
    chat_lieu TEXT,
    quy_trinh_che_tac TEXT,
    y_nghia_van_hoa TEXT,
    ngay_dang TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    trang_thai_hien_thi VARCHAR(20) DEFAULT 'HIEN_THI'
        CHECK (trang_thai_hien_thi IN ('HIEN_THI', 'AN')),

    FOREIGN KEY (ma_ho_so)
        REFERENCES ho_so_nghe_nhan(ma_ho_so)
        ON DELETE CASCADE,

    FOREIGN KEY (ma_nghe)
        REFERENCES nghe_truyen_thong(ma_nghe)
        ON DELETE SET NULL
);


-- ============================================
-- 8. BANG NOI DUNG VAN HOA
-- ============================================

CREATE TABLE noi_dung_van_hoa (
    ma_noi_dung INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ma_ho_so INTEGER,
    ma_nghe INTEGER,
    ma_lang_nghe INTEGER,
    tieu_de VARCHAR(250) NOT NULL,
    loai_noi_dung VARCHAR(100),
    tom_tat TEXT,
    noi_dung_chi_tiet TEXT NOT NULL,
    nguon_goc_cau_chuyen TEXT,
    gia_tri_van_hoa TEXT,
    ngay_dang TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    trang_thai_hien_thi VARCHAR(20) DEFAULT 'HIEN_THI'
        CHECK (trang_thai_hien_thi IN ('HIEN_THI', 'AN')),

    FOREIGN KEY (ma_ho_so)
        REFERENCES ho_so_nghe_nhan(ma_ho_so)
        ON DELETE SET NULL,

    FOREIGN KEY (ma_nghe)
        REFERENCES nghe_truyen_thong(ma_nghe)
        ON DELETE SET NULL,

    FOREIGN KEY (ma_lang_nghe)
        REFERENCES lang_nghe(ma_lang_nghe)
        ON DELETE SET NULL
);


-- ============================================
-- 9. BANG HOAT DONG TRAI NGHIEM
-- ============================================

CREATE TABLE hoat_dong_trai_nghiem (
    ma_hoat_dong INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ma_ho_so INTEGER NOT NULL,
    ma_lang_nghe INTEGER,
    ten_hoat_dong VARCHAR(200) NOT NULL,
    mo_ta_hoat_dong TEXT,
    noi_dung_trai_nghiem TEXT,
    dia_diem_to_chuc TEXT,
    thoi_luong VARCHAR(100),
    so_luong_khach_toi_da INTEGER
        CHECK (so_luong_khach_toi_da > 0),
    yeu_cau_tham_gia TEXT,
    ngay_dang TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    trang_thai_hoat_dong VARCHAR(20) DEFAULT 'CHO_DUYET'
        CHECK (trang_thai_hoat_dong IN (
            'CHO_DUYET', 'DANG_HOAT_DONG', 'TAM_DUNG', 'DA_KET_THUC'
        )),

    FOREIGN KEY (ma_ho_so)
        REFERENCES ho_so_nghe_nhan(ma_ho_so)
        ON DELETE CASCADE,

    FOREIGN KEY (ma_lang_nghe)
        REFERENCES lang_nghe(ma_lang_nghe)
        ON DELETE SET NULL
);


-- ============================================
-- 10. BANG DAT LICH TRAI NGHIEM
-- ============================================


CREATE TABLE dat_lich_trai_nghiem (
    ma_dat_lich INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ma_tai_khoan INTEGER NOT NULL,
    ma_hoat_dong INTEGER NOT NULL,
    ngay_gui_yeu_cau TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_trai_nghiem DATE NOT NULL,
    gio_trai_nghiem TIME NOT NULL,
    so_luong_nguoi_tham_gia INTEGER NOT NULL
        CHECK (so_luong_nguoi_tham_gia > 0),
    loi_nhan TEXT,
    trang_thai_dat_lich VARCHAR(20) DEFAULT 'DA_DAT'
        CHECK (trang_thai_dat_lich IN (
            'DA_DAT',
            'QUA_SO_LUONG',
            'DA_HUY'
        )),

    FOREIGN KEY (ma_tai_khoan)
        REFERENCES tai_khoan(ma_tai_khoan),

    FOREIGN KEY (ma_hoat_dong)
        REFERENCES hoat_dong_trai_nghiem(ma_hoat_dong)
);



-- ============================================
-- 11. BANG YEU THICH
-- Mot tai khoan co the yeu thich nhieu doi tuong
-- Moi dong chi yeu thich mot doi tuong
-- ============================================

CREATE TABLE yeu_thich (
    ma_yeu_thich INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ma_tai_khoan INTEGER NOT NULL,
    ma_ho_so INTEGER,
    ma_san_pham INTEGER,
    ma_noi_dung INTEGER,
    ma_hoat_dong INTEGER,
    ngay_them TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Moi yeu thich chi thuoc mot loai doi tuong
    CHECK (
        num_nonnulls(
            ma_ho_so,
            ma_san_pham,
            ma_noi_dung,
            ma_hoat_dong
        ) = 1
    ),

    FOREIGN KEY (ma_tai_khoan)
        REFERENCES tai_khoan(ma_tai_khoan)
        ON DELETE CASCADE,

    FOREIGN KEY (ma_ho_so)
        REFERENCES ho_so_nghe_nhan(ma_ho_so)
        ON DELETE CASCADE,

    FOREIGN KEY (ma_san_pham)
        REFERENCES san_pham(ma_san_pham)
        ON DELETE CASCADE,

    FOREIGN KEY (ma_noi_dung)
        REFERENCES noi_dung_van_hoa(ma_noi_dung)
        ON DELETE CASCADE,

    FOREIGN KEY (ma_hoat_dong)
        REFERENCES hoat_dong_trai_nghiem(ma_hoat_dong)
        ON DELETE CASCADE
);

-- Khong cho phep yeu thich trung lap
/*
CREATE UNIQUE INDEX uq_yeu_thich_nghe_nhan
ON yeu_thich(ma_tai_khoan, ma_ho_so)
WHERE ma_ho_so IS NOT NULL;

CREATE UNIQUE INDEX uq_yeu_thich_san_pham
ON yeu_thich(ma_tai_khoan, ma_san_pham)
WHERE ma_san_pham IS NOT NULL;

CREATE UNIQUE INDEX uq_yeu_thich_noi_dung
ON yeu_thich(ma_tai_khoan, ma_noi_dung)
WHERE ma_noi_dung IS NOT NULL;

CREATE UNIQUE INDEX uq_yeu_thich_hoat_dong
ON yeu_thich(ma_tai_khoan, ma_hoat_dong)
WHERE ma_hoat_dong IS NOT NULL;
*/

-- ============================================
-- 12. BANG DANH GIA VA NHAN XET
-- ============================================

CREATE TABLE danh_gia (
    ma_danh_gia INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ma_tai_khoan INTEGER NOT NULL,
    ma_ho_so INTEGER,
    ma_san_pham INTEGER,
    ma_noi_dung INTEGER,
    ma_hoat_dong INTEGER,
    diem_danh_gia INTEGER NOT NULL
        CHECK (diem_danh_gia BETWEEN 1 AND 5),
    noi_dung_nhan_xet TEXT,
    ngay_danh_gia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP,
    trang_thai_hien_thi VARCHAR(20) DEFAULT 'HIEN_THI'
        CHECK (trang_thai_hien_thi IN ('HIEN_THI', 'AN')),

    CHECK (
        num_nonnulls(
            ma_ho_so,
            ma_san_pham,
            ma_noi_dung,
            ma_hoat_dong
        ) = 1
    ),

    FOREIGN KEY (ma_tai_khoan)
        REFERENCES tai_khoan(ma_tai_khoan)
        ON DELETE CASCADE,

    FOREIGN KEY (ma_ho_so)
        REFERENCES ho_so_nghe_nhan(ma_ho_so)
        ON DELETE CASCADE,

    FOREIGN KEY (ma_san_pham)
        REFERENCES san_pham(ma_san_pham)
        ON DELETE CASCADE,

    FOREIGN KEY (ma_noi_dung)
        REFERENCES noi_dung_van_hoa(ma_noi_dung)
        ON DELETE CASCADE,

    FOREIGN KEY (ma_hoat_dong)
        REFERENCES hoat_dong_trai_nghiem(ma_hoat_dong)
        ON DELETE CASCADE
);


-- ============================================
-- 13. BANG HINH ANH VA VIDEO
-- ============================================

CREATE TABLE hinh_anh_video (
    ma_tu_lieu INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ma_tai_khoan INTEGER,
    ten_tu_lieu VARCHAR(200) NOT NULL,
    loai_tu_lieu VARCHAR(20) NOT NULL
        CHECK (loai_tu_lieu IN ('HINH_ANH', 'VIDEO')),
    duong_dan_luu_tru TEXT NOT NULL,
    mo_ta_tu_lieu TEXT,
    ngay_tai_len TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ma_tai_khoan)
        REFERENCES tai_khoan(ma_tai_khoan)
        ON DELETE SET NULL
);


-- ============================================
-- 14. CAC BANG LIEN KET TU LIEU
-- Cho phep mot doi tuong co nhieu anh/video
-- ============================================

CREATE TABLE tu_lieu_nghe_nhan (
    ma_tu_lieu INTEGER REFERENCES hinh_anh_video(ma_tu_lieu)
        ON DELETE CASCADE,
    ma_ho_so INTEGER REFERENCES ho_so_nghe_nhan(ma_ho_so)
        ON DELETE CASCADE,
    PRIMARY KEY (ma_tu_lieu, ma_ho_so)
);

CREATE TABLE tu_lieu_lang_nghe (
    ma_tu_lieu INTEGER REFERENCES hinh_anh_video(ma_tu_lieu)
        ON DELETE CASCADE,
    ma_lang_nghe INTEGER REFERENCES lang_nghe(ma_lang_nghe)
        ON DELETE CASCADE,
    PRIMARY KEY (ma_tu_lieu, ma_lang_nghe)
);

CREATE TABLE tu_lieu_nghe_truyen_thong (
    ma_tu_lieu INTEGER REFERENCES hinh_anh_video(ma_tu_lieu)
        ON DELETE CASCADE,
    ma_nghe INTEGER REFERENCES nghe_truyen_thong(ma_nghe)
        ON DELETE CASCADE,
    PRIMARY KEY (ma_tu_lieu, ma_nghe)
);

CREATE TABLE tu_lieu_san_pham (
    ma_tu_lieu INTEGER REFERENCES hinh_anh_video(ma_tu_lieu)
        ON DELETE CASCADE,
    ma_san_pham INTEGER REFERENCES san_pham(ma_san_pham)
        ON DELETE CASCADE,
    PRIMARY KEY (ma_tu_lieu, ma_san_pham)
);

CREATE TABLE tu_lieu_noi_dung (
    ma_tu_lieu INTEGER REFERENCES hinh_anh_video(ma_tu_lieu)
        ON DELETE CASCADE,
    ma_noi_dung INTEGER REFERENCES noi_dung_van_hoa(ma_noi_dung)
        ON DELETE CASCADE,
    PRIMARY KEY (ma_tu_lieu, ma_noi_dung)
);

CREATE TABLE tu_lieu_hoat_dong (
    ma_tu_lieu INTEGER REFERENCES hinh_anh_video(ma_tu_lieu)
        ON DELETE CASCADE,
    ma_hoat_dong INTEGER REFERENCES hoat_dong_trai_nghiem(ma_hoat_dong)
        ON DELETE CASCADE,
    PRIMARY KEY (ma_tu_lieu, ma_hoat_dong)
);


/*
-- Tim kiem tai khoan
CREATE INDEX idx_tai_khoan_vai_tro
ON tai_khoan(vai_tro);

CREATE INDEX idx_tai_khoan_trang_thai
ON tai_khoan(trang_thai);

-- Tim kiem nghe nhan theo lang nghe
CREATE INDEX idx_ho_so_lang_nghe
ON ho_so_nghe_nhan(ma_lang_nghe);

-- Tim kiem san pham theo nghe nhan
CREATE INDEX idx_san_pham_nghe_nhan
ON san_pham(ma_ho_so);

-- Tim kiem noi dung van hoa
CREATE INDEX idx_noi_dung_loai
ON noi_dung_van_hoa(loai_noi_dung);

-- Tim kiem hoat dong
CREATE INDEX idx_hoat_dong_nghe_nhan
ON hoat_dong_trai_nghiem(ma_ho_so);

-- Tim kiem dat lich
CREATE INDEX idx_dat_lich_tai_khoan
ON dat_lich_trai_nghiem(ma_tai_khoan);

CREATE INDEX idx_dat_lich_hoat_dong
ON dat_lich_trai_nghiem(ma_hoat_dong);

CREATE INDEX idx_dat_lich_trang_thai
ON dat_lich_trai_nghiem(trang_thai_dat_lich);

-- Tim kiem danh gia
CREATE INDEX idx_danh_gia_tai_khoan
ON danh_gia(ma_tai_khoan);

CREATE INDEX idx_danh_gia_trang_thai
ON danh_gia(trang_thai_hien_thi);
*/
