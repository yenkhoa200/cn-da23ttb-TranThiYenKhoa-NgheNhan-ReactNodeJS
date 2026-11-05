import {
  Archive,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Eye,
  FileImage,
  Pencil,
  Plus,
  Search,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { pageDefinitions } from "./AdminDashboard.jsx";

export function AdminDataModal() {
  const { modal, closeModal, saveRecord, confirmModalAction } = useOutletContext();
  if (!modal) return null;

  const isConfirm = modal.type === "confirm";
  const isView = modal.type === "view";
  const mediaPreview = modal.record?.preview || modal.record?.image;

  return (
    <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
      <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
        <div className="admin-modal-heading">
          <div><span className="admin-eyebrow">TINH HOA VIỆT · QUẢN TRỊ</span><h2 id="admin-modal-title">{modal.title}</h2></div>
          <button className="admin-icon-button" type="button" onClick={closeModal} aria-label="Đóng"><X size={18} /></button>
        </div>
        {isConfirm ? (
          <>
            <p className="admin-confirm-copy">{modal.message}</p>
            <div className="admin-modal-actions">
              <button className="admin-secondary-button" type="button" onClick={closeModal}>Hủy</button>
              <button className="admin-danger-button" type="button" onClick={confirmModalAction}>{modal.confirmLabel || "Xác nhận"}</button>
            </div>
          </>
        ) : isView ? (
          <>
            {modal.record?.type === "Video" && modal.record.video
              ? <video className="admin-detail-media admin-detail-video" controls preload="metadata" poster={mediaPreview} aria-label={`Video: ${modal.record.name}`}><source src={modal.record.video} type="video/mp4" />Trình duyệt không hỗ trợ phát video.</video>
              : mediaPreview && <div className="admin-detail-media"><img src={mediaPreview} alt={modal.record.name} /></div>}
            <div className="admin-detail-list">
              {Object.entries(modal.record || {}).filter(([key]) => !["id", "preview", "image", "video"].includes(key)).map(([key, value]) => (
                <div key={key}><span>{modal.labels[key] || key}</span><strong>{value || "Chưa cập nhật"}</strong></div>
              ))}
            </div>
            <div className="admin-modal-actions"><button className="admin-primary-button" type="button" onClick={closeModal}>Đóng</button></div>
          </>
        ) : (
          <form onSubmit={saveRecord}>
            <div className="admin-form-grid">
              {modal.fields.map((field) => (
                <label className={field.wide ? "wide" : ""} key={field.key}>
                  <span>{field.label}</span>
                  {field.options
                    ? <select name={field.key} defaultValue={modal.record?.[field.key] || field.options[0]}>{field.options.map((option) => <option key={option}>{option}</option>)}</select>
                    : field.multiline
                      ? <textarea name={field.key} rows="3" defaultValue={modal.record?.[field.key] || ""} placeholder={field.label} />
                      : <input type={field.url ? "url" : "text"} name={field.key} defaultValue={modal.record?.[field.key] || ""} placeholder={field.label} />}
                </label>
              ))}
            </div>
            <div className="admin-modal-actions">
              <button className="admin-secondary-button" type="button" onClick={closeModal}>Hủy</button>
              <button className="admin-primary-button" type="submit">{modal.type === "edit" ? "Lưu thay đổi" : "Thêm mới"}</button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

export default function AdminManagementPage({ pageKey }) {
  const { records, openForm, openDetails, handleAction, confirmDelete } = useOutletContext();
  const definition = pageDefinitions[pageKey];
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredRecords = useMemo(() => records[pageKey].filter((record) => {
    const matchesQuery = Object.values(record).some((value) => String(value).toLowerCase().includes(query.toLowerCase()));
    const matchesFilter = filter === "Tất cả" || (pageKey === "reviews" ? record.rating === filter : record[definition.filterKey] === filter);
    return matchesQuery && matchesFilter;
  }), [definition.filterKey, filter, pageKey, query, records]);
  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const visibleRecords = filteredRecords.slice((page - 1) * pageSize, page * pageSize);
  const showApproval = ["products", "stories", "experiences"].includes(pageKey);

  const renderCell = (key, value) => {
    if (key === "status" || key === "verification") {
      const tone = /đã duyệt|đã xác minh|hoạt động|hiển thị|không vi phạm/i.test(value) ? "success"
        : /chờ|đợi/i.test(value) ? "pending"
          : /khóa|từ chối|ẩn|xóa|vi phạm/i.test(value) ? "danger" : "neutral";
      return <span className={`admin-status ${tone}`}>{value}</span>;
    }
    if (key === "rating") return <span className="admin-stars">★ {value}</span>;
    if (key === "name" && ["accounts", "artisans"].includes(pageKey)) {
      return <span className="admin-name-with-avatar"><span>{value.split(" ").slice(-2).map((part) => part[0]).join("")}</span>{value}</span>;
    }
    const image = key === "name" && records[pageKey].find((record) => record.name === value)?.image;
    if (image) return <span className="admin-name-with-image"><img src={image} alt="" loading="lazy" />{value}</span>;
    return value || <span className="admin-empty-value">—</span>;
  };

  const toggleLabel = (record) => {
    if (pageKey === "accounts" || pageKey === "artisans") return record.status === "Bị khóa" ? "Mở khóa tài khoản" : "Khóa tài khoản";
    return record.status === "Đã ẩn" ? "Hiển thị lại nội dung" : "Ẩn nội dung";
  };

  const renderActions = (record) => (
    <div className="admin-row-actions">
      <button type="button" title="Xem chi tiết" aria-label={`Xem ${record.name || record.visitor || record.email}`} onClick={() => openDetails(pageKey, record, definition)}><Eye size={15} /></button>
      <button type="button" title="Chỉnh sửa" aria-label={`Chỉnh sửa ${record.name || record.visitor || record.email}`} onClick={() => openForm(pageKey, definition, record)}><Pencil size={15} /></button>
      {showApproval && record.status === "Chờ duyệt" && <button className="approve" type="button" title="Duyệt" aria-label={`Duyệt ${record.name}`} onClick={() => handleAction(pageKey, record, "approve")}><BadgeCheck size={15} /></button>}
      {pageKey === "artisans" && record.verification === "Chờ xác minh" && <button className="approve" type="button" title="Xác minh" aria-label={`Xác minh ${record.name}`} onClick={() => handleAction(pageKey, record, "verify")}><BadgeCheck size={15} /></button>}
      {pageKey === "artisans" && record.verification === "Chờ xác minh" && <button className="warning" type="button" title="Từ chối xác minh" aria-label={`Từ chối xác minh ${record.name}`} onClick={() => handleAction(pageKey, record, "reject")}><X size={15} /></button>}
      {pageKey === "reports" && record.status === "Chờ xử lý" && <button className="approve" type="button" title="Không vi phạm" aria-label={`Đánh dấu không vi phạm ${record.name}`} onClick={() => handleAction(pageKey, record, "clear")}><Shield size={15} /></button>}
      <button className={record.status === "Bị khóa" || record.status === "Đã ẩn" ? "approve" : "warning"} type="button" title={toggleLabel(record)} aria-label={`${toggleLabel(record)} ${record.name || record.visitor || record.email}`} onClick={() => handleAction(pageKey, record, "toggle")}><Archive size={15} /></button>
      <button className="delete" type="button" title="Xóa" aria-label={`Xóa ${record.name || record.visitor || record.email}`} onClick={() => confirmDelete(pageKey, record)}><Trash2 size={15} /></button>
    </div>
  );

  return (
    <section className="admin-management">
      <div className="admin-management-heading">
        <div><span className="admin-eyebrow">DỮ LIỆU HỆ THỐNG</span><h2>{definition.title}</h2><p>{definition.description}</p></div>
        {!["reviews", "reports"].includes(pageKey) && <button className="admin-primary-button" type="button" onClick={() => openForm(pageKey, definition)}><Plus size={16} />{definition.addLabel || "Thêm nội dung"}</button>}
      </div>
      <div className="admin-toolbar">
        <label className="admin-search"><Search size={17} /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder={definition.searchPlaceholder} /></label>
        <label className="admin-filter"><span>{definition.filterLabel}</span><select value={filter} onChange={(event) => { setFilter(event.target.value); setPage(1); }}><option>Tất cả</option>{definition.filterOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
        <span className="admin-result-count">{filteredRecords.length} kết quả</span>
      </div>
      {pageKey === "media" ? (
        <div className="admin-media-grid">
          {visibleRecords.length ? visibleRecords.map((record) => (
            <article className="admin-media-card" key={record.id}>
              <div className="admin-media-preview"><img src={record.preview} alt={record.name} loading="lazy" />{record.type === "Video" && <span className="admin-media-play">▶</span>}<span className="admin-media-type">{record.type}</span></div>
              <div className="admin-media-card-body"><div><strong>{record.name}</strong><small>{record.artisan} · {record.created}</small></div><span className={`admin-status ${record.status === "Đã duyệt" ? "success" : record.status === "Chờ duyệt" ? "pending" : "danger"}`}>{record.status}</span><div className="admin-media-card-actions">{renderActions(record)}</div></div>
            </article>
          )) : <div className="admin-media-empty"><FileImage size={24} /><strong>Không tìm thấy dữ liệu phù hợp</strong><small>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.</small></div>}
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr>{definition.columns.map(([key, label]) => <th key={key}>{label}</th>)}<th className="admin-actions-heading">Thao tác</th></tr></thead>
            <tbody>
              {visibleRecords.map((record) => <tr key={record.id}>{definition.columns.map(([key]) => <td key={key} className={key === "comment" || key === "reason" ? "admin-cell-truncate" : ""}>{renderCell(key, record[key])}</td>)}<td>{renderActions(record)}</td></tr>)}
              {visibleRecords.length === 0 && <tr><td className="admin-empty-row" colSpan={definition.columns.length + 1}><span><ClipboardList size={23} /></span><strong>Không tìm thấy dữ liệu phù hợp</strong><small>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.</small></td></tr>}
            </tbody>
          </table>
        </div>
      )}
      <div className="admin-pagination">
        <span>Hiển thị {filteredRecords.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filteredRecords.length)} trên {filteredRecords.length} mục</span>
        <div><button type="button" disabled={page <= 1} aria-label="Trang trước" onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft size={16} /></button><span>Trang {page} / {pageCount}</span><button type="button" disabled={page >= pageCount} aria-label="Trang sau" onClick={() => setPage((current) => Math.min(pageCount, current + 1))}><ChevronRight size={16} /></button></div>
      </div>
    </section>
  );
}
