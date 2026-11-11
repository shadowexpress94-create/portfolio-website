/* Light / dark toggle. Add <script src="js/theme.js"></script> inside <head> on every page. */
(function () {
  var KEY = 'yy-theme';
  var root = document.documentElement;

  // Colours for each mode. Setting data-theme overrides the automatic OS setting.
  var css =
    ':root[data-theme="light"]{--bg:#F6F6FB;--card:#FFFFFF;--ink:#1E2233;--ink-2:#555B73;--muted:#7A8099;--line:#E6E7F0;--panel:#1E2233;' +
    '--s-coral:#FFE6E2;--s-sun:#FFF1CF;--s-mint:#D6F6EA;--s-sky:#DCEFFE;--s-violet:#E8E1FF;--s-pink:#FFE0EE;--danger:#D93A4A;--ok:#14A67A;color-scheme:light}' +
    ':root[data-theme="dark"]{--bg:#12141F;--card:#1B1E2D;--ink:#F2F3FA;--ink-2:#B4B9CF;--muted:#868BA3;--line:#2C3046;--panel:#262A40;' +
    '--s-coral:#3A2325;--s-sun:#3A3220;--s-mint:#1A3A31;--s-sky:#1B3045;--s-violet:#2D2650;--s-pink:#3A2234;--danger:#FF7A87;--ok:#43DDB0;color-scheme:dark}' +
    '.theme-btn{width:46px;height:46px;border-radius:50%;border:0;background:var(--card);box-shadow:inset 0 0 0 1.5px var(--line);color:var(--ink);cursor:pointer;display:inline-grid;place-items:center;padding:0;flex:none;transition:transform .2s}' +
    '.theme-btn:hover{transform:rotate(18deg)}.theme-btn:focus-visible{outline:3px solid var(--violet);outline-offset:2px}' +
    '.theme-btn svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
    '.theme-btn .sun{display:none}:root[data-theme="dark"] .theme-btn .sun{display:block}:root[data-theme="dark"] .theme-btn .moon{display:none}' +
    '@media(max-width:760px){.theme-btn{margin-left:auto}.menu-btn{margin-left:0!important}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function systemDark() { return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches; }
  function current() { return root.getAttribute('data-theme') || (systemDark() ? 'dark' : 'light'); }

  // Apply the saved choice straight away so the page does not flash.
  var saved = read();
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);

  document.addEventListener('DOMContentLoaded', function () {
    var nav = document.querySelector('.site-header .nav');
    if (!nav) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-btn';
    btn.innerHTML =
      '<svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
      '<svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    function label() { btn.setAttribute('aria-label', current() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'); }
    label();
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      write(next);
      label();
    });
    var cta = nav.querySelector('.btn-coral');
    nav.insertBefore(btn, cta || null);
  });
})();
