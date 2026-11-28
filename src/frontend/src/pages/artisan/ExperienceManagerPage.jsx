import {
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Eye,
  ImagePlus,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useArtisanToast } from "../../contexts/ArtisanToastContext.js";
import { ROUTES } from "../../routes/path.js";
import artisanExperienceService from "../../services/artisanExperienceService.js";
import "../../styles/ExperienceManagerPage.css";

const statusLabels = {
  published: "Đang hiển thị",
  draft: "Bản nháp",
};

function formatSchedule(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const time = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  const day = new Intl.DateTimeFormat("vi-VN").format(date);
  return `${time} - ${day}`;
}

function parseDescription(description = "") {
  const marker = "Nội dung trải nghiệm:\n";
  const index = description.indexOf(marker);
  if (index === -1) {
    const trimmed = description.trim();
    const legacyMarker = trimmed.indexOf("Nội dung trải nghiệm:");
    if (legacyMarker === -1) return { summary: trimmed, details: "" };
    return {
      summary: trimmed.slice(0, legacyMarker).trim(),
      details: trimmed.slice(legacyMarker + "Nội dung trải nghiệm:".length).replace(/^[:\s]+/, "").trim(),
    };
  }
  return {
    summary: description.slice(0, index).trim(),
    details: description.slice(index + marker.length).trim(),
  };
}

function parseRequirements(requirements = "") {
  const result = { requirements: "", preparation: "", notes: "" };
  const text = String(requirements || "").trim();
  if (!text) return result;

  const sectionMatchers = [
    ["requirements", /^Yêu cầu tham gia\s*:/i],
    ["preparation", /^Vật liệu cần chuẩn bị\s*:/i],
    ["notes", /^Lưu ý\s*:/i],
  ];

  let activeSection = null;
  let foundSection = false;
  text.split("\n").forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    const matcher = sectionMatchers.find(([, pattern]) => pattern.test(trimmedLine));
    if (matcher) {
      foundSection = true;
      activeSection = matcher[0];
      const value = trimmedLine.replace(matcher[1], "").trim();
      if (value) {
        result[activeSection] = result[activeSection]
          ? `${result[activeSection]}\n${value}`
          : value;
      }
      return;
    }

    if (activeSection) {
      result[activeSection] = result[activeSection]
        ? `${result[activeSection]}\n${trimmedLine}`
        : trimmedLine;
    }
  });

  if (!foundSection) result.requirements = text;
  return result;
}

