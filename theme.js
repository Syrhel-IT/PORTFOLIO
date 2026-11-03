(function () {
    var KEY = 'theme';
    var root = document.documentElement;
  
    // apply the saved choice immediately, so the page doesn't flash the wrong theme
    var saved;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  
    function current() {
      return root.getAttribute('data-theme') ||
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
  
    function sync() {
      var dark = current() === 'dark';
      document.querySelectorAll('.theme-toggle').forEach(function (b) {
        b.setAttribute('aria-pressed', dark);
        b.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      });
    }
  
    document.addEventListener('DOMContentLoaded', function () {
      sync();
      document.querySelectorAll('.theme-toggle').forEach(function (b) {
        b.addEventListener('click', function () {
          var next = current() === 'dark' ? 'light' : 'dark';
          root.setAttribute('data-theme', next);
          try { localStorage.setItem(KEY, next); } catch (e) {}
          sync();
        });
      });
    });
  })();