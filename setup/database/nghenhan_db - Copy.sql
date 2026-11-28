CREATE DATABASE nghenhan_db;
CREATE TABLE tai_khoan (
    ma_tk BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ho_ten VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mat_khau_hash VARCHAR(255) NOT NULL,
    sdt VARCHAR(15),
    anh_dai_dien VARCHAR(500),
    anh_dai_dien_public_id VARCHAR(255),
    anh_dai_dien_resource_type VARCHAR(20),
    vai_tro VARCHAR(20) NOT NULL DEFAULT 'du_khach',
    trang_thai_tk VARCHAR(20) NOT NULL DEFAULT 'hoat_dong',
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT ck_tk_vai_tro
        CHECK (vai_tro IN ('nghe_nhan', 'du_khach', 'quan_tri')),
    CONSTRAINT ck_tk_trang_thai
        CHECK (trang_thai_tk IN ('hoat_dong', 'bi_khoa')),
    CONSTRAINT ck_tk_email
        CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
    CONSTRAINT ck_tk_sdt
        CHECK (sdt IS NULL OR sdt ~ '^[0-9+]{9,15}$'),
    CONSTRAINT ck_tk_resource_type
        CHECK (
            anh_dai_dien_resource_type IS NULL
            OR anh_dai_dien_resource_type IN ('image', 'video', 'raw')
        )
);
CREATE UNIQUE INDEX uq_tai_khoan_email
ON tai_khoan (LOWER(email));
CREATE TABLE nghe_nhan (
    ma_nn BIGINT PRIMARY KEY REFERENCES tai_khoan(ma_tk) ON DELETE CASCADE,
    ngay_sinh DATE,
    gioi_tinh VARCHAR(10),
    dia_chi VARCHAR(255),
    gioi_thieu TEXT,
    so_nam_kn SMALLINT CHECK (so_nam_kn >= 0),
    qua_trinh_lam_nghe TEXT,
    lang_nghe_mo_ta TEXT,
    hoat_dong_trai_nghiem_mo_ta TEXT,
    trang_thai_xac_minh VARCHAR(20)
        NOT NULL DEFAULT 'chua_xac_minh',
    ma_quan_tri_xac_minh BIGINT
        REFERENCES tai_khoan(ma_tk) ON DELETE SET NULL,
    ngay_xac_minh TIMESTAMPTZ,
    CONSTRAINT ck_nn_gioi_tinh
        CHECK (gioi_tinh IS NULL OR gioi_tinh IN ('Nam', 'Nữ', 'Khác')),
    CONSTRAINT ck_nn_ngay_sinh
        CHECK (ngay_sinh IS NULL OR ngay_sinh < CURRENT_DATE),
    CONSTRAINT ck_nn_xac_minh
        CHECK (trang_thai_xac_minh IN (
            'chua_xac_minh',
            'cho_xac_minh',
            'da_xac_minh',
            'tu_choi'
        ))
);
CREATE TABLE lang_nghe (
    ma_ln BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ten_ln VARCHAR(150) NOT NULL,
    dia_chi_ln VARCHAR(255),
    tinh_thanh_pho VARCHAR(100) NOT NULL,
    lich_su_ln TEXT,
    gioi_thieu_ln TEXT,
    anh_dai_dien VARCHAR(500),
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT uq_lang_nghe
        UNIQUE (ten_ln, tinh_thanh_pho)
);
CREATE TABLE nghe_truyen_thong (
    ma_nghe BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ten_nghe VARCHAR(150) NOT NULL UNIQUE,
    mo_ta TEXT,
    nguon_goc TEXT,
    quy_trinh_thuc_hien TEXT,
    gia_tri_van_hoa TEXT,
    anh_dai_dien VARCHAR(500),

    trang_thai_hoat_dong VARCHAR(20)
        NOT NULL DEFAULT 'hoat_dong',

    CONSTRAINT ck_nghe_trang_thai
        CHECK (trang_thai_hoat_dong IN ('hoat_dong', 'tam_ngung'))
);
CREATE TABLE nghe_nhan_nghe (
    ma_nn BIGINT NOT NULL
        REFERENCES nghe_nhan(ma_nn) ON DELETE CASCADE,

    ma_nghe BIGINT NOT NULL
        REFERENCES nghe_truyen_thong(ma_nghe) ON DELETE CASCADE,

    nam_bat_dau SMALLINT
        CHECK (nam_bat_dau BETWEEN 1900 AND 2100),

    PRIMARY KEY (ma_nn, ma_nghe)
);
CREATE TABLE nghe_nhan_lang_nghe (
    ma_nn BIGINT NOT NULL
        REFERENCES nghe_nhan(ma_nn) ON DELETE CASCADE,

    ma_ln BIGINT NOT NULL
        REFERENCES lang_nghe(ma_ln) ON DELETE CASCADE,

    PRIMARY KEY (ma_nn, ma_ln)
);
CREATE TABLE lang_nghe_nghe (
    ma_ln BIGINT NOT NULL
        REFERENCES lang_nghe(ma_ln) ON DELETE CASCADE,

    ma_nghe BIGINT NOT NULL
        REFERENCES nghe_truyen_thong(ma_nghe) ON DELETE CASCADE,

    PRIMARY KEY (ma_ln, ma_nghe)
);
CREATE TABLE san_pham (
    ma_sp BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    ma_nn BIGINT NOT NULL
        REFERENCES nghe_nhan(ma_nn) ON DELETE CASCADE,

    ma_nghe BIGINT
        REFERENCES nghe_truyen_thong(ma_nghe) ON DELETE SET NULL,

    ten_sp VARCHAR(200) NOT NULL,
    danh_muc VARCHAR(100) NOT NULL DEFAULT 'Khác',
    mo_ta_sp TEXT,
    nguyen_lieu TEXT,
    quy_trinh_che_tac TEXT,
    y_nghia_van_hoa TEXT,
    gia_tham_khao NUMERIC(14,2),

    ngay_dang TIMESTAMPTZ NOT NULL DEFAULT now(),

    trang_thai_hien_thi VARCHAR(20)
        NOT NULL DEFAULT 'cho_duyet',

    CONSTRAINT ck_sp_gia
        CHECK (gia_tham_khao IS NULL OR gia_tham_khao >= 0),

    CONSTRAINT ck_sp_trang_thai
        CHECK (trang_thai_hien_thi IN (
            'nhap',
            'cho_duyet',
            'da_dang',
            'bi_an'
        ))
);
CREATE TABLE nd_van_hoa (
    ma_nd BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    ma_nn BIGINT NOT NULL
        REFERENCES nghe_nhan(ma_nn) ON DELETE CASCADE,

    ma_nghe BIGINT
        REFERENCES nghe_truyen_thong(ma_nghe) ON DELETE SET NULL,

    tieu_de VARCHAR(250) NOT NULL,

    loai_nd VARCHAR(30) NOT NULL DEFAULT 'cau_chuyen',

    tom_tat TEXT,
    noi_dung_chi_tiet TEXT NOT NULL,
    y_nghia_van_hoa TEXT,

    ngay_dang TIMESTAMPTZ NOT NULL DEFAULT now(),
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT now(),

    trang_thai_kiem_duyet VARCHAR(20)
        NOT NULL DEFAULT 'da_dang',

    ma_quan_tri_duyet BIGINT
        REFERENCES tai_khoan(ma_tk) ON DELETE SET NULL,

    ngay_duyet TIMESTAMPTZ,

    CONSTRAINT ck_nd_loai
        CHECK (loai_nd IN (
            'cau_chuyen',
            'kien_thuc',
            'phong_tuc',
            'ky_thuat',
            'khac'
        )),
    CONSTRAINT ck_nd_trang_thai
        CHECK (trang_thai_kiem_duyet IN (
            'nhap',
            'cho_duyet',
            'da_dang',
            'bi_an'
        ))
);
CREATE TABLE hoat_dong_trai_nghiem (
    ma_hd BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    ma_nn BIGINT NOT NULL
        REFERENCES nghe_nhan(ma_nn) ON DELETE CASCADE,

    ma_nghe BIGINT
        REFERENCES nghe_truyen_thong(ma_nghe) ON DELETE SET NULL,

    ma_ln BIGINT
        REFERENCES lang_nghe(ma_ln) ON DELETE SET NULL,

    ten_hd VARCHAR(200) NOT NULL,
    mo_ta_hd TEXT,
    dia_diem_to_chuc VARCHAR(255) NOT NULL,

    thoi_luong_phut SMALLINT NOT NULL
        CHECK (thoi_luong_phut > 0),

    sl_tham_gia_max SMALLINT NOT NULL
        CHECK (sl_tham_gia_max > 0),

    thoi_gian_to_chuc VARCHAR(255),
    yeu_cau_tham_gia TEXT,

    trang_thai_hd VARCHAR(20)
        NOT NULL DEFAULT 'cho_duyet',

    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT ck_hd_trang_thai
        CHECK (trang_thai_hd IN (
            'nhap',
            'cho_duyet',
            'dang_mo',
            'tam_ngung',
            'bi_an'
        ))
);
-- Một bản ghi đa phương tiện chỉ thuộc về một đối tượng:
-- Nghệ nhân HOẶC Sản phẩm HOẶC Nội dung văn hóa HOẶC Hoạt động.

