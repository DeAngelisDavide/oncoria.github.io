/* Oncoria — app del paziente: interazioni del mockup (stato salvato solo in questo browser) */
(function () {
  const get = k => { try { return localStorage.getItem('oncoria-pt-' + k); } catch (e) { return null; } };
  const set = (k, v) => { try { localStorage.setItem('oncoria-pt-' + k, v); } catch (e) {} };
  const body = document.body;

  // presenza confermata
  function applyConfirmed() {
    const on = get('confirmed') === '1';
    body.classList.toggle('confirmed', on);
    const st = document.getElementById('st-conf');
    if (st) { st.classList.toggle('done', on); st.querySelector('small').textContent = on ? 'Hai confermato la tua presenza' : 'Dopo gli esami e la tua conferma'; }
    document.querySelectorAll('input[data-confirm]').forEach(i => { i.checked = on; });
  }
  const c = document.getElementById('confirm');
  if (c) c.addEventListener('click', () => { set('confirmed', '1'); set('chk-presenza', '1'); applyConfirmed(); });

  // checklist
  document.querySelectorAll('.pt-check input[data-key]').forEach(i => {
    if (get('chk-' + i.dataset.key) === '1') i.checked = true;
    i.addEventListener('change', () => {
      set('chk-' + i.dataset.key, i.checked ? '1' : '0');
      if (i.hasAttribute('data-confirm')) { set('confirmed', i.checked ? '1' : '0'); applyConfirmed(); }
    });
  });
  applyConfirmed();

  // notifiche lette
  function applyRead() { if (get('read') === '1') document.querySelectorAll('[data-unread]').forEach(e => e.remove()); }
  const ra = document.getElementById('readall');
  if (ra) ra.addEventListener('click', () => { set('read', '1'); applyRead(); });
  if (location.pathname.endsWith('notifiche.html')) setTimeout(() => set('read', '1'), 1500);
  applyRead();

  // pannelli e invii simulati
  document.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => {
    const s = document.getElementById(b.dataset.open); s.classList.toggle('open'); if (s.classList.contains('open')) s.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }));
  document.querySelectorAll('[data-send]').forEach(b => b.addEventListener('click', () => {
    document.getElementById(b.dataset.send).classList.add('show'); b.disabled = true; b.textContent = 'Inviato';
  }));

  // documenti: filtro
  const seg = document.getElementById('docseg');
  if (seg) seg.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    seg.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    document.querySelectorAll('#docs .pt-doc').forEach(d => { d.style.display = (b.dataset.v === 'all' || d.dataset.cat === b.dataset.v) ? '' : 'none'; });
  });

  // calendario
  const cal = document.getElementById('cal');
  if (cal) {
    const MONTHS = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    const WD = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
    const EV = [
      ['2026-09-08', 'lab', 'Esami del sangue', '8:00 · Laboratorio analisi, AOU Ruggi'],
      ['2026-09-10', 'ther', 'Seduta · ciclo 5', 'Fatta · Day Hospital, AOU Ruggi'],
      ['2026-09-29', 'lab', 'Esami del sangue', '8:00 · Laboratorio analisi, AOU Ruggi · conferma la presenza entro oggi'],
      ['2026-10-01', 'ther', 'Seduta · ciclo 6', '9:30 · Day Hospital Oncologico, AOU Ruggi', 'seduta.html'],
      ['2026-10-20', 'lab', 'Esami del sangue', '8:00 · Laboratorio analisi, AOU Ruggi'],
      ['2026-10-21', 'vis', 'Visita di controllo', 'Con la tua oncologa · orario da confermare'],
      ['2026-10-22', 'ther', 'Seduta · ciclo 7', 'Orario in definizione'],
      ['2026-11-10', 'lab', 'Esami del sangue', '8:00 · Laboratorio analisi, AOU Ruggi'],
      ['2026-11-12', 'ther', 'Seduta · ciclo 8', 'Orario in definizione'],
    ];
    const TODAY = '2026-09-25';
    let m = 9; // ottobre (0-based)
    const pad = n => String(n).padStart(2, '0');
    function draw() {
      const y = 2026, first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate();
      const off = (first.getDay() + 6) % 7, prevDays = new Date(y, m, 0).getDate();
      document.getElementById('mlabel').textContent = MONTHS[m] + ' ' + y;
      let h = ['L', 'M', 'M', 'G', 'V', 'S', 'D'].map(d => '<span class="h" role="columnheader">' + d + '</span>').join('');
      for (let i = 0; i < off; i++) h += '<span class="x">' + (prevDays - off + 1 + i) + '</span>';
      for (let d = 1; d <= days; d++) {
        const iso = y + '-' + pad(m + 1) + '-' + pad(d), ev = EV.find(e => e[0] === iso);
        const cls = [ev ? ev[1] : '', iso === TODAY ? 'today' : ''].join(' ').trim();
        h += '<span' + (cls ? ' class="' + cls + '"' : '') + (ev ? ' title="' + ev[2] + '"' : '') + '>' + d + '</span>';
      }
      const tail = (7 - (off + days) % 7) % 7;
      for (let i = 1; i <= tail; i++) h += '<span class="x">' + i + '</span>';
      cal.innerHTML = h;
      const list = EV.filter(e => +e[0].slice(5, 7) === m + 1);
      document.getElementById('evlist').innerHTML = list.length ? list.map(e => {
        const dt = new Date(e[0] + 'T12:00:00'), tag = e[4] ? 'a href="' + e[4] + '"' : 'div';
        return '<' + tag + ' class="pt-ev ' + (e[1] === 'ther' ? '' : e[1]) + '"' + (e[0] < TODAY ? ' style="opacity:.6"' : '') + '><div class="pt-dd"><small>' + WD[dt.getDay()] + '</small><b>' + dt.getDate() + '</b></div><div><b>' + e[2] + '</b><small>' + e[3] + '</small></div></' + (e[4] ? 'a' : 'div') + '>';
      }).join('') : '<p class="onc-muted" style="font-size:14px">Nessun appuntamento in questo mese.</p>';
      document.getElementById('prev').disabled = m <= 8; document.getElementById('next').disabled = m >= 10;
    }
    document.getElementById('prev').addEventListener('click', () => { if (m > 8) { m--; draw(); } });
    document.getElementById('next').addEventListener('click', () => { if (m < 10) { m++; draw(); } });
    draw();
  }
})();
