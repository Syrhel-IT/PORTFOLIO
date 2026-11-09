(function () {
  function init() {
    var wrap = document.getElementById('lanyard');
    if (!wrap) { console.warn('lanyard: #lanyard not found'); return; }

    var swing = wrap.querySelector('.swing');
    var card = wrap.querySelector('.id-card');
    var hint = wrap.querySelector('.lanyard-hint');
    if (!swing || !card) { console.warn('lanyard: .swing or .id-card missing'); return; }

    var a = 0, w = 0, tilt = 0;
    var dragging = false, running = false, last = 0;
    var MAX = 1.25, G = 3200, DAMP = 0.9;

    function cssNum(name) {
      return parseFloat(getComputedStyle(wrap).getPropertyValue(name)) || 0;
    }

    function render() {
      swing.style.transform = 'rotate(' + (-a) + 'rad)';
      card.style.transform = 'rotate(' + tilt + 'rad)';
    }

    function frame(now) {
      var dt = Math.min((now - last) / 1000, 0.033);
      last = now;

      if (!dragging) {
        var L = (cssNum('--L') || 200) + (cssNum('--ch') || 300) * 0.5;
        w += -(G / L) * Math.sin(a) * dt;
        w *= Math.exp(-DAMP * dt);
        a += w * dt;
      }

      var target = Math.max(-0.5, Math.min(0.5, w * 0.05));
      tilt += (target - tilt) * Math.min(1, dt * 10);
      render();

      if (!dragging && Math.abs(a) < 0.0008 && Math.abs(w) < 0.01) {
        a = w = tilt = 0;
        render();
        running = false;
        return;
      }
      requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      last = performance.now();
      requestAnimationFrame(frame);
    }

    function aim(x, y) {
      var r = wrap.getBoundingClientRect();
      var ang = Math.atan2(x - (r.left + r.width / 2), Math.max(y - r.top, 40));
      return Math.max(-MAX, Math.min(MAX, ang));
    }

    var lastMove = 0;

    function down(e) {
      dragging = true;
      wrap.classList.add('dragging');
      if (hint) hint.classList.add('gone');
      w = 0;
      lastMove = performance.now();
      start();
      if (e.cancelable) e.preventDefault();
    }

    function move(e) {
      if (!dragging) return;
      var p = e.touches ? e.touches[0] : e;
      var next = aim(p.clientX, p.clientY);
      var now = performance.now();
      var dt = Math.max((now - lastMove) / 1000, 0.008);
      lastMove = now;
      w = Math.max(-9, Math.min(9, (next - a) / dt));
      a = next;
      if (e.cancelable) e.preventDefault();
    }

    function up() {
      if (!dragging) return;
      dragging = false;
      wrap.classList.remove('dragging');
      start();
    }

    // mouse
    card.addEventListener('mousedown', down);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);

    // touch (non-passive so the page doesn't scroll while dragging the card)
    card.addEventListener('touchstart', down, { passive: false });
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
    window.addEventListener('touchcancel', up);

    // keep images and text from starting a native drag/selection
    card.addEventListener('dragstart', function (e) { e.preventDefault(); });

    // small push so people see it moves
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { w = 2.4; start(); io.disconnect(); }
      }, { threshold: 0.4 });
      io.observe(wrap);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();