CREATE TABLE da_phuong_tien (
    ma_pt BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    ma_tk_tai_len BIGINT NOT NULL
        REFERENCES tai_khoan(ma_tk) ON DELETE CASCADE,

    loai_tu_lieu VARCHAR(20) NOT NULL DEFAULT 'hinh_anh',
    duong_dan_tep VARCHAR(500) NOT NULL,

    cloudinary_public_id VARCHAR(255),
    cloudinary_resource_type VARCHAR(20),

    chu_thich VARCHAR(500),
    ngay_tai_len TIMESTAMPTZ NOT NULL DEFAULT now(),

    ma_nn BIGINT
        REFERENCES nghe_nhan(ma_nn) ON DELETE CASCADE,

    ma_sp BIGINT
        REFERENCES san_pham(ma_sp) ON DELETE CASCADE,

    ma_nd BIGINT
        REFERENCES nd_van_hoa(ma_nd) ON DELETE CASCADE,

    ma_hd BIGINT
        REFERENCES hoat_dong_trai_nghiem(ma_hd) ON DELETE CASCADE,

    CONSTRAINT ck_pt_loai
        CHECK (loai_tu_lieu IN ('hinh_anh', 'video', 'tai_lieu')),

    CONSTRAINT ck_pt_resource_type
        CHECK (
            cloudinary_resource_type IS NULL
            OR cloudinary_resource_type IN ('image', 'video', 'raw')
        ),

    CONSTRAINT ck_pt_mot_doi_tuong
        CHECK (num_nonnulls(ma_nn, ma_sp, ma_nd, ma_hd) = 1)
);

