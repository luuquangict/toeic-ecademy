import React from "react";
import { BookOpen, Headphones, ArrowRight } from "lucide-react";
import { lessonsData } from "../../data/lessons";
import { audioTracks } from "../../data/audio";
import { AppLogo } from "../Layout/AppLogo";
import { TopHeader } from "../Layout/TopHeader";
import "./IndexPage.css";

export interface IndexPageProps {
  onNavigateLessons: () => void;
  onNavigateAudio: () => void;
  completedList: string[];
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export const IndexPage: React.FC<IndexPageProps> = ({
  onNavigateLessons,
  onNavigateAudio,
  completedList,
  theme,
  onToggleTheme,
}) => {
  const completedCount = completedList.length;
  const totalLessons = lessonsData.length;

  return (
    <div className="index-page-container">
      {/* Header chung đồng nhất toàn ứng dụng */}
      <TopHeader
        leftContent={<AppLogo />}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      <div className="index-page-inner">
        {/* Main Content: 2 Cards */}
        <main className="index-main-content">
          <div className="index-cards-grid">
            {/* Card 1: Lessons */}
            <div
              className="index-hub-card lessons-card"
              onClick={onNavigateLessons}
            >
              <div className="card-top-row">
                <div className="card-icon-wrap lessons-icon">
                  <BookOpen size={22} />
                </div>
                <div className="card-action-arrow">
                  <ArrowRight size={16} />
                </div>
              </div>

              <div className="card-info">
                <h2 className="card-title">Bài Học & Lý Thuyết</h2>
                <p className="card-desc">
                  Ngữ pháp, từ vựng và mẹo làm bài theo từng buổi.
                </p>
                <div className="card-meta">
                  <span className="card-badge lessons-badge">
                    {totalLessons} Buổi học
                  </span>
                  {completedCount > 0 && (
                    <span className="card-sub-meta">
                      Đã xong {completedCount}/{totalLessons}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Card 2: Audio Listening */}
            <div
              className="index-hub-card audio-card"
              onClick={onNavigateAudio}
            >
              <div className="card-top-row">
                <div className="card-icon-wrap audio-icon">
                  <Headphones size={22} />
                </div>
                <div className="card-action-arrow">
                  <ArrowRight size={16} />
                </div>
              </div>

              <div className="card-info">
                <h2 className="card-title">Sách TOEIC Preparation (Vol 1)</h2>
                <p className="card-desc">
                  Luyện nghe từng bài, hỗ trợ nghe lại từng câu và chỉnh tốc độ.
                </p>
                <div className="card-meta">
                  <span className="card-badge audio-badge">
                    {audioTracks.length} Audio Tracks
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default IndexPage;
