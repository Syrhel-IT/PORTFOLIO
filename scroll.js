(function () {
    var root = document.documentElement;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
    // hide reveal targets right away, so nothing flashes before it animates
    root.classList.add('js-anim');
  
    var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  
    document.addEventListener('DOMContentLoaded', function () {
  
      /* ---------- 1. reveal on scroll ---------- */
      var targets = document.querySelectorAll([
        '.hero-img', '.hero-text > *',
        'section > h2', '.grid > *', '.job',
        '.page > .tag', '.page > h1', '.page > .chips', '.page > .lead',
        '.page > .prose', '.page > h2', '.page > a', '.page > .photo-slot',
        'footer .wrap'
      ].join(','));
  
      var counts = new Map();
      targets.forEach(function (el) {
        var n = counts.get(el.parentNode) || 0;
        counts.set(el.parentNode, n + 1);
        el.style.setProperty('--d', Math.min(n, 6) * 90 + 'ms');   // stagger siblings
        el.classList.add('reveal');
      });
  
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          el.classList.add('in');
          io.unobserve(el);
          // once finished, hand control back to the element's normal styles (hover effects etc.)
          setTimeout(function () {
            el.classList.remove('reveal', 'in');
            el.style.removeProperty('--d');
          }, 1400);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  
      targets.forEach(function (el) { io.observe(el); });
  
  
      var panels = document.querySelectorAll('header.hero, section[id]');
      var ticking = false;
  
      function update() {
        var vh = window.innerHeight;
        var max = root.scrollHeight - vh;
  
        panels.forEach(function (p) {
          var r = p.getBoundingClientRect();
          // starts when the section's bottom is 60% up the screen, finishes when it leaves
          var t = clamp(1 - r.bottom / (vh * 0.6), 0, 1);
          if (t === 0 || r.bottom <= 0) {
            p.style.transform = '';
            p.style.opacity = '';
          } else {
            p.style.transformOrigin = '50% 100%';
            p.style.transform = 'scale(' + (1 - t * 0.06) + ')';
            p.style.opacity = String(1 - t * 0.55);
          }
        });
        ticking = false;
      }
  
      function onScroll() {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      }
  
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('resize', onScroll);
      update();
    });
  })();