CREATE TABLE dat_lich_trai_nghiem (
    ma_dl BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    ma_tk BIGINT NOT NULL
        REFERENCES tai_khoan(ma_tk) ON DELETE CASCADE,

    ma_hd BIGINT NOT NULL
        REFERENCES hoat_dong_trai_nghiem(ma_hd) ON DELETE CASCADE,

    ngay_dl TIMESTAMPTZ NOT NULL DEFAULT now(),

    ngay_trai_nghiem DATE NOT NULL,

    gio_bd TIME NOT NULL,
    gio_kt TIME NOT NULL,

    sl_nguoi_tham_gia SMALLINT NOT NULL
        CHECK (sl_nguoi_tham_gia > 0),

    ten_lien_he VARCHAR(100),
    email_lien_he VARCHAR(255),
    sdt_lien_he VARCHAR(30),

    ghi_chu TEXT,

    trang_thai_dl VARCHAR(20)
        NOT NULL DEFAULT 'da_dat',

    ly_do_huy TEXT,

    CONSTRAINT ck_dl_gio
        CHECK (gio_kt > gio_bd),

    CONSTRAINT ck_dl_trang_thai
        CHECK (trang_thai_dl IN (
            'da_dat',
            'qua_so_luong',
            'da_huy',
            'hoan_thanh'
        )),

    CONSTRAINT ck_dl_email
        CHECK (
            email_lien_he IS NULL
            OR email_lien_he ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
        )
);
CREATE TABLE lich_su_dat_lich_trai_nghiem (
    ma_lsd BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    ma_dl BIGINT NOT NULL
        REFERENCES dat_lich_trai_nghiem(ma_dl) ON DELETE CASCADE,

    trang_thai_cu VARCHAR(20),

    trang_thai_moi VARCHAR(20) NOT NULL,

    ma_tk_thay_doi BIGINT
        REFERENCES tai_khoan(ma_tk) ON DELETE SET NULL,

    ly_do TEXT,

    thoi_diem TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT ck_lsd_trang_thai_cu
        CHECK (
            trang_thai_cu IS NULL
            OR trang_thai_cu IN (
                'da_dat',
                'qua_so_luong',
                'da_huy',
                'hoan_thanh'
            )
        ),

    CONSTRAINT ck_lsd_trang_thai_moi
        CHECK (trang_thai_moi IN (
            'da_dat',
            'qua_so_luong',
            'da_huy',
            'hoan_thanh'
        ))
);

