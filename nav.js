(function () {
    var file = location.pathname.split('/').pop().toLowerCase();
    var home = file === '' || file === 'index.html';
    var base = home ? '' : 'index.html';
  
    var items = [
      ['about', 'Home'], ['skills', 'Skills'], ['experience', 'Experience'],
      ['projects', 'Projects'], ['credentials', 'Credentials'], ['contact', 'Contact']
    ];
  
    var sectionOf = {
      'education.html': 'credentials',
      'certification.html': 'credentials',
      'certifications.html': 'credentials',
      'qr-attendance.html': 'projects',
      'license-plate-recognition.html': 'projects'
    };
    var current = home ? 'about' : sectionOf[file];
  
    var links = items.map(function (i) {
      var href = home ? '#' + i[0] : (i[0] === 'about' ? 'index.html' : base + '#' + i[0]);
      return '<a href="' + href + '"' + (i[0] === current ? ' class="active"' : '') + '>' + i[1] + '</a>';
    }).join('');
  
    var html =
      '<nav class="topnav"><div class="topnav-bar">' +
        '<a class="logo" href="' + (home ? '#about' : 'index.html') + '"><span class="logo-mark">JS</span><span class="logo-text">Jhon Syrhel</span></a>' +
        '<div class="nav-pill" id="navPill">' + links + '</div>' +
        '<div class="nav-right">' +
          '<a class="nav-mail" href="mailto:delacruzjhonsyrhel@gmail.com">delacruzjhonsyrhel@gmail.com</a>' +
          '<button class="theme-toggle" type="button" role="switch" aria-checked="false" aria-label="Toggle light or dark mode">' +
            '<svg class="ico ico-sun" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' +
            '<svg class="ico ico-moon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
            '<span class="knob"></span>' +
          '</button>' +
          '<button class="nav-btn" id="navBtn" type="button" aria-label="Menu" aria-controls="navPill">' +
            '<svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">' +
              '<circle cx="3" cy="3" r="1.8"/><circle cx="9" cy="3" r="1.8"/><circle cx="15" cy="3" r="1.8"/>' +
              '<circle cx="3" cy="9" r="1.8"/><circle cx="9" cy="9" r="1.8"/><circle cx="15" cy="9" r="1.8"/>' +
              '<circle cx="3" cy="15" r="1.8"/><circle cx="9" cy="15" r="1.8"/><circle cx="15" cy="15" r="1.8"/>' +
            '</svg>' +
          '</button>' +
        '</div>' +
      '</div></nav>';
  
    var mount = document.getElementById('site-nav');
    if (!mount) return;
    mount.insertAdjacentHTML('afterend', html);
    mount.remove();
  
    var pill = document.getElementById('navPill');
    var btn = document.getElementById('navBtn');
    var anchors = pill.querySelectorAll('a');
  
    // round button: dropdown on small screens, jump to Contact on desktop
    btn.addEventListener('click', function () {
      if (window.innerWidth <= 960) pill.classList.toggle('open');
      else location.href = base + '#contact';
    });
    anchors.forEach(function (a) {
      a.addEventListener('click', function () { pill.classList.remove('open'); });
    });
  
    // ---------- light / dark switch ----------
    var root = document.documentElement;
    var sw = document.querySelector('.theme-toggle');
  
    function isDark() {
      return (root.getAttribute('data-theme') ||
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';
    }
  
    function syncSwitch() {
      sw.setAttribute('aria-checked', isDark() ? 'true' : 'false');
    }
  
    sw.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncSwitch();
    });
  
    syncSwitch();
  
    // homepage only: highlight the section you're viewing
    if (home && 'IntersectionObserver' in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            anchors.forEach(function (a) {
              a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
            });
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      items.forEach(function (i) {
        var s = document.getElementById(i[0]);
        if (s) spy.observe(s);
      });
    }
  })();