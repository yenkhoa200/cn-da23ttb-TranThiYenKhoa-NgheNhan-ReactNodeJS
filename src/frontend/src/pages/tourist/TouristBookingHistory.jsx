import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  UsersRound,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import experienceBookingService from "../../services/experienceBookingService.js";
import "../../styles/TouristBookingHistory.css";

const statusLabels = {
  pending: "Đang chờ nghệ nhân xác nhận",
  confirmed: "Đã xác nhận",
  rejected: "Bị từ chối",
  cancelled: "Đã hủy",
  completed: "Đã hoàn thành",
};

const trackingStatuses = new Set(["pending", "confirmed", "rejected", "cancelled"]);

function formatDate(value, options = {}) {
  if (!value) return "Chưa có thông tin";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("vi-VN", options).format(date);
}

function experienceDateTime(booking) {
  const date = String(booking.experience_date).slice(0, 10);
  return `${formatDate(`${date}T12:00:00`, { day: "2-digit", month: "2-digit", year: "numeric" })} · ${booking.start_time}–${booking.end_time}`;
}

function canCancel(booking) {
  if (!["pending", "confirmed"].includes(booking.status)) return false;
  const start = new Date(`${String(booking.experience_date).slice(0, 10)}T${booking.start_time}:00`);
  return !Number.isNaN(start.getTime()) && start.getTime() - Date.now() >= 24 * 60 * 60 * 1000;
}