CREATE TABLE yeu_thich (
    ma_yt BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    ma_tk BIGINT NOT NULL
        REFERENCES tai_khoan(ma_tk) ON DELETE CASCADE,

    ngay_luu TIMESTAMPTZ NOT NULL DEFAULT now(),

    ma_nn BIGINT
        REFERENCES nghe_nhan(ma_nn) ON DELETE CASCADE,

    ma_nghe BIGINT
        REFERENCES nghe_truyen_thong(ma_nghe) ON DELETE CASCADE,

    ma_sp BIGINT
        REFERENCES san_pham(ma_sp) ON DELETE CASCADE,

    ma_nd BIGINT
        REFERENCES nd_van_hoa(ma_nd) ON DELETE CASCADE,

    ma_hd BIGINT
        REFERENCES hoat_dong_trai_nghiem(ma_hd) ON DELETE CASCADE,

    CONSTRAINT ck_yt_mot_doi_tuong
        CHECK (num_nonnulls(ma_nn, ma_nghe, ma_sp, ma_nd, ma_hd) = 1),

    CONSTRAINT uq_yt_nn UNIQUE (ma_tk, ma_nn),
    CONSTRAINT uq_yt_nghe UNIQUE (ma_tk, ma_nghe),
    CONSTRAINT uq_yt_sp UNIQUE (ma_tk, ma_sp),
    CONSTRAINT uq_yt_nd UNIQUE (ma_tk, ma_nd),
    CONSTRAINT uq_yt_hd UNIQUE (ma_tk, ma_hd)
);
CREATE TABLE danh_gia (
    ma_dg BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    ma_tk BIGINT NOT NULL
        REFERENCES tai_khoan(ma_tk) ON DELETE CASCADE,

    diem_danh_gia SMALLINT NOT NULL
        CHECK (diem_danh_gia BETWEEN 1 AND 5),

    noi_dung_danh_gia TEXT,

    ngay_danh_gia TIMESTAMPTZ NOT NULL DEFAULT now(),

    trang_thai_kiem_duyet VARCHAR(20)
        NOT NULL DEFAULT 'cho_duyet',

    ma_quan_tri_duyet BIGINT
        REFERENCES tai_khoan(ma_tk) ON DELETE SET NULL,

    ngay_duyet TIMESTAMPTZ,

    ma_nn BIGINT
        REFERENCES nghe_nhan(ma_nn) ON DELETE CASCADE,

    ma_sp BIGINT
        REFERENCES san_pham(ma_sp) ON DELETE CASCADE,

    ma_nd BIGINT
        REFERENCES nd_van_hoa(ma_nd) ON DELETE CASCADE,

    ma_hd BIGINT
        REFERENCES hoat_dong_trai_nghiem(ma_hd) ON DELETE CASCADE,

    CONSTRAINT ck_dg_mot_doi_tuong
        CHECK (num_nonnulls(ma_nn, ma_sp, ma_nd, ma_hd) = 1),

    CONSTRAINT ck_dg_trang_thai
        CHECK (trang_thai_kiem_duyet IN (
            'cho_duyet',
            'da_duyet',
            'bi_an',
            'tu_choi'
        )),

    CONSTRAINT uq_dg_nn UNIQUE (ma_tk, ma_nn),
    CONSTRAINT uq_dg_sp UNIQUE (ma_tk, ma_sp),
    CONSTRAINT uq_dg_nd UNIQUE (ma_tk, ma_nd),
    CONSTRAINT uq_dg_hd UNIQUE (ma_tk, ma_hd)
);