export default function ExperienceManagerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const notify = useArtisanToast();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [craftFilter, setCraftFilter] = useState("all");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [editOriginalImage, setEditOriginalImage] = useState("");
  const editImageInputRef = useRef(null);

  useEffect(() => {
    let active = true;
    artisanExperienceService.list()
      .then((items) => {
        if (active) setActivities(items);
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

  useEffect(() => {
    const notice = location.state?.notice;
    if (!notice) return;

    notify(notice);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate, notify]);

  const crafts = useMemo(
    () => [...new Set(activities.map((activity) => activity.craft))],
    [activities],
  );

  const filteredActivities = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("vi");
    return activities.filter((activity) => {
      const matchesSearch =
        !query ||
        `${activity.title} ${activity.craft} ${activity.location}`
          .toLocaleLowerCase("vi")
          .includes(query);
      const matchesStatus =
        statusFilter === "all" || activity.status === statusFilter;
      const matchesCraft =
        craftFilter === "all" || activity.craft === craftFilter;
      return matchesSearch && matchesStatus && matchesCraft;
    });
  }, [activities, craftFilter, search, statusFilter]);

  const openEdit = (activity) => {
    const parsedDescription = parseDescription(activity.description);
    const parsedRequirements = parseRequirements(activity.requirements);
    setForm({
      ...activity,
      schedule: activity.schedule,
      capacity: String(activity.capacity),
      duration: String(activity.duration),
      description: parsedDescription.summary,
      details: parsedDescription.details,
      requirements: parsedRequirements.requirements,
      preparation: parsedRequirements.preparation,
      notes: parsedRequirements.notes,
    });
    setEditImageFile(null);
    setEditImagePreview(activity.image || "");
    setEditOriginalImage(activity.image || "");
    setModal({ type: "form", activityId: activity.id });
  };

  const handleEditImage = (file) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      notify("Vui lòng chọn ảnh JPG, PNG hoặc WEBP.", "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      notify("Ảnh cần có dung lượng tối đa 2 MB.", "error");
      return;
    }
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const description = [
      form.description.trim(),
      form.details.trim() && `Nội dung trải nghiệm:\n${form.details.trim()}`,
    ].filter(Boolean).join("\n\n");
    const requirements = [
      form.requirements.trim() && `Yêu cầu tham gia: ${form.requirements.trim()}`,
      form.preparation.trim() && `Vật liệu cần chuẩn bị: ${form.preparation.trim()}`,
      form.notes.trim() && `Lưu ý: ${form.notes.trim()}`,
    ].filter(Boolean).join("\n");
    const savedActivity = {
      craftId: form.craft_id,
      title: form.title.trim(),
      description,
      location: form.location.trim(),
      schedule: form.schedule || "",
      requirements,
      status: form.status,
      duration: Number(form.duration),
      capacity: Number(form.capacity),
    };

    try {
      const saved = await artisanExperienceService.update(modal.activityId, savedActivity);
      let updated = saved;
      if (editImageFile) {
        await artisanExperienceService.uploadImage(saved.id, editImageFile);
        updated = { ...saved, image: editImagePreview };
      }
      setActivities((current) => current.map((activity) => (
        activity.id === updated.id ? { ...activity, ...updated, craft: activity.craft } : activity
      )));
      setModal(null);
      notify("Đã cập nhật hoạt động.");
    } catch (error) {
      notify(error.message, "error");
    }
  };

  const handleDelete = async (activityId) => {
    if (!window.confirm("Bạn có chắc muốn xóa hoạt động này không?")) return;
    try {
      await artisanExperienceService.remove(activityId);
      setActivities((current) => current.filter((activity) => activity.id !== activityId));
      if (modal?.type === "detail" && modal.activity.id === activityId) setModal(null);
      notify("Đã xóa hoạt động.");
    } catch (error) {
      notify(error.message, "error");
    }
  };

  return (
    <main className="experience-page">
      <div className="experience-page-heading">
        <div>
          <span className="experience-eyebrow">KHÔNG GIAN NGHỆ NHÂN</span>
          <h1>Đưa nghề Việt đến gần du khách</h1>
          <p>Tạo, cập nhật và quản lý những buổi trải nghiệm làng nghề của bạn.</p>
        </div>
        <Link className="experience-primary-button" to={ROUTES.ARTISAN_EXPERIENCE_CREATE}>
          <Plus size={15} />
          Thêm hoạt động mới
        </Link>
      </div>

      <section className="experience-stats" aria-label="Thống kê hoạt động">
        <article className="experience-stat-card">
          <span>Tổng số hoạt động</span>
          <strong>{activities.length}</strong>
          <small>Trong danh sách của bạn</small>
          <CalendarDays className="experience-stat-icon" size={17} />
        </article>
        <article className="experience-stat-card">
          <span>Đang hiển thị</span>
          <strong>{activities.filter((item) => item.status === "published").length}</strong>
          <small>Du khách có thể tham gia</small>
          <Eye className="experience-stat-icon" size={17} />
        </article>
        <article className="experience-stat-card">
          <span>Bản nháp</span>
          <strong>{activities.filter((item) => item.status === "draft").length}</strong>
          <small>Chỉ bạn có thể xem</small>
          <Pencil className="experience-stat-icon" size={17} />
        </article>
      </section>

      <section className="experience-list-section">
        <div className="experience-list-heading">
          <h2>Danh sách hoạt động</h2>
          <button
            className="experience-sort-button"
            type="button"
            onClick={() => setActivities((current) => [...current].reverse())}
          >
            Đổi thứ tự
          </button>
        </div>

        <div className="experience-filters">
          <label className="experience-search">
            <Search size={15} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm kiếm theo tên hoạt động..."
              aria-label="Tìm kiếm theo tên hoạt động"
            />
          </label>
          <label className="experience-select-wrap">
            <span className="sr-only">Lọc theo trạng thái</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">Trạng thái: Tất cả</option>
              <option value="published">Đang hiển thị</option>
              <option value="draft">Bản nháp</option>
            </select>
            <ChevronDown size={14} />
          </label>
          <label className="experience-select-wrap">
            <span className="sr-only">Lọc theo nghề truyền thống</span>
            <select
              value={craftFilter}
              onChange={(event) => setCraftFilter(event.target.value)}
            >
              <option value="all">Nghề truyền thống: Tất cả</option>
              {crafts.map((craft) => (
                <option key={craft} value={craft}>{craft}</option>
              ))}
            </select>
            <ChevronDown size={14} />
          </label>
        </div>

        <p className="experience-results-count">
          Hiển thị {filteredActivities.length} trên {activities.length} hoạt động
          {" · "}Tất cả nghề thủ công Việt Nam
        </p>

        {isLoading ? <p role="status">Đang tải hoạt động...</p> : filteredActivities.length > 0 ? (
          <div className="experience-grid">
            {filteredActivities.map((activity) => (
              <article className="experience-card" key={activity.id}>
                <div className="experience-card-image">
                  <img src={activity.image} alt={activity.title} />
                  <span className={`experience-status-badge ${activity.status}`}>
                    <span />
                    {statusLabels[activity.status]}
                  </span>
                </div>
                <div className="experience-card-content">
                  <span className="experience-craft">{activity.craft}</span>
                  <h3>{activity.title}</h3>
                  <div className="experience-meta">
                    <span>
                      <MapPin size={16} />
                      <span className="experience-meta-copy"><small>Địa điểm</small><strong>{activity.location}</strong></span>
                    </span>
                    <span>
                      <CalendarDays size={16} />
                      <span className="experience-meta-copy"><small>Ngày & giờ</small><strong>{formatSchedule(activity.schedule)}</strong></span>
                    </span>
                    <span>
                      <Clock3 size={16} />
                      <span className="experience-meta-copy"><small>Thời lượng</small><strong>{activity.duration} phút</strong></span>
                    </span>
                    <span>
                      <UsersRound size={16} />
                      <span className="experience-meta-copy"><small>Số lượng tối đa</small><strong>{activity.capacity} người</strong></span>
                    </span>
                  </div>
                  <div className="experience-card-actions">
                    <button type="button" onClick={() => setModal({ type: "detail", activity })}>
                      <Eye size={13} /> Xem chi tiết
                    </button>
                    <button type="button" onClick={() => openEdit(activity)}>
                      <Pencil size={13} /> Chỉnh sửa
                    </button>
                    <button
                      className="experience-delete-button"
                      type="button"
                      onClick={() => handleDelete(activity.id)}
                    >
                      <Trash2 size={13} /> Xóa
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="experience-empty-state">
            <Search size={23} />
            <strong>Không tìm thấy hoạt động phù hợp</strong>
            <span>Thử đổi từ khóa hoặc bộ lọc để xem thêm hoạt động.</span>
          </div>
        )}
      </section>

      {modal?.type === "form" && (
        <div className="experience-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModal(null);
        }}>
          <section className="experience-modal" role="dialog" aria-modal="true" aria-labelledby="experience-form-title">
            <div className="experience-modal-heading">
              <div>
                <span className="experience-eyebrow">QUẢN LÝ LÀNG NGHỀ</span>
                <h2 id="experience-form-title">
                  {modal.activityId ? "Chỉnh sửa hoạt động" : "Thêm hoạt động mới"}
                </h2>
              </div>
              <button type="button" aria-label="Đóng" onClick={() => setModal(null)}>
                <X size={19} />
              </button>
            </div>
            <form className="experience-form" onSubmit={handleSubmit}>
              <label>
                Tên hoạt động
                <input
                  autoFocus
                  required
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  placeholder="Ví dụ: Một ngày làm gốm"
                />
              </label>
              <div className="experience-form-row">
                <label>
                  Nghề truyền thống
                  <input required value={form.craft || ""} readOnly />
                </label>
                <label>
                  Sức chứa tối đa
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.capacity}
                    onChange={(event) => setForm({ ...form, capacity: event.target.value })}
                  />
                </label>
              </div>
              <label>
                Địa điểm
                <input
                  required
                  value={form.location}
                  onChange={(event) => setForm({ ...form, location: event.target.value })}
                  placeholder="Làng nghề, tỉnh/thành phố"
                />
              </label>
              <div className="experience-form-row">
                <label>
                  Thời gian
                  <input
                    required
                    value={form.schedule}
                    onChange={(event) => setForm({ ...form, schedule: event.target.value })}
                    type="datetime-local"
                  />
                </label>
                <label>
                  Thời lượng
                  <input
                    required
                    value={form.duration}
                    onChange={(event) => setForm({ ...form, duration: event.target.value })}
                    placeholder="120 phút"
                  />
                </label>
              </div>
              <div className="experience-edit-image">
                <span>Ảnh hoạt động</span>
                {editImagePreview && (
                  <img src={editImagePreview} alt={form.title || "Ảnh hoạt động"} />
                )}
                <div className="experience-edit-image-actions">
                  <button
                    type="button"
                    className="experience-cancel-button"
                    onClick={() => editImageInputRef.current?.click()}
                  >
                    <ImagePlus size={14} /> Thay ảnh
                  </button>
                  {editImageFile && (
                    <button
                      type="button"
                      className="experience-cancel-button"
                      onClick={() => {
                        setEditImageFile(null);
                        setEditImagePreview(editOriginalImage);
                      }}
                    >
                      <X size={14} /> Hủy thay ảnh
                    </button>
                  )}
                  <input
                    ref={editImageInputRef}
                    className="experience-file-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => handleEditImage(event.target.files?.[0])}
                  />
                </div>
                <small>JPG, PNG hoặc WEBP · Tối đa 2 MB.</small>
              </div>
              <label>
                Mô tả hoạt động
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  placeholder="Mô tả tổng quan hoạt động..."
                />
              </label>
              <label>
                Nội dung trải nghiệm
                <textarea
                  rows={3}
                  value={form.details}
                  onChange={(event) => setForm({ ...form, details: event.target.value })}
                  placeholder="Các bước và trình tự trải nghiệm..."
                />
              </label>
              <label>
                Yêu cầu tham gia
                <textarea
                  rows={2}
                  value={form.requirements}
                  onChange={(event) => setForm({ ...form, requirements: event.target.value })}
                  placeholder="Độ tuổi, sức khỏe hoặc kinh nghiệm..."
                />
              </label>
              <label>
                Vật liệu cần chuẩn bị
                <textarea
                  rows={2}
                  value={form.preparation}
                  onChange={(event) => setForm({ ...form, preparation: event.target.value })}
                  placeholder="Vật liệu xưởng cung cấp hoặc khách mang theo..."
                />
              </label>
              <label>
                Lưu ý cho du khách
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                  placeholder="Trang phục, an toàn và các lưu ý..."
                />
              </label>
              <label>
                Trạng thái
                <select
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value })}
                >
                  <option value="draft">Bản nháp</option>
                  <option value="published">Đang hiển thị</option>
                </select>
              </label>
              <div className="experience-form-actions">
                <button className="experience-cancel-button" type="button" onClick={() => setModal(null)}>
                  Hủy
                </button>
                <button className="experience-primary-button" type="submit">
                  <Check size={15} />
                  {modal.activityId ? "Lưu thay đổi" : "Tạo hoạt động"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {modal?.type === "detail" && (
        <div className="experience-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModal(null);
        }}>
          <section className="experience-modal experience-detail-modal" role="dialog" aria-modal="true" aria-labelledby="experience-detail-title">
            <div className="experience-modal-heading">
              <div>
                <span className="experience-eyebrow">{modal.activity.craft}</span>
                <h2 id="experience-detail-title">{modal.activity.title}</h2>
              </div>
              <button type="button" aria-label="Đóng" onClick={() => setModal(null)}>
                <X size={19} />
              </button>
            </div>
            <img src={modal.activity.image} alt={modal.activity.title} />
            <div className="experience-form experience-detail-fields">
              <div className="experience-detail-field">
                <span>Tên hoạt động</span>
                <strong>{modal.activity.title}</strong>
              </div>
              <div className="experience-form-row">
                <div className="experience-detail-field">
                  <span>Nghề truyền thống</span>
                  <strong>{modal.activity.craft}</strong>
                </div>
                <div className="experience-detail-field">
                  <span>Sức chứa tối đa</span>
                  <strong>{modal.activity.capacity} người</strong>
                </div>
              </div>
              <div className="experience-detail-field">
                <span>Địa điểm</span>
                <strong>{modal.activity.location}</strong>
              </div>
              <div className="experience-form-row">
                <div className="experience-detail-field">
                  <span>Thời gian</span>
                  <strong>{formatSchedule(modal.activity.schedule)}</strong>
                </div>
                <div className="experience-detail-field">
                  <span>Thời lượng</span>
                  <strong>{modal.activity.duration} phút</strong>
                </div>
              </div>
              <div className="experience-detail-field">
                <span>Mô tả hoạt động</span>
                <p>{parseDescription(modal.activity.description).summary || "Chưa có mô tả."}</p>
              </div>
              <div className="experience-detail-field">
                <span>Nội dung trải nghiệm</span>
                <p>{parseDescription(modal.activity.description).details || "Chưa có nội dung trải nghiệm."}</p>
              </div>
              <div className="experience-detail-field">
                <span>Yêu cầu tham gia</span>
                <p>{parseRequirements(modal.activity.requirements).requirements || "Không có yêu cầu đặc biệt."}</p>
              </div>
              <div className="experience-detail-field">
                <span>Vật liệu cần chuẩn bị</span>
                <p>{parseRequirements(modal.activity.requirements).preparation || "Xưởng sẽ cung cấp thông tin khi xác nhận."}</p>
              </div>
              <div className="experience-detail-field">
                <span>Lưu ý cho du khách</span>
                <p>{parseRequirements(modal.activity.requirements).notes || "Không có lưu ý bổ sung."}</p>
              </div>
              <div className="experience-detail-field">
                <span>Trạng thái</span>
                <strong>{statusLabels[modal.activity.status]}</strong>
              </div>
            </div>
            <div className="experience-form-actions">
              <button className="experience-cancel-button" type="button" onClick={() => setModal(null)}>Đóng</button>
              <button className="experience-primary-button" type="button" onClick={() => openEdit(modal.activity)}>
                <Pencil size={14} /> Chỉnh sửa
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}