import React, { useEffect, useState } from "react";
import {
  ClipboardList,
  X,
  RefreshCw,
  AlertTriangle,
  Play,
  FileWarning,
  Clock,
} from "lucide-react";
import {
  fetchAudioReports,
  AudioReportItem,
  isSupabaseConfigured,
} from "../../../services/supabase";
import "./ReportListModal.css";

interface ReportListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrackByKey?: (trackKey: string) => void;
}

export const ReportListModal: React.FC<ReportListModalProps> = ({
  isOpen,
  onClose,
  onSelectTrackByKey,
}) => {
  const [reports, setReports] = useState<AudioReportItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const loadReports = async () => {
    setIsLoading(true);
    setErrorMessage("");
    const res = await fetchAudioReports();
    setIsLoading(false);
    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setReports(res.data);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadReports();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="report-modal-overlay" onClick={onClose}>
      <div
        className="report-list-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="report-modal-header">
          <div className="report-modal-title">
            <ClipboardList size={19} className="report-icon" />
            <h3>Danh sách bài bị report</h3>
            {reports.length > 0 && (
              <span className="report-total-badge">{reports.length} bài</span>
            )}
          </div>
          <div className="report-header-actions">
            <button
              type="button"
              className="report-refresh-btn"
              onClick={loadReports}
              disabled={isLoading}
              title="Làm mới danh sách"
            >
              <RefreshCw size={15} className={isLoading ? "spinning" : ""} />
            </button>
            <button
              type="button"
              className="report-modal-close"
              onClick={onClose}
              title="Đóng"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="report-list-modal-body">
          {!isSupabaseConfigured && (
            <div className="report-env-notice">
              <AlertTriangle size={16} />
              <span>
                Chưa điền <code>VITE_SUPABASE_URL</code> &amp;{" "}
                <code>VITE_SUPABASE_ANON_KEY</code> trong <code>.env</code>.
              </span>
            </div>
          )}

          {errorMessage && (
            <div className="report-error-banner">
              <AlertTriangle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {isLoading ? (
            <div className="report-loading-state">
              <RefreshCw size={24} className="spinning" />
              <p>Đang tải danh sách báo cáo...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="report-empty-state">
              <ClipboardList size={36} className="empty-icon" />
              <p>Chưa có bài nào bị report</p>
              <span>
                Các bài được báo cáo lỗi kịch bản hoặc lệch thời gian sẽ hiển
                thị tại đây.
              </span>
            </div>
          ) : (
            <div className="report-items-table">
              {reports.map((item) => {
                const isTimeIssue = item.reason.includes("lệch time");

                return (
                  <div
                    key={item.track_key}
                    className="report-table-row"
                    onClick={() => {
                      if (onSelectTrackByKey) {
                        onSelectTrackByKey(item.track_key);
                        onClose();
                      }
                    }}
                    title="Bấm để phát bài này"
                  >
                    <div className="row-col-track">
                      <span className="row-track-key">{item.track_key}</span>
                      <span className="row-track-title">
                        {item.track_title}
                      </span>
                    </div>

                    <div className="row-col-reason">
                      <span
                        className={`reason-pill ${isTimeIssue ? "time" : "script"}`}
                      >
                        {isTimeIssue ? (
                          <Clock size={12} />
                        ) : (
                          <FileWarning size={12} />
                        )}
                        {item.reason}
                      </span>
                    </div>

                    <div className="row-col-count" title="Số lượt báo cáo">
                      <span className="count-number">
                        {item.report_count || 1}
                      </span>
                      <span className="count-label">lượt</span>
                    </div>

                    {onSelectTrackByKey && (
                      <button
                        type="button"
                        className="row-play-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTrackByKey(item.track_key);
                          onClose();
                        }}
                        title="Nghe bài này"
                      >
                        <Play size={13} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