Table "tai_khoan" {
  "ma_tk" BIGINT [pk, increment]
  "ho_ten" VARCHAR(100) [not null]
  "email" VARCHAR(255) [not null]
  "mat_khau_hash" VARCHAR(255) [not null]
  "sdt" VARCHAR(15)
  "anh_dai_dien" VARCHAR(500)
  "vai_tro" VARCHAR(20) [not null, default: 'du_khach']
  "trang_thai_tk" VARCHAR(20) [not null, default: 'hoat_dong']
  "ngay_tao" TIMESTAMPTZ [not null, default: `now()`]

  Checks {
    `vai_tro IN ('nghe_nhan', 'du_khach', 'quan_tri')` [name: 'ck_tk_vai_tro']
    `trang_thai_tk IN ('hoat_dong', 'bi_khoa')` [name: 'ck_tk_trang_thai']
    `email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'` [name: 'ck_tk_email']
    `sdt IS NULL OR sdt ~ '^[0-9+]{9,15}$'` [name: 'ck_tk_sdt']
  }

  Indexes {
    `lower(email)` [unique, name: "uq_tai_khoan_email"]
  }
}

Table "nghe_nhan" {
  "ma_nn" BIGINT [pk]
  "ngay_sinh" DATE
  "dia_chi" VARCHAR(255)
  "gioi_thieu" TEXT
  "so_nam_kn" SMALLINT [check: `so_nam_kn >= 0`]
  "qua_trinh_lam_nghe" TEXT
  "trang_thai_xac_minh" VARCHAR(20) [not null, default: 'chua_xac_minh']
  "ma_quan_tri_xac_minh" BIGINT
  "ngay_xac_minh" TIMESTAMPTZ

  Checks {
    `trang_thai_xac_minh IN
        ('chua_xac_minh', 'cho_xac_minh', 'da_xac_minh', 'tu_choi')` [name: 'ck_nn_xac_minh']
    `ngay_sinh IS NULL OR ngay_sinh < CURRENT_DATE` [name: 'ck_nn_ngay_sinh']
  }
}

Table "lang_nghe" {
  "ma_ln" BIGINT [pk, increment]
  "ten_ln" VARCHAR(150) [not null]
  "dia_chi_ln" VARCHAR(255)
  "tinh_thanh_pho" VARCHAR(100) [not null]
  "lich_su_ln" TEXT
  "gioi_thieu_ln" TEXT
  "anh_dai_dien" VARCHAR(500)
  "ngay_tao" TIMESTAMPTZ [not null, default: `now()`]

  Indexes {
    (ten_ln, tinh_thanh_pho) [unique, name: "uq_lang_nghe"]
  }
}

Table "nghe_truyen_thong" {
  "ma_nghe" BIGINT [pk, increment]
  "ten_nghe" VARCHAR(150) [unique, not null]
  "mo_ta" TEXT
  "nguon_goc" TEXT
  "quy_trinh_thuc_hien" TEXT
  "gia_tri_van_hoa" TEXT
  "anh_dai_dien" VARCHAR(500)
  "trang_thai_hoat_dong" VARCHAR(20) [not null, default: 'hoat_dong']

  Checks {
    `trang_thai_hoat_dong IN ('hoat_dong', 'tam_ngung')` [name: 'ck_nghe_trang_thai']
  }
}

Table "nghe_nhan_nghe" {
  "ma_nn" BIGINT [not null]
  "ma_nghe" BIGINT [not null]
  "nam_bat_dau" SMALLINT [check: `nam_bat_dau BETWEEN 1900 AND 2100`]

  Indexes {
    (ma_nn, ma_nghe) [pk]
  }
}

Table "nghe_nhan_lang_nghe" {
  "ma_nn" BIGINT [not null]
  "ma_ln" BIGINT [not null]

  Indexes {
    (ma_nn, ma_ln) [pk]
  }
}

Table "lang_nghe_nghe" {
  "ma_ln" BIGINT [not null]
  "ma_nghe" BIGINT [not null]

  Indexes {
    (ma_ln, ma_nghe) [pk]
  }
}

Table "san_pham" {
  "ma_sp" BIGINT [pk, increment]
  "ma_nn" BIGINT [not null]
  "ma_nghe" BIGINT
  "ten_sp" VARCHAR(200) [not null]
  "mo_ta_sp" TEXT
  "nguyen_lieu" TEXT
  "quy_trinh_che_tac" TEXT
  "y_nghia_van_hoa" TEXT
  "ngay_dang" TIMESTAMPTZ [not null, default: `now()`]
  "trang_thai_hien_thi" VARCHAR(20) [not null, default: 'cho_duyet']

  Checks {
    `trang_thai_hien_thi IN
        ('nhap', 'cho_duyet', 'da_dang', 'bi_an')` [name: 'ck_sp_trang_thai']
  }
}

