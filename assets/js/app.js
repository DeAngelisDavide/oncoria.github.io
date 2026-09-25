/* Oncoria — interazioni comuni del mockup */
(function () {
  const root = document.documentElement;
  const KEY = 'oncoria-theme';
  try { const t = localStorage.getItem(KEY); if (t) root.setAttribute('data-theme', t); } catch (e) {}
  function isDark() {
    const t = root.getAttribute('data-theme');
    return t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('theme');
    if (btn) {
      const sync = () => btn.setAttribute('aria-label', isDark() ? 'Passa al tema chiaro' : 'Passa al tema scuro');
      sync();
      btn.addEventListener('click', function () {
        const next = isDark() ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem(KEY, next); } catch (e) {}
        sync();
      });
    }
    // segmented controls: un solo pulsante attivo per gruppo
    document.querySelectorAll('.seg').forEach(function (seg) {
      seg.addEventListener('click', function (e) {
        const b = e.target.closest('button'); if (!b) return;
        seg.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
        seg.dispatchEvent(new CustomEvent('segchange', { detail: b.dataset.v || b.textContent.trim(), bubbles: true }));
      });
    });
    // interruttori
    document.querySelectorAll('.toggle').forEach(function (t) {
      t.addEventListener('click', () => t.setAttribute('aria-checked', t.getAttribute('aria-checked') === 'true' ? 'false' : 'true'));
    });
    // righe di tabella cliccabili
    document.querySelectorAll('tr[data-href]').forEach(function (tr) {
      tr.addEventListener('click', () => { location.href = tr.dataset.href; });
    });
  });
})();
