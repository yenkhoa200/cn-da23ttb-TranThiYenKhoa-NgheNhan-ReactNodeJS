import { CircleAlert, CircleCheck, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArtisanToastContext } from "../../contexts/ArtisanToastContext.js";

const TOAST_DURATION = 3500;

export default function ArtisanToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timeoutRef = useRef(null);

  const dismiss = useCallback(() => {
    window.clearTimeout(timeoutRef.current);
    setToast(null);
  }, []);

  const notify = useCallback((message, type = "success") => {
    window.clearTimeout(timeoutRef.current);
    setToast({ id: Date.now(), message, type });
    timeoutRef.current = window.setTimeout(() => setToast(null), TOAST_DURATION);
  }, []);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  return (
    <ArtisanToastContext.Provider value={notify}>
      {children}
      <div className="artisan-toast-viewport" aria-live={toast?.type === "error" ? "assertive" : "polite"} aria-atomic="true">
        {toast && (
          <div className={`artisan-toast artisan-toast-${toast.type}`} key={toast.id} role="status">
            {toast.type === "error"
              ? <CircleAlert size={19} aria-hidden="true" />
              : <CircleCheck size={19} aria-hidden="true" />}
            <span>{toast.message}</span>
            <button type="button" onClick={dismiss} aria-label="Đóng thông báo">
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </ArtisanToastContext.Provider>
  );
}
