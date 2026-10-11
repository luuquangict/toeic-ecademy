import React from "react";
import { Lesson } from "../types";
import {
  Target,
  Headphones,
  BookOpen,
  Award,
  CheckCircle2,
  Circle,
  Search,
  Moon,
  Sun,
  X,
  Sparkles,
  Zap,
} from "lucide-react";

interface SidebarProps {
  lessons: Lesson[];
  currentIndex: number;
  completedList: string[];
  currentFilter: "all" | "listening" | "reading";
  searchQuery: string;
  theme: "dark" | "light";
  isOpen: boolean;
  onSelectLesson: (index: number) => void;
  onFilterChange: (filter: "all" | "listening" | "reading") => void;
  onSearchChange: (query: string) => void;
  onToggleTheme: () => void;
  onCloseMobile: () => void;
  onOpenQuizlet: () => void;
  onOpenFlashcards: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  lessons,
  currentIndex,
  completedList,
  currentFilter,
  searchQuery,
  theme,
  isOpen,
  onSelectLesson,
  onFilterChange,
  onSearchChange,
  onToggleTheme,
  onCloseMobile,
  onOpenQuizlet,
  onOpenFlashcards,
}) => {
  const completedCount = completedList.length;
  const totalCount = lessons.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  const filteredLessons = lessons
    .map((lesson, originalIndex) => ({ lesson, originalIndex }))
    .filter(({ lesson }) => {
      const matchFilter =
        currentFilter === "all" ||
        lesson.type === currentFilter ||
        (currentFilter === "listening" && lesson.type.includes("listening")) ||
        (currentFilter === "reading" && lesson.type.includes("reading"));

      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        lesson.title.toLowerCase().includes(q) ||
        lesson.desc.toLowerCase().includes(q);

      return matchFilter && matchSearch;
    });

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="brand-row">
          <div className="brand-title">
            <span className="brand-badge">
              <Target size={18} />
            </span>
            <span>TOEIC Prep Hub</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              className="btn-action"
              onClick={onToggleTheme}
              title={
                theme === "dark" ? "Chuyển chế độ sáng" : "Chuyển chế độ tối"
              }
              style={{ padding: "6px 8px" }}
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              className="mobile-close-btn"
              onClick={onCloseMobile}
              title="Đóng sidebar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Progress box */}
        <div className="progress-box">
          <div className="progress-info">
            <span>Tiến độ đã ôn:</span>
            <span style={{ color: "var(--accent-emerald)", fontWeight: 700 }}>
              {completedCount} / {totalCount} ({progressPct}%)
            </span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Direct Hub Banners (Quizlet & Flashcards) */}
      <div
        style={{
          padding: "10px 14px 4px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <button
          onClick={() => {
            onOpenQuizlet();
            onCloseMobile();
          }}
          style={{
            width: "100%",
            background:
              "linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(6, 182, 212, 0.12))",
            border: "1px solid rgba(99, 102, 241, 0.35)",
            borderRadius: "10px",
            padding: "10px 12px",
            color: "#a5b4fc",
            fontSize: "12.5px",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "all 0.2s ease",
          }}
          title="Bấm để mở danh sách toàn bộ link Quizlet các buổi"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Sparkles size={16} color="#818cf8" />
            <span>Kho Link Quizlet</span>
          </div>
          <span
            style={{
              background: "rgba(99, 102, 241, 0.25)",
              color: "#c7d2fe",
              fontSize: "10px",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            Tất cả buổi
          </span>
        </button>

        <button
          onClick={() => {
            onOpenFlashcards();
            onCloseMobile();
          }}
          style={{
            width: "100%",
            background:
              "linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(234, 88, 12, 0.12))",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            borderRadius: "10px",
            padding: "10px 12px",
            color: "#fbbf24",
            fontSize: "12.5px",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "all 0.2s ease",
          }}
          title="Ôn tập nhanh với Flashcards các bẫy TOEIC kinh điển"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Zap size={16} color="#f59e0b" />
            <span>Ôn Tập Flashcards</span>
          </div>
          <span
            style={{
              background: "rgba(245, 158, 11, 0.25)",
              color: "#fde68a",
              fontSize: "10px",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            10 Thẻ
          </span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="sidebar-search-box">
        <div className="search-input-wrapper">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm theo tên bài, mẹo..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="filter-chips">
          <button
            className={`chip-btn ${currentFilter === "all" ? "active" : ""}`}
            onClick={() => onFilterChange("all")}
          >
            Tất cả
          </button>
          <button
            className={`chip-btn ${currentFilter === "listening" ? "active" : ""}`}
            onClick={() => onFilterChange("listening")}
          >
            Listening
          </button>
          <button
            className={`chip-btn ${currentFilter === "reading" ? "active" : ""}`}
            onClick={() => onFilterChange("reading")}
          >
            Reading
          </button>
        </div>
      </div>

      {/* Lesson List */}
      <ul className="nav-list">
        {filteredLessons.map(({ lesson, originalIndex }) => {
          const isDone = completedList.includes(lesson.id);
          const isActive = originalIndex === currentIndex;

          const IconComponent =
            lesson.type === "listening"
              ? Headphones
              : lesson.type === "reading"
                ? BookOpen
                : Award;

          const titlePart = lesson.title.split(":")[1] || lesson.title;

          return (
            <li
              key={lesson.id}
              className={`nav-item ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}
              onClick={() => {
                onSelectLesson(originalIndex);
                onCloseMobile();
              }}
            >
              <div className="nav-item-left">
                <span className="nav-badge-icon">
                  <IconComponent size={15} />
                </span>
                <div className="nav-text-col">
                  <span className="nav-session-title">
                    {typeof lesson.sessionNum === "number"
                      ? `Buổi ${lesson.sessionNum}`
                      : "Đề Giữa Kỳ"}
                  </span>
                  <span className="nav-session-sub">{titlePart.trim()}</span>
                </div>
              </div>

              <span className="nav-status-icon">
                {isDone ? (
                  <CheckCircle2 size={16} color="var(--accent-emerald)" />
                ) : (
                  <Circle size={15} />
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