Table "nd_van_hoa" {
  "ma_nd" BIGINT [pk, increment]
  "ma_nn" BIGINT [not null]
  "ma_nghe" BIGINT
  "tieu_de" VARCHAR(250) [not null]
  "loai_nd" VARCHAR(30) [not null, default: 'cau_chuyen']
  "tom_tat" TEXT
  "noi_dung_chi_tiet" TEXT [not null]
  "y_nghia_van_hoa" TEXT
  "ngay_dang" TIMESTAMPTZ [not null, default: `now()`]
  "ngay_cap_nhat" TIMESTAMPTZ [not null, default: `now()`]
  "trang_thai_kiem_duyet" VARCHAR(20) [not null, default: 'nhap']
  "ma_quan_tri_duyet" BIGINT
  "ngay_duyet" TIMESTAMPTZ

  Checks {
    `loai_nd IN
        ('cau_chuyen', 'kien_thuc', 'phong_tuc', 'ky_thuat', 'khac')` [name: 'ck_nd_loai']
    `trang_thai_kiem_duyet IN
        ('nhap', 'cho_duyet', 'da_dang', 'bi_an')` [name: 'ck_nd_trang_thai']
  }
}

Table "hoat_dong_trai_nghiem" {
  "ma_hd" BIGINT [pk, increment]
  "ma_nn" BIGINT [not null]
  "ma_nghe" BIGINT
  "ma_ln" BIGINT
  "ten_hd" VARCHAR(200) [not null]
  "mo_ta_hd" TEXT
  "dia_diem_to_chuc" VARCHAR(255) [not null]
  "thoi_luong_phut" SMALLINT [not null, check: `thoi_luong_phut > 0`]
  "sl_tham_gia_max" SMALLINT [not null, check: `sl_tham_gia_max > 0`]
  "thoi_gian_to_chuc" VARCHAR(255)
  "yeu_cau_tham_gia" TEXT
  "trang_thai_hd" VARCHAR(20) [not null, default: 'cho_duyet']
  "ngay_tao" TIMESTAMPTZ [not null, default: `now()`]

  Checks {
    `trang_thai_hd IN
        ('nhap', 'cho_duyet', 'dang_mo', 'tam_ngung', 'bi_an')` [name: 'ck_hd_trang_thai']
  }
}

Table "da_phuong_tien" {
  "ma_pt" BIGINT [pk, increment]
  "ma_tk_tai_len" BIGINT [not null]
  "loai_tu_lieu" VARCHAR(20) [not null, default: 'hinh_anh']
  "duong_dan_tep" VARCHAR(500) [not null]
  "chu_thich" VARCHAR(500)
  "ngay_tai_len" TIMESTAMPTZ [not null, default: `now()`]
  "ma_nn" BIGINT
  "ma_sp" BIGINT
  "ma_nd" BIGINT
  "ma_hd" BIGINT

  Checks {
    `loai_tu_lieu IN ('hinh_anh', 'video', 'tai_lieu')` [name: 'ck_pt_loai']
    `num_nonnulls(ma_nn, ma_sp, ma_nd, ma_hd) = 1` [name: 'ck_pt_mot_doi_tuong']
  }
}

Table "dat_lich_trai_nghiem" {
  "ma_dl" BIGINT [pk, increment]
  "ma_tk" BIGINT [not null]
  "ma_hd" BIGINT [not null]
  "ngay_dl" TIMESTAMPTZ [not null, default: `now()`]
  "ngay_trai_nghiem" DATE [not null]
  "gio_bd" TIME [not null]
  "gio_kt" TIME [not null]
  "sl_nguoi_tham_gia" SMALLINT [not null, check: `sl_nguoi_tham_gia > 0`]
  "ghi_chu" TEXT
  "trang_thai_dl" VARCHAR(20) [not null, default: 'cho_xac_nhan']
  "ngay_xac_nhan" TIMESTAMPTZ

  Checks {
    `gio_kt > gio_bd` [name: 'ck_dl_gio']
    `trang_thai_dl IN
        ('cho_xac_nhan', 'da_xac_nhan', 'bi_tu_choi', 'da_huy', 'hoan_thanh')` [name: 'ck_dl_trang_thai']
  }

  Indexes {
    (ma_tk, ngay_dl [desc]) [name: "ix_dl_tk_ngay"]
    (ma_hd, ngay_trai_nghiem, trang_thai_dl) [name: "ix_dl_hd_ngay_trang_thai"]
  }
}

