// ==========================================================================
// TOEIC Audio A-B Loop - Audio Engine & Loop Controller
// ==========================================================================

window.ToeicAB = window.ToeicAB || {};

ToeicAB.Audio = {
  activeAudio: null,
  loopStart: 0,
  loopEnd: 0,
  currentPlaybackRate: 1.0,
  loopRafId: null,

  init() {
    this.startLoopEngine();
  },

  startLoopEngine() {
    const loopStep = () => {
      if (this.activeAudio && !this.activeAudio.paused) {
        const cur = this.activeAudio.currentTime;
        const d = this.activeAudio.duration || 100;
        const effectiveEnd = this.loopEnd > 0 ? this.loopEnd : d;

        // Tự động đồng bộ loopEnd nếu ban đầu duration chưa tải xong
        if (this.loopEnd === 0 && this.activeAudio.duration > 0) {
          this.loopEnd = this.activeAudio.duration;
          if (ToeicAB.Dock) ToeicAB.Dock.updateTrimmerPositions();
        }

        if (cur >= effectiveEnd || cur < this.loopStart) {
          this.activeAudio.currentTime = this.loopStart;
        }
        if (ToeicAB.Dock) {
          ToeicAB.Dock.updatePlaybackUI();
        }
      }
      this.loopRafId = requestAnimationFrame(loopStep);
    };
    this.loopRafId = requestAnimationFrame(loopStep);
  },

  findAndAttach() {
    if (this.activeAudio && document.contains(this.activeAudio)) {
      return this.activeAudio;
    }
    const mediaEls = Array.from(document.querySelectorAll('audio, video'));
    if (mediaEls.length === 0) return null;
    const playing = mediaEls.find((m) => !m.paused);
    const target = playing || mediaEls[0];
    this.attach(target);
    return target;
  },

  ensureAudio() {
    if (this.activeAudio && document.contains(this.activeAudio)) {
      return this.activeAudio;
    }
    return this.findAndAttach();
  },

  attach(audioEl) {
    if (!audioEl) return;
    if (this.activeAudio === audioEl) return;

    if (this.activeAudio) {
      this.activeAudio.removeEventListener('timeupdate', this.boundTimeUpdate);
      this.activeAudio.removeEventListener('seeked', this.boundTimeUpdate);
      this.activeAudio.removeEventListener('loadedmetadata', this.boundMetadata);
      this.activeAudio.removeEventListener('durationchange', this.boundMetadata);
      this.activeAudio.removeEventListener('canplay', this.boundMetadata);
      this.activeAudio.removeEventListener('canplaythrough', this.boundMetadata);
      this.activeAudio.removeEventListener('play', this.boundStateChange);
      this.activeAudio.removeEventListener('pause', this.boundStateChange);
    }

    this.activeAudio = audioEl;
    this.activeAudio.playbackRate = this.currentPlaybackRate;

    const srcKey = audioEl.currentSrc || audioEl.src || 'track-1';
    const bars = ToeicAB.generateWaveformBars(srcKey);

    this.loopStart = 0;
    this.loopEnd = audioEl.duration > 0 ? audioEl.duration : 0;

    if (ToeicAB.Dock) {
      ToeicAB.Dock.renderWaveform(bars);
      ToeicAB.Dock.updateStatus(audioEl.paused ? 'Đã kết nối' : 'Đang phát', 'active');
      ToeicAB.Dock.updatePlayButtonVisual();
    }

    this.boundTimeUpdate = () => {
      if (!this.activeAudio) return;
      if (this.loopEnd === 0 && this.activeAudio.duration > 0) {
        this.loopEnd = this.activeAudio.duration;
        if (ToeicAB.Dock) ToeicAB.Dock.updateTrimmerPositions();
      }
      if (ToeicAB.Dock) ToeicAB.Dock.updatePlaybackUI();
    };

    this.boundMetadata = () => {
      if (!this.activeAudio) return;
      if (this.loopEnd === 0 || this.loopEnd > this.activeAudio.duration) {
        this.loopEnd = this.activeAudio.duration || 0;
      }
      if (ToeicAB.Dock) ToeicAB.Dock.updateAllUI();
    };

    this.boundStateChange = () => {
      if (!this.activeAudio) return;
      const isPaused = this.activeAudio.paused;
      if (ToeicAB.Dock) {
        ToeicAB.Dock.updateStatus(isPaused ? 'Đã dừng' : 'Đang phát', isPaused ? 'searching' : 'active');
        ToeicAB.Dock.updatePlayButtonVisual();
      }
    };

    audioEl.addEventListener('timeupdate', this.boundTimeUpdate);
    audioEl.addEventListener('seeked', this.boundTimeUpdate);
    audioEl.addEventListener('loadedmetadata', this.boundMetadata);
    audioEl.addEventListener('durationchange', this.boundMetadata);
    audioEl.addEventListener('canplay', this.boundMetadata);
    audioEl.addEventListener('canplaythrough', this.boundMetadata);
    audioEl.addEventListener('play', this.boundStateChange);
    audioEl.addEventListener('pause', this.boundStateChange);

    if (ToeicAB.Dock) {
      ToeicAB.Dock.updateAllUI();
    }
  },

  togglePlayPause() {
    const audio = this.ensureAudio();
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch((err) => console.error('Play error:', err));
    } else {
      audio.pause();
    }
    if (ToeicAB.Dock) {
      ToeicAB.Dock.updatePlayButtonVisual();
    }
  },

  replayA() {
    const audio = this.ensureAudio();
    if (!audio) return;
    audio.currentTime = this.loopStart;
    audio.play().catch(() => {});
    if (ToeicAB.Dock) {
      ToeicAB.Dock.updatePlaybackUI();
    }
  },

  setA() {
    const audio = this.ensureAudio();
    if (!audio) return;
    const d = audio.duration || 100;
    const curEnd = this.loopEnd > 0 ? this.loopEnd : d;
    const newA = Math.min(audio.currentTime, Math.max(0, curEnd - 0.5));
    this.loopStart = newA;
    if (newA >= this.loopEnd || this.loopEnd === 0) {
      this.loopEnd = Math.min(d, newA + 5);
    }
    if (ToeicAB.Dock) {
      ToeicAB.Dock.updateTrimmerPositions();
    }
  },

  setB() {
    const audio = this.ensureAudio();
    if (!audio) return;
    const d = audio.duration || 100;
    const newB = Math.max(audio.currentTime, 0.5);
    this.loopEnd = Math.min(d, newB);
    if (this.loopEnd <= this.loopStart) {
      this.loopStart = Math.max(0, this.loopEnd - 5);
    }
    if (ToeicAB.Dock) {
      ToeicAB.Dock.updateTrimmerPositions();
    }
  },

  resetAB() {
    const audio = this.ensureAudio();
    if (!audio) return;
    this.loopStart = 0;
    this.loopEnd = audio.duration || 100;
    if (ToeicAB.Dock) {
      ToeicAB.Dock.updateTrimmerPositions();
    }
  },

  extendPointB(sec = 5) {
    const audio = this.ensureAudio();
    if (!audio) return;
    const duration = audio.duration || 100;
    const curEnd = this.loopEnd > 0 ? this.loopEnd : Math.max(audio.currentTime, this.loopStart);
    this.loopEnd = Math.min(duration, curEnd + sec);
    if (this.loopEnd <= this.loopStart) {
      this.loopEnd = Math.min(duration, this.loopStart + 1);
    }
    if (ToeicAB.Dock) {
      ToeicAB.Dock.updateTrimmerPositions();
    }
  },

  skipSeconds(sec) {
    const audio = this.ensureAudio();
    if (!audio) return;
    const duration = audio.duration || 100;
    const newTime = Math.max(0, Math.min(duration, (audio.currentTime || 0) + sec));
    audio.currentTime = newTime;
    if (ToeicAB.Dock) {
      ToeicAB.Dock.updatePlaybackUI();
    }
  },

  nextSection() {
    const audio = this.ensureAudio();
    if (!audio) return;
    const duration = audio.duration || 100;
    const effectiveEnd = this.loopEnd > 0 ? this.loopEnd : duration;

    // A về tọa độ của B, B về End của audio
    this.loopStart = Math.min(duration, Math.max(0, effectiveEnd));
    this.loopEnd = duration;

    audio.currentTime = this.loopStart;
    audio.play().catch(() => {});

    if (ToeicAB.Dock) {
      ToeicAB.Dock.updateTrimmerPositions();
      ToeicAB.Dock.updatePlaybackUI();
    }
  },

  setPlaybackRate(speed) {
    this.currentPlaybackRate = speed;
    if (this.activeAudio) {
      this.activeAudio.playbackRate = speed;
    }
  },

  seek(time) {
    const audio = this.ensureAudio();
    if (!audio) return;
    audio.currentTime = time;
    if (ToeicAB.Dock) {
      ToeicAB.Dock.updatePlaybackUI();
    }
  },

  setLoopStartFromDrag(time) {
    const audio = this.ensureAudio();
    if (!audio) return;
    const d = audio.duration || 100;
    const curEnd = this.loopEnd > 0 ? this.loopEnd : d;
    this.loopStart = Math.min(time, Math.max(0, curEnd - 0.5));
    if (ToeicAB.Dock) {
      ToeicAB.Dock.updateTrimmerPositions();
    }
  },

  setLoopEndFromDrag(time) {
    const audio = this.ensureAudio();
    if (!audio) return;
    const d = audio.duration || 100;
    this.loopEnd = Math.max(time, Math.min(d, this.loopStart + 0.5));
    if (ToeicAB.Dock) {
      ToeicAB.Dock.updateTrimmerPositions();
    }
  },
};

ToeicAB.Audio.init();
