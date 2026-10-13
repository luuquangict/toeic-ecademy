// ==========================================================================
// TOEIC Audio A-B Loop - Keyboard Shortcuts Manager
// ==========================================================================

window.ToeicAB = window.ToeicAB || {};

ToeicAB.Hotkeys = {
  init() {
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
  },

  handleKeydown(e) {
    if (!ToeicAB.Audio || !ToeicAB.Audio.ensureAudio()) return;

    // Bỏ qua nếu người dùng đang gõ trong input / textarea
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
      ToeicAB.Audio.togglePlayPause();
    } else if (e.key === '0' || e.code === 'Digit0' || e.code === 'Numpad0') {
      e.preventDefault();
      ToeicAB.Audio.replayA();
    } else if (e.code === 'Delete' || e.key === 'Delete') {
      e.preventDefault();
      ToeicAB.Audio.resetAB();
    } else if (e.code === 'Enter' || e.key === 'Enter' || e.code === 'NumpadEnter') {
      e.preventDefault();
      ToeicAB.Audio.nextSection();
    } else if (e.code === 'NumpadAdd' || e.key === '+' || e.keyCode === 107) {
      e.preventDefault();
      ToeicAB.Audio.extendPointB(5);
    } else if (e.code === 'ArrowLeft' || e.key === 'ArrowLeft') {
      e.preventDefault();
      ToeicAB.Audio.skipSeconds(-3);
    } else if (e.code === 'ArrowRight' || e.key === 'ArrowRight') {
      e.preventDefault();
      ToeicAB.Audio.skipSeconds(3);
    } else if (e.code === 'ArrowUp' || e.key === 'ArrowUp') {
      e.preventDefault();
      ToeicAB.Audio.setA();
    } else if (e.code === 'ArrowDown' || e.key === 'ArrowDown') {
      e.preventDefault();
      ToeicAB.Audio.setB();
    }
  },
};
