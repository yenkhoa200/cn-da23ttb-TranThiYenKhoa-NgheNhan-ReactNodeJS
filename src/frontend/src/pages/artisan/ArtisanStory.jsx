import { useEffect, useState } from "react";
import "../../styles/ArtisanStory.css";
import artisanStoryService from "../../services/artisanStoryService";
import { useArtisanToast } from "../../contexts/ArtisanToastContext.js";

const categories = [
  { value: "cau_chuyen", icon: "📜", title: "Câu chuyện nghệ nhân" },
  { value: "ky_thuat", icon: "⚒", title: "Kỹ thuật truyền đời" },
  { value: "phong_tuc", icon: "🏯", title: "Phong tục" },
];

function getYouTubeId(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1).split("/")[0] || null;
    if (url.hostname.includes("youtube.com")) {
      return url.searchParams.get("v")
        || (url.pathname.startsWith("/embed/") ? url.pathname.split("/")[2] : null)
        || (url.pathname.startsWith("/shorts/") ? url.pathname.split("/")[2] : null);
    }
  } catch {
    return null;
  }
  return null;
}

export default function ArtisanStory() {
  const [stories, setStories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("cau_chuyen");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [existingMedia, setExistingMedia] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const notify = useArtisanToast();

  async function loadStories() {
    try {
      setStories(await artisanStoryService.list());
    } catch (error) {
      notify(error.message, "error");
    }
  }

  useEffect(() => {
    let ignore = false;

    async function initialize() {
      try {
        const data = await artisanStoryService.list();
        if (!ignore) setStories(data);
      } catch (error) {
        if (!ignore) notify(error.message, "error");
      }
    }

    initialize();
    return () => {
      ignore = true;
    };
  }, [notify]);

  function resetEditor() {
    setEditingId(null);
    setTitle("");
    setCategory("cau_chuyen");
    setContent("");
    setSummary("");
    setVideoLink("");
    setExistingMedia([]);
    setImageFiles([]);
    setVideoFile(null);
  }

  async function editStory(story) {
    try {
      setLoading(true);
      const detail = await artisanStoryService.get(story.ma_nd);
      setEditingId(detail.ma_nd);
      setTitle(detail.tieu_de || "");
      setContent(detail.noi_dung_chi_tiet || "");
      setSummary(detail.tom_tat || "");
      setExistingMedia(detail.media || []);
      setImageFiles([]);
      setVideoFile(null);
      const reverseCategory = {
        khac: "lich_su_nghe",
        ky_thuat: "ky_thuat_truyen_doi",
        cau_chuyen: "ky_uc_tho_gom",
        phong_tuc: "phong_tuc",
      };
      setCategory(reverseCategory[detail.loai_nd] || "cau_chuyen");
      const savedVideo = (detail.media || []).find((item) => item.type === "video");
      setVideoLink(savedVideo && getYouTubeId(savedVideo.url) ? savedVideo.url : "");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function saveStory(publish = false) {
    if (!title.trim()) return notify("Vui lòng nhập tiêu đề bài viết.", "error");
    if (!content.trim()) return notify("Vui lòng nhập nội dung câu chuyện.", "error");
    if (videoLink.trim() && !getYouTubeId(videoLink)) {
      return notify("Liên kết YouTube không hợp lệ.", "error");
    }

    const data = { title, category, content, summary, status: publish ? "da_dang" : "nhap" };
    const cacheStory = (savedStory, media) => {
      const storyWithMedia = { ...savedStory, media };
      setStories((current) => [
        storyWithMedia,
        ...current.filter((item) => item.ma_nd !== savedStory.ma_nd),
      ]);
      setEditingId(savedStory.ma_nd);
      setExistingMedia(media);
    };

    try {
      setLoading(true);
      let story = editingId
        ? await artisanStoryService.update(editingId, data)
        : await artisanStoryService.create(data);
      const id = story.ma_nd;
      let savedMedia = [...existingMedia];
      cacheStory(story, savedMedia);

      try {
        if (imageFiles.length || videoFile) {
          const uploadedMedia = await artisanStoryService.uploadMedia(id, {
            images: imageFiles,
            video: videoFile,
          });
          savedMedia = [
            ...savedMedia.filter((item) => item.type !== "video" || !videoFile),
            ...uploadedMedia,
          ];
        }
        if (videoLink.trim()) {
          const youtubeMedia = await artisanStoryService.saveYoutube(id, videoLink.trim());
          savedMedia = [...savedMedia.filter((item) => item.type !== "video"), youtubeMedia];
        }
      } catch (error) {
        cacheStory(story, savedMedia);
        notify(`Nội dung đã lưu, nhưng tải tư liệu chưa hoàn tất: ${error.message}`, "error");
        return;
      }

      if (publish) {
        try {
          const publishedStory = await artisanStoryService.publish(id);
          story = { ...story, ...publishedStory };
        } catch (error) {
          cacheStory(story, savedMedia);
          notify(`Nội dung đã lưu, nhưng chưa thể đăng: ${error.message}`, "error");
          return;
        }
      }
      cacheStory(story, savedMedia);
      setImageFiles([]);
      setVideoFile(null);
      notify(publish ? "Đã đăng bài viết." : "Đã lưu bản nháp.");
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function deleteStory(story) {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    try {
      await artisanStoryService.remove(story.ma_nd);
      if (editingId === story.ma_nd) resetEditor();
      notify("Đã xóa bài viết.");
      await loadStories();
    } catch (error) {
      notify(error.message, "error");
    }
  }

  async function deleteMedia(media) {
    if (!editingId) return;
    try {
      await artisanStoryService.removeMedia(editingId, media.id);
      setExistingMedia((items) => items.filter((item) => item.id !== media.id));
    } catch (error) {
      notify(error.message, "error");
    }
  }

  const youtubeId = getYouTubeId(videoLink);
  const savedVideo = existingMedia.find((item) => item.type === "video");
  const drafts = stories.filter((story) => story.trang_thai_kiem_duyet === "nhap");

  return (
    <div className="artisan-story-container">
      <div className="story-banner-card">
        <div className="banner-icon">✿</div>
        <div className="banner-text">
          <span className="eyebrow">LƯU GIỮ KÝ ỨC DI SẢN</span>
          <h2>Kể câu chuyện văn hóa & Ký ức làng nghề</h2>
          <p>Chia sẻ câu chuyện nghề truyền thống kèm hình ảnh và video tư liệu.</p>
        </div>
      </div>

      <section className="story-section-card">
        <div className="section-header-flex">
          <div>
            <h3>1. Nội dung bài viết</h3>
            <p className="sub-hint">Thông tin sẽ được lưu cùng tài khoản nghệ nhân.</p>
          </div>
          <button type="button" className="btn-outline-small" onClick={resetEditor}>＋ Bài viết mới</button>
        </div>

        <div className="input-group">
          <input
            className="story-title-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Nhập tiêu đề câu chuyện"
            maxLength={250}
          />
        </div>

        <div className="story-category-block">
          <h3>2. Thể loại câu chuyện</h3>
          <div className="category-grid">
            {categories.map((item) => (
              <label className={`category-card ${category === item.value ? "selected" : ""}`} key={item.value}>
                <input
                  type="radio"
                  name="category"
                  value={item.value}
                  checked={category === item.value}
                  onChange={() => setCategory(item.value)}
                />
                <span className="cat-icon">{item.icon}</span>
                <span className="cat-title">{item.title}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="story-summary-group">
          <label htmlFor="story-summary">Tóm tắt ngắn</label>
          <textarea
            id="story-summary"
            rows="3"
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            placeholder="Viết vài dòng giới thiệu..."
          />
        </div>

        <label className="story-content-label" htmlFor="story-content">Nội dung chi tiết</label>
        <textarea
          id="story-content"
          className="editor-content"
          rows="10"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Kể câu chuyện của bạn..."
        />
      </section>

      <section className="story-section-card">
        <div className="section-header-flex">
          <div>
            <h3>3. Hình ảnh tư liệu</h3>
            <p className="sub-hint">Chọn nhiều ảnh JPG, PNG hoặc WEBP.</p>
          </div>
        </div>

        <div className="images-grid">
          {existingMedia.filter((item) => item.type === "hinh_anh").map((item) => (
            <div className="image-card" key={item.id}>
              <div className="img-wrapper">
                <img src={item.url} alt="Tư liệu câu chuyện" />
                <button type="button" className="delete-img-btn" onClick={() => deleteMedia(item)} aria-label="Xóa ảnh">🗑</button>
              </div>
            </div>
          ))}
          {imageFiles.map((file, index) => (
            <div className="image-card" key={`${file.name}-${index}`}>
              <div className="img-wrapper">
                <img src={URL.createObjectURL(file)} alt={file.name} />
                <button
                  type="button"
                  className="delete-img-btn"
                  onClick={() => setImageFiles((items) => items.filter((_, itemIndex) => itemIndex !== index))}
                  aria-label="Bỏ ảnh"
                >×</button>
              </div>
              <div className="img-info"><strong>{file.name}</strong></div>
            </div>
          ))}
          <label className="upload-box">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(event) => setImageFiles(Array.from(event.target.files || []))}
            />
            <div className="upload-icon-circle">🖼</div>
            <strong>Bấm để thêm ảnh</strong>
            <p>Tối đa 10 ảnh, mỗi ảnh 50 MB</p>
          </label>
        </div>
      </section>

      <section className="story-section-card">
        <h3>4. Thước phim tư liệu</h3>
        <p className="sub-hint">Dán link YouTube hoặc tải video MP4, MOV, WEBM từ máy.</p>
        <div className="video-section-flex">
          <div className="video-input-left">
            <label className="input-label" htmlFor="youtube-link">Liên kết YouTube</label>
            <div className="link-input-box">
              <span className="link-icon">🔗</span>
              <input
                id="youtube-link"
                type="url"
                value={videoLink}
                onChange={(event) => setVideoLink(event.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <label className="upload-video-btn">
              📁 Tải video từ máy
              <input
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                onChange={(event) => {
                  setVideoFile(event.target.files?.[0] || null);
                  if (event.target.files?.[0]) setVideoLink("");
                }}
              />
            </label>
            {videoFile && <span className="auto-recognize">Đã nhận diện: {videoFile.name}</span>}
          </div>

          <div className="video-preview-card">
            {youtubeId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                title="Video YouTube"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : videoFile ? (
              <video src={URL.createObjectURL(videoFile)} controls />
            ) : savedVideo?.url ? (
              <video src={savedVideo.url} controls />
            ) : (
              <div className="video-empty-preview">Video sẽ hiển thị tại đây</div>
            )}
          </div>
        </div>
      </section>

      <section className="story-section-card draft-section">
        <div className="section-header-flex">
          <div>
            <h3>Bản nháp đã lưu</h3>
            <p className="sub-hint">Xem lại, sửa, xóa hoặc đăng bài ngay.</p>
          </div>
        </div>
        {drafts.length === 0 ? (
          <p className="empty-drafts">Chưa có bản nháp.</p>
        ) : (
          <div className="draft-list">
            {drafts.map((story) => (
              <article className="draft-card" key={story.ma_nd}>
                <div>
                  <strong>{story.tieu_de}</strong>
                  <p>{story.tom_tat || "Chưa có tóm tắt"}</p>
                  <small>Đã cập nhật: {new Date(story.ngay_cap_nhat).toLocaleString("vi-VN")}</small>
                </div>
                <div className="draft-actions">
                  <button type="button" onClick={() => editStory(story)}>Sửa / xem</button>
                  <button type="button" className="draft-delete" onClick={() => deleteStory(story)}>Xóa</button>
                  <button type="button" className="draft-publish" onClick={async () => {
                    await editStory(story);
                    await artisanStoryService.publish(story.ma_nd);
                    notify("Đã đăng bài viết.");
                    await loadStories();
                  }}>Đăng bài</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="story-submit-bar">
        <div className="submit-buttons">
          <button type="button" className="btn-preview" onClick={() => saveStory(false)} disabled={loading}>
            💾 Lưu nháp
          </button>
          <button type="button" className="btn-publish" onClick={() => saveStory(true)} disabled={loading}>
            ĐĂNG BÀI
          </button>
        </div>
      </div>
    </div>
  );
}
