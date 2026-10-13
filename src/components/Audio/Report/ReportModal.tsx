import React, { useState } from "react";
import {
  Flag,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileWarning,
} from "lucide-react";
import {
  submitAudioReport,
  isSupabaseConfigured,
} from "../../../services/supabase";
import "./ReportModal.css";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackKey: string;
  trackTitle: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  trackKey,
  trackTitle,
}) => {
  const [selectedReason, setSelectedReason] =
    useState<string>("Report script sai");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const res = await submitAudioReport(trackKey, trackTitle, selectedReason);
    setIsSubmitting(false);

    if (res.success) {
      setSubmitStatus("success");
      setTimeout(() => {
        setSubmitStatus("idle");
        onClose();
      }, 1500);
    } else {
      setSubmitStatus("error");
      setErrorMessage(res.error || "Gửi báo cáo thất bại.");
    }
  };

  const handleClose = () => {
    setSubmitStatus("idle");
    setErrorMessage("");
    onClose();
  };

  return (
    <div className="report-modal-overlay" onClick={handleClose}>
      <div className="report-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="report-modal-header">
          <div className="report-modal-title">
            <Flag size={18} className="report-icon" />
            <h3>Báo lỗi bài nghe</h3>
          </div>
          <button
            type="button"
            className="report-modal-close"
            onClick={handleClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {submitStatus === "success" ? (
          <div className="report-success-state">
            <CheckCircle2 size={44} className="success-icon" />
            <h4>Gửi báo cáo thành công!</h4>
            <p>
              Hệ thống đã ghi nhận phản hồi cho bài <strong>{trackKey}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="report-modal-body">
            {/* Track Info Badge */}
            <div className="report-track-info-badge">
              <span className="report-track-key">ID: {trackKey}</span>
              <span className="report-track-name">{trackTitle}</span>
            </div>

            {!isSupabaseConfigured && (
              <div className="report-env-notice">
                <AlertTriangle size={16} />
                <span>
                  Chưa điền <code>VITE_SUPABASE_URL</code> &amp;{" "}
                  <code>VITE_SUPABASE_ANON_KEY</code> trong <code>.env</code>.
                </span>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="report-error-banner">
                <AlertTriangle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <p className="report-select-label">Chọn vấn đề bạn gặp phải:</p>

            <div className="report-options-group">
              <label
                className={`report-option-card ${
                  selectedReason === "Report script sai" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="reportReason"
                  value="Report script sai"
                  checked={selectedReason === "Report script sai"}
                  onChange={() => setSelectedReason("Report script sai")}
                />
                <FileWarning size={18} className="opt-icon" />
                <div className="opt-content">
                  <span className="opt-title">Report script sai</span>
                  <span className="opt-desc">
                    Câu từ trong bài không khớp với âm thanh hoặc chính tả bị
                    sai
                  </span>
                </div>
              </label>

              <label
                className={`report-option-card ${
                  selectedReason === "Report cho lệch time của script"
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="reportReason"
                  value="Report cho lệch time của script"
                  checked={selectedReason === "Report cho lệch time của script"}
                  onChange={() =>
                    setSelectedReason("Report cho lệch time của script")
                  }
                />
                <Clock size={18} className="opt-icon" />
                <div className="opt-content">
                  <span className="opt-title">
                    Report cho lệch time của script
                  </span>
                  <span className="opt-desc">
                    Thời điểm bắt đầu hoặc kết thúc của câu bị nhanh/chậm hơn
                    audio
                  </span>
                </div>
              </label>
            </div>

            {/* Actions */}
            <div className="report-modal-actions">
              <button
                type="button"
                className="btn-report-cancel"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn-report-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang gửi..." : "Gửi báo cáo"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
