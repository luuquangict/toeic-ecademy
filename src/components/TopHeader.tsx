import React from 'react';
import { Lesson } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Zap, 
  Menu,
  Sparkles 
} from 'lucide-react';

interface TopHeaderProps {
  currentLesson: Lesson;
  currentIndex: number;
  totalLessons: number;
  isDone: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleDone: () => void;
  onOpenFlashcards: () => void;
  onOpenQuizlet: () => void;
  onOpenMobileMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentLesson,
  currentIndex,
  totalLessons,
  isDone,
  onPrev,
  onNext,
  onToggleDone,
  onOpenFlashcards,
  onOpenQuizlet,
  onOpenMobileMenu,
}) => {
  return (
    <header className="top-header">
      <div className="top-header-left">
        <button 
          className="mobile-menu-btn" 
          onClick={onOpenMobileMenu}
          title="Mở menu bài học"
        >
          <Menu size={20} />
        </button>

        <button 
          className="nav-btn" 
          onClick={onPrev} 
          disabled={currentIndex === 0}
          title="Bài trước (hoặc phím mũi tên trái ←)"
        >
          <ChevronLeft size={16} />
          <span>Trước</span>
        </button>

        <span className="page-indicator">
          {typeof currentLesson.sessionNum === 'number' 
            ? `Buổi ${currentLesson.sessionNum}` 
            : 'Đề Giữa Kỳ'}
          <span style={{ opacity: 0.6, marginLeft: '6px' }}>({currentIndex + 1}/{totalLessons})</span>
        </span>

        <button 
          className="nav-btn" 
          onClick={onNext} 
          disabled={currentIndex === totalLessons - 1}
          title="Bài kế tiếp (hoặc phím mũi tên phải →)"
        >
          <span>Tiếp</span>
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="top-header-right">
        <button 
          className="btn-action" 
          onClick={onOpenQuizlet}
          title="Mở tổng hợp tất cả link Quizlet toàn khóa"
          style={{ 
            borderColor: 'rgba(99, 102, 241, 0.4)', 
            background: 'rgba(99, 102, 241, 0.1)', 
            color: '#818cf8' 
          }}
        >
          <Sparkles size={14} />
          <span>Kho Quizlet</span>
        </button>

        <button 
          className={`btn-action btn-done-toggle ${isDone ? 'active' : ''}`}
          onClick={onToggleDone}
        >
          {isDone ? <CheckCircle2 size={16} /> : <Circle size={16} />}
          <span>{isDone ? 'Đã ôn xong' : 'Đánh dấu đã ôn'}</span>
        </button>

        <button 
          className="btn-action" 
          onClick={onOpenFlashcards}
          title="Ôn tập nhanh với Flashcards"
        >
          <Zap size={14} color="var(--accent-amber)" />
          <span>Flashcards</span>
        </button>
      </div>
    </header>
  );
};
