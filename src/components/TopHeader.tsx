import React from "react";
import { Lesson } from "../types";
import { CheckCircle2, Circle, Menu } from "lucide-react";

interface TopHeaderProps {
  currentLesson: Lesson;
  isDone: boolean;
  onToggleDone: () => void;
  onOpenMobileMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentLesson,
  isDone,
  onToggleDone,
  onOpenMobileMenu,
}) => {
  const sessionName =
    typeof currentLesson.sessionNum === "number"
      ? `Buổi ${currentLesson.sessionNum} (${currentLesson.type === "listening" ? "Listening" : "Reading"})`
      : "Đề Giữa Kỳ";

  return (
    <header className="top-header">
      <div className="top-header-left">
        <button
          className="mobile-menu-btn"
          onClick={onOpenMobileMenu}
          title="Mở menu danh sách bài học"
        >
          <Menu size={20} />
        </button>

        <span className="page-indicator">{sessionName}</span>
      </div>

      <div className="top-header-right">
        <button
          className={`btn-action btn-done-toggle ${isDone ? "active" : ""}`}
          onClick={onToggleDone}
          title={isDone ? "Đã ôn xong bài này" : "Đánh dấu đã ôn"}
        >
          {isDone ? <CheckCircle2 size={16} /> : <Circle size={16} />}
          <span>{isDone ? "Đã ôn xong" : "Đánh dấu đã ôn"}</span>
        </button>
      </div>
    </header>
  );
};
