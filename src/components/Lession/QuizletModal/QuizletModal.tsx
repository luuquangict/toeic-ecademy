import React, { useState } from "react";
import {
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  X,
  Search,
  Headphones,
  BookOpen,
} from "lucide-react";
import { allQuizletList } from "../../../data/quizlet";
import "./QuizletModal.css";

export interface QuizletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuizletModal: React.FC<QuizletModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"all" | "listening" | "reading">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredItems = allQuizletList.filter((item) => {
    const matchFilter =
      filterType === "all" ||
      item.type === filterType ||
      (filterType === "listening" && item.type === "listening") ||
      (filterType === "reading" && item.type === "reading");

    const q = searchQuery.toLowerCase();
    const matchSearch =
      !searchQuery ||
      item.session.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.topic.toLowerCase().includes(q);

    return matchFilter && matchSearch;
  });

  return (
    <div className="quizlet-modal-backdrop" onClick={onClose}>
      <div className="quizlet-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                background:
                  "linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(6, 182, 212, 0.2))",
                padding: "6px 8px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Sparkles size={18} color="var(--accent-cyan)" />
            </span>
            <div>
              <h3
                style={{
                  fontSize: "17px",
                  fontWeight: 800,
                  margin: 0,
                  color: "var(--text-main)",
                }}
              >
                Tổng Hợp Link Quizlet 15 Buổi Học
              </h3>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  margin: 0,
                }}
              >
                Học từ vựng & mẹo ngữ pháp chuẩn format đề thi TOEIC
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="quizlet-filter-bar">
          <div
            className="search-input-wrapper"
            style={{ flex: 1, minWidth: "220px" }}
          >
            <Search size={14} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Tìm theo buổi, từ vựng, ngữ pháp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-chips">
            <button
              className={`chip-btn ${filterType === "all" ? "active" : ""}`}
              onClick={() => setFilterType("all")}
            >
              Tất cả ({allQuizletList.length})
            </button>
            <button
              className={`chip-btn ${filterType === "listening" ? "active" : ""}`}
              onClick={() => setFilterType("listening")}
            >
              Listening
            </button>
            <button
              className={`chip-btn ${filterType === "reading" ? "active" : ""}`}
              onClick={() => setFilterType("reading")}
            >
              Reading
            </button>
          </div>
        </div>

        {/* Quizlet List Container */}
        <div className="quizlet-list-container">
          {filteredItems.length === 0 ? (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: "13px",
              }}
            >
              Không tìm thấy link Quizlet nào phù hợp với từ khóa "{searchQuery}
              "
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isCopied = copiedUrl === item.url;
              return (
                <div key={idx} className="quizlet-item-card">
                  <div className="quizlet-item-main">
                    <span className={`quizlet-item-badge ${item.type}`}>
                      {item.type === "listening" && <Headphones size={12} />}
                      {item.type === "reading" && <BookOpen size={12} />}
                      {item.type === "global" && <Sparkles size={12} />}
                      <span>{item.session}</span>
                    </span>
                    <div className="quizlet-item-info">
                      <span className="quizlet-item-title">{item.title}</span>
                      <span className="quizlet-item-topic">{item.topic}</span>
                    </div>
                  </div>

                  <div className="quizlet-item-actions">
                    <button
                      className="btn-action"
                      onClick={() => handleCopy(item.url)}
                      title="Sao chép đường dẫn Quizlet"
                      style={{ fontSize: "11.5px", padding: "6px 10px" }}
                    >
                      {isCopied ? (
                        <Check size={14} color="var(--accent-emerald)" />
                      ) : (
                        <Copy size={14} />
                      )}
                      <span>{isCopied ? "Đã copy" : "Copy"}</span>
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-open-quizlet"
                      title="Mở học trực tiếp trên Quizlet"
                    >
                      <span>Mở thẻ</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizletModal;
