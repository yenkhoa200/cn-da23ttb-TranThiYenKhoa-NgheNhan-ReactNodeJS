import {
  ArrowLeft,
  CalendarCheck,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Flower2,
  Home,
  MapPin,
  Search,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useArtisanToast } from "../../contexts/ArtisanToastContext.js";
import artisanExperienceService from "../../services/artisanExperienceService.js";
import { getProfileImageUrl } from "../../services/artisanProfileService.js";
import "../../styles/ArtisanRegistrationsPage.css";

const bookingStatusLabels = {
  confirmed: "Đã xác nhận",
  pending: "Chờ xác nhận",
  rejected: "Đã từ chối",
  cancelled: "Đã hủy",
  completed: "Đã hoàn thành",
};

function getBookings(activityId, registrations) {
  return registrations[activityId] || [];
}

function getParticipantCount(activityId, registrations) {
  return getBookings(activityId, registrations)
    .filter((booking) => ["pending", "confirmed"].includes(booking.status))
    .reduce((total, booking) => total + booking.participants, 0);
}

function groupBookings(bookings) {
  return bookings.reduce((groups, booking) => {
    const activityId = String(booking.activity_id);
    if (!groups[activityId]) groups[activityId] = [];
    groups[activityId].push({
      id: String(booking.id),
      image: booking.image ? getProfileImageUrl(booking.image) : "",
      name: booking.contact_name,
      email: booking.contact_email,
      phone: booking.contact_phone,
      registeredAt: booking.requested_at,
      experienceDate: booking.experience_date,
      startTime: booking.start_time,
      endTime: booking.end_time,
      participants: Number(booking.participants),
      status: booking.status,
      rejectionReason: booking.rejection_reason,
    });
    return groups;
  }, {});
}

function bookingHasEnded(booking) {
  if (!booking.experienceDate || !booking.endTime) return false;
  return new Date(`${String(booking.experienceDate).slice(0, 10)}T${booking.endTime}:00`) < new Date();
}

function getScheduleStatus(schedule) {
  const date = new Date(schedule);
  return Number.isNaN(date.getTime()) || date.getTime() >= Date.now()
    ? "upcoming"
    : "completed";
}

function formatSchedule(schedule) {
  const date = new Date(schedule);
  if (Number.isNaN(date.getTime())) return { date: schedule, time: "" };

  return {
    date: new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date),
    time: new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date),
  };
}

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("vi");
}

function formatAgendaDate(schedule) {
  const date = new Date(schedule);
  if (Number.isNaN(date.getTime())) return { day: "--", month: "Chưa rõ lịch" };

  return {
    day: new Intl.DateTimeFormat("vi-VN", { day: "2-digit" }).format(date),
    month: new Intl.DateTimeFormat("vi-VN", { month: "long", year: "numeric" }).format(date),
  };
}