Table "lich_su_dat_lich_trai_nghiem" {
  "ma_lsd" BIGINT [pk, increment]
  "ma_dl" BIGINT [not null]
  "trang_thai_cu" VARCHAR(20)
  "trang_thai_moi" VARCHAR(20) [not null]
  "ma_tk_thay_doi" BIGINT
  "ly_do" TEXT
  "thoi_diem" TIMESTAMPTZ [not null, default: `now()`]

  Checks {
    `trang_thai_cu IS NULL OR trang_thai_cu IN
        ('cho_xac_nhan', 'da_xac_nhan', 'bi_tu_choi', 'da_huy', 'hoan_thanh')` [name: 'ck_lsd_trang_thai_cu']
    `trang_thai_moi IN
        ('cho_xac_nhan', 'da_xac_nhan', 'bi_tu_choi', 'da_huy', 'hoan_thanh')` [name: 'ck_lsd_trang_thai_moi']
  }

  Indexes {
    (ma_dl, thoi_diem) [name: "ix_lsd_dl_thoi_diem"]
  }
}

Table "yeu_thich" {
  "ma_yt" BIGINT [pk, increment]
  "ma_tk" BIGINT [not null]
  "ngay_luu" TIMESTAMPTZ [not null, default: `now()`]
  "ma_nn" BIGINT
  "ma_nghe" BIGINT
  "ma_sp" BIGINT
  "ma_nd" BIGINT
  "ma_hd" BIGINT

  Checks {
    `num_nonnulls(ma_nn, ma_nghe, ma_sp, ma_nd, ma_hd) = 1` [name: 'ck_yt_mot_doi_tuong']
  }

  Indexes {
    (ma_tk, ma_nn) [unique, name: "uq_yt_nn"]
    (ma_tk, ma_nghe) [unique, name: "uq_yt_nghe"]
    (ma_tk, ma_sp) [unique, name: "uq_yt_sp"]
    (ma_tk, ma_nd) [unique, name: "uq_yt_nd"]
    (ma_tk, ma_hd) [unique, name: "uq_yt_hd"]
  }
}

Table "danh_gia" {
  "ma_dg" BIGINT [pk, increment]
  "ma_tk" BIGINT [not null]
  "diem_danh_gia" SMALLINT [not null, check: `diem_danh_gia BETWEEN 1 AND 5`]
  "noi_dung_danh_gia" TEXT
  "ngay_danh_gia" TIMESTAMPTZ [not null, default: `now()`]
  "trang_thai_kiem_duyet" VARCHAR(20) [not null, default: 'cho_duyet']
  "ma_quan_tri_duyet" BIGINT
  "ngay_duyet" TIMESTAMPTZ
  "ma_nn" BIGINT
  "ma_sp" BIGINT
  "ma_nd" BIGINT
  "ma_hd" BIGINT

  Checks {
    `num_nonnulls(ma_nn, ma_sp, ma_nd, ma_hd) = 1` [name: 'ck_dg_mot_doi_tuong']
    `trang_thai_kiem_duyet IN
        ('cho_duyet', 'da_duyet', 'bi_an', 'tu_choi')` [name: 'ck_dg_trang_thai']
  }

  Indexes {
    (ma_tk, ma_nn) [unique, name: "uq_dg_nn"]
    (ma_tk, ma_sp) [unique, name: "uq_dg_sp"]
    (ma_tk, ma_nd) [unique, name: "uq_dg_nd"]
    (ma_tk, ma_hd) [unique, name: "uq_dg_hd"]
  }
}

Ref:"tai_khoan"."ma_tk" <? "nghe_nhan"."ma_nn" [delete: cascade]

Ref:"tai_khoan"."ma_tk" ?<? "nghe_nhan"."ma_quan_tri_xac_minh" [delete: set null]

Ref:"nghe_nhan"."ma_nn" <? "nghe_nhan_nghe"."ma_nn" [delete: cascade]

Ref:"nghe_truyen_thong"."ma_nghe" <? "nghe_nhan_nghe"."ma_nghe" [delete: cascade]

