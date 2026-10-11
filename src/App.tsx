import { useState, useEffect } from 'react';
import { lessonsData, flashcardsData } from './data/lessons';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { LessonPage } from './components/LessonPage';
import { FlashcardModal } from './components/FlashcardModal';
import { QuizletModal } from './components/QuizletModal';
import { AudioPage } from './components/AudioPage';

const STORAGE_KEY_DONE = 'toeic_prep_completed_list';
const STORAGE_KEY_THEME = 'toeic_prep_theme';

export function App() {
  const [activePage, setActivePage] = useState<'lessons' | 'audio'>('lessons');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedList, setCompletedList] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_DONE) || '[]');
    } catch {
      return [];
    }
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem(STORAGE_KEY_THEME) as 'dark' | 'light') || 'dark';
  });

  const [currentFilter, setCurrentFilter] = useState<'all' | 'listening' | 'reading'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false);
  const [isQuizletOpen, setIsQuizletOpen] = useState(false);

  // Apply Theme
  useEffect(() => {
    if (theme === 'light') {
      document.body.setAttribute('data-theme', 'light');
    } else {
      document.body.removeAttribute('data-theme');
    }
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  // Sync Done list to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DONE, JSON.stringify(completedList));
  }, [completedList]);

  // Sync hash routing on load and hash change
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'audio') {
        setActivePage('audio');
      } else {
        setActivePage('lessons');
        if (hash) {
          const foundIdx = lessonsData.findIndex((l) => l.id === hash);
          if (foundIdx !== -1) {
            setCurrentIndex(foundIdx);
          }
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Update hash when index or activePage changes
  useEffect(() => {
    if (activePage === 'audio') {
      if (window.location.hash !== '#audio') {
        window.location.hash = 'audio';
      }
    } else {
      const current = lessonsData[currentIndex];
      if (current && window.location.hash !== `#${current.id}`) {
        window.location.hash = current.id;
      }
    }
  }, [currentIndex, activePage]);

  // Keyboard Navigation (Left / Right Arrow) - Only on lessons page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePage !== 'lessons') return;
      if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => Math.min(lessonsData.length - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePage]);

  const currentLesson = lessonsData[currentIndex];
  const prevLesson = currentIndex > 0 ? lessonsData[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessonsData.length - 1 ? lessonsData[currentIndex + 1] : null;
  const isDone = completedList.includes(currentLesson.id);

  const handleToggleDone = () => {
    setCompletedList((prev) =>
      prev.includes(currentLesson.id)
        ? prev.filter((id) => id !== currentLesson.id)
        : [...prev, currentLesson.id]
    );
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleGoToLessons = (lessonIndex?: number) => {
    if (typeof lessonIndex === 'number') {
      setCurrentIndex(lessonIndex);
    }
    setActivePage('lessons');
    const targetLesson = typeof lessonIndex === 'number' ? lessonsData[lessonIndex] : currentLesson;
    if (targetLesson) {
      window.location.hash = targetLesson.id;
    }
  };

  const handleGoToAudio = () => {
    setActivePage('audio');
    window.location.hash = 'audio';
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar
        lessons={lessonsData}
        currentIndex={currentIndex}
        completedList={completedList}
        currentFilter={currentFilter}
        searchQuery={searchQuery}
        theme={theme}
        isOpen={isSidebarOpen}
        activePage={activePage}
        onSelectLesson={(idx) => handleGoToLessons(idx)}
        onFilterChange={setCurrentFilter}
        onSearchChange={setSearchQuery}
        onToggleTheme={handleToggleTheme}
        onCloseMobile={() => setIsSidebarOpen(false)}
        onOpenQuizlet={() => setIsQuizletOpen(true)}
        onOpenFlashcards={() => setIsFlashcardOpen(true)}
        onNavigateAudio={handleGoToAudio}
      />

      {/* Mobile Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="main-area">
        {activePage === 'audio' ? (
          <AudioPage onBackToLessons={() => handleGoToLessons()} />
        ) : (
          <>
            <TopHeader
              currentLesson={currentLesson}
              isDone={isDone}
              onToggleDone={handleToggleDone}
              onOpenMobileMenu={() => setIsSidebarOpen(true)}
            />

            <LessonPage
              key={currentLesson.id}
              lesson={currentLesson}
              prevLesson={prevLesson}
              nextLesson={nextLesson}
              onGoPrev={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              onGoNext={() => setCurrentIndex((prev) => Math.min(lessonsData.length - 1, prev + 1))}
              onOpenQuizlet={() => setIsQuizletOpen(true)}
              onOpenAudioPage={handleGoToAudio}
            />
          </>
        )}
      </main>

      {/* Flashcard Quiz Modal */}
      <FlashcardModal
        cards={flashcardsData}
        isOpen={isFlashcardOpen}
        onClose={() => setIsFlashcardOpen(false)}
      />

      {/* Central Quizlet Hub Modal */}
      <QuizletModal
        isOpen={isQuizletOpen}
        onClose={() => setIsQuizletOpen(false)}
      />
    </div>
  );
}

export default App;
