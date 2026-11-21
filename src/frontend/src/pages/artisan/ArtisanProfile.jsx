import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useArtisanToast } from "../../contexts/ArtisanToastContext.js";
import { ROUTES } from "../../routes/path.js";
import artisanProfileService, { getProfileImageUrl } from "../../services/artisanProfileService.js";
import "../../styles/ArtisanProfile.css";

const emptyProfile = {
  ho_ten: "",
  email: "",
  sdt: "",
  anh_dai_dien: "",
  gioi_tinh: "",
  ngay_sinh: "",
  dia_chi: "",
  gioi_thieu: "",
  so_nam_kn: 0,
  qua_trinh_lam_nghe: "",
  lang_nghe_mo_ta: "",
  hoat_dong_trai_nghiem_mo_ta: "",
  lang_nghe: "",
  hoat_dong: [],
};

function updateCachedAuthUser(updates) {
  try {
    const user = JSON.parse(window.localStorage.getItem("auth-user") || "null");
    if (!user || typeof user !== "object") return;

    window.localStorage.setItem("auth-user", JSON.stringify({ ...user, ...updates }));
    window.dispatchEvent(new Event("auth-user-updated"));
  } catch (error) {
    console.error("Không thể đồng bộ ảnh và tên hồ sơ lên thanh tiêu đề:", error);
  }
}

