/* Oncoria — interazioni comuni del mockup */
(function () {
  const root = document.documentElement;
  const KEY = 'oncoria-theme';
  try { const t = localStorage.getItem(KEY); if (t) root.setAttribute('data-theme', t); } catch (e) {}
  function isDark() {
    return root.getAttribute('data-theme') === 'dark';
  }
  const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>';
  const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('theme');
    if (btn) {
      const sync = () => { btn.setAttribute('aria-label', isDark() ? 'Passa al tema chiaro' : 'Passa al tema notturno'); btn.setAttribute('title', isDark() ? 'Tema chiaro' : 'Tema notturno'); btn.innerHTML = isDark() ? SUN : MOON; };
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
