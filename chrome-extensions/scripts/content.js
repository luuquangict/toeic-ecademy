// ==========================================================================
// TOEIC Audio A-B Loop - Extension Entry Point
// ==========================================================================

(() => {
  // Ngăn chặn inject trùng lặp
  if (window.__TOEIC_AB_LOOP_INITIALIZED__) return;
  window.__TOEIC_AB_LOOP_INITIALIZED__ = true;

  // 1. Khởi tạo Floating Dock UI
  ToeicAB.Dock.init();

  // 2. Khởi tạo Hotkeys Listener
  ToeicAB.Hotkeys.init();

  // 3. Tự động tìm kiếm và gắn vào audio ngay khi trang vừa tải
  ToeicAB.Audio.findAndAttach();

  // 4. Theo dõi DOM qua MutationObserver để bắt ngay khi React/SPA vừa chèn thẻ <audio>
  const observer = new MutationObserver(() => {
    if (!ToeicAB.Audio.activeAudio || !document.contains(ToeicAB.Audio.activeAudio)) {
      ToeicAB.Audio.findAndAttach();
    }
  });

  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
  });

  // 5. Fast-poll trong 3 giây đầu (mỗi 100ms) để bắt audio ngay lập tức khi component vừa mount
  let pollCount = 0;
  const pollTimer = setInterval(() => {
    pollCount++;
    if (ToeicAB.Audio.findAndAttach() || pollCount >= 30) {
      clearInterval(pollTimer);
    }
  }, 100);

  // 6. Lắng nghe các sự kiện phát/tải âm thanh để tự động kết nối
  ['play', 'playing', 'canplay', 'loadeddata'].forEach((evt) => {
    document.addEventListener(
      evt,
      (e) => {
        if (e.target instanceof HTMLMediaElement && ToeicAB.Audio.activeAudio !== e.target) {
          ToeicAB.Audio.attach(e.target);
        }
      },
      true
    );
  });
})();
