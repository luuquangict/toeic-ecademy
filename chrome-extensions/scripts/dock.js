// ==========================================================================
// TOEIC Audio A-B Loop - Floating Dock UI & Trimmer Interaction
// ==========================================================================

window.ToeicAB = window.ToeicAB || {};

ToeicAB.Dock = {
  wrapper: null,
  elements: {},
  isDraggingTrimmer: null,
  isMinimized: false,
  isMaximizedWidth: false,
  currentX: 0,
  currentY: 0,
  isMovingDock: false,
  dockStartX: 0,
  dockStartY: 0,
  dockRafId: null,
  lastKnownPaused: null,

  init() {
    this.createDOM();
    this.cacheElements();
    this.initPosition();
    this.bindWindowControls();
    this.bindPlaybackControls();
    this.bindTrimmerDrags();
  },

  createDOM() {
    const { ICONS, SPEED_RATES } = ToeicAB;

    const wrapper = document.createElement('div');
    wrapper.className = 'toeic-ab-loop-wrapper';
    wrapper.innerHTML = `
      <div class="toeic-ext-card">
        <!-- Window Header Bar (Drag Handle) -->
        <div class="toeic-ext-header" id="dock-drag-header">
          <div class="toeic-ext-title-group">
            <div class="toeic-ext-logo-icon">${ICONS.headphones}</div>
            <span class="toeic-ext-title">A-B Loop Player</span>
            <span class="toeic-ext-status-badge searching" id="audio-status-badge">Đang tìm audio...</span>
          </div>
          <div class="toeic-ext-header-actions">
            <button type="button" class="toeic-ext-header-btn" id="btn-toggle-max-width" title="Tối đa chiều rộng">
              ${ICONS.expandWidth}
            </button>
            <button type="button" class="toeic-ext-header-btn" id="btn-toggle-minimize" title="Thu nhỏ / Mở rộng">
              ${ICONS.minimize}
            </button>
          </div>
        </div>

        <div class="toeic-ext-body">
          <!-- Waveform Video-Trimmer Track -->
          <div class="waveform-trimmer-section">
            <div class="trimmer-ruler-header">
              <span class="ruler-label start" id="ruler-time-current">00:00</span>
              <span class="ruler-label end" id="ruler-time-duration">00:00</span>
            </div>

            <div class="trimmer-viewport" id="trimmer-viewport">
              <div class="trimmer-track-surface">
                <!-- Waveform bars -->
                <div class="trimmer-waveform-bars" id="waveform-bars-container"></div>

                <!-- Dimmed shades (phủ bóng mờ bên ngoài [A, B]) -->
                <div class="trimmer-dim-shade left" id="dim-shade-left" style="width: 0%;"></div>
                <div class="trimmer-dim-shade right" id="dim-shade-right" style="left: 100%; width: 0%;"></div>

                <!-- Selection window -->
                <div class="trimmer-selection-window" id="selection-window" style="left: 0%; width: 100%;">
                  <div class="trimmer-edge-border top"></div>
                  <div class="trimmer-edge-border bottom"></div>
                </div>
              </div>

              <!-- Handle A -->
              <div class="trimmer-vertical-handle handle-start" id="handle-start" style="left: 0%;" title="Kéo mốc [A]">
                <div class="handle-flag">A</div>
                <div class="handle-time-pill" id="pill-time-start">00:00</div>
              </div>

              <!-- Handle B -->
              <div class="trimmer-vertical-handle handle-end" id="handle-end" style="left: 100%;" title="Kéo mốc [B]">
                <div class="handle-flag">B</div>
                <div class="handle-time-pill" id="pill-time-end">00:00</div>
              </div>

              <!-- Playhead Needle -->
              <div class="trimmer-playhead-needle" id="playhead-needle" style="left: 0%;">
                <div class="playhead-cap"></div>
                <div class="playhead-line"></div>
              </div>
            </div>
          </div>

          <!-- Trimmer Control Toolbar -->
          <div class="trimmer-toolbar-row">
            <!-- Playback controls (Bên trái: Play/Pause + Chỉnh tốc độ) -->
            <div class="trimmer-playback-controls">
              <button type="button" class="trimmer-btn btn-play-toggle" id="btn-play-toggle" title="Phát / Dừng (Phím Space)">
                <span class="icon-play-svg">${ICONS.play}</span>
                <span class="icon-pause-svg" style="display: none;">${ICONS.pause}</span>
                <span id="label-play-toggle">Phát</span>
              </button>
              <div class="speed-pills-group" id="speed-pills-group" title="Chỉnh tốc độ phát">
                ${SPEED_RATES.map((spd) => `
                  <button type="button" class="speed-pill-btn ${spd === 1.0 ? 'active' : ''}" data-speed="${spd}">
                    ${spd}x
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Action buttons (Bên phải: 4 nút cố định chiều rộng) -->
            <div class="trimmer-action-buttons">
              <button type="button" class="trimmer-btn replay-a" id="btn-replay-a" title="Phát lại từ [A] (Phím 0)">
                ${ICONS.rotateCcw} Phát lại từ [A]
              </button>
              <button type="button" class="trimmer-btn btn-set-point" id="btn-set-a" title="Đặt mốc [A] (Phím ↑)">
                📍 Đặt [A] (<span class="btn-time-val" id="time-val-a">00:00</span>)
              </button>
              <button type="button" class="trimmer-btn btn-set-point" id="btn-set-b" title="Đặt mốc [B] (Phím ↓)">
                🏁 Đặt [B] (<span class="btn-time-val" id="time-val-b">00:00</span>)
              </button>
              <button type="button" class="trimmer-btn reset" id="btn-reset-ab" title="Reset khoảng A-B về toàn bài (Phím Delete)">
                Reset toàn bài
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.documentElement.appendChild(wrapper);
    this.wrapper = wrapper;
  },

  cacheElements() {
    const w = this.wrapper;
    this.elements = {
      dragHeader: w.querySelector('#dock-drag-header'),
      statusBadge: w.querySelector('#audio-status-badge'),
      btnToggleMin: w.querySelector('#btn-toggle-minimize'),
      btnToggleMaxWidth: w.querySelector('#btn-toggle-max-width'),
      rulerCurrent: w.querySelector('#ruler-time-current'),
      rulerDuration: w.querySelector('#ruler-time-duration'),
      trimmerViewport: w.querySelector('#trimmer-viewport'),
      waveformContainer: w.querySelector('#waveform-bars-container'),
      dimLeft: w.querySelector('#dim-shade-left'),
      dimRight: w.querySelector('#dim-shade-right'),
      selectionWindow: w.querySelector('#selection-window'),
      handleStart: w.querySelector('#handle-start'),
      handleEnd: w.querySelector('#handle-end'),
      pillStart: w.querySelector('#pill-time-start'),
      pillEnd: w.querySelector('#pill-time-end'),
      playheadNeedle: w.querySelector('#playhead-needle'),
      btnPlayToggle: w.querySelector('#btn-play-toggle'),
      iconPlay: w.querySelector('.icon-play-svg'),
      iconPause: w.querySelector('.icon-pause-svg'),
      labelPlayToggle: w.querySelector('#label-play-toggle'),
      speedPillsGroup: w.querySelector('#speed-pills-group'),
      btnReplayA: w.querySelector('#btn-replay-a'),
      btnSetA: w.querySelector('#btn-set-a'),
      btnSetB: w.querySelector('#btn-set-b'),
      btnResetAB: w.querySelector('#btn-reset-ab'),
      timeValA: w.querySelector('#time-val-a'),
      timeValB: w.querySelector('#time-val-b'),
    };
  },

  initPosition() {
    const width = Math.min(880, window.innerWidth - 32);
    this.currentX = Math.round(Math.max(16, (window.innerWidth - width) / 2));
    this.currentY = Math.round(Math.max(16, window.innerHeight - 220));
    this.wrapper.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0)`;
  },

  bindWindowControls() {
    const { ICONS } = ToeicAB;
    const { dragHeader, btnToggleMaxWidth, btnToggleMin } = this.elements;

    // Maximize width
    btnToggleMaxWidth.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.isMinimized) {
        this.isMinimized = false;
        this.wrapper.classList.remove('minimized');
        btnToggleMin.innerHTML = ICONS.minimize;
        btnToggleMin.title = 'Thu nhỏ';
        this.isMaximizedWidth = true;
      } else {
        this.isMaximizedWidth = !this.isMaximizedWidth;
      }

      btnToggleMaxWidth.classList.toggle('active', this.isMaximizedWidth);

      if (this.isMaximizedWidth) {
        this.wrapper.classList.add('max-width-mode');
        btnToggleMaxWidth.title = 'Thu nhỏ chiều rộng bình thường';
        this.currentX = 12;
        this.wrapper.style.transform = `translate3d(${this.currentX}px, ${Math.round(this.currentY)}px, 0)`;
      } else {
        this.wrapper.classList.remove('max-width-mode');
        btnToggleMaxWidth.title = 'Tối đa chiều rộng';
        this.currentX = Math.round(Math.max(16, (window.innerWidth - 880) / 2));
        this.wrapper.style.transform = `translate3d(${this.currentX}px, ${Math.round(this.currentY)}px, 0)`;
      }
    });

    // Minimize / Expand
    btnToggleMin.addEventListener('click', (e) => {
      e.stopPropagation();
      this.isMinimized = !this.isMinimized;
      if (this.isMinimized) {
        if (this.isMaximizedWidth) {
          this.isMaximizedWidth = false;
          this.wrapper.classList.remove('max-width-mode');
          btnToggleMaxWidth.classList.remove('active');
          btnToggleMaxWidth.title = 'Tối đa chiều rộng';
          this.currentX = Math.round(Math.max(16, (window.innerWidth - 880) / 2));
          this.wrapper.style.transform = `translate3d(${this.currentX}px, ${Math.round(this.currentY)}px, 0)`;
        }
        this.wrapper.classList.add('minimized');
        btnToggleMin.innerHTML = ICONS.maximize;
        btnToggleMin.title = 'Mở rộng';
      } else {
        this.wrapper.classList.remove('minimized');
        btnToggleMin.innerHTML = ICONS.minimize;
        btnToggleMin.title = 'Thu nhỏ';
      }
    });

    // Header dragging
    dragHeader.addEventListener('mousedown', (e) => {
      if (e.target.closest('.toeic-ext-header-btn')) return;
      e.preventDefault();
      this.isMovingDock = true;
      this.dockStartX = Math.round(e.clientX - this.currentX);
      this.dockStartY = Math.round(e.clientY - this.currentY);

      const onDockMove = (moveEvt) => {
        if (!this.isMovingDock) return;
        const newX = Math.round(moveEvt.clientX - this.dockStartX);
        const newY = Math.round(moveEvt.clientY - this.dockStartY);

        const rect = this.wrapper.getBoundingClientRect();
        const maxX = Math.round(window.innerWidth - rect.width - 10);
        const maxY = Math.round(window.innerHeight - rect.height - 10);

        this.currentX = Math.max(10, Math.min(maxX, newX));
        this.currentY = Math.max(10, Math.min(maxY, newY));

        if (!this.dockRafId) {
          this.dockRafId = requestAnimationFrame(() => {
            this.wrapper.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0)`;
            this.dockRafId = null;
          });
        }
      };

      const onDockUp = () => {
        this.isMovingDock = false;
        if (this.dockRafId) {
          cancelAnimationFrame(this.dockRafId);
          this.dockRafId = null;
        }
        window.removeEventListener('mousemove', onDockMove);
        window.removeEventListener('mouseup', onDockUp);
      };

      window.addEventListener('mousemove', onDockMove, { passive: true });
      window.addEventListener('mouseup', onDockUp);
    });
  },

  bindPlaybackControls() {
    const { btnPlayToggle, speedPillsGroup, btnReplayA, btnSetA, btnSetB, btnResetAB } = this.elements;

    btnPlayToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      ToeicAB.Audio.togglePlayPause();
    });

    speedPillsGroup.addEventListener('click', (e) => {
      const btn = e.target.closest('.speed-pill-btn');
      if (!btn) return;
      e.stopPropagation();

      const speed = parseFloat(btn.dataset.speed);
      if (!isNaN(speed)) {
        ToeicAB.Audio.setPlaybackRate(speed);
        speedPillsGroup.querySelectorAll('.speed-pill-btn').forEach((b) => {
          b.classList.toggle('active', b === btn);
        });
      }
    });

    btnReplayA.addEventListener('click', (e) => {
      e.stopPropagation();
      ToeicAB.Audio.replayA();
    });

    btnSetA.addEventListener('click', (e) => {
      e.stopPropagation();
      ToeicAB.Audio.setA();
    });

    btnSetB.addEventListener('click', (e) => {
      e.stopPropagation();
      ToeicAB.Audio.setB();
    });

    btnResetAB.addEventListener('click', (e) => {
      e.stopPropagation();
      ToeicAB.Audio.resetAB();
    });
  },

  getTimeFromClientX(clientX) {
    const rect = this.elements.trimmerViewport.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const duration = (ToeicAB.Audio.activeAudio && ToeicAB.Audio.activeAudio.duration) || 100;
    return ratio * duration;
  },

  bindTrimmerDrags() {
    const { handleStart, handleEnd, trimmerViewport } = this.elements;
    this.setupDrag(handleStart, 'start');
    this.setupDrag(handleEnd, 'end');
    this.setupDrag(trimmerViewport, 'seek');
  },

  setupDrag(element, type) {
    const onStart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.isDraggingTrimmer = type;

      const getClientX = (evt) => (evt.touches ? evt.touches[0].clientX : evt.clientX);

      if (type === 'seek' && ToeicAB.Audio.activeAudio) {
        ToeicAB.Audio.seek(this.getTimeFromClientX(getClientX(e)));
      }

      let pendingTime = null;
      let dragRafId = null;

      const updateDrag = () => {
        if (pendingTime === null || !ToeicAB.Audio.activeAudio) return;
        const time = pendingTime;

        if (this.isDraggingTrimmer === 'start') {
          ToeicAB.Audio.setLoopStartFromDrag(time);
        } else if (this.isDraggingTrimmer === 'end') {
          ToeicAB.Audio.setLoopEndFromDrag(time);
        } else if (this.isDraggingTrimmer === 'seek') {
          ToeicAB.Audio.seek(time);
        }

        dragRafId = null;
      };

      const onMove = (moveEvt) => {
        if (!this.isDraggingTrimmer || !ToeicAB.Audio.activeAudio) return;
        pendingTime = this.getTimeFromClientX(getClientX(moveEvt));

        if (!dragRafId) {
          dragRafId = requestAnimationFrame(updateDrag);
        }
      };

      const onEnd = () => {
        if (dragRafId) {
          cancelAnimationFrame(dragRafId);
          dragRafId = null;
        }

        const audio = ToeicAB.Audio.activeAudio;
        if (this.isDraggingTrimmer === 'start' && audio && audio.currentTime < ToeicAB.Audio.loopStart) {
          ToeicAB.Audio.seek(ToeicAB.Audio.loopStart);
        } else if (this.isDraggingTrimmer === 'end' && audio && audio.currentTime >= ToeicAB.Audio.loopEnd) {
          ToeicAB.Audio.seek(ToeicAB.Audio.loopStart);
        }

        this.isDraggingTrimmer = null;
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onEnd);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onEnd);
      };

      window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onMove, { passive: true });
      window.addEventListener('touchend', onEnd);
    };

    element.addEventListener('mousedown', onStart);
    element.addEventListener('touchstart', onStart, { passive: false });
  },

  renderWaveform(bars) {
    const { waveformContainer } = this.elements;
    waveformContainer.innerHTML = '';
    const frag = document.createDocumentFragment();
    bars.forEach((height) => {
      const span = document.createElement('span');
      span.className = 'wave-bar';
      span.style.height = `${height}%`;
      frag.appendChild(span);
    });
    waveformContainer.appendChild(frag);
  },

  updateStatus(text, className) {
    const badge = this.elements.statusBadge;
    badge.textContent = text;
    badge.className = `toeic-ext-status-badge ${className}`;
  },

  updatePlayButtonVisual() {
    const audio = ToeicAB.Audio.activeAudio;
    if (!audio) return;
    const isPaused = audio.paused;
    if (isPaused === this.lastKnownPaused) return;
    this.lastKnownPaused = isPaused;

    const { btnPlayToggle, iconPlay, iconPause, labelPlayToggle } = this.elements;

    if (isPaused) {
      btnPlayToggle.classList.remove('playing');
      iconPlay.style.display = 'inline-flex';
      iconPause.style.display = 'none';
      labelPlayToggle.textContent = 'Phát';
    } else {
      btnPlayToggle.classList.add('playing');
      iconPlay.style.display = 'none';
      iconPause.style.display = 'inline-flex';
      labelPlayToggle.textContent = 'Dừng';
    }
  },

  updateTrimmerPositions() {
    const audio = ToeicAB.Audio.activeAudio;
    if (!audio) return;
    const duration = audio.duration || 0;
    const d = duration || 100;
    const { loopStart, loopEnd } = ToeicAB.Audio;
    const effectiveEnd = loopEnd > 0 ? loopEnd : d;

    const startPct = duration > 0 ? (loopStart / duration) * 100 : 0;
    const endPct = duration > 0 ? (effectiveEnd / duration) * 100 : 100;
    const widthPct = Math.max(0, endPct - startPct);

    const { handleStart, handleEnd, pillStart, pillEnd, selectionWindow, dimLeft, dimRight } = this.elements;

    handleStart.style.left = `${startPct}%`;
    handleEnd.style.left = `${endPct}%`;
    pillStart.textContent = ToeicAB.formatTime(loopStart);
    pillEnd.textContent = ToeicAB.formatTime(effectiveEnd);

    selectionWindow.style.left = `${startPct}%`;
    selectionWindow.style.width = `${widthPct}%`;

    dimLeft.style.width = `${startPct}%`;
    dimRight.style.left = `${endPct}%`;
    dimRight.style.width = `${Math.max(0, 100 - endPct)}%`;
  },

  updatePlaybackUI() {
    const audio = ToeicAB.Audio.activeAudio;
    if (!audio) return;
    const duration = audio.duration || 0;
    const currentTime = audio.currentTime || 0;

    const { rulerCurrent, rulerDuration, timeValA, timeValB, playheadNeedle } = this.elements;

    rulerCurrent.textContent = ToeicAB.formatTime(currentTime);
    rulerDuration.textContent = ToeicAB.formatTime(duration);

    if (timeValA) timeValA.textContent = ToeicAB.formatTime(currentTime);
    if (timeValB) timeValB.textContent = ToeicAB.formatTime(currentTime);

    const currentPct = duration > 0 ? (currentTime / duration) * 100 : 0;
    playheadNeedle.style.left = `${currentPct}%`;

    this.updatePlayButtonVisual();
  },

  updateAllUI() {
    this.updateTrimmerPositions();
    this.updatePlaybackUI();
  },
};
