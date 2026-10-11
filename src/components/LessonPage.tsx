import React, { useState } from "react";
import { Lesson } from "../types";
import {
  FolderOpen,
  Award,
  ExternalLink,
  BookOpen,
  Lightbulb,
  Clock,
  CheckSquare,
  ArrowLeft,
  ArrowRight,
  BookCheck,
  AlertTriangle,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";

interface LessonPageProps {
  lesson: Lesson;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
  onGoPrev: () => void;
  onGoNext: () => void;
  onOpenQuizlet: () => void;
}

const STORAGE_KEY_TASKS = "toeic_prep_completed_tasks";

export const LessonPage: React.FC<LessonPageProps> = ({
  lesson,
  prevLesson,
  nextLesson,
  onGoPrev,
  onGoNext,
  onOpenQuizlet,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "core" | "tips" | "hw">(
    "all",
  );
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(
    () => {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || "{}");
      } catch {
        return {};
      }
    },
  );

  const toggleTask = (taskId: string) => {
    setCheckedTasks((prev) => {
      const updated = {
        ...prev,
        [taskId]: !prev[taskId],
      };
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="page-content-wrapper">
      {/* Quick Global Links Strip */}
      <div className="quick-links-strip">
        <a
          href="https://drive.google.com/drive/folders/1YO0Zd4rwRlrbbLR3OIeROkAl8w6k5_-7?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="quick-link-pill"
        >
          <FolderOpen size={13} />
          <span>Drive Sách & Audio Lớp</span>
        </a>
        <a
          href="https://drive.google.com/drive/folders/1Ho_72oIdKIAmbuGgvOp69bo5sB-XMG9I?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="quick-link-pill"
        >
          <Award size={13} color="var(--accent-amber)" />
          <span>Drive Đề Thi Giữa Kỳ</span>
        </a>
        <a
          href="https://quizlet.com/133289919/600-tu-vung-toeic-flash-cards/?i=73nq5i&x=1jqt"
          target="_blank"
          rel="noopener noreferrer"
          className="quick-link-pill"
        >
          <Sparkles size={13} />
          <span>600 Từ Vựng TOEIC</span>
        </a>
        <a
          href="https://parroto.app/vi/exams/toeic"
          target="_blank"
          rel="noopener noreferrer"
          className="quick-link-pill"
        >
          <BookCheck size={13} />
          <span>Parroto Thi Thử</span>
        </a>
      </div>

      {/* Lesson Hero Banner */}
      <div className="lesson-hero">
        <div className="lesson-meta">
          <span
            className={`badge-tag ${
              lesson.type === "listening"
                ? "badge-listening"
                : lesson.type === "reading"
                  ? "badge-reading"
                  : "badge-midterm"
            }`}
          >
            {lesson.badge}
          </span>
        </div>
        <h1 className="lesson-title-main">{lesson.title}</h1>
        <p className="lesson-desc-sub">{lesson.desc}</p>
      </div>

      {/* Internal Sub-Tabs */}
      <div className="lesson-tabs">
        <button
          className={`lesson-tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          Tất cả nội dung
        </button>
        <button
          className={`lesson-tab-btn ${activeTab === "core" ? "active" : ""}`}
          onClick={() => setActiveTab("core")}
        >
          <BookOpen size={13} style={{ marginRight: "6px" }} />
          Cốt lõi
        </button>
        {lesson.tips && lesson.tips.length > 0 && (
          <button
            className={`lesson-tab-btn ${activeTab === "tips" ? "active" : ""}`}
            onClick={() => setActiveTab("tips")}
          >
            <Lightbulb size={13} style={{ marginRight: "6px" }} />
            Mẹo & Bẫy
          </button>
        )}
        <button
          className={`lesson-tab-btn ${activeTab === "hw" ? "active" : ""}`}
          onClick={() => setActiveTab("hw")}
        >
          <CheckSquare size={13} style={{ marginRight: "6px" }} />
          Bài tập & Deadline
        </button>
      </div>

      {/* Lesson Sections Container */}
      <div id="lessonContentSections">
        {/* Section 1: Core Knowledge */}
        {(activeTab === "all" || activeTab === "core") && (
          <div className="content-section">
            <h3 className="section-title core">
              <BookOpen size={16} />
              <span>Kiến Thức Trọng Tâm</span>
            </h3>

            {lesson.core.map((item, idx) => (
              <div key={idx} className="formula-card">
                <div style={{ fontWeight: 700, marginBottom: "4px" }}>
                  {item.title}
                </div>
                <div className="formula-code">{item.code}</div>
                <div className="formula-desc">{item.desc}</div>
              </div>
            ))}

            {lesson.grids && (
              <div className="card-grid" style={{ marginTop: "14px" }}>
                {lesson.grids.map((grid, gIdx) => (
                  <div key={gIdx} className="sub-card">
                    <div className="sub-card-title">{grid.title}</div>
                    <ul className="bullet-list">
                      {grid.items.map((it, iIdx) => (
                        <li key={iIdx}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section 2: Tips & Traps */}
        {(activeTab === "all" || activeTab === "tips") &&
          lesson.tips &&
          lesson.tips.length > 0 && (
            <div className="content-section">
              <h3 className="section-title tips">
                <Lightbulb size={16} />
                <span>Mẹo & Chiến Lược Làm Bài</span>
              </h3>

              {lesson.tips.map((tip, tIdx) => {
                const isTrap = tip.tag.includes("BẪY");
                return (
                  <div key={tIdx} className="callout">
                    <div className="callout-header">
                      {isTrap ? (
                        <AlertTriangle size={14} color="var(--accent-rose)" />
                      ) : (
                        <Sparkles size={14} color="var(--accent-emerald)" />
                      )}
                      <span className={isTrap ? "tag-wrong" : "tag-correct"}>
                        {tip.tag}
                      </span>
                    </div>
                    <div>{tip.text}</div>
                  </div>
                );
              })}
            </div>
          )}

        {/* Section 3: Homework & Deadlines */}
        {(activeTab === "all" || activeTab === "hw") && (
          <div className="content-section">
            <h3 className="section-title hw">
              <CheckSquare size={16} />
              <span>Bài Tập Về Nhà & Deadline</span>
            </h3>

            <div className="hw-deadline-badge">
              <Clock size={13} />
              <span>Hạn nộp: {lesson.homework.deadline}</span>
            </div>

            <ul className="hw-item-list">
              {lesson.homework.tasks.map((task, idx) => {
                const taskId = `${lesson.id}_${idx}`;
                const isChecked = !!checkedTasks[taskId];

                return (
                  <li
                    key={idx}
                    className="hw-item"
                    onClick={() => toggleTask(taskId)}
                    style={{ cursor: "pointer" }}
                  >
                    <input
                      type="checkbox"
                      className="hw-checkbox"
                      checked={isChecked}
                      onChange={() => toggleTask(taskId)}
                    />
                    <span
                      style={{
                        textDecoration: isChecked ? "line-through" : "none",
                        opacity: isChecked ? 0.6 : 1,
                        flex: 1,
                      }}
                    >
                      {task}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="hw-action-links">
              {lesson.homework.links.map((link, lIdx) => (
                <a
                  key={lIdx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn-link ${link.isQuizlet ? "quizlet" : ""}`}
                >
                  <LinkIcon size={13} />
                  <span>{link.name}</span>
                  <ExternalLink size={12} style={{ opacity: 0.7 }} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Big Bottom Navigation Buttons */}
      <div className="bottom-nav-row">
        <button
          className="bottom-nav-btn prev"
          disabled={!prevLesson}
          onClick={onGoPrev}
        >
          <span className="nav-dir-label">
            <ArrowLeft
              size={12}
              style={{ display: "inline", marginRight: "4px" }}
            />
            Buổi Trước
          </span>
          <span className="nav-dir-title">
            {prevLesson
              ? `${typeof prevLesson.sessionNum === "number" ? "Buổi " + prevLesson.sessionNum : "Đề Giữa Kỳ"}: ${(prevLesson.title.split(":")[1] || prevLesson.title).trim()}`
              : "Hết bài trước"}
          </span>
        </button>

        <button
          className="bottom-nav-btn next"
          disabled={!nextLesson}
          onClick={onGoNext}
        >
          <span className="nav-dir-label">
            Buổi Tiếp Theo
            <ArrowRight
              size={12}
              style={{ display: "inline", marginLeft: "4px" }}
            />
          </span>
          <span className="nav-dir-title">
            {nextLesson
              ? `${typeof nextLesson.sessionNum === "number" ? "Buổi " + nextLesson.sessionNum : "Đề Giữa Kỳ"}: ${(nextLesson.title.split(":")[1] || nextLesson.title).trim()}`
              : "Đã hết bài học"}
          </span>
        </button>
      </div>
    </div>
  );
};
