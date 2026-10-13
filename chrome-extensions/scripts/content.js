// ==========================================================================
// TOEIC Audio A-B Loop Controller - Floating Dock Extension
// Tối ưu hóa cực hạn GPU & requestAnimationFrame cho độ mượt mà tối đa
// ==========================================================================

(() => {
  // Prevent duplicate injection
  if (window.__TOEIC_AB_LOOP_DOCK_INITIALIZED__) return;
  window.__TOEIC_AB_LOOP_DOCK_INITIALIZED__ = true;

  // SVG Icons
  const ICONS = {
    headphones: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>`,
    rotateCcw: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>`,
    play: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
    pause: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`,
    minimize: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
    maximize: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>`,
    expandWidth: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>`,
  };

  const SPEED_RATES = [0.5, 0.8, 1.0, 1.2, 1.5];
  let currentPlaybackRate = 1.0;
  let activeAudio = null;
  let loopStart = 0;
  let loopEnd = 0;
  let isDragging = null;
  let isMinimized = false;
  let isMaximizedWidth = false;

  function formatTime(sec) {
    if (isNaN(sec) || sec < 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function generateWaveformBars(key) {
    let seed = 0;
    const str = key || 'audio-sample-seed';
    for (let i = 0; i < str.length; i++) {
      seed = (seed * 31 + str.charCodeAt(i)) % 100000;
    }
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const count = 200;
    const bars = [];
    for (let i = 0; i < count; i++) {
      const envelope = Math.sin((i / count) * Math.PI);
      const wave1 = Math.sin(i * 0.22) * 0.25 + 0.5;
      const wave2 = Math.cos(i * 0.55) * 0.2;
      const noise = random() * 0.35;
      const pause = (i % 22 === 0 || i % 38 === 0) ? 0.2 : 1;
      const height = Math.max(14, Math.min(96, (wave1 + wave2 + noise) * envelope * pause * 90 + 16));
      bars.push(Math.round(height));
    }
    return bars;
  }

  // --------------------------------------------------------------------------
  // Create Floating Dock Container
  // --------------------------------------------------------------------------
  const wrapper = document.createElement('div');
  wrapper.className = 'toeic-ab-loop-wrapper';
  wrapper.style.display = 'none'; // Ẩn mặc định, chỉ hiện khi tìm thấy audio trên trang
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
            <button type="button" class="trimmer-btn replay-a" id="btn-replay-a" title="Phát lại từ [A] (Phím Ctrl)">
              ${ICONS.rotateCcw} Phát lại từ [A]
            </button>
            <button type="button" class="trimmer-btn btn-set-point" id="btn-set-a" title="Đặt mốc [A] (Phím ↑)">
              📍 Đặt [A] (<span class="btn-time-val" id="time-val-a">00:00</span>)
            </button>
            <button type="button" class="trimmer-btn btn-set-point" id="btn-set-b" title="Đặt mốc [B] (Phím ↓)">
              🏁 Đặt [B] (<span class="btn-time-val" id="time-val-b">00:00</span>)
            </button>
            <button type="button" class="trimmer-btn reset" id="btn-reset-ab" title="Reset khoảng A-B về toàn bài (Phím 0)">
              Reset toàn bài
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.documentElement.appendChild(wrapper);

  // --------------------------------------------------------------------------
  // Elements Cache
  // --------------------------------------------------------------------------
  const dragHeader = wrapper.querySelector('#dock-drag-header');
  const statusBadge = wrapper.querySelector('#audio-status-badge');
  const btnToggleMin = wrapper.querySelector('#btn-toggle-minimize');
  const btnToggleMaxWidth = wrapper.querySelector('#btn-toggle-max-width');
  const rulerCurrent = wrapper.querySelector('#ruler-time-current');
  const rulerDuration = wrapper.querySelector('#ruler-time-duration');
  const trimmerViewport = wrapper.querySelector('#trimmer-viewport');
  const waveformContainer = wrapper.querySelector('#waveform-bars-container');
  const dimLeft = wrapper.querySelector('#dim-shade-left');
  const dimRight = wrapper.querySelector('#dim-shade-right');
  const selectionWindow = wrapper.querySelector('#selection-window');
  const handleStart = wrapper.querySelector('#handle-start');
  const handleEnd = wrapper.querySelector('#handle-end');
  const pillStart = wrapper.querySelector('#pill-time-start');
  const pillEnd = wrapper.querySelector('#pill-time-end');
  const playheadNeedle = wrapper.querySelector('#playhead-needle');
  const btnPlayToggle = wrapper.querySelector('#btn-play-toggle');
  const iconPlay = wrapper.querySelector('.icon-play-svg');
  const iconPause = wrapper.querySelector('.icon-pause-svg');
  const labelPlayToggle = wrapper.querySelector('#label-play-toggle');
  const speedPillsGroup = wrapper.querySelector('#speed-pills-group');
  const btnReplayA = wrapper.querySelector('#btn-replay-a');
  const btnSetA = wrapper.querySelector('#btn-set-a');
  const btnSetB = wrapper.querySelector('#btn-set-b');
  const btnResetAB = wrapper.querySelector('#btn-reset-ab');
  const timeValA = wrapper.querySelector('#time-val-a');
  const timeValB = wrapper.querySelector('#time-val-b');

  // Render static waveform bars once
  function renderWaveformDOM(bars) {
    waveformContainer.innerHTML = '';
    const frag = document.createDocumentFragment();
    bars.forEach((height) => {
      const span = document.createElement('span');
      span.className = 'wave-bar';
      span.style.height = `${height}%`;
      frag.appendChild(span);
    });
    waveformContainer.appendChild(frag);
  }

  function getTimeFromClientX(clientX) {
    const rect = trimmerViewport.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const duration = (activeAudio && activeAudio.duration) || 100;
    return ratio * duration;
  }

  // Cập nhật trạng thái nút Play (Không bao giờ ghi đè innerHTML để không nuốt sự kiện click)
  let lastKnownPaused = null;
  function updatePlayButtonVisual() {
    if (!activeAudio) return;
    const isPaused = activeAudio.paused;
    if (isPaused === lastKnownPaused) return;
    lastKnownPaused = isPaused;

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
  }

  // Cập nhật vị trí mốc [A] và [B]
  function updateTrimmerPositions() {
    if (!activeAudio) return;
    const duration = activeAudio.duration || 0;
    const d = duration || 100;
    const effectiveEnd = loopEnd > 0 ? loopEnd : d;

    const startPct = duration > 0 ? (loopStart / duration) * 100 : 0;
    const endPct = duration > 0 ? (effectiveEnd / duration) * 100 : 100;
    const widthPct = Math.max(0, endPct - startPct);

    handleStart.style.left = `${startPct}%`;
    handleEnd.style.left = `${endPct}%`;
    pillStart.textContent = formatTime(loopStart);
    pillEnd.textContent = formatTime(effectiveEnd);

    selectionWindow.style.left = `${startPct}%`;
    selectionWindow.style.width = `${widthPct}%`;

    dimLeft.style.width = `${startPct}%`;
    dimRight.style.left = `${endPct}%`;
    dimRight.style.width = `${Math.max(0, 100 - endPct)}%`;
  }

  // Cập nhật playhead & đồng hồ thời gian
  function updatePlaybackUI() {
    if (!activeAudio) return;
    const duration = activeAudio.duration || 0;
    const currentTime = activeAudio.currentTime || 0;

    rulerCurrent.textContent = formatTime(currentTime);
    rulerDuration.textContent = formatTime(duration);

    if (timeValA) timeValA.textContent = formatTime(currentTime);
    if (timeValB) timeValB.textContent = formatTime(currentTime);

    const currentPct = duration > 0 ? (currentTime / duration) * 100 : 0;
    playheadNeedle.style.left = `${currentPct}%`;

    updatePlayButtonVisual();
  }

  function updateAllUI() {
    updateTrimmerPositions();
    updatePlaybackUI();
  }

  // --------------------------------------------------------------------------
  // High-precision Repeat Loop
  // --------------------------------------------------------------------------
  function checkLoop() {
    if (activeAudio && !activeAudio.paused) {
      const cur = activeAudio.currentTime;
      const d = activeAudio.duration || 100;
      const effectiveEnd = loopEnd > 0 ? loopEnd : d;

      if (cur >= effectiveEnd || cur < loopStart) {
        activeAudio.currentTime = loopStart;
      }
      updatePlaybackUI();
    }
    requestAnimationFrame(checkLoop);
  }
  requestAnimationFrame(checkLoop);

  // --------------------------------------------------------------------------
  // Audio Attachment & Synchronization
  // --------------------------------------------------------------------------
  function attachToAudio(audioEl) {
    if (activeAudio === audioEl) return;

    if (activeAudio) {
      activeAudio.removeEventListener('timeupdate', onTimeUpdate);
      activeAudio.removeEventListener('seeked', onTimeUpdate);
      activeAudio.removeEventListener('loadedmetadata', onMetadata);
      activeAudio.removeEventListener('durationchange', onMetadata);
      activeAudio.removeEventListener('play', onStateChange);
      activeAudio.removeEventListener('pause', onStateChange);
    }

    activeAudio = audioEl;
    activeAudio.playbackRate = currentPlaybackRate;

    const srcKey = audioEl.currentSrc || audioEl.src || 'track-1';
    const bars = generateWaveformBars(srcKey);
    renderWaveformDOM(bars);

    loopStart = 0;
    loopEnd = audioEl.duration || 0;

    statusBadge.textContent = 'Đã kết nối';
    statusBadge.className = 'toeic-ext-status-badge active';

    audioEl.addEventListener('timeupdate', onTimeUpdate);
    audioEl.addEventListener('seeked', onTimeUpdate);
    audioEl.addEventListener('loadedmetadata', onMetadata);
    audioEl.addEventListener('durationchange', onMetadata);
    audioEl.addEventListener('play', onStateChange);
    audioEl.addEventListener('pause', onStateChange);

    updateAllUI();
  }

  function onTimeUpdate() {
    updatePlaybackUI();
  }

  function onMetadata() {
    if (!activeAudio) return;
    if (loopEnd === 0 || loopEnd > activeAudio.duration) {
      loopEnd = activeAudio.duration || 0;
    }
    updateAllUI();
  }

  function onStateChange() {
    if (!activeAudio) return;
    statusBadge.textContent = activeAudio.paused ? 'Đã dừng' : 'Đang phát';
    statusBadge.className = `toeic-ext-status-badge ${activeAudio.paused ? 'searching' : 'active'}`;
    updatePlayButtonVisual();
  }

  function findAndAttachAudio() {
    const mediaEls = Array.from(document.querySelectorAll('audio, video'));
    if (mediaEls.length > 0) {
      initDockPosition();
      wrapper.style.display = '';
      const playing = mediaEls.find((m) => !m.paused);
      attachToAudio(playing || mediaEls[0]);
    } else {
      wrapper.style.display = 'none';
      activeAudio = null;
    }
  }

  document.addEventListener('play', (e) => {
    if (e.target instanceof HTMLMediaElement) {
      initDockPosition();
      wrapper.style.display = '';
      attachToAudio(e.target);
    }
  }, true);

  const observer = new MutationObserver(() => {
    if (!activeAudio || !document.contains(activeAudio)) {
      findAndAttachAudio();
    }
  });
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
  });

  setInterval(() => {
    if (!activeAudio || !document.contains(activeAudio)) {
      findAndAttachAudio();
    }
  }, 1000);

  findAndAttachAudio();

  // --------------------------------------------------------------------------
  // Dragging Trimmer Handles & Timeline
  // --------------------------------------------------------------------------
  function setupDrag(element, type) {
    const onStart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      isDragging = type;

      const getClientX = (evt) => (evt.touches ? evt.touches[0].clientX : evt.clientX);

      if (type === 'seek' && activeAudio) {
        activeAudio.currentTime = getTimeFromClientX(getClientX(e));
        updatePlaybackUI();
      }

      let pendingTime = null;
      let dragRafId = null;

      const updateDrag = () => {
        if (pendingTime === null || !activeAudio) return;
        const time = pendingTime;
        const d = activeAudio.duration || 100;
        const curEnd = loopEnd > 0 ? loopEnd : d;

        if (isDragging === 'start') {
          loopStart = Math.min(time, Math.max(0, curEnd - 0.5));
          updateTrimmerPositions();
        } else if (isDragging === 'end') {
          loopEnd = Math.max(time, Math.min(d, loopStart + 0.5));
          updateTrimmerPositions();
        } else if (isDragging === 'seek') {
          activeAudio.currentTime = time;
          updatePlaybackUI();
        }

        dragRafId = null;
      };

      const onMove = (moveEvt) => {
        if (!isDragging || !activeAudio) return;
        const curX = getClientX(moveEvt);
        pendingTime = getTimeFromClientX(curX);

        if (!dragRafId) {
          dragRafId = requestAnimationFrame(updateDrag);
        }
      };

      const onEnd = () => {
        if (dragRafId) {
          cancelAnimationFrame(dragRafId);
          dragRafId = null;
        }
        if (isDragging === 'start' && activeAudio && activeAudio.currentTime < loopStart) {
          activeAudio.currentTime = loopStart;
          updatePlaybackUI();
        } else if (isDragging === 'end' && activeAudio && activeAudio.currentTime >= loopEnd) {
          activeAudio.currentTime = loopStart;
          updatePlaybackUI();
        }
        isDragging = null;
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
  }

  setupDrag(handleStart, 'start');
  setupDrag(handleEnd, 'end');
  setupDrag(trimmerViewport, 'seek');

  // --------------------------------------------------------------------------
  // Play/Pause & Speed Buttons
  // --------------------------------------------------------------------------
  btnPlayToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    togglePlayPause();
  });

  speedPillsGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.speed-pill-btn');
    if (!btn) return;
    e.stopPropagation();

    const speed = parseFloat(btn.dataset.speed);
    if (!isNaN(speed)) {
      currentPlaybackRate = speed;
      if (activeAudio) {
        activeAudio.playbackRate = speed;
      }
      speedPillsGroup.querySelectorAll('.speed-pill-btn').forEach((b) => {
        b.classList.toggle('active', b === btn);
      });
    }
  });

  // --------------------------------------------------------------------------
  // 4 Action Handlers
  // --------------------------------------------------------------------------
  function triggerReplayA() {
    if (!activeAudio) return;
    activeAudio.currentTime = loopStart;
    activeAudio.play().catch(() => {});
    updatePlaybackUI();
  }

  function triggerSetA() {
    if (!activeAudio) return;
    const d = activeAudio.duration || 100;
    const curEnd = loopEnd > 0 ? loopEnd : d;
    const newA = Math.min(activeAudio.currentTime, Math.max(0, curEnd - 0.5));
    loopStart = newA;
    if (newA >= loopEnd || loopEnd === 0) {
      loopEnd = Math.min(d, newA + 5);
    }
    updateTrimmerPositions();
  }

  function triggerSetB() {
    if (!activeAudio) return;
    const d = activeAudio.duration || 100;
    const newB = Math.max(activeAudio.currentTime, 0.5);
    loopEnd = Math.min(d, newB);
    if (loopEnd <= loopStart) {
      loopStart = Math.max(0, loopEnd - 5);
    }
    updateTrimmerPositions();
  }

  function triggerResetAB() {
    if (!activeAudio) return;
    loopStart = 0;
    loopEnd = activeAudio.duration || 100;
    updateTrimmerPositions();
  }

  // 4 Action Buttons click events
  btnReplayA.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerReplayA();
  });

  btnSetA.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerSetA();
  });

  btnSetB.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerSetB();
  });

  btnResetAB.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerResetAB();
  });

  function togglePlayPause() {
    if (!activeAudio) return;
    if (activeAudio.paused) {
      activeAudio.play().catch((err) => console.error("Play error:", err));
    } else {
      activeAudio.pause();
    }
    updatePlayButtonVisual();
  }

  function skipSeconds(sec) {
    if (!activeAudio) return;
    const d = activeAudio.duration || 100;
    const newTime = Math.max(0, Math.min(d, activeAudio.currentTime + sec));
    activeAudio.currentTime = newTime;
    updatePlaybackUI();
  }

  // --------------------------------------------------------------------------
  // Keyboard Shortcuts (Hotkeys)
  // - Space: Dừng / Phát tiếp
  // - Ctrl: Phát lại từ A
  // - Mũi tên trái (←): Lùi 5s
  // - Mũi tên phải (→): Tiến 5s
  // - Mũi tên lên (↑): Lấy A
  // - Mũi tên xuống (↓): Lấy B
  // - Phím số 0: Reset toàn bài
  // --------------------------------------------------------------------------
  document.addEventListener('keydown', (e) => {
    // Không nhận phím tắt nếu panel đang ẩn (trang không có audio)
    if (wrapper.style.display === 'none' || !activeAudio) return;

    // Bỏ qua nếu người dùng đang gõ văn bản trong input / textarea
    const target = e.target;
    if (
      target &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        (target.getAttribute && target.getAttribute('contenteditable') === 'true'))
    ) {
      return;
    }

    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      togglePlayPause();
    } else if (e.key === 'Control') {
      e.preventDefault();
      triggerReplayA();
    } else if (e.code === 'ArrowLeft' || e.key === 'ArrowLeft') {
      e.preventDefault();
      skipSeconds(-3);
    } else if (e.code === 'ArrowRight' || e.key === 'ArrowRight') {
      e.preventDefault();
      skipSeconds(3);
    } else if (e.code === 'ArrowUp' || e.key === 'ArrowUp') {
      e.preventDefault();
      triggerSetA();
    } else if (e.code === 'ArrowDown' || e.key === 'ArrowDown') {
      e.preventDefault();
      triggerSetB();
    } else if (e.key === '0') {
      e.preventDefault();
      triggerResetAB();
    }
  });

  // --------------------------------------------------------------------------
  // Maximize Width & Minimize Toggles
  // --------------------------------------------------------------------------
  btnToggleMaxWidth.addEventListener('click', (e) => {
    e.stopPropagation();

    // Nếu đang ở trạng thái minimum, tự động mở chiều cao trở lại và bật max width
    if (isMinimized) {
      isMinimized = false;
      wrapper.classList.remove('minimized');
      btnToggleMin.innerHTML = ICONS.minimize;
      btnToggleMin.title = 'Thu nhỏ';
      isMaximizedWidth = true;
    } else {
      isMaximizedWidth = !isMaximizedWidth;
    }

    btnToggleMaxWidth.classList.toggle('active', isMaximizedWidth);

    if (isMaximizedWidth) {
      wrapper.classList.add('max-width-mode');
      btnToggleMaxWidth.title = 'Thu nhỏ chiều rộng bình thường';
      currentX = 12; // Căn sát mép trái 12px
      wrapper.style.transform = `translate3d(${currentX}px, ${Math.round(currentY)}px, 0)`;
    } else {
      wrapper.classList.remove('max-width-mode');
      btnToggleMaxWidth.title = 'Tối đa chiều rộng';
      currentX = Math.round(Math.max(16, (window.innerWidth - 880) / 2));
      wrapper.style.transform = `translate3d(${currentX}px, ${Math.round(currentY)}px, 0)`;
    }
  });

  btnToggleMin.addEventListener('click', (e) => {
    e.stopPropagation();
    isMinimized = !isMinimized;
    if (isMinimized) {
      // Khi đang ở maxsize, bấm mini thì thu nhỏ lại và tắt chế độ max chiều rộng
      if (isMaximizedWidth) {
        isMaximizedWidth = false;
        wrapper.classList.remove('max-width-mode');
        btnToggleMaxWidth.classList.remove('active');
        btnToggleMaxWidth.title = 'Tối đa chiều rộng';
        currentX = Math.round(Math.max(16, (window.innerWidth - 880) / 2));
        wrapper.style.transform = `translate3d(${currentX}px, ${Math.round(currentY)}px, 0)`;
      }
      wrapper.classList.add('minimized');
      btnToggleMin.innerHTML = ICONS.maximize;
      btnToggleMin.title = 'Mở rộng';
    } else {
      wrapper.classList.remove('minimized');
      btnToggleMin.innerHTML = ICONS.minimize;
      btnToggleMin.title = 'Thu nhỏ';
    }
  });

  // --------------------------------------------------------------------------
  // Free Window Dragging (Dùng số nguyên pixel tránh mờ nhòe chữ)
  // --------------------------------------------------------------------------
  let currentX = 0;
  let currentY = 0;
  let isMovingDock = false;
  let dockStartX = 0;
  let dockStartY = 0;
  let dockRafId = null;

  let isPositionInitialized = false;
  function initDockPosition() {
    if (isPositionInitialized) return;
    const width = Math.min(880, window.innerWidth - 32);
    currentX = Math.round(Math.max(16, (window.innerWidth - width) / 2));
    currentY = Math.round(Math.max(16, window.innerHeight - 220));
    wrapper.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    isPositionInitialized = true;
  }

  dragHeader.addEventListener('mousedown', (e) => {
    if (e.target.closest('.toeic-ext-header-btn')) return;
    e.preventDefault();
    isMovingDock = true;
    dockStartX = Math.round(e.clientX - currentX);
    dockStartY = Math.round(e.clientY - currentY);

    const onDockMove = (moveEvt) => {
      if (!isMovingDock) return;
      const newX = Math.round(moveEvt.clientX - dockStartX);
      const newY = Math.round(moveEvt.clientY - dockStartY);

      const rect = wrapper.getBoundingClientRect();
      const maxX = Math.round(window.innerWidth - rect.width - 10);
      const maxY = Math.round(window.innerHeight - rect.height - 10);

      currentX = Math.max(10, Math.min(maxX, newX));
      currentY = Math.max(10, Math.min(maxY, newY));

      if (!dockRafId) {
        dockRafId = requestAnimationFrame(() => {
          wrapper.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
          dockRafId = null;
        });
      }
    };

    const onDockUp = () => {
      isMovingDock = false;
      if (dockRafId) {
        cancelAnimationFrame(dockRafId);
        dockRafId = null;
      }
      window.removeEventListener('mousemove', onDockMove);
      window.removeEventListener('mouseup', onDockUp);
    };

    window.addEventListener('mousemove', onDockMove, { passive: true });
    window.addEventListener('mouseup', onDockUp);
  });
})();
