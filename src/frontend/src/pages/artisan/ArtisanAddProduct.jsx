import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/ArtisanAddProduct.css";
import { ROUTES } from "../../routes/path.js";
import productService from "../../services/productService";
import { useArtisanToast } from "../../contexts/ArtisanToastContext.js";

const categories = [
  "Gốm trang trí",
  "Đồ gia dụng",
  "Đồ phong thủy",
  "Trang sức & phụ kiện",
  "Khác",
];

function getYouTubeId(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.hostname === "youtu.be") return url.pathname.slice(1).split("/")[0] || null;
    if (["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname)) {
      return url.searchParams.get("v")
        || (url.pathname.startsWith("/embed/") ? url.pathname.split("/")[2] : null)
        || (url.pathname.startsWith("/shorts/") ? url.pathname.split("/")[2] : null);
    }
  } catch {
    return null;
  }
  return null;
}

export default function ArtisanAddProduct() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [videoLink, setVideoLink] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const notify = useArtisanToast();

  async function loadProducts() {
    try {
      setProducts(await productService.getMine());
    } catch (error) {
      notify(error.message, "error");
    }
  }

  useEffect(() => {
    let ignore = false;
    async function initialize() {
      try {
        const result = await productService.getMine();
        if (!ignore) setProducts(result);
      } catch (error) {
        if (!ignore) notify(error.message, "error");
      }
    }
    initialize();
    return () => { ignore = true; };
  }, [notify]);

  useEffect(() => () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
  }, [videoPreview]);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setCategory(categories[0]);
    setPrice("");
    setDescription("");
    setImageFiles([]);
    setVideoLink("");
    setVideoFile(null);
    setMedia([]);
    setVideoPreview("");
  }

  function editProduct(product) {
    setEditingId(product.id);
    setTitle(product.title || "");
    setCategory(categories.includes(product.category) ? product.category : "Khác");
    setPrice(product.price ?? "");
    setDescription(product.description || "");
    setImageFiles([]);
    const currentMedia = product.media || [];
    setMedia(currentMedia);
    const currentVideo = currentMedia.find((item) => item.type === "video");
    setVideoLink(currentVideo?.url?.includes("youtube.com") || currentVideo?.url?.includes("youtu.be")
      ? currentVideo.url
      : "");
    setVideoFile(null);
    setVideoPreview("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectImages(event) {
    const selected = Array.from(event.target.files || []);
    const remaining = Math.max(0, 4 - media.filter((item) => item.type === "hinh_anh").length);
    setImageFiles(selected.slice(0, remaining));
    if (selected.length > remaining) notify(`Chỉ có thể đính kèm tổng cộng 4 ảnh. Đã chọn ${remaining} ảnh mới.`, "error");
  }

  async function saveProduct(publish) {
    if (!title.trim()) return notify("Vui lòng nhập tên sản phẩm.", "error");
    if (!category) return notify("Vui lòng chọn danh mục sản phẩm.", "error");
    if (price === "" || !Number.isFinite(Number(price)) || Number(price) < 0) {
      return notify("Vui lòng nhập giá tham khảo hợp lệ.", "error");
    }
    if (!description.trim()) return notify("Vui lòng nhập mô tả sản phẩm.", "error");
    const currentImageCount = media.filter((item) => item.type === "hinh_anh").length;
    if (publish && currentImageCount + imageFiles.length === 0) {
      return notify("Vui lòng tải lên ít nhất một hình ảnh trước khi lưu sản phẩm.", "error");
    }
    if (currentImageCount + imageFiles.length > 4) return notify("Sản phẩm chỉ được có tối đa 4 hình ảnh.", "error");

    const data = { title, category, price: Number(price), description, status: "nhap" };
    try {
      setLoading(true);
      const product = editingId
        ? await productService.update(editingId, data)
        : await productService.create(data);
      const id = product.id;

      for (const file of imageFiles) {
        await productService.uploadMedia(id, file, title);
      }
      if (videoFile) {
        await productService.uploadMedia(id, videoFile, title);
      } else if (videoLink.trim()) {
        await productService.saveYouTube(id, videoLink.trim());
      }

      if (publish) await productService.update(id, { ...data, status: "da_dang" });
      setEditingId(id);
      setImageFiles([]);
      setVideoFile(null);
      setVideoPreview("");
      setMedia(await productService.getMedia(id));
      notify(publish ? "Đã lưu và đăng sản phẩm. Du khách có thể xem ngay." : "Đã lưu bản nháp sản phẩm.");
      await loadProducts();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(product) {
    if (!window.confirm(`Xóa sản phẩm “${product.title}”?`)) return;
    try {
      await productService.delete(product.id);
      if (editingId === product.id) resetForm();
      await loadProducts();
      notify("Đã xóa sản phẩm.");
    } catch (error) {
      notify(error.message, "error");
    }
  }

  async function publishDraft(product) {
    if (!(product.media || []).some((item) => item.type === "hinh_anh")) {
      notify("Vui lòng thêm ít nhất một hình ảnh trước khi đăng sản phẩm.", "error");
      return;
    }
    try {
      await productService.update(product.id, {
        title: product.title,
        category: product.category,
        price: Number(product.price),
        description: product.description,
        status: "da_dang",
      });
      await loadProducts();
      notify("Đã đăng sản phẩm. Du khách có thể xem ngay.");
    } catch (error) {
      notify(error.message, "error");
    }
  }

  async function deleteMedia(item) {
    if (!editingId) return;
    try {
      await productService.removeMedia(editingId, item.ma_pt || item.id);
      setMedia((current) => current.filter((entry) => (entry.ma_pt || entry.id) !== (item.ma_pt || item.id)));
    } catch (error) {
      notify(error.message, "error");
    }
  }

  const youtubeId = getYouTubeId(videoLink);
  const imageMedia = media.filter((item) => item.loai_tu_lieu === "hinh_anh" || item.type === "hinh_anh");
  const videoMedia = media.find((item) => item.loai_tu_lieu === "video" || item.type === "video");
  const drafts = products.filter((item) => item.status === "nhap");

  return (
    <main className="product-content">
      <div className="back-button-row">
        <Link to={ROUTES.ARTISAN_DASHBOARD} className="btn-back">← Trở về trang tổng quan</Link>
      </div>

      <div className="page-header-card">
        <div>
          <span className="step-tag-red">✍ THÔNG TIN TÁC PHẨM</span>
          <h1>Thêm sản phẩm thủ công mới</h1>
          <p className="subtitle">Điền thông tin, thêm hình ảnh hoặc video, rồi lưu nháp hoặc đăng sản phẩm.</p>
        </div>
        <button type="button" className="btn-audio-guide" onClick={resetForm}>＋ Sản phẩm mới</button>
      </div>

      <section className="product-card">
        <div className="card-step-header"><div className="step-number">1</div><h2>Thông tin sản phẩm</h2><span className="required-note">Bắt buộc nhập</span></div>
        <div className="step-form">
          <div className="form-group">
            <label htmlFor="product-title">Tên sản phẩm *</label>
            <input id="product-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} placeholder="Nhập tên sản phẩm" />
          </div>
          <div className="product-category-price-row">
            <div className="form-group product-category-group">
              <label htmlFor="product-category">Danh mục sản phẩm *</label>
              <select id="product-category" value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div className="form-group product-price-group">
              <label htmlFor="product-price">Giá tham khảo (VNĐ) *</label>
              <input id="product-price" type="number" min="0" step="1000" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Ví dụ: 2500000" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="product-description">Mô tả sản phẩm *</label>
            <textarea id="product-description" rows={6} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Mô tả chất liệu, cách chế tác, kích thước và ý nghĩa sản phẩm..." />
          </div>
        </div>
      </section>

      <section className="product-card">
        <div className="card-step-header">
          <div className="step-number">2</div>
          <div><h2>Hình ảnh sản phẩm</h2><p className="step-sub-desc margin-0">Tối đa 4 ảnh JPG, PNG hoặc WEBP.</p></div>
          <span className="count-info">{imageMedia.length + imageFiles.length} / 4 ảnh</span>
        </div>
        <div className="images-upload-grid">
          {imageMedia.map((item) => (
            <div className="image-preview-card" key={item.ma_pt || item.id}>
              <img src={item.duong_dan_tep || item.url} alt="Ảnh sản phẩm" />
              <button type="button" className="product-media-delete" onClick={() => deleteMedia(item)} aria-label="Xóa ảnh">×</button>
            </div>
          ))}
          {imageFiles.map((item) => <div className="product-file-chip" key={`${item.name}-${item.lastModified}`}>🖼 {item.name}</div>)}
          {imageMedia.length + imageFiles.length < 4 && (
            <label className="upload-placeholder-card product-upload-label">
              <span className="upload-icon">🖼</span>
              <strong>Chọn ảnh từ máy</strong>
              <small>JPG, PNG, WEBP · tối đa 50 MB/ảnh</small>
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={selectImages} />
            </label>
          )}
        </div>
      </section>

      <section className="product-card">
        <div className="card-step-header">
          <div className="step-number">3</div>
          <div><h2>Video giới thiệu sản phẩm</h2><p className="step-sub-desc margin-0">Dán link YouTube hoặc tải video từ máy.</p></div>
          <span className="optional-badge">Không bắt buộc</span>
        </div>
        {videoMedia && !videoFile && !videoLink && (
          <div className="product-existing-video">
            <span>Đã có video: {videoMedia.chu_thich || videoMedia.caption || "Video sản phẩm"}</span>
            <button type="button" onClick={() => deleteMedia(videoMedia)}>Xóa video</button>
          </div>
        )}
        <div className="product-video-form">
          <label className="form-group">
            <span>Link YouTube</span>
            <input
              type="url"
              value={videoLink}
              onChange={(event) => {
                setVideoLink(event.target.value);
                if (event.target.value) {
                  setVideoFile(null);
                  setVideoPreview("");
                }
              }}
              placeholder="https://youtube.com/watch?v=..."
            />
          </label>
          <label className="btn-choose-file product-video-upload">
            📁 Tải video từ máy
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              onChange={(event) => {
                const file = event.target.files?.[0] || null;
                setVideoFile(file);
                setVideoLink("");
                setVideoPreview(file ? URL.createObjectURL(file) : "");
              }}
            />
          </label>
          {videoFile && <span className="product-file-chip">🎬 {videoFile.name}</span>}
        </div>
        <div className="product-video-preview">
          {youtubeId ? (
            <iframe src={`https://www.youtube-nocookie.com/embed/${youtubeId}`} title="Video giới thiệu sản phẩm" allowFullScreen />
          ) : videoPreview ? (
            <video src={videoPreview} controls />
          ) : videoMedia ? (
            videoMedia.duong_dan_tep?.includes("youtube.com") || videoMedia.url?.includes("youtube.com")
              ? <iframe src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(videoMedia.duong_dan_tep || videoMedia.url)}`} title="Video sản phẩm" allowFullScreen />
              : <video src={videoMedia.duong_dan_tep || videoMedia.url} controls />
          ) : <span>Video sẽ hiển thị tại đây sau khi được chọn</span>}
        </div>
      </section>

      <div className="sticky-save-bar">
        <div className="save-status-info">{loading ? "Đang lưu sản phẩm..." : "Sản phẩm đăng ngay sẽ hiển thị cho du khách."}</div>
        <div className="save-action-btns">
          <button type="button" className="btn-save-draft" onClick={() => saveProduct(false)} disabled={loading}>📄 Lưu nháp</button>
          <button type="button" className="btn-publish-product" onClick={() => saveProduct(true)} disabled={loading}>💾 ĐĂNG</button>
        </div>
      </div>

      <section className="product-card product-drafts">
        <div className="card-step-header"><div className="step-number">4</div><h2>Sản phẩm của tôi</h2></div>
        {products.length === 0 ? <p className="product-empty">Chưa có sản phẩm nào được lưu.</p> : (
          <div className="product-draft-list">
            {products.map((item) => (
              <article className="product-draft-row" key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.category} · {Number(item.price || 0).toLocaleString("vi-VN")} đ</span>
                  <small>{item.status === "nhap" ? "Bản nháp" : item.status === "da_dang" ? "Đang hiển thị" : item.status}</small>
                </div>
                <div className="product-draft-actions">
                  <button type="button" onClick={() => editProduct(item)}>Xem / sửa</button>
                  {item.status === "nhap" && <button type="button" className="product-draft-publish" onClick={() => publishDraft(item)}>Đăng sản phẩm</button>}
                  <button type="button" className="product-draft-delete" onClick={() => deleteProduct(item)}>Xóa</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
