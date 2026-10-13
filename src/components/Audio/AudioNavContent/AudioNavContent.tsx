import React, { useState, useMemo } from "react";
import { AudioTrack } from "../../../data/audio";
import { Search, Play, Pause, Music, ClipboardList } from "lucide-react";
import "./AudioNavContent.css";

export interface AudioNavContentProps {
  tracks: AudioTrack[];
  currentTrack: AudioTrack;
  isPlaying: boolean;
  onSelectTrack: (track: AudioTrack) => void;
  onCloseMobile: () => void;
  onOpenReportList?: () => void;
}

export const AudioNavContent: React.FC<AudioNavContentProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onSelectTrack,
  onCloseMobile,
  onOpenReportList,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(""),
    [selectedUnit, setSelectedUnit] = useState<string>("all");

  // Units list for tabs
  const unitList = useMemo(() => {
    const units = new Set<number>();
    tracks.forEach((t) => {
      if (t.unit) units.add(t.unit);
    });
    return Array.from(units).sort((a, b) => a - b);
  }, [tracks]);

  // Filtered tracks
  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      if (selectedUnit !== "all") {
        if (selectedUnit === "other") {
          if (track.unit !== null && track.unit !== undefined) return false;
        } else {
          if (track.unit !== Number(selectedUnit)) return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = track.title.toLowerCase().includes(q);
        const matchFile = track.fileName.toLowerCase().includes(q);
        const matchKey = track.key.toLowerCase().includes(q);
        return matchTitle || matchFile || matchKey;
      }

      return true;
    });
  }, [tracks, selectedUnit, searchQuery]);

  return (
    <div className="audio-nav-content">
      {/* Search Input Box */}
      <div className="audio-sidebar-search">
        <Search size={14} className="search-icon" />
        <input
          type="text"
          placeholder="Tìm bài nghe (01_01, Unit 4)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="search-clear-btn"
            onClick={() => setSearchQuery("")}
          >
            ×
          </button>
        )}
      </div>

      {/* Unit Filter Select Dropdown */}
      <div className="audio-sidebar-unit-select-wrap">
        <select
          className="audio-sidebar-unit-select"
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
          aria-label="Lọc theo Unit bài học"
        >
          <option value="all">Tất cả Unit</option>
          {unitList.map((u) => (
            <option key={u} value={String(u)}>
              Unit {u}
            </option>
          ))}
          <option value="other">Bài tập khác</option>
        </select>
      </div>

      {/* Vertical Track List */}
      <div className="audio-sidebar-track-list">
        {filteredTracks.length === 0 ? (
          <div className="no-tracks-found">
            <Music size={26} color="var(--text-muted)" />
            <p>Không tìm thấy bài nghe phù hợp</p>
          </div>
        ) : (
          filteredTracks.map((track) => {
            const isCurrent = currentTrack.key === track.key;
            const isThisPlaying = isCurrent && isPlaying;

            return (
              <div
                key={track.key}
                onClick={() => {
                  onSelectTrack(track);
                  onCloseMobile();
                }}
                className={`audio-track-sidebar-item ${isCurrent ? "current" : ""} ${
                  isThisPlaying ? "playing" : ""
                }`}
              >
                <button
                  className="track-mini-play-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTrack(track);
                    onCloseMobile();
                  }}
                  title={isThisPlaying ? "Tạm dừng" : "Phát bài này"}
                >
                  {isThisPlaying ? (
                    <Pause size={13} />
                  ) : (
                    <Play size={13} style={{ marginLeft: "1px" }} />
                  )}
                </button>

                <div className="track-mini-meta">
                  <div className="track-mini-title-row">
                    <span className="track-mini-name">{track.title}</span>
                    {isThisPlaying && (
                      <span className="equalizer-bars">
                        <span />
                        <span />
                        <span />
                      </span>
                    )}
                  </div>
                  <div className="track-mini-sub">{track.fileName}</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer item: Danh sách report */}
      <div className="audio-sidebar-footer">
        <button
          type="button"
          className="audio-sidebar-report-btn"
          onClick={() => {
            if (onOpenReportList) onOpenReportList();
            onCloseMobile();
          }}
          title="Xem danh sách các bài bị report lỗi"
        >
          <ClipboardList size={16} className="report-btn-icon" />
          <span>Danh sách report</span>
        </button>
      </div>
    </div>
  );
};

export default AudioNavContent;