export default function ArtisanProfile() {
  const [profile, setProfile] = useState(emptyProfile);
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState("");
  const notify = useArtisanToast();
  const avatarInput = useRef(null);
  const galleryInput = useRef(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      artisanProfileService.getProfile(),
      artisanProfileService.getImages(),
    ])
      .then(([savedProfile, savedImages]) => {
        if (!active) return;
        setProfile({ ...emptyProfile, ...savedProfile });
        setImages(savedImages);
        updateCachedAuthUser({
          name: savedProfile.ho_ten,
          email: savedProfile.email,
          avatarUrl: savedProfile.anh_dai_dien || "",
        });
      })
      .catch((error) => {
        if (active) notify(error.message, "error");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [notify]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const savedProfile = await artisanProfileService.updateProfile({
        name: profile.ho_ten,
        phone: profile.sdt,
        gender: profile.gioi_tinh,
        birthDate: profile.ngay_sinh,
        address: profile.dia_chi,
        introduction: profile.gioi_thieu,
        yearsOfExperience: profile.so_nam_kn,
        careerHistory: profile.qua_trinh_lam_nghe,
        craftVillageDescription: profile.lang_nghe_mo_ta,
        experienceDescription: profile.hoat_dong_trai_nghiem_mo_ta,
      });
      setProfile({ ...emptyProfile, ...savedProfile });
      updateCachedAuthUser({
        name: savedProfile.ho_ten,
        email: savedProfile.email,
        avatarUrl: savedProfile.anh_dai_dien || "",
      });
      notify("Đã lưu hồ sơ nghệ nhân.");
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading("avatar");
    try {
      const result = await artisanProfileService.uploadAvatar(file);
      setProfile((current) => ({ ...current, anh_dai_dien: result.avatarUrl }));
      updateCachedAuthUser({ avatarUrl: result.avatarUrl });
      notify("Đã cập nhật ảnh đại diện.");
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setUploading("");
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading("image");
    try {
      const image = await artisanProfileService.uploadImage(file, caption);
      setImages((current) => [image, ...current]);
      setCaption("");
      notify("Đã tải ảnh lên hồ sơ.");
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setUploading("");
    }
  };

  const handleImageDelete = async (image) => {
    if (!window.confirm("Bạn có chắc muốn xóa ảnh này khỏi hồ sơ?")) return;

    try {
      await artisanProfileService.deleteImage(image.ma_pt);
      setImages((current) => current.filter((item) => item.ma_pt !== image.ma_pt));
      notify("Đã xóa ảnh khỏi hồ sơ.");
    } catch (error) {
      notify(error.message, "error");
    }
  };

  if (isLoading) {
    return <main className="profile-content"><p role="status">Đang tải hồ sơ nghệ nhân...</p></main>;
  }

  return (
    <main className="profile-content">
      <div className="breadcrumb-row">
        <Link to={ROUTES.ARTISAN_DASHBOARD}>Tổng quan</Link>
        <span>›</span>
        <span className="active">Hồ sơ nghệ nhân</span>
      </div>

      <div className="title-section-row">
        <div>
          <h1>Hồ sơ nghệ nhân</h1>
          <p className="subtitle">Cập nhật thông tin giới thiệu và hình ảnh để chia sẻ với du khách.</p>
        </div>
        <div className="verified-badge-pill">
          {profile.trang_thai_xac_minh === "da_xac_minh" ? "✔ Đã xác minh" : "Hồ sơ nghệ nhân"}
        </div>
      </div>

      <form onSubmit={handleSave}>
        <section className="profile-card avatar-section-card">
          <div className="avatar-wrapper">
            {profile.anh_dai_dien
              ? <img src={getProfileImageUrl(profile.anh_dai_dien)} alt={`Ảnh đại diện ${profile.ho_ten}`} />
              : <div className="profile-avatar-placeholder" aria-label="Chưa có ảnh đại diện">Ảnh nghệ nhân</div>}
          </div>
          <div className="avatar-info-right">
            <span className="section-tag-red">Ảnh đại diện</span>
            <h2>{profile.ho_ten || "Nghệ nhân"}</h2>
            <p className="desc-text">Ảnh đại diện sẽ xuất hiện cùng thông tin hồ sơ của bạn.</p>
            <div className="avatar-action-row">
              <button
                className="change-avatar-btn"
                type="button"
                onClick={() => avatarInput.current?.click()}
                disabled={uploading !== ""}
              >
                {uploading === "avatar" ? "Đang tải ảnh..." : "📷 Đổi ảnh đại diện"}
              </button>
              <input
                ref={avatarInput}
                className="profile-file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
              />
              <span className="profile-upload-hint">JPG, PNG hoặc WEBP, tối đa 10 MB.</span>
            </div>
          </div>
        </section>

        <section className="profile-card form-section-card">
          <div className="form-card-header">
            <h2>Thông tin cơ bản</h2>
            <span className="tip-note">Thông tin được lưu vào hồ sơ của bạn</span>
          </div>
          <div className="artisan-form">
            <div className="form-grid-2col">
              <div className="form-group">
                <label htmlFor="artisan-name">Họ và tên</label>
                <input id="artisan-name" name="ho_ten" value={profile.ho_ten} onChange={updateField} maxLength={100} required />
              </div>
              <div className="form-group">
                <label htmlFor="artisan-email">Email tài khoản</label>
                <input id="artisan-email" value={profile.email} readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="artisan-birth-date">Ngày sinh</label>
                <input
                  id="artisan-birth-date"
                  name="ngay_sinh"
                  type="date"
                  value={profile.ngay_sinh ? String(profile.ngay_sinh).slice(0, 10) : ""}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={updateField}
                />
              </div>
              <fieldset className="gender-fieldset">
                <legend>Giới tính</legend>
                <div className="gender-options">
                  {["Nam", "Nữ", "Khác"].map((gender) => (
                    <label className="gender-option" key={gender}>
                      <input
                        type="radio"
                        name="gioi_tinh"
                        value={gender}
                        checked={profile.gioi_tinh === gender}
                        onChange={updateField}
                        required
                      />
                      <span>{gender}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="form-group">
                <label htmlFor="artisan-years">Số năm kinh nghiệm</label>
                <input
                  id="artisan-years"
                  name="so_nam_kn"
                  type="number"
                  min="0"
                  max="32767"
                  value={profile.so_nam_kn}
                  onChange={updateField}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="artisan-phone">Số điện thoại liên hệ</label>
                <input id="artisan-phone" name="sdt" type="tel" value={profile.sdt || ""} onChange={updateField} maxLength={30} />
              </div>
            </div>
            <div className="form-group full-width">
              <label htmlFor="artisan-address">Địa chỉ hoạt động / đón khách</label>
              <input id="artisan-address" name="dia_chi" value={profile.dia_chi || ""} onChange={updateField} maxLength={255} />
            </div>
            <div className="form-group full-width">
              <label htmlFor="artisan-introduction">Giới thiệu bản thân</label>
              <textarea id="artisan-introduction" name="gioi_thieu" rows={4} value={profile.gioi_thieu || ""} onChange={updateField} maxLength={10000} />
            </div>
            <div className="form-group full-width">
              <label htmlFor="artisan-history">Hành trình gìn giữ và truyền nghề</label>
              <textarea id="artisan-history" name="qua_trinh_lam_nghe" rows={4} value={profile.qua_trinh_lam_nghe || ""} onChange={updateField} maxLength={10000} />
            </div>
          </div>
        </section>

        <section className="profile-card profile-linked-data">
          <div className="form-card-header">
            <div>
              <h2>Làng nghề và hoạt động trải nghiệm</h2>
              <p className="header-desc">Bạn có thể tự nhập thông tin này; nếu chưa có làng nghề, hãy ghi tên nghề truyền thống.</p>
            </div>
          </div>
          <div className="artisan-form">
            <div className="form-group full-width">
              <label htmlFor="artisan-craft-village">Làng nghề / nghề truyền thống</label>
              <input
                id="artisan-craft-village"
                name="lang_nghe_mo_ta"
                value={profile.lang_nghe_mo_ta || ""}
                onChange={updateField}
                maxLength={1000}
                placeholder="Nhập tên làng nghề; nếu chưa có làng nghề, nhập tên nghề truyền thống"
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="artisan-experience-description">Hoạt động trải nghiệm</label>
              <textarea
                id="artisan-experience-description"
                name="hoat_dong_trai_nghiem_mo_ta"
                rows={4}
                value={profile.hoat_dong_trai_nghiem_mo_ta || ""}
                onChange={updateField}
                maxLength={10000}
                placeholder="Mô tả hoạt động trải nghiệm mà bạn tổ chức hoặc hướng dẫn"
              />
            </div>
          </div>
        </section>

        <section className="profile-card certificates-section-card">
          <div className="form-card-header">
            <div>
              <h2>Hình ảnh hồ sơ</h2>
              <p className="header-desc">Ảnh tải lên được lưu cùng hồ sơ nghệ nhân.</p>
            </div>
          </div>
          <div className="profile-gallery-upload">
            <input
              aria-label="Chú thích ảnh"
              type="text"
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              placeholder="Chú thích ảnh (không bắt buộc)"
              maxLength={500}
            />
            <button type="button" className="btn-upload-cert" onClick={() => galleryInput.current?.click()} disabled={uploading !== ""}>
              {uploading === "image" ? "Đang tải ảnh..." : "📷 Tải ảnh lên"}
            </button>
            <input
              ref={galleryInput}
              className="profile-file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
            />
          </div>

          {images.length ? (
            <div className="certificates-grid">
              {images.map((image) => (
                <article className="cert-item-card" key={image.ma_pt}>
                  <div className="cert-img-box">
                    <img src={getProfileImageUrl(image.url)} alt={image.caption || "Ảnh hồ sơ nghệ nhân"} />
                  </div>
                  <p>{image.caption || "Ảnh hồ sơ"}</p>
                  <div className="cert-footer">
                    <span>{image.uploaded_at ? new Date(image.uploaded_at).toLocaleDateString("vi-VN") : ""}</span>
                    <button className="del-btn" type="button" onClick={() => handleImageDelete(image)}>Xóa ảnh</button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="profile-empty-gallery">Bạn chưa tải ảnh nào lên hồ sơ.</p>
          )}
        </section>

        <div className="bottom-action-bar">
          <button type="button" className="btn-print" onClick={() => window.print()}>🖨 In hồ sơ</button>
          <button type="submit" className="btn-save-primary" disabled={isSaving || uploading !== ""}>
            {isSaving ? "Đang lưu..." : "💾 Lưu thay đổi hồ sơ"}
          </button>
        </div>
      </form>
    </main>
  );
}
