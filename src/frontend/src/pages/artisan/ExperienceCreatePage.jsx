import {
  ArrowLeft,
  Camera,
  Clock3,
  ImagePlus,
  Info,
  MapPin,
  MessageSquareText,
  Sprout,
  Upload,
  UsersRound,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/path.js";
import {
  DEFAULT_ARTISAN_EXPERIENCES,
  readArtisanExperiences,
  saveArtisanExperiences,
} from "../../services/artisanExperienceStorage.js";
import "../../styles/ExperienceManagerPage.css";

const initialForm = {
  title: "",
  craft: "",
  description: "",
  location: "",
  date: "",
  time: "",
  duration: "",
  capacity: "",
  details: "",
  requirements: "",
  preparation: "",
  notes: "",
};

const guidance = [
  {
    icon: MessageSquareText,
    title: "Nói rõ điều được trải nghiệm",
    text: "Du khách sẽ tự tay làm gì và mang về điều gì?",
  },
  {
    icon: Clock3,
    title: "Lịch trình vừa sức",
    text: "Dành đủ thời gian hướng dẫn, thực hành và nghỉ ngơi.",
  },
  {
    icon: Camera,
    title: "Ảnh thật tại không gian nghề",
    text: "Ưu tiên ảnh rõ nét, đầy đủ dụng cụ và hoạt động tại xưởng.",
  },
];

function getToday() {
  const date = new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

export default function ExperienceCreatePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageError, setImageError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const updateForm = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleImage = (file) => {
    setImageError("");
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setImageError("Vui lòng chọn ảnh JPG, PNG hoặc WEBP.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError("Ảnh cần có dung lượng tối đa 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setImageError("Không thể đọc tệp ảnh. Vui lòng chọn ảnh khác.");
        return;
      }
      setImage(reader.result);
      setImageName(file.name);
    };
    reader.onerror = () => setImageError("Đã xảy ra lỗi khi đọc ảnh. Vui lòng thử lại.");
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSaveError("");

    const submitterValue = event.nativeEvent.submitter?.value;
    const status = submitterValue === "draft" ? "draft" : "published";
    if (!image) {
      setImageError("Vui lòng thêm ảnh đại diện cho hoạt động.");
      return;
    }

    const activity = {
      id: Date.now(),
      title: form.title.trim(),
      craft: form.craft.trim(),
      location: form.location.trim(),
      schedule: form.date && form.time ? `${form.date}T${form.time}` : "",
      duration: form.duration ? `${form.duration} phút` : "",
      capacity: Number(form.capacity) || 0,
      status,
      image,
      description: form.description.trim(),
      details: form.details.trim(),
      requirements: form.requirements.trim(),
      preparation: form.preparation.trim(),
      notes: form.notes.trim(),
    };

    try {
      const activities = readArtisanExperiences(DEFAULT_ARTISAN_EXPERIENCES);
      saveArtisanExperiences([activity, ...activities]);
    } catch {
      setSaveError("Không thể lưu hoạt động vào trình duyệt. Vui lòng thử lại.");
      return;
    }

    navigate(ROUTES.ARTISAN_EXPERIENCES, {
      state: { notice: status === "draft" ? "Đã lưu bản nháp." : "Đã tạo hoạt động mới." },
    });
  };

  return (
    <main className="experience-page experience-create-page">
      <div className="experience-create-heading">
        <div className="experience-breadcrumb">
          <Link to={ROUTES.ARTISAN_DASHBOARD}>Tổng quan</Link>
          <span>/</span>
          <Link to={ROUTES.ARTISAN_EXPERIENCES}>Hoạt động trải nghiệm</Link>
          <span>/</span>
          <strong>Thêm hoạt động mới</strong>
        </div>
        <Link className="experience-back-link" to={ROUTES.ARTISAN_EXPERIENCES}>
          <ArrowLeft size={14} />
          Danh sách hoạt động
        </Link>
        <h1>Thêm hoạt động mới</h1>
        <p>
          Mời khách khám phá làng nghề, kết nối với câu chuyện và trải nghiệm
          văn hóa của bạn.
        </p>
        <p className="experience-required-note"><span>*</span> là thông tin bắt buộc.</p>
      </div>

      <form className="experience-create-form" onSubmit={handleSubmit}>
        <div className="experience-create-main">
          <section className="experience-form-card">
            <div className="experience-form-card-heading">
              <span className="experience-step">01</span>
              <div>
                <h2>Thông tin cơ bản</h2>
                <p>Giúp du khách hiểu về hoạt động và làng nghề.</p>
              </div>
            </div>
            <div className="experience-create-fields">
              <label className="experience-field">
                Tên hoạt động <span>*</span>
                <input
                  required
                  maxLength={120}
                  value={form.title}
                  onChange={updateForm("title")}
                  placeholder="Ví dụ: Một ngày làm gốm Bát Tràng"
                />
                <small>Tên rõ ràng, tối đa 120 ký tự.</small>
              </label>
              <label className="experience-field">
                Nghề truyền thống liên quan <span>*</span>
                <select required value={form.craft} onChange={updateForm("craft")}>
                  <option value="" disabled>Chọn nghề truyền thống</option>
                  <option>Gốm sứ</option>
                  <option>Dệt lụa</option>
                  <option>Tranh dân gian</option>
                  <option>Mây tre đan</option>
                  <option>Điêu khắc gỗ</option>
                  <option>Nghề truyền thống khác</option>
                </select>
              </label>
              <label className="experience-field">
                Mô tả hoạt động <span>*</span>
                <textarea
                  required
                  rows={4}
                  maxLength={1000}
                  value={form.description}
                  onChange={updateForm("description")}
                  placeholder="Giới thiệu ngắn về trải nghiệm, nét độc đáo của nghề và điều du khách sẽ khám phá..."
                />
                <small>Từ 50–1.000 ký tự. Viết bằng ngôn ngữ gần gũi, dễ hiểu.</small>
              </label>
            </div>
          </section>

          <section className="experience-form-card">
            <div className="experience-form-card-heading">
              <span className="experience-step">02</span>
              <div>
                <h2>Địa điểm và lịch tổ chức</h2>
                <p>Cung cấp lịch cụ thể để du khách dễ dàng sắp xếp.</p>
              </div>
            </div>
            <div className="experience-create-fields">
              <label className="experience-field">
                Địa điểm <span>*</span>
                <span className="experience-input-with-icon">
                  <input
                    required
                    value={form.location}
                    onChange={updateForm("location")}
                    placeholder="Tên xưởng, địa chỉ, xã/phường, tỉnh/thành phố"
                  />
                  <MapPin size={15} />
                </span>
                <small>Ghi rõ điểm hẹn tại xưởng hoặc làng nghề.</small>
              </label>
              <div className="experience-create-fields-row">
                <label className="experience-field">
                  Ngày tổ chức <span>*</span>
                  <input
                    type="date"
                    required
                    min={getToday()}
                    value={form.date}
                    onChange={updateForm("date")}
                  />
                  <small>Chọn ngày diễn ra hoạt động.</small>
                </label>
                <label className="experience-field">
                  Giờ bắt đầu <span>*</span>
                  <input
                    type="time"
                    required
                    value={form.time}
                    onChange={updateForm("time")}
                  />
                  <small>Giờ địa phương tại Việt Nam (GMT+7).</small>
                </label>
              </div>
              <div className="experience-create-fields-row">
                <label className="experience-field">
                  Thời lượng (phút) <span>*</span>
                  <input
                    type="number"
                    required
                    min="30"
                    max="480"
                    step="15"
                    value={form.duration}
                    onChange={updateForm("duration")}
                    placeholder="Ví dụ: 120"
                  />
                  <small>Nhập số nguyên từ 30 đến 480 phút.</small>
                </label>
                <label className="experience-field">
                  Số người tham gia tối đa <span>*</span>
                  <span className="experience-input-with-icon">
                    <input
                      type="number"
                      required
                      min="1"
                      max="50"
                      value={form.capacity}
                      onChange={updateForm("capacity")}
                      placeholder="Ví dụ: 12"
                    />
                    <UsersRound size={15} />
                  </span>
                  <small>Nhập số người từ 1 đến 50 người.</small>
                </label>
              </div>
            </div>
          </section>

          <section className="experience-form-card">
            <div className="experience-form-card-heading">
              <span className="experience-step">03</span>
              <div>
                <h2>Nội dung trải nghiệm</h2>
                <p>Mô tả hành trình và những điều cần chuẩn bị.</p>
              </div>
            </div>
            <div className="experience-create-fields">
              <label className="experience-field">
                Nội dung trải nghiệm <span>*</span>
                <textarea
                  required
                  rows={4}
                  value={form.details}
                  onChange={updateForm("details")}
                  placeholder="Liệt kê các bước: đón khách, giới thiệu nghề, thực hành và chia sẻ thành phẩm..."
                />
                <small>Sắp xếp theo trình tự để khách dễ thực hiện từng bước.</small>
              </label>
              <label className="experience-field">
                Yêu cầu tham gia
                <textarea
                  rows={3}
                  value={form.requirements}
                  onChange={updateForm("requirements")}
                  placeholder="Độ tuổi phù hợp, yêu cầu sức khỏe hoặc kinh nghiệm (nếu có)"
                />
              </label>
              <label className="experience-field">
                Vật liệu cần chuẩn bị
                <textarea
                  rows={3}
                  value={form.preparation}
                  onChange={updateForm("preparation")}
                  placeholder="Vật liệu xưởng cung cấp và những đồ dùng khách cần mang theo"
                />
              </label>
              <label className="experience-field">
                Lưu ý cho du khách
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={updateForm("notes")}
                  placeholder="Trang phục, an toàn tại xưởng, thời gian đón và các lưu ý khác"
                />
              </label>
            </div>
          </section>

          <section className="experience-form-card">
            <div className="experience-form-card-heading">
              <span className="experience-step">04</span>
              <div>
                <h2>Ảnh minh họa</h2>
                <p>Hình ảnh chân thực giúp trải nghiệm thêm gần gũi.</p>
              </div>
            </div>
            <div className="experience-create-fields">
              <div className="experience-field">
                <span className="experience-field-title">Ảnh đại diện và ảnh hoạt động <span>*</span></span>
                {image ? (
                  <div className="experience-upload-preview">
                    <img src={image} alt="Ảnh minh họa hoạt động" />
                    <div>
                      <strong>{imageName}</strong>
                      <button type="button" onClick={() => {
                        setImage("");
                        setImageName("");
                      }}>
                        <X size={13} /> Gỡ ảnh
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`experience-upload-zone${isDragging ? " is-dragging" : ""}`}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(event) => {
                      event.preventDefault();
                      setIsDragging(false);
                      handleImage(event.dataTransfer.files[0]);
                    }}
                  >
                    <ImagePlus size={22} />
                    <span>Kéo thả ảnh vào đây hoặc chọn từ thiết bị</span>
                    <button type="button" onClick={() => fileInputRef.current?.click()}>
                      <Upload size={13} /> Chọn ảnh
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="experience-file-input"
                      onChange={(event) => handleImage(event.target.files[0])}
                    />
                  </div>
                )}
                {imageError && <small className="experience-inline-error">{imageError}</small>}
                <small>JPG, PNG hoặc WEBP · Tối đa 2 MB · Khuyến nghị ảnh ngang 1200 × 800 px.</small>
              </div>
            </div>
          </section>

          {saveError && <p className="experience-save-error" role="alert">{saveError}</p>}

          <div className="experience-create-footer">
            <p><Info size={14} /> Lưu để hiển thị với du khách. Chọn lưu bản nháp nếu bạn muốn hoàn thiện nội dung sau.</p>
            <div>
              <Link className="experience-cancel-button" to={ROUTES.ARTISAN_EXPERIENCES}>Hủy</Link>
              <button className="experience-cancel-button" type="submit" value="draft" formNoValidate>
                Lưu bản nháp
              </button>
              <button className="experience-primary-button" type="submit" value="published">
                <Upload size={13} /> Lưu
              </button>
            </div>
          </div>
        </div>

        <aside className="experience-create-aside">
          <section className="experience-advice-card">
            <Sprout size={19} />
            <h2>Một trải nghiệm,<br />một câu chuyện nghề</h2>
            <p>
              Chia sẻ điều đặc biệt mà chỉ khi đến làng nghề, du khách mới có
              thể cảm nhận.
            </p>
            <div className="experience-advice-list">
              {guidance.map(({ icon: Icon, title, text }) => (
                <div className="experience-advice-item" key={title}>
                  <Icon size={14} />
                  <div>
                    <strong>{title}</strong>
                    <span>{text}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="experience-publish-card">
            <h3>Chủ động chia sẻ</h3>
            <p>
              Lưu hoạt động để hiển thị với du khách khi đã điền đủ thông tin
              hợp lệ.
            </p>
            <p>
              Lưu bản nháp: giữ nội dung để hoàn thiện sau, chưa hiển thị với
              du khách.
            </p>
          </section>
        </aside>
      </form>
    </main>
  );
}