function RegistrationDetailView({
  activity,
  activities,
  registrations,
  onBack,
  onStatusChange,
}) {
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const allBookings = getBookings(activity.id, registrations);
  const pendingCount = allBookings.filter((booking) => booking.status === "pending"
    || (booking.status === "confirmed" && bookingHasEnded(booking))).length;
  const visibleBookings = showPendingOnly
    ? allBookings.filter((booking) => booking.status === "pending"
      || (booking.status === "confirmed" && bookingHasEnded(booking)))
    : allBookings;
  const pageSize = 8;
  const pageCount = Math.max(1, Math.ceil(visibleBookings.length / pageSize));
  const displayPage = Math.min(currentPage, pageCount);
  const pageBookings = visibleBookings.slice((displayPage - 1) * pageSize, displayPage * pageSize);
  const participantCount = visibleBookings.reduce(
    (total, booking) => total + booking.participants,
    0,
  );
  const allParticipantCount = allBookings.reduce(
    (total, booking) => total + booking.participants,
    0,
  );
  const schedule = formatSchedule(activity.schedule);
  const scheduleStatus = getScheduleStatus(activity.schedule);
  const gallery = [
    activity.image,
    ...activities.filter((item) => item.id !== activity.id).map((item) => item.image),
  ].slice(0, 3);

  const changePendingFilter = () => {
    setShowPendingOnly((current) => !current);
    setCurrentPage(1);
  };

  return (
    <div className="registration-detail-page">
      <nav className="registration-detail-breadcrumb" aria-label="Điều hướng">
        <Home size={15} />
        <ChevronRight size={14} />
        <span>Danh sách đăng ký</span>
        <ChevronRight size={14} />
        <strong>Chi tiết hoạt động</strong>
      </nav>

      <button className="registration-back-button" type="button" onClick={onBack}>
        <ArrowLeft size={16} />
        Quay lại
      </button>

      <div className="registration-detail-grid">
        <article className="registration-activity-detail-card">
          <div className="registration-detail-cover">
            <img src={activity.image} alt={activity.title} />
            <span className={`registration-status ${scheduleStatus}`}>
              <i aria-hidden="true" />
              {scheduleStatus === "completed" ? "Đã diễn ra" : "Sắp diễn ra"}
            </span>
          </div>

          <div className="registration-activity-detail-content">
            <h1>{activity.title}</h1>
            <p className="registration-activity-description">
              {activity.description || "Cùng khám phá và trải nghiệm nghề truyền thống Việt Nam."}
            </p>

            <div className="registration-activity-facts">
              <div>
                <CalendarDays size={18} />
                <span>Thời gian tổ chức<strong>{schedule.date}<small>{schedule.time} · {activity.duration}</small></strong></span>
              </div>
              <div>
                <MapPin size={18} />
                <span>Địa điểm<strong>{activity.location}</strong></span>
              </div>
              <div>
                <UsersRound size={18} />
                <span>Số lượng đăng ký<strong>{allParticipantCount} / {activity.capacity} người</strong></span>
              </div>
            </div>

            <section className="registration-activity-note">
              <h2><Flower2 size={17} />Thông tin hoạt động</h2>
              <p>{activity.description || "Hoạt động trải nghiệm giúp du khách tìm hiểu quy trình và giá trị của nghề truyền thống."}</p>
              <div className="registration-activity-gallery">
                {gallery.map((image, index) => (
                  <img key={`${activity.id}-${index}`} src={image} alt="" />
                ))}
                <span><strong>+2</strong>hình ảnh</span>
              </div>
            </section>
          </div>
        </article>

        <section className="registration-guest-card">
          <header className="registration-guest-card-heading">
            <h2><UsersRound size={21} />Danh sách du khách đăng ký</h2>
            <button
              className={`registration-pending-button${showPendingOnly ? " is-active" : ""}`}
              type="button"
              aria-pressed={showPendingOnly}
              onClick={changePendingFilter}
            >
              {showPendingOnly ? "Tất cả đăng ký" : "Danh sách cần xử lý"}
              {!showPendingOnly && <span>{pendingCount}</span>}
            </button>
          </header>

          {pageBookings.length ? (
            <div className="registration-detail-table-wrap">
              <table className={`registration-detail-table${showPendingOnly ? " has-review-actions" : ""}`}>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Họ tên</th>
                    <th>Số điện thoại</th>
                    <th>Email</th>
                    <th>Thời gian đăng ký</th>
                    <th>Số lượng</th>
                    {showPendingOnly && <th>Thao tác</th>}
                  </tr>
                </thead>
                <tbody>
                  {pageBookings.map((booking, index) => {
                    const registeredAt = formatSchedule(booking.registeredAt);
                    return (
                      <tr key={booking.id}>
                        <td>{(currentPage - 1) * pageSize + index + 1}</td>
                        <td>
                          <div className="registration-detail-guest-name">
                            <strong>{booking.name}</strong>
                            {!showPendingOnly && booking.status !== "confirmed" && (
                              <span className={`registration-booking-status ${booking.status}`}>
                                {bookingStatusLabels[booking.status]}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>{booking.phone}</td>
                        <td>{booking.email}</td>
                        <td>{registeredAt.date}<small>{registeredAt.time}</small></td>
                        <td>{booking.participants} người</td>
                        {showPendingOnly && (
                          <td>
                            <div className="registration-review-actions">
                              {booking.status === "pending" ? (
                                <>
                                  <button
                                    className="registration-confirm-button"
                                    type="button"
                                    onClick={() => onStatusChange(booking.id, "confirmed")}
                                  >
                                    <Check size={14} /> Xác nhận
                                  </button>
                                  <button
                                    className="registration-reject-button"
                                    type="button"
                                    onClick={() => onStatusChange(booking.id, "rejected")}
                                  >
                                    <X size={14} /> Từ chối
                                  </button>
                                </>
                              ) : (
                                <button
                                  className="registration-confirm-button"
                                  type="button"
                                  onClick={() => onStatusChange(booking.id, "completed")}
                                >
                                  <Check size={14} /> Ghi nhận hoàn thành
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="registration-detail-empty">
              <UsersRound size={23} />
              <strong>{showPendingOnly ? "Không có đăng ký đang chờ xác nhận" : "Chưa có du khách đăng ký"}</strong>
              <span>Danh sách sẽ được cập nhật khi có đăng ký mới.</span>
            </div>
          )}

          <footer className="registration-detail-footer">
            <nav className="registration-pagination" aria-label="Phân trang danh sách du khách">
              <button
                type="button"
                aria-label="Trang trước"
                disabled={displayPage === 1}
                onClick={() => setCurrentPage(Math.max(1, displayPage - 1))}
              >
                <ChevronRight size={16} />
              </button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                <button
                  type="button"
                  className={page === displayPage ? "active" : ""}
                  aria-current={page === displayPage ? "page" : undefined}
                  key={page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                aria-label="Trang sau"
                disabled={displayPage === pageCount}
                onClick={() => setCurrentPage(Math.min(pageCount, displayPage + 1))}
              >
                <ChevronRight size={16} />
              </button>
            </nav>
            <button className="registration-count-button" type="button">
              <UsersRound size={16} />
              {visibleBookings.length} lượt đăng ký / {participantCount} người tham gia
            </button>
          </footer>
        </section>
      </div>

      <div className="registration-detail-reminder">
        <CalendarCheck size={19} />
        <div><strong>Lưu ý</strong><span>Vui lòng kiểm tra số lượng đăng ký để chuẩn bị tốt nhất cho hoạt động.</span></div>
      </div>
    </div>
  );
}

export default function ArtisanRegistrationsPage() {
  const notify = useArtisanToast();
  const [activities, setActivities] = useState([]);
  const [registrations, setRegistrations] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [dataError, setDataError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [calendarView, setCalendarView] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      artisanExperienceService.list(),
      artisanExperienceService.listBookings(),
    ])
      .then(([savedActivities, savedBookings]) => {
        if (!active) return;
        const groupedBookings = groupBookings(savedBookings);
        setActivities(savedActivities.map((activity) => ({
          ...activity,
          id: String(activity.id),
          craft: activity.craft || activity.category || "",
          duration: `${activity.duration} phút`,
          image: activity.image
            ? getProfileImageUrl(activity.image)
            : groupedBookings[String(activity.id)]?.find((booking) => booking.image)?.image || "",
        })));
        setRegistrations(groupedBookings);
      })
      .catch((error) => {
        if (active) setDataError(error.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalParticipants = activities.reduce(
      (total, activity) => total + getParticipantCount(activity.id, registrations),
      0,
    );
    const completed = activities.filter(
      (activity) => getScheduleStatus(activity.schedule) === "completed",
    ).length;

    return {
      activities: activities.length,
      participants: totalParticipants,
      completed,
      upcoming: activities.length - completed,
    };
  }, [activities, registrations]);

  const filteredActivities = useMemo(() => {
    const now = new Date();
    const query = search.trim().toLocaleLowerCase("vi");
    const nextThirtyDays = new Date();
    nextThirtyDays.setDate(nextThirtyDays.getDate() + 30);

    return [...activities]
      .filter((activity) => {
        const status = getScheduleStatus(activity.schedule);
        const bookings = getBookings(activity.id, registrations);
        const searchText = [
          activity.title,
          activity.craft,
          activity.location,
          ...bookings.map((booking) => booking.name),
        ].join(" ").toLocaleLowerCase("vi");
        const matchesSearch = !query || searchText.includes(query);
        const matchesStatus = statusFilter === "all" || status === statusFilter;
        const scheduleDate = new Date(activity.schedule);
        const matchesTime = timeFilter === "all"
          || (timeFilter === "this-month"
            && scheduleDate.getMonth() === now.getMonth()
            && scheduleDate.getFullYear() === now.getFullYear())
          || (timeFilter === "next-30-days"
            && scheduleDate >= now
            && scheduleDate <= nextThirtyDays);

        return matchesSearch && matchesStatus && matchesTime;
      })
      .sort((a, b) => new Date(a.schedule) - new Date(b.schedule));
  }, [activities, registrations, search, statusFilter, timeFilter]);

  const handleRegistrationStatusChange = async (bookingId, status) => {
    let reason = "";
    if (status === "rejected") {
      if (!window.confirm("Bạn có chắc muốn từ chối đăng ký này không?")) return;
      const enteredReason = window.prompt("Lý do từ chối (không bắt buộc):");
      if (enteredReason === null) return;
      reason = enteredReason;
    }

    try {
      await artisanExperienceService.updateBookingStatus(bookingId, status, reason);
    } catch (error) {
      notify(error.message, "error");
      return;
    }

    setRegistrations((current) => Object.fromEntries(
      Object.entries(current).map(([activityId, bookings]) => [
        activityId,
        bookings.map((booking) => booking.id === String(bookingId)
          ? {
            ...booking,
            status,
            rejectionReason: status === "rejected" ? reason : null,
          }
          : booking),
      ]),
    ));

    try {
      const savedBookings = await artisanExperienceService.listBookings();
      setRegistrations(groupBookings(savedBookings));
      notify(status === "confirmed"
        ? "Đã xác nhận đăng ký."
        : status === "completed"
          ? "Đã ghi nhận hoạt động hoàn thành."
          : "Đã từ chối đăng ký.");
    } catch (error) {
      notify(`Đã cập nhật trạng thái nhưng không thể tải lại danh sách: ${error.message}`, "error");
    }
  };

  if (selectedActivity) {
    return (
      <main className="artisan-registrations-page">
        <RegistrationDetailView
          activity={selectedActivity}
          activities={activities}
          registrations={registrations}
          onBack={() => setSelectedActivity(null)}
          onStatusChange={handleRegistrationStatusChange}
        />
      </main>
    );
  }

  return (
    <main className="artisan-registrations-page">
      <section className="registrations-hero">
        <div className="registrations-hero-content">
          <span className="registrations-hero-mark" aria-hidden="true"><Flower2 size={37} /></span>
          <div>
            <span className="registrations-eyebrow">KHÔNG GIAN NGHỆ NHÂN</span>
            <h1>Danh sách đăng ký tham gia hoạt động</h1>
            <p>Theo dõi du khách đăng ký, số lượng người tham gia và lịch tổ chức.</p>
          </div>
        </div>
      </section>

      <section className="registrations-stats" aria-label="Thống kê đăng ký">
        <article className="registrations-stat-card stat-green">
          <span className="registrations-stat-icon"><CalendarDays size={21} /></span>
          <div><span>Tổng hoạt động</span><strong>{stats.activities}</strong></div>
        </article>
        <article className="registrations-stat-card stat-gold">
          <span className="registrations-stat-icon"><UsersRound size={22} /></span>
          <div><span>Tổng lượt đăng ký</span><strong>{stats.participants}</strong></div>
        </article>
        <article className="registrations-stat-card stat-green">
          <span className="registrations-stat-icon"><CalendarCheck size={22} /></span>
          <div><span>Đã diễn ra</span><strong>{stats.completed}</strong></div>
        </article>
        <article className="registrations-stat-card stat-gold">
          <span className="registrations-stat-icon"><Clock3 size={22} /></span>
          <div><span>Sắp diễn ra</span><strong>{stats.upcoming}</strong></div>
        </article>
      </section>
      {dataError && <p className="registrations-load-error" role="alert">{dataError}</p>}
      {isLoading && <p className="registrations-load-error" role="status">Đang tải dữ liệu đăng ký...</p>}

      <section className="registrations-toolbar" aria-label="Tìm kiếm và lọc đăng ký">
        <label className="registrations-search">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm hoạt động hoặc du khách..."
            aria-label="Tìm hoạt động hoặc du khách"
          />
        </label>
        <label className="registrations-select">
          <span className="sr-only">Lọc theo trạng thái hoạt động</span>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="upcoming">Sắp diễn ra</option>
            <option value="completed">Đã diễn ra</option>
          </select>
          <ChevronDown size={15} aria-hidden="true" />
        </label>
        <label className="registrations-select">
          <span className="sr-only">Lọc theo thời gian</span>
          <select value={timeFilter} onChange={(event) => setTimeFilter(event.target.value)}>
            <option value="all">Tất cả thời gian</option>
            <option value="this-month">Trong tháng này</option>
            <option value="next-30-days">30 ngày tới</option>
          </select>
          <ChevronDown size={15} aria-hidden="true" />
        </label>
        <button
          className="registrations-calendar-button"
          type="button"
          aria-pressed={calendarView}
          onClick={() => setCalendarView((current) => !current)}
        >
          <CalendarDays size={16} />
          {calendarView ? "Xem danh sách" : "Xem lịch hoạt động"}
        </button>
      </section>

      <section className="registrations-list-section">
        <div className="registrations-list-heading">
          <div>
            <h2>{calendarView ? "Lịch tổ chức hoạt động" : "Hoạt động trải nghiệm"}</h2>
            <p>Danh sách người đăng ký và tình trạng chỗ tham gia</p>
          </div>
          <span className="registrations-result-count">
            {filteredActivities.length} / {activities.length} hoạt động
          </span>
        </div>

        {filteredActivities.length ? (
          calendarView ? (
            <div className="registrations-agenda">
              {filteredActivities.map((activity) => {
                const schedule = formatSchedule(activity.schedule);
                const status = getScheduleStatus(activity.schedule);
                const participants = getParticipantCount(activity.id);
                return (
                  <article className="registrations-agenda-item" key={activity.id}>
                    <div className="registrations-agenda-date">
                      <strong>{formatAgendaDate(activity.schedule).day}</strong>
                      <span>{formatAgendaDate(activity.schedule).month}</span>
                    </div>
                    <img src={activity.image} alt="" />
                    <div className="registrations-agenda-info">
                      <h3>{activity.title}</h3>
                      <span><Clock3 size={13} />{schedule.time || "Chưa có giờ"} · {activity.duration}</span>
                      <span><MapPin size={13} />{activity.location}</span>
                    </div>
                    <span className={`registration-status ${status}`}>
                      {status === "completed" ? "Đã diễn ra" : "Sắp diễn ra"}
                    </span>
                    <strong className="registrations-agenda-count">
                      <UsersRound size={15} />{participants}/{activity.capacity}
                    </strong>
                    <button
                      type="button"
                      className="registration-view-button"
                      onClick={() => setSelectedActivity(activity)}
                    >
                      Xem chi tiết <ChevronRight size={14} />
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="registrations-table-wrap">
              <table className="registrations-table">
                <thead>
                  <tr>
                    <th>Hoạt động trải nghiệm</th>
                    <th>Thời gian tổ chức</th>
                    <th>Số lượng đăng ký</th>
                    <th>Trạng thái</th>
                    <th>Thông tin du khách</th>
                    <th><span className="sr-only">Thao tác</span></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivities.map((activity) => {
                    const schedule = formatSchedule(activity.schedule);
                    const status = getScheduleStatus(activity.schedule);
                    const bookings = getBookings(activity.id, registrations);
                    const participants = getParticipantCount(activity.id, registrations);
                    const capacity = Number(activity.capacity) || 1;
                    const progress = Math.min((participants / capacity) * 100, 100);

                    return (
                      <tr key={activity.id}>
                        <td>
                          <div className="registration-activity-cell">
                            <img src={activity.image} alt="" />
                            <div>
                              <strong>{activity.title}</strong>
                              <span>{activity.craft}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="registration-schedule-cell">
                            <CalendarDays size={15} />
                            <span>{schedule.date}<small>{schedule.time} · {activity.duration}</small></span>
                          </div>
                        </td>
                        <td>
                          <div className="registration-progress-cell">
                            <strong>{participants} <span>/ {capacity} người</span></strong>
                            <div className="registration-progress-track">
                              <span style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`registration-status ${status}`}>
                            <i aria-hidden="true" />
                            {status === "completed" ? "Đã diễn ra" : "Sắp diễn ra"}
                          </span>
                        </td>
                        <td>
                          <div className="registration-guest-stack" aria-label={`${bookings.length} lượt đăng ký`}>
                            {bookings.slice(0, 4).map((booking, index) => (
                              <span
                                className={`registration-guest-avatar guest-color-${index % 4}`}
                                key={booking.id}
                                title={booking.name}
                              >
                                {getInitials(booking.name)}
                              </span>
                            ))}
                            {bookings.length > 4 && (
                              <span className="registration-guest-more">+{bookings.length - 4}</span>
                            )}
                            <span className="registration-guest-total">
                              {bookings.length ? `${bookings.length} khách` : "Chưa có khách"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="registration-view-button"
                            onClick={() => setSelectedActivity(activity)}
                          >
                            Xem chi tiết <ChevronRight size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="registrations-empty-state">
            <Search size={24} />
            <strong>Không tìm thấy hoạt động phù hợp</strong>
            <span>Thử thay đổi từ khóa hoặc bộ lọc thời gian, trạng thái.</span>
          </div>
        )}
      </section>

    </main>
  );
}