Ref:"nghe_nhan"."ma_nn" <? "nghe_nhan_lang_nghe"."ma_nn" [delete: cascade]

Ref:"lang_nghe"."ma_ln" <? "nghe_nhan_lang_nghe"."ma_ln" [delete: cascade]

Ref:"lang_nghe"."ma_ln" <? "lang_nghe_nghe"."ma_ln" [delete: cascade]

Ref:"nghe_truyen_thong"."ma_nghe" <? "lang_nghe_nghe"."ma_nghe" [delete: cascade]

Ref:"nghe_nhan"."ma_nn" <? "san_pham"."ma_nn" [delete: cascade]

Ref:"nghe_truyen_thong"."ma_nghe" ?<? "san_pham"."ma_nghe" [delete: set null]

Ref:"nghe_nhan"."ma_nn" <? "nd_van_hoa"."ma_nn" [delete: cascade]

Ref:"nghe_truyen_thong"."ma_nghe" ?<? "nd_van_hoa"."ma_nghe" [delete: set null]

Ref:"tai_khoan"."ma_tk" ?<? "nd_van_hoa"."ma_quan_tri_duyet" [delete: set null]

Ref:"nghe_nhan"."ma_nn" <? "hoat_dong_trai_nghiem"."ma_nn" [delete: cascade]

Ref:"nghe_truyen_thong"."ma_nghe" ?<? "hoat_dong_trai_nghiem"."ma_nghe" [delete: set null]

Ref:"lang_nghe"."ma_ln" ?<? "hoat_dong_trai_nghiem"."ma_ln" [delete: set null]

Ref:"tai_khoan"."ma_tk" <? "da_phuong_tien"."ma_tk_tai_len" [delete: cascade]

Ref:"nghe_nhan"."ma_nn" ?<? "da_phuong_tien"."ma_nn" [delete: cascade]

Ref:"san_pham"."ma_sp" ?<? "da_phuong_tien"."ma_sp" [delete: cascade]

Ref:"nd_van_hoa"."ma_nd" ?<? "da_phuong_tien"."ma_nd" [delete: cascade]

Ref:"hoat_dong_trai_nghiem"."ma_hd" ?<? "da_phuong_tien"."ma_hd" [delete: cascade]

Ref:"tai_khoan"."ma_tk" <? "dat_lich_trai_nghiem"."ma_tk" [delete: cascade]

Ref:"hoat_dong_trai_nghiem"."ma_hd" <? "dat_lich_trai_nghiem"."ma_hd" [delete: cascade]

Ref:"dat_lich_trai_nghiem"."ma_dl" <? "lich_su_dat_lich_trai_nghiem"."ma_dl" [delete: cascade]

Ref:"tai_khoan"."ma_tk" ?<? "lich_su_dat_lich_trai_nghiem"."ma_tk_thay_doi" [delete: set null]

Ref:"tai_khoan"."ma_tk" <? "yeu_thich"."ma_tk" [delete: cascade]

Ref:"nghe_nhan"."ma_nn" ?<? "yeu_thich"."ma_nn" [delete: cascade]

Ref:"nghe_truyen_thong"."ma_nghe" ?<? "yeu_thich"."ma_nghe" [delete: cascade]

Ref:"san_pham"."ma_sp" ?<? "yeu_thich"."ma_sp" [delete: cascade]

Ref:"nd_van_hoa"."ma_nd" ?<? "yeu_thich"."ma_nd" [delete: cascade]

Ref:"hoat_dong_trai_nghiem"."ma_hd" ?<? "yeu_thich"."ma_hd" [delete: cascade]

Ref:"tai_khoan"."ma_tk" <? "danh_gia"."ma_tk" [delete: cascade]

Ref:"tai_khoan"."ma_tk" ?<? "danh_gia"."ma_quan_tri_duyet" [delete: set null]

Ref:"nghe_nhan"."ma_nn" ?<? "danh_gia"."ma_nn" [delete: cascade]

Ref:"san_pham"."ma_sp" ?<? "danh_gia"."ma_sp" [delete: cascade]

Ref:"nd_van_hoa"."ma_nd" ?<? "danh_gia"."ma_nd" [delete: cascade]

Ref:"hoat_dong_trai_nghiem"."ma_hd" ?<? "danh_gia"."ma_hd" [delete: cascade]