function BookingDetails({ booking, onClose, onCancel }) {
  const history = booking.status_history || [];
  const progressStatuses = ["pending", "confirmed", "completed"];
  const progressIndex = booking.status === "rejected" || booking.status === "cancelled"
    ? 1
    : progressStatuses.indexOf(booking.status);
  const reason = booking.rejection_reason || booking.cancellation_reason;

  return (
    <div className="tourist-booking-modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section
        className="tourist-booking-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tourist-booking-detail-title"
      >
        <header className="tourist-booking-modal-header">
          <div>
            <span>CHI TIẾT LỊCH ĐẶT #{booking.id}</span>
            <h2 id="tourist-booking-detail-title">{booking.activity_title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Đóng chi tiết"><X size={20} /></button>
        </header>
        {booking.image && <img className="tourist-booking-modal-image" src={booking.image} alt={booking.activity_title} />}
        <div className="tourist-booking-modal-body">
          <span className={`tourist-booking-status status-${booking.status}`}>{statusLabels[booking.status]}</span>
          <div className="tourist-booking-detail-grid">
            <span><strong>Nghệ nhân</strong>{booking.artisan_name}</span>
            <span><strong>Địa điểm</strong>{booking.location}</span>
            <span><strong>Ngày, giờ trải nghiệm</strong>{experienceDateTime(booking)}</span>
            <span><strong>Số người tham gia</strong>{booking.participants} người</span>
            <span><strong>Thời gian gửi yêu cầu</strong>{formatDate(booking.requested_at, { dateStyle: "medium", timeStyle: "short" })}</span>
            <span><strong>Thông tin liên hệ</strong>{booking.contact_name} · {booking.contact_phone} · {booking.contact_email}</span>
            {booking.note && <span className="detail-note"><strong>Ghi chú</strong>{booking.note}</span>}
          </div>

          <section className="tourist-booking-progress">
            <h3>Tiến trình đặt lịch</h3>
            <ol>
              {progressStatuses.map((status, index) => {
                const reached = progressIndex >= index;
                const isCurrent = booking.status === status;
                return (
                  <li className={`${reached ? "is-reached" : ""}${isCurrent ? " is-current" : ""}`} key={status}>
                    <span className="progress-dot">{reached ? <Check size={13} /> : index + 1}</span>
                    <span>{status === "pending" ? "Đã gửi yêu cầu" : status === "confirmed" ? "Nghệ nhân phản hồi" : "Hoàn thành trải nghiệm"}</span>
                    <small>{formatDate(history.find((item) => item.status === status)?.changedAt, { dateStyle: "medium", timeStyle: "short" })}</small>
                  </li>
                );
              })}
            </ol>
            {reason && <p className="tourist-booking-reason"><strong>{booking.status === "rejected" ? "Lý do từ chối:" : "Lý do hủy:"}</strong> {reason}</p>}
          </section>
          {canCancel(booking) && (
            <button className="tourist-booking-cancel-button" type="button" onClick={() => onCancel(booking)}>
              Hủy lịch đặt
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default function TouristBookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("tracking");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refreshBookings = useCallback(async () => {
    try {
      const result = await experienceBookingService.listMine();
      setBookings(result);
      setError("");
      setSelectedBooking((current) => current
        ? result.find((item) => item.id === current.id) || current
        : null);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshBookings();
    const intervalId = window.setInterval(() => refreshBookings(), 30000);
    return () => window.clearInterval(intervalId);
  }, [refreshBookings]);

  const statistics = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter((item) => item.status === "pending").length,
    confirmed: bookings.filter((item) => item.status === "confirmed").length,
    completed: bookings.filter((item) => item.status === "completed").length,
  }), [bookings]);

  const visibleBookings = bookings.filter((item) => activeTab === "completed"
    ? item.status === "completed"
    : trackingStatuses.has(item.status));

  const openDetails = async (booking) => {
    setSelectedBooking(booking);
    try {
      const latest = await experienceBookingService.getMine(booking.id);
      setSelectedBooking(latest);
    } catch (detailError) {
      setNotice(detailError.message);
    }
  };

  const cancelBooking = async (booking) => {
    if (!window.confirm("Bạn có chắc muốn hủy lịch đặt này không?")) return;
    try {
      await experienceBookingService.cancel(booking.id);
      setNotice("Đã hủy lịch đặt.");
      await refreshBookings();
    } catch (cancelError) {
      setNotice(cancelError.message);
    }
  };

  return (
    <section className="tourist-booking-history">
      <header className="tourist-booking-hero">
        <span className="tourist-booking-hero-icon"><CalendarDays size={23} /></span>
        <div>
          <span className="tourist-booking-eyebrow">HÀNH TRÌNH CỦA BẠN</span>
          <h1>Lịch đặt trải nghiệm của tôi</h1>
          <p>Theo dõi các hoạt động trải nghiệm mà bạn đã đăng ký.</p>
        </div>
      </header>

      <section className="tourist-booking-stats" aria-label="Thống kê lịch đặt">
        {[
          ["Tổng số lịch đặt", statistics.total, "total"],
          ["Đang chờ xác nhận", statistics.pending, "pending"],
          ["Đã xác nhận", statistics.confirmed, "confirmed"],
          ["Đã hoàn thành", statistics.completed, "completed"],
        ].map(([label, count, kind]) => (
          <article className={`tourist-booking-stat stat-${kind}`} key={kind}>
            <span>{label}</span>
            <strong>{count}</strong>
          </article>
        ))}
      </section>

      <section className="tourist-booking-panel">
        <div className="tourist-booking-tabs" role="tablist" aria-label="Lịch đặt trải nghiệm">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "completed"}
            className={activeTab === "completed" ? "active" : ""}
            onClick={() => setActiveTab("completed")}
          >
            Lịch sử đã hoàn thành <span>{statistics.completed}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "tracking"}
            className={activeTab === "tracking" ? "active" : ""}
            onClick={() => setActiveTab("tracking")}
          >
            Theo dõi quá trình đặt lịch <span>{bookings.filter((item) => trackingStatuses.has(item.status)).length}</span>
          </button>
        </div>

        {error && <div className="tourist-booking-error" role="alert">{error}</div>}
        {notice && <div className="tourist-booking-notice" role="status">{notice}<button type="button" onClick={() => setNotice("")} aria-label="Đóng thông báo"><X size={15} /></button></div>}
        {isLoading ? (
          <div className="tourist-booking-loading" role="status"><span /> Đang tải lịch đặt...</div>
        ) : visibleBookings.length ? (
          <div className="tourist-booking-list" role="tabpanel">
            {visibleBookings.map((booking) => (
              <article className="tourist-booking-card" key={booking.id}>
                {booking.image
                  ? <img className="tourist-booking-card-image" src={booking.image} alt={booking.activity_title} />
                  : <div className="tourist-booking-card-image image-placeholder"><CalendarDays size={25} /></div>}
                <div className="tourist-booking-card-content">
                  <div className="tourist-booking-card-heading">
                    <div><h2>{booking.activity_title}</h2><span>Nghệ nhân {booking.artisan_name}</span></div>
                    <span className={`tourist-booking-status status-${booking.status}`}>{statusLabels[booking.status]}</span>
                  </div>
                  <div className="tourist-booking-card-facts">
                    <span><MapPin size={15} />{booking.location}</span>
                    <span><CalendarDays size={15} />{experienceDateTime(booking)}</span>
                    <span><UsersRound size={15} />{booking.participants} người</span>
                    <span><Clock3 size={15} />Đặt ngày {formatDate(booking.requested_at, { day: "2-digit", month: "2-digit", year: "numeric" })}</span>
                  </div>
                  {booking.status === "rejected" && booking.rejection_reason && <p className="tourist-booking-card-reason">Lý do: {booking.rejection_reason}</p>}
                  <button className="tourist-booking-detail-button" type="button" onClick={() => openDetails(booking)}>Xem chi tiết</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="tourist-booking-empty" role="tabpanel">
            <CalendarDays size={34} />
            <strong>{activeTab === "completed" ? "Chưa có trải nghiệm hoàn thành" : "Bạn chưa có lịch đặt trải nghiệm"}</strong>
            <p>{activeTab === "completed" ? "Những hoạt động đã tham gia sẽ xuất hiện tại đây." : "Hãy khám phá các hoạt động và gửi yêu cầu đặt lịch đầu tiên."}</p>
            <Link to="/tourist/activities">Khám phá hoạt động</Link>
          </div>
        )}
      </section>
      {selectedBooking && (
        <BookingDetails
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onCancel={cancelBooking}
        />
      )}
    </section>
  );
}
