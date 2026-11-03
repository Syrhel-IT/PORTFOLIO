(function () {
    var wrap = document.getElementById('lanyard');
    if (!wrap) return;
  
    var swing = wrap.querySelector('.swing');
    var card = wrap.querySelector('.id-card');
    var hint = wrap.querySelector('.lanyard-hint');
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  
    var a = 0;          // swing angle (radians)
    var w = 0;          // angular velocity
    var tilt = 0;       // extra lag-tilt of the card
    var dragging = false;
    var running = false;
    var last = 0;
    var MAX = 1.25;     // max swing angle (~70°)
    var G = 3200;       // "gravity": higher = faster swing
    var DAMP = 0.9;     // friction: higher = settles sooner
  
    function num(name) {
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
        var leff = num('--L') + num('--ch') * 0.5;
        w += -(G / leff) * Math.sin(a) * dt;
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
  
    function aim(e) {
      var r = wrap.getBoundingClientRect();
      var ax = r.left + r.width / 2;
      var ay = r.top;
      var ang = Math.atan2(e.clientX - ax, Math.max(e.clientY - ay, 40));
      return Math.max(-MAX, Math.min(MAX, ang));
    }
  
    card.addEventListener('pointerdown', function (e) {
      dragging = true;
      card.setPointerCapture(e.pointerId);
      wrap.classList.add('dragging');
      if (hint) hint.classList.add('gone');
      w = 0;
      start();
      e.preventDefault();
    });
  
    card.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var next = aim(e);
      var now = performance.now();
      var dt = Math.max((now - last) / 1000, 0.008);
      w = (next - a) / dt;                 // release speed = how fast you were dragging
      w = Math.max(-9, Math.min(9, w));
      a = next;
    });
  
    function release() {
      if (!dragging) return;
      dragging = false;
      wrap.classList.remove('dragging');
      start();
    }
    card.addEventListener('pointerup', release);
    card.addEventListener('pointercancel', release);
  
    // a little push when it first scrolls into view, so people see it is playable
    if (!reduce && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          w = 2.4;
          start();
          io.disconnect();
        }
      }, { threshold: 0.4 });
      io.observe(wrap);
    }
  })();