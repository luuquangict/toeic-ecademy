import React, { useState, useRef, useEffect, useMemo } from "react";
import { audioTracks, AudioTrack } from "../../../data/audio";
import {
  Headphones,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Repeat,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Sparkles,
  Flag,
} from "lucide-react";
import {
  getAudioScriptByKey,
  ScriptSentence,
} from "../../../data/audioScripts";
import { Sidebar } from "../../Layout/Sidebar";
import { AudioNavContent } from "../AudioNavContent";
import { TopHeader } from "../../Layout/TopHeader";
import { ReportModal, ReportListModal } from "../Report";
import "./AudioPage.css";

interface AudioPageProps {
  onBackHome?: () => void;
  theme?: "dark" | "light";
  onToggleTheme?: () => void;
}

const SPEED_OPTIONS = [0.8, 1.0, 1.2, 1.5];

export const AudioPage: React.FC<AudioPageProps> = ({
  onBackHome,
  theme,
  onToggleTheme,
}) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack>(
    () => audioTracks[0],
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isLoop, setIsLoop] = useState<boolean>(false);
  const [isAutoNext, setIsAutoNext] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // A-B Repeat States (Trimmer Selection Mode)
  const [isABRepeat, setIsABRepeat] = useState<boolean>(true);
  const [loopStart, setLoopStart] = useState<number>(0);
  const [loopEnd, setLoopEnd] = useState<number>(0);

  // Script & Shadowing States
  const [scriptMode, setScriptMode] = useState<"full" | "hidden">("full");
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());

  // Mobile Drawer state
  const [isMobileTracksOpen, setIsMobileTracksOpen] = useState<boolean>(false);

  // Report Modals States
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isReportListModalOpen, setIsReportListModalOpen] =
    useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const cur = audio.currentTime;
      setCurrentTime(cur);

      // Check A-B Repeat condition
      if (isABRepeat) {
        const effectiveEnd = loopEnd > 0 ? loopEnd : audio.duration;
        if (effectiveEnd > loopStart) {
          if (cur >= effectiveEnd || cur < loopStart) {
            audio.currentTime = loopStart;
            setCurrentTime(loopStart);
          }
        }
      }
    };

    const handleLoadedMetadata = () => {
      const d = audio.duration || 0;
      setDuration(d);
      setLoopEnd((prev) => (prev === 0 || prev > d ? d : prev));
    };

    const handleEnded = () => {
      if (isABRepeat) {
        audio.currentTime = loopStart;
        setCurrentTime(loopStart);
        audio.play().catch(() => {});
      } else if (isLoop) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (isAutoNext) {
        handleNextTrack();
      } else {
        setIsPlaying(false);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [currentTrack, isLoop, isAutoNext, isABRepeat, loopStart, loopEnd]);

  // Play / Pause toggle
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.error("Playback failed:", err);
      });
    }
  };

  // Play a specific track
  const playTrack = (track: AudioTrack) => {
    if (currentTrack.key === track.key) {
      togglePlay();
      setIsMobileTracksOpen(false);
      return;
    }

    setCurrentTrack(track);
    setCurrentTime(0);
    setLoopStart(0);
    setLoopEnd(0);
    setRevealedIds(new Set());
    setIsMobileTracksOpen(false);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.playbackRate = playbackRate;
        audioRef.current.play().catch((err) => {
          console.error("Auto playback failed:", err);
        });
      }
    }, 50);
  };

  // Current track script
  const currentScript = useMemo(
    () => getAudioScriptByKey(currentTrack.key),
    [currentTrack.key],
  );

  // Click a sentence to auto-loop A-B and play
  const handleSentenceClick = (sentence: ScriptSentence) => {
    setLoopStart(sentence.start);
    setLoopEnd(sentence.end);
    setIsABRepeat(true);

    if (audioRef.current) {
      audioRef.current.currentTime = sentence.start;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
    setCurrentTime(sentence.start);
  };

  // Toggle reveal sentence in hidden mode
  const toggleRevealSentence = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Generate realistic speech waveform peaks for current track
  const waveformBars = useMemo(() => {
    let seed = 0;
    for (let i = 0; i < currentTrack.key.length; i++) {
      seed = (seed * 31 + currentTrack.key.charCodeAt(i)) % 100000;
    }
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    // Mật độ 200 thanh để dày đặc và mịn
    const count = 200;
    const bars: number[] = [];
    for (let i = 0; i < count; i++) {
      const envelope = Math.sin((i / count) * Math.PI);
      const wave1 = Math.sin(i * 0.22) * 0.25 + 0.5;
      const wave2 = Math.cos(i * 0.55) * 0.2;
      const noise = random() * 0.35;
      const pause = i % 22 === 0 || i % 38 === 0 ? 0.2 : 1;
      const height = Math.max(
        14,
        Math.min(96, (wave1 + wave2 + noise) * envelope * pause * 90 + 16),
      );
      bars.push(height);
    }
    return bars;
  }, [currentTrack.key]);

  const timelineRef = useRef<HTMLDivElement | null>(null);

  const getTimeFromClientX = (clientX: number) => {
    if (!timelineRef.current || duration <= 0) return 0;
    const rect = timelineRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return ratio * duration;
  };

  const handleTimelineMouseDown = (
    e: React.MouseEvent,
    type: "start" | "end" | "seek",
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const clickedTime = getTimeFromClientX(e.clientX);
    if (type === "seek") {
      if (audioRef.current) {
        audioRef.current.currentTime = clickedTime;
        setCurrentTime(clickedTime);
      }
    }

    const onMouseMove = (moveEvent: MouseEvent) => {
      const time = getTimeFromClientX(moveEvent.clientX);
      const d = duration || 100;
      if (type === "start") {
        const curEnd = loopEnd > 0 ? loopEnd : d;
        const newStart = Math.min(time, Math.max(0, curEnd - 0.5));
        setLoopStart(newStart);
        if (isABRepeat && audioRef.current && currentTime < newStart) {
          audioRef.current.currentTime = newStart;
          setCurrentTime(newStart);
        }
      } else if (type === "end") {
        const newEnd = Math.max(time, Math.min(d, loopStart + 0.5));
        setLoopEnd(newEnd);
        if (isABRepeat && audioRef.current && currentTime >= newEnd) {
          audioRef.current.currentTime = loopStart;
          setCurrentTime(loopStart);
        }
      } else if (type === "seek") {
        if (audioRef.current) {
          audioRef.current.currentTime = time;
          setCurrentTime(time);
        }
      }
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleTimelineTouchStart = (
    e: React.TouchEvent,
    type: "start" | "end" | "seek",
  ) => {
    e.stopPropagation();
    const touch = e.touches[0];
    const touchedTime = getTimeFromClientX(touch.clientX);

    if (type === "seek") {
      if (audioRef.current) {
        audioRef.current.currentTime = touchedTime;
        setCurrentTime(touchedTime);
      }
    }

    const onTouchMove = (moveEvent: TouchEvent) => {
      const moveTouch = moveEvent.touches[0];
      const time = getTimeFromClientX(moveTouch.clientX);
      const d = duration || 100;
      if (type === "start") {
        const curEnd = loopEnd > 0 ? loopEnd : d;
        const newStart = Math.min(time, Math.max(0, curEnd - 0.5));
        setLoopStart(newStart);
      } else if (type === "end") {
        const newEnd = Math.max(time, Math.min(d, loopStart + 0.5));
        setLoopEnd(newEnd);
      } else if (type === "seek") {
        if (audioRef.current) {
          audioRef.current.currentTime = time;
          setCurrentTime(time);
        }
      }
    };

    const onTouchEnd = () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };

    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
  };

  const effectiveEnd = loopEnd > 0 ? loopEnd : duration || 100;
  const startPercent = duration > 0 ? (loopStart / duration) * 100 : 0;
  const endPercent = duration > 0 ? (effectiveEnd / duration) * 100 : 100;
  const widthPercent = Math.max(0, endPercent - startPercent);
  const playheadPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // A-B Repeat Quick Handlers
  const handleSetA = () => {
    const d = duration || 100;
    const newA = Math.min(currentTime, Math.max(0, d - 0.5));
    setLoopStart(newA);
    if (newA >= loopEnd || loopEnd === 0) {
      setLoopEnd(Math.min(d, newA + 5));
    }
    setIsABRepeat(true);
  };

  const handleSetB = () => {
    const d = duration || 100;
    const newB = Math.max(currentTime, 0.5);
    setLoopEnd(newB);
    if (newB <= loopStart) {
      setLoopStart(Math.max(0, newB - 5));
    }
    setIsABRepeat(true);
  };

  const handleResetAB = () => {
    setLoopStart(0);
    setLoopEnd(duration || 100);
    setIsABRepeat(false);
  };

  // Replay immediately starting from [A]
  const handleReplayFromA = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = loopStart;
      setCurrentTime(loopStart);
      audioRef.current.play().catch((err) => {
        console.error("Play from A failed:", err);
      });
      setIsPlaying(true);
    }
  };

  // Next / Prev track
  const handleNextTrack = () => {
    const currentIndex = audioTracks.findIndex(
      (t) => t.key === currentTrack.key,
    );
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % audioTracks.length;
    playTrack(audioTracks[nextIndex]);
  };

  const handlePrevTrack = () => {
    const currentIndex = audioTracks.findIndex(
      (t) => t.key === currentTrack.key,
    );
    if (currentIndex === -1) return;
    const prevIndex =
      (currentIndex - 1 + audioTracks.length) % audioTracks.length;
    playTrack(audioTracks[prevIndex]);
  };

  // Skip +/- 5s
  const skipSeconds = (sec: number) => {
    if (!audioRef.current) return;
    const newTime = Math.max(
      0,
      Math.min(duration, audioRef.current.currentTime + sec),
    );
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Speed change
  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // Time format mm:ss
  const formatTime = (timeInSec: number) => {
    if (isNaN(timeInSec) || timeInSec < 0) return "00:00";
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Keyboard Shortcuts (Space: Play/Pause, ArrowLeft: -5s, ArrowRight: +5s)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement &&
        (document.activeElement.tagName === "INPUT" ||
          document.activeElement.tagName === "TEXTAREA")
      )
        return;

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        skipSeconds(-5);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        skipSeconds(5);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, duration]);

  return (
    <div className="app-layout">
      {/* Hidden Native Audio Element */}
      <audio ref={audioRef} src={currentTrack.url} preload="metadata" />

      {/* Nav bar (Sidebar) component với danh sách bài Audio */}
      <Sidebar
        isOpen={isMobileTracksOpen}
        onCloseMobile={() => setIsMobileTracksOpen(false)}
        onGoHome={onBackHome}
      >
        <AudioNavContent
          tracks={audioTracks}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onSelectTrack={(track) => playTrack(track)}
          onCloseMobile={() => setIsMobileTracksOpen(false)}
          onOpenReportList={() => setIsReportListModalOpen(true)}
        />
      </Sidebar>

      {/* Main Content Area */}
      <main className="main-area">
        <TopHeader
          title="Sách TOEIC Preparation (Vol 1)"
          onOpenMobileMenu={() => setIsMobileTracksOpen(true)}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />

        <div className="audio-player-page-content">
          {/* Main Player Card */}
          <div className="player-card">
            {/* Top row: Track Info & Wave indicator */}
            <div className="player-track-info">
              <div className={`player-disc-icon ${isPlaying ? "playing" : ""}`}>
                <Headphones size={22} color="var(--accent-cyan)" />
              </div>
              <div className="player-text-details">
                <div className="player-track-tag">
                  {currentTrack.unit ? `UNIT ${currentTrack.unit}` : "BÀI TẬP"}
                  {currentTrack.track ? ` • TRACK ${currentTrack.track}` : ""}
                </div>
                <div className="player-track-title">{currentTrack.title}</div>
                <div className="player-track-filename">
                  {currentTrack.fileName}
                </div>
              </div>

              <div className="player-status-badge">
                {isPlaying ? (
                  <span className="badge-playing">
                    <span className="dot pulse" /> Đang phát
                  </span>
                ) : (
                  <span className="badge-paused">Đã dừng</span>
                )}
              </div>
            </div>

            {/* Audio Waveform Video-Trimmer Track */}
            <div className="waveform-trimmer-section">
              <div className="trimmer-ruler-header">
                <span className="ruler-label start">
                  {formatTime(currentTime)}
                </span>
                <span className="ruler-label end">{formatTime(duration)}</span>
              </div>

              <div
                className={`trimmer-viewport ${isABRepeat ? "loop-active" : ""}`}
                ref={timelineRef}
                onMouseDown={(e) => handleTimelineMouseDown(e, "seek")}
                onTouchStart={(e) => handleTimelineTouchStart(e, "seek")}
              >
                {/* Internal Track Surface (bo góc tròn 9px để clip toàn bộ panel con không bị đè góc ra ngoài) */}
                <div className="trimmer-track-surface">
                  {/* Audio Waveform Bars */}
                  <div className="trimmer-waveform-bars">
                    {waveformBars.map((height, i) => {
                      const barRatio = i / waveformBars.length;
                      const barTime = barRatio * (duration || 100);
                      const isInside = isABRepeat
                        ? barTime >= loopStart && barTime <= effectiveEnd
                        : true;
                      const isPassed = barTime <= currentTime;

                      return (
                        <span
                          key={i}
                          className={`wave-bar ${isInside ? "inside" : "dimmed"} ${isPassed ? "passed" : ""}`}
                          style={{ height: `${height}%` }}
                        />
                      );
                    })}
                  </div>

                  {/* Dimmed Left Overlay (vùng không chọn trước A) */}
                  {duration > 0 && loopStart > 0 && (
                    <div
                      className="trimmer-dim-shade left"
                      style={{ width: `${startPercent}%` }}
                    />
                  )}

                  {/* Dimmed Right Overlay (vùng không chọn sau B) */}
                  {duration > 0 && endPercent < 100 && (
                    <div
                      className="trimmer-dim-shade right"
                      style={{
                        left: `${endPercent}%`,
                        width: `${Math.max(0, 100 - endPercent)}%`,
                      }}
                    />
                  )}

                  {/* Active Selection Box (Khung sáng giữa A và B) */}
                  {duration > 0 && (
                    <div
                      className="trimmer-selection-window"
                      style={{
                        left: `${startPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    >
                      <div className="trimmer-edge-border top" />
                      <div className="trimmer-edge-border bottom" />
                    </div>
                  )}
                </div>

                {/* Left Vertical Trimmer Handle [A] (mỏng như thanh kim) */}
                {duration > 0 && (
                  <div
                    className="trimmer-vertical-handle handle-start"
                    style={{ left: `${startPercent}%` }}
                    onMouseDown={(e) => handleTimelineMouseDown(e, "start")}
                    onTouchStart={(e) => handleTimelineTouchStart(e, "start")}
                    title={`Kéo thanh dọc để chỉnh Điểm bắt đầu [A]: ${formatTime(loopStart)}`}
                  >
                    <div className="handle-flag">A</div>
                    <div className="handle-time-pill">
                      {formatTime(loopStart)}
                    </div>
                  </div>
                )}

                {/* Right Vertical Trimmer Handle [B] (mỏng như thanh kim) */}
                {duration > 0 && (
                  <div
                    className="trimmer-vertical-handle handle-end"
                    style={{ left: `${endPercent}%` }}
                    onMouseDown={(e) => handleTimelineMouseDown(e, "end")}
                    onTouchStart={(e) => handleTimelineTouchStart(e, "end")}
                    title={`Kéo thanh dọc để chỉnh Điểm kết thúc [B]: ${formatTime(effectiveEnd)}`}
                  >
                    <div className="handle-flag">B</div>
                    <div className="handle-time-pill">
                      {formatTime(effectiveEnd)}
                    </div>
                  </div>
                )}

                {/* Playhead Needle (Kim thời gian chạy trên sóng âm) */}
                <div
                  className="trimmer-playhead-needle"
                  style={{ left: `${playheadPercent}%` }}
                >
                  <div className="playhead-cap" />
                  <div className="playhead-line" />
                </div>
              </div>
            </div>

            {/* Trimmer Control Toolbar */}
            <div className="trimmer-toolbar-row">
              <label
                className="trimmer-repeat-toggle"
                title="Tích để lặp lại đúng phân đoạn được bôi chọn"
              >
                <input
                  type="checkbox"
                  checked={isABRepeat}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsABRepeat(checked);
                    if (checked) {
                      if (loopEnd === 0 || loopEnd <= loopStart) {
                        setLoopEnd(duration || 100);
                      }
                      if (
                        audioRef.current &&
                        (currentTime < loopStart ||
                          currentTime >= (loopEnd || duration))
                      ) {
                        audioRef.current.currentTime = loopStart;
                        setCurrentTime(loopStart);
                      }
                    }
                  }}
                />
                <span className="toggle-switch-visual" />
                <span className="toggle-label-text">
                  <strong>Lặp lại đoạn đã chọn</strong>
                </span>
              </label>

              <div className="trimmer-action-buttons">
                <button
                  type="button"
                  onClick={handleReplayFromA}
                  className="trimmer-btn replay-a"
                  title="Phát lại ngay lập tức bắt đầu từ mốc [A]"
                >
                  <RotateCcw size={12} /> Phát lại từ [A]
                </button>
                <button
                  type="button"
                  onClick={handleSetA}
                  className="trimmer-btn"
                  title="Đặt thanh dọc [A] tại giây đang nghe"
                >
                  📍 Đặt [A] ({formatTime(currentTime)})
                </button>
                <button
                  type="button"
                  onClick={handleSetB}
                  className="trimmer-btn"
                  title="Đặt thanh dọc [B] tại giây đang nghe"
                >
                  🏁 Đặt [B] ({formatTime(currentTime)})
                </button>
                <button
                  type="button"
                  onClick={handleResetAB}
                  className="trimmer-btn reset"
                  title="Đặt lại toàn bài"
                >
                  Reset toàn bài
                </button>
              </div>
            </div>

            {/* Central Controls */}
            <div className="player-controls-row">
              {/* Speed selection */}
              <div className="speed-pills-group">
                {SPEED_OPTIONS.map((spd) => (
                  <button
                    key={spd}
                    onClick={() => handleSpeedChange(spd)}
                    className={`speed-pill ${playbackRate === spd ? "active" : ""}`}
                    title={`Tốc độ phát ${spd}x`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Playback action buttons */}
              <div className="playback-actions">
                <button
                  onClick={handlePrevTrack}
                  className="control-icon-btn"
                  title="Bài trước đó"
                >
                  <SkipBack size={19} />
                </button>

                <button
                  onClick={() => skipSeconds(-5)}
                  className="control-icon-btn small"
                  title="Tua lùi 5 giây (Mũi tên Trái)"
                >
                  <span style={{ fontSize: "11px", fontWeight: 700 }}>-5s</span>
                </button>

                <button
                  onClick={togglePlay}
                  className="play-main-btn"
                  title={
                    isPlaying ? "Tạm dừng (Phím Cách)" : "Phát (Phím Cách)"
                  }
                >
                  {isPlaying ? (
                    <Pause size={24} />
                  ) : (
                    <Play size={24} style={{ marginLeft: "2px" }} />
                  )}
                </button>

                <button
                  onClick={() => skipSeconds(5)}
                  className="control-icon-btn small"
                  title="Tua tới 5 giây (Mũi tên Phải)"
                >
                  <span style={{ fontSize: "11px", fontWeight: 700 }}>+5s</span>
                </button>

                <button
                  onClick={handleNextTrack}
                  className="control-icon-btn"
                  title="Bài tiếp theo"
                >
                  <SkipForward size={19} />
                </button>
              </div>

              {/* Additional settings: Repeat, Auto Next, Volume */}
              <div className="player-extra-controls">
                <button
                  onClick={() => setIsLoop(!isLoop)}
                  className={`control-toggle-btn ${isLoop ? "active" : ""}`}
                  title={
                    isLoop ? "Đang bật lặp lại bài này" : "Bật lặp lại 1 bài"
                  }
                >
                  <Repeat size={16} />
                </button>

                <button
                  onClick={() => setIsAutoNext(!isAutoNext)}
                  className={`control-toggle-btn ${isAutoNext ? "active" : ""}`}
                  title={
                    isAutoNext
                      ? "Tự chuyển bài tiếp theo: BẬT"
                      : "Tự chuyển bài tiếp theo: TẮT"
                  }
                >
                  <RotateCcw size={15} />
                  <span style={{ fontSize: "11px", fontWeight: 600 }}>
                    Tự next
                  </span>
                </button>

                <div className="volume-control-wrap">
                  <button
                    onClick={toggleMute}
                    className="control-icon-btn small"
                    title={isMuted ? "Bật âm thanh" : "Tắt tiếng"}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX size={16} />
                    ) : (
                      <Volume2 size={16} />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                    aria-label="Âm lượng"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Script & Practice Section */}
          <section className="audio-script-section">
            <div className="audio-script-header">
              <div className="audio-script-title-group">
                <div className="audio-script-title">
                  <FileText size={18} className="script-title-icon" />
                  <h3>Kịch bản bài nghe (Audio Script)</h3>
                </div>
                {currentScript && (
                  <div className="audio-script-badges">
                    <span className="script-part-badge">
                      {currentScript.partTitle}
                    </span>
                    {currentScript.topic && (
                      <span className="script-topic-badge">
                        {currentScript.topic}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Mode switch & Report button */}
              {currentScript && (
                <div className="script-header-actions-group">
                  <div className="script-mode-toggle-group">
                    <button
                      type="button"
                      className={`script-mode-btn ${scriptMode === "full" ? "active" : ""}`}
                      onClick={() => setScriptMode("full")}
                      title="Hiện toàn bộ câu và chữ"
                    >
                      <Eye size={14} />
                      <span>Hiện đầy đủ</span>
                    </button>
                    <button
                      type="button"
                      className={`script-mode-btn ${scriptMode === "hidden" ? "active" : ""}`}
                      onClick={() => setScriptMode("hidden")}
                      title="Chỉ hiện nhãn (A, B, C...) để tự luyện nghe"
                    >
                      <EyeOff size={14} />
                      <span>Ẩn nội dung</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="script-report-trigger-btn"
                    onClick={() => setIsReportModalOpen(true)}
                    title="Báo cáo lỗi kịch bản hoặc lệch thời gian"
                  >
                    <Flag size={13} />
                    <span>Report</span>
                  </button>
                </div>
              )}
            </div>

            {currentScript ? (
              <div className="audio-script-list">
                <div className="script-hint-banner">
                  💡 <em>Mẹo:</em> Bấm vào từng dòng để tự động khoanh vùng
                  [A-B] và lặp lại câu đó.
                </div>

                {currentScript.sentences.map((sentence) => {
                  const isActive =
                    currentTime >= sentence.start &&
                    currentTime <= sentence.end;
                  const isRevealed =
                    scriptMode === "full" || revealedIds.has(sentence.id);

                  return (
                    <div
                      key={sentence.id}
                      className={`script-line-item ${isActive ? "active" : ""}`}
                      onClick={() => handleSentenceClick(sentence)}
                      title={`Bấm để khoanh vùng A-B [${formatTime(sentence.start)} - ${formatTime(sentence.end)}] và lặp câu này`}
                    >
                      <div className="script-line-left">
                        <span
                          className={`script-label-badge label-${sentence.label.toLowerCase()}`}
                        >
                          {sentence.label}
                        </span>
                        <div className="script-text-container">
                          {isRevealed ? (
                            <span className="script-text">{sentence.text}</span>
                          ) : (
                            <span className="script-text-hidden">
                              ••••••••••••••••••••••••
                            </span>
                          )}
                        </div>
                      </div>

                      {scriptMode === "hidden" && (
                        <div className="script-line-right">
                          <button
                            type="button"
                            className="reveal-toggle-btn"
                            onClick={(e) =>
                              toggleRevealSentence(sentence.id, e)
                            }
                            title={isRevealed ? "Ẩn câu này" : "Xem câu này"}
                          >
                            {isRevealed ? (
                              <EyeOff size={14} />
                            ) : (
                              <Eye size={14} />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="script-empty-state">
                <Sparkles size={22} className="empty-icon" />
                <p>Chưa có kịch bản mẫu cho track này.</p>
                <span>
                  (Kịch bản mẫu hiện hỗ trợ Track 01 của Unit 1 đến 12)
                </span>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Report Modal (Báo lỗi cho bài hiện tại) */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        trackKey={currentTrack.key}
        trackTitle={currentTrack.title}
      />

      {/* Report List Modal (Danh sách bài bị report) */}
      <ReportListModal
        isOpen={isReportListModalOpen}
        onClose={() => setIsReportListModalOpen(false)}
        onSelectTrackByKey={(trackKey) => {
          const targetTrack = audioTracks.find((t) => t.key === trackKey);
          if (targetTrack) {
            playTrack(targetTrack);
          }
        }}
      />
    </div>
  );
};

export default AudioPage;
