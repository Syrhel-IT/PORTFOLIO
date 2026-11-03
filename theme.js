(function () {
    if (window.__themeReady) return;      // never run twice, even if the file is loaded twice
    window.__themeReady = true;
  
    var root = document.documentElement;
  
    // apply the saved choice before the page paints
    try {
      var saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
    } catch (e) {}
  
    function isDark() {
      return (root.getAttribute('data-theme') ||
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';
    }
  
    function sync() {
      var dark = isDark();
      document.querySelectorAll('.theme-toggle').forEach(function (b) {
        b.setAttribute('aria-checked', dark ? 'true' : 'false');
      });
    }
  
    // capture phase + stopImmediatePropagation: this is the ONLY handler that can run for the switch
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.theme-toggle');
      if (!b) return;
      e.stopImmediatePropagation();
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (err) {}
      sync();
    }, true);
  
    // keep the aria state right whenever the nav gets built
    new MutationObserver(sync).observe(root, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', sync);
  })();