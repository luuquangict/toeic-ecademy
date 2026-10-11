import React from 'react';
import { Lesson } from '../types';
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
  X
} from 'lucide-react';

interface SidebarProps {
  lessons: Lesson[];
  currentIndex: number;
  completedList: string[];
  currentFilter: 'all' | 'listening' | 'reading';
  searchQuery: string;
  theme: 'dark' | 'light';
  isOpen: boolean;
  onSelectLesson: (index: number) => void;
  onFilterChange: (filter: 'all' | 'listening' | 'reading') => void;
  onSearchChange: (query: string) => void;
  onToggleTheme: () => void;
  onCloseMobile: () => void;
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
}) => {
  const completedCount = completedList.length;
  const totalCount = lessons.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  const filteredLessons = lessons.map((lesson, originalIndex) => ({ lesson, originalIndex })).filter(({ lesson }) => {
    const matchFilter = 
      currentFilter === 'all' || 
      lesson.type === currentFilter ||
      (currentFilter === 'listening' && lesson.type.includes('listening')) ||
      (currentFilter === 'reading' && lesson.type.includes('reading'));

    const q = searchQuery.toLowerCase();
    const matchSearch = 
      !searchQuery || 
      lesson.title.toLowerCase().includes(q) || 
      lesson.desc.toLowerCase().includes(q);

    return matchFilter && matchSearch;
  });

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-row">
          <div className="brand-title">
            <span className="brand-badge">
              <Target size={18} />
            </span>
            <span>TOEIC Prep Hub</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button 
              className="btn-action" 
              onClick={onToggleTheme} 
              title={theme === 'dark' ? 'Chuyển chế độ sáng' : 'Chuyển chế độ tối'}
              style={{ padding: '6px 8px' }}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
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
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
              {completedCount} / {totalCount} ({progressPct}%)
            </span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
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
            className={`chip-btn ${currentFilter === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('all')}
          >
            Tất cả
          </button>
          <button
            className={`chip-btn ${currentFilter === 'listening' ? 'active' : ''}`}
            onClick={() => onFilterChange('listening')}
          >
            Listening
          </button>
          <button
            className={`chip-btn ${currentFilter === 'reading' ? 'active' : ''}`}
            onClick={() => onFilterChange('reading')}
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
            lesson.type === 'listening' ? Headphones :
            lesson.type === 'reading' ? BookOpen : Award;

          const titlePart = lesson.title.split(':')[1] || lesson.title;

          return (
            <li
              key={lesson.id}
              className={`nav-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
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
                    {typeof lesson.sessionNum === 'number' ? `Buổi ${lesson.sessionNum}` : 'Đề Giữa Kỳ'}
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
