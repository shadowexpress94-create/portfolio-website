/* main.js - runs on every page.
   Shared helpers: icon sprite, mobile menu, dates, toast, planner storage. */

(function () {
  'use strict';

  // ---------- shared helpers, also used by planner.js ----------
  var STORAGE_KEY = 'yy-planner-v1';

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function isoDate(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function daysFromToday(n) { var d = new Date(); d.setDate(d.getDate() + n); return isoDate(d); }

  function seedTasks() {
    return [
      { id: 1, title: 'Finish contact form validation', subject: 'Web development', due: daysFromToday(1), priority: 2, done: false },
      { id: 2, title: 'Practise loops in C++', subject: 'C++', due: daysFromToday(2), priority: 1, done: false },
      { id: 3, title: 'Physics problem set', subject: 'Physics', due: daysFromToday(4), priority: 1, done: false },
      { id: 4, title: 'Submit Python lab assessment', subject: 'Python', due: daysFromToday(-1), priority: 2, done: true }
    ];
  }

  function loadTasks() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) { return parsed; }
      }
    } catch (e) { /* storage blocked: fall through to the sample tasks */ }
    return seedTasks();
  }

  function saveTasks(tasks) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch (e) { /* ignore */ }
  }

  var toastTimer;
  function showToast(message) {
    var el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.className = 'toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('on'); }, 2400);
  }

  window.YY = {
    isoDate: isoDate,
    loadTasks: loadTasks,
    saveTasks: saveTasks,
    toast: showToast
  };

  // ---------- icon sprite (injected once, used with <use href="#i-name">) ----------
  var SPRITE =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></symbol>' +
    '<symbol id="i-grad" viewBox="0 0 24 24"><path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></symbol>' +
    '<symbol id="i-code" viewBox="0 0 24 24"><path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/></symbol>' +
    '<symbol id="i-target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></symbol>' +
    '<symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 21s-8-5-8-11a5 5 0 0 1 8-3 5 5 0 0 1 8 3c0 6-8 11-8 11z"/></symbol>' +
    '<symbol id="i-trend" viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></symbol>' +
    '<symbol id="i-crown" viewBox="0 0 24 24"><path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/></symbol>' +
    '<symbol id="i-game" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 10v5M4.5 12.5h5M16 11h.01M18.5 14h.01"/></symbol>' +
    '<symbol id="i-film" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/></symbol>' +
    '<symbol id="i-dumb" viewBox="0 0 24 24"><path d="M6 8v8M3 10v4M18 8v8M21 10v4M6 12h12"/></symbol>' +
    '<symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></symbol>' +
    '<symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/></symbol>' +
    '<symbol id="i-book" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></symbol>' +
    '<symbol id="i-table" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 10h18M9 4v16"/></symbol>' +
    '<symbol id="i-check" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="m8 12 3 3 5-6"/></symbol>' +
    '<symbol id="i-trash" viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></symbol>' +
    '<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>' +
    '</defs></svg>';
  document.body.insertAdjacentHTML('afterbegin', SPRITE);

  // ---------- mobile menu ----------
  var btn = document.getElementById('menuBtn');
  var menu = document.getElementById('menu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------- live date and footer year ----------
  var longDate = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  var yr = document.getElementById('yr');
  if (yr) { yr.textContent = new Date().getFullYear(); }
  var todayLine = document.getElementById('todayLine');
  if (todayLine) { todayLine.textContent = 'Welcome. Today is ' + longDate; }
  var plannerDate = document.getElementById('plannerDate');
  if (plannerDate) { plannerDate.textContent = 'Today is ' + longDate; }

  // ---------- home: animated counters, live planner count ----------
  var live = document.getElementById('statTasks');
  if (live) { live.dataset.count = loadTasks().length; }
  var counters = document.querySelectorAll('[data-count]');
  Array.prototype.forEach.call(counters, function (el) {
    var target = Number(el.dataset.count) || 0, n = 0;
    if (!target) { el.textContent = '0'; return; }
    var step = setInterval(function () {
      n += 1;
      el.textContent = n;
      if (n >= target) { clearInterval(step); }
    }, 110);
  });

  // ---------- projects: filter buttons ----------
  var filterBtns = document.querySelectorAll('[data-filter]');
  var projectCards = document.querySelectorAll('.project[data-cat]');
  Array.prototype.forEach.call(filterBtns, function (b) {
    b.addEventListener('click', function () {
      var f = b.dataset.filter;
      Array.prototype.forEach.call(filterBtns, function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      Array.prototype.forEach.call(projectCards, function (card) {
        var cats = card.dataset.cat.split(' ');
        card.hidden = !(f === 'all' || cats.indexOf(f) > -1);
      });
    });
  });

  // ---------- simulated links ----------
  Array.prototype.forEach.call(document.querySelectorAll('a[data-demo]'), function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      showToast('Demo link. Replace it with your real URL.');
    });
  });
})();
