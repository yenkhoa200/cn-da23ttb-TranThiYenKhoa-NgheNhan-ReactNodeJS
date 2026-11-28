import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
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
  lang_nghe: "",
  nghe_truyen_thong: "",
  hoat_dong_trai_nghiem_mo_ta: "",
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
  const [proofs, setProofs] = useState([]);
  const [caption, setCaption] = useState("");
  const [proofCaption, setProofCaption] = useState("");
  const [proofLink, setProofLink] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState("");
  const [imageToDelete, setImageToDelete] = useState(null);
  const [deletingImageId, setDeletingImageId] = useState(null);
  const notify = useArtisanToast();
  const avatarInput = useRef(null);
  const galleryInput = useRef(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      artisanProfileService.getProfile(),
      artisanProfileService.getImages(),
      artisanProfileService.getProofs(),
    ])
      .then(([savedProfile, savedImages, savedProofs]) => {
        if (!active) return;
        setProfile({ ...emptyProfile, ...savedProfile });
        setImages(savedImages);
        setProofs(savedProofs);
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
        craftVillageName: profile.lang_nghe,
        craftName: profile.nghe_truyen_thong,
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

  const handleSubmitForReview = async () => {
    setIsSubmitting(true);
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
        craftVillageName: profile.lang_nghe,
        craftName: profile.nghe_truyen_thong,
        experienceDescription: profile.hoat_dong_trai_nghiem_mo_ta,
      });
      setProfile({ ...emptyProfile, ...savedProfile });
      const result = await artisanProfileService.submitProfile();
      setProfile({ ...emptyProfile, ...savedProfile, trang_thai_xac_minh: result.status });
      notify("Đã gửi hồ sơ cho Admin xét duyệt.");
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setIsSubmitting(false);
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

  const handleImageDelete = async () => {
    if (!imageToDelete) return;
    const image = imageToDelete;
    setDeletingImageId(image.ma_pt);
    try {
      await artisanProfileService.deleteImage(image.ma_pt);
      setImages((current) => current.filter((item) => item.ma_pt !== image.ma_pt));
      setImageToDelete(null);
      notify("Đã xóa ảnh khỏi hồ sơ.");
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setDeletingImageId(null);
    }
  };

  const handleProofLinkAdd = async (event) => {
    event.preventDefault();
    const url = proofLink.trim();
    if (!url) return;

    setUploading("proof-link");
    try {
      const proof = await artisanProfileService.addProofLink(url, proofCaption);
      setProofs((current) => [proof, ...current]);
      setProofLink("");
      setProofCaption("");
      notify("Đã thêm liên kết minh chứng.");
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setUploading("");
    }
  };

  const handleProofDelete = async (proof) => {
    if (!window.confirm("Bạn có chắc muốn xóa minh chứng này khỏi hồ sơ?")) return;

    try {
      await artisanProfileService.deleteProof(proof.ma_pt);
      setProofs((current) => current.filter((item) => item.ma_pt !== proof.ma_pt));
      notify("Đã xóa minh chứng.");
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
        <div className={`verified-badge-pill status-${profile.trang_thai_xac_minh || "chua_xac_minh"}`}>
          {profile.trang_thai_xac_minh === "da_xac_minh"
            ? "✔ Đã xác minh"
            : profile.trang_thai_xac_minh === "cho_xac_minh"
              ? "⏳ Chờ duyệt"
              : profile.trang_thai_xac_minh === "tu_choi"
                ? "Từ chối xác minh"
                : "Chưa gửi hồ sơ"}
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
              <label htmlFor="artisan-craft-village">Làng nghề</label>
              <input
                id="artisan-craft-village"
                name="lang_nghe"
                value={profile.lang_nghe || ""}
                onChange={updateField}
                maxLength={150}
                placeholder="Nhập tên làng nghề"
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="artisan-traditional-craft">Nghề truyền thống</label>
              <input
                id="artisan-traditional-craft"
                name="nghe_truyen_thong"
                value={profile.nghe_truyen_thong || ""}
                onChange={updateField}
                maxLength={150}
                placeholder="Nhập nghề truyền thống của bạn"
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
          <div className="proof-and-image-upload">
            <form className="proof-link-form proof-link-options" onSubmit={handleProofLinkAdd}>
              <input
                aria-label="Liên kết minh chứng"
                type="url"
                value={proofLink}
                onChange={(event) => setProofLink(event.target.value)}
                placeholder="https://... liên kết minh chứng"
                required
              />
              <input
                aria-label="Tên liên kết minh chứng"
                type="text"
                value={proofCaption}
                onChange={(event) => setProofCaption(event.target.value)}
                placeholder="Tên hoặc mô tả liên kết (không bắt buộc)"
                maxLength={500}
              />
              <button type="submit" className="btn-upload-cert" disabled={uploading !== ""}>
                {uploading === "proof-link" ? "Đang thêm..." : "🔗 Nộp bằng liên kết"}
              </button>
            </form>

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
                    <button className="del-btn" type="button" onClick={() => setImageToDelete(image)}>Xóa ảnh</button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="profile-empty-gallery">Bạn chưa tải ảnh nào lên hồ sơ.</p>
          )}

          {proofs.length > 0 && (
            <div className="proof-list">
              {proofs.map((proof) => (
                <article className="proof-item" key={proof.ma_pt}>
                  <div className="proof-item-type">
                    {proof.loai_minh_chung === "link" ? "🔗" : "📎"}
                  </div>
                  <div className="proof-item-copy">
                    <strong>{proof.caption || (proof.loai_minh_chung === "link" ? "Liên kết minh chứng" : "Tệp minh chứng")}</strong>
                    {proof.loai_minh_chung === "link" ? (
                      <a href={proof.url} target="_blank" rel="noreferrer">{proof.url}</a>
                    ) : (
                      <a href={getProfileImageUrl(proof.url)} target="_blank" rel="noreferrer">Mở tệp minh chứng</a>
                    )}
                  </div>
                  <button type="button" className="del-btn" onClick={() => handleProofDelete(proof)}>Xóa</button>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="bottom-action-bar">
          <button type="button" className="btn-save-primary" onClick={handleSubmitForReview} disabled={isSaving || isSubmitting || uploading !== ""}>
            {isSubmitting ? "Đang gửi..." : "📤 Gửi hồ sơ xét duyệt"}
          </button>
          <button type="submit" className="btn-save-primary" disabled={isSaving || uploading !== ""}>
            {isSaving ? "Đang lưu..." : "💾 Lưu thay đổi hồ sơ"}
          </button>
        </div>
      </form>

      {imageToDelete && (
        <div
          className="artisan-profile-confirm-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deletingImageId) setImageToDelete(null);
          }}
        >
          <section
            className="artisan-profile-confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="artisan-profile-confirm-title"
            aria-describedby="artisan-profile-confirm-description"
          >
            <span className="artisan-profile-confirm-icon"><Trash2 size={22} /></span>
            <h2 id="artisan-profile-confirm-title">Xác nhận xóa ảnh</h2>
            <p id="artisan-profile-confirm-description">
              Bạn có muốn xóa <strong>“{imageToDelete.caption || "Ảnh hồ sơ"}”</strong> không?
            </p>
            <p className="artisan-profile-confirm-warning">
              Ảnh này cũng sẽ bị gỡ khỏi hồ sơ nghệ nhân sau khi xóa.
            </p>
            <div className="artisan-profile-confirm-actions">
              <button
                type="button"
                disabled={Boolean(deletingImageId)}
                onClick={() => setImageToDelete(null)}
              >
                Hủy
              </button>
              <button
                className="artisan-profile-confirm-delete"
                type="button"
                disabled={Boolean(deletingImageId)}
                onClick={handleImageDelete}
              >
                {deletingImageId ? "Đang xóa..." : "Xóa ảnh"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
