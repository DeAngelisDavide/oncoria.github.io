/* Oncoria — grafico della giacenza proiettata (dati simulati in sched.js) */
(function () {
  const S = window.ONC_SCHED;
  function series(drug, withRealloc) {
    const sc = S.sched[drug]; let s = S.stock[drug]; const out = [];
    for (let d = 0; d < 14; d++) {
      s += (sc.orders[d] || 0);
      if (withRealloc && sc.realloc && sc.realloc.day === d) s += sc.realloc.qty;
      s -= (sc.adm[d] || 0); out.push(s);
    }
    return out;
  }
  function proj(el, drug, opt) {
    const base = Object.assign({ w: 640, h: 240 }, opt || {});
    el._drug = drug; el._base = base;
    if (!el._onc) { el._onc = true; let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => proj(el, el._drug, el._base), 150); }); }
    opt = Object.assign({}, base);
    const cw = el.clientWidth; if (cw) { opt.h = Math.round(base.h * Math.min(1.15, Math.max(.9, cw / base.w))); opt.w = Math.max(420, cw); }
    const sc = S.sched[drug], a = series(drug, false), b = sc.realloc ? series(drug, true) : null;
    const all = a.concat(b || [], [S.stock[drug], sc.min]);
    const lo = Math.min(-2, ...all), hi = Math.max(...all) + 1;
    const L = 34, R = 12, T = 30, B = 58, W = opt.w, H = opt.h;
    const x = i => L + (W - L - R) * i / 14, y = v => T + (H - T - B) * (hi - v) / (hi - lo);
    const step = arr => { let p = `M${x(0)},${y(S.stock[drug])}`; arr.forEach((v, i) => { p += ` H${x(i + 0.5)} V${y(v)}`; }); return p + ` H${x(14)}`; };
    let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Giacenza proiettata a 14 giorni">`;
    // weekend
    [1, 2, 8, 9].forEach(d => { s += `<rect x="${x(d)}" y="${T}" width="${x(1) - x(0)}" height="${H - T - B}" fill="var(--surface-100)" opacity=".6"/>`; });
    // area deficit
    s += `<rect x="${L}" y="${y(0)}" width="${W - L - R}" height="${y(lo) - y(0)}" fill="var(--deficit-tint)"/>`;
    s += `<text x="${W - R - 4}" y="${y(lo) - 6}" text-anchor="end" style="fill:var(--deficit);font-weight:700">sotto zero = pazienti scoperti</text>`;
    // griglia
    const ticks = []; const stepv = hi - lo > 12 ? 5 : 2;
    for (let v = Math.ceil(lo / stepv) * stepv; v <= hi; v += stepv) ticks.push(v);
    ticks.forEach(v => { s += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="${v === 0 ? 'var(--line-strong)' : 'var(--line)'}" ${v === 0 ? '' : 'stroke-dasharray="3 3"'}/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`; });
    // scorta minima
    s += `<line x1="${L}" x2="${W - R}" y1="${y(sc.min)}" y2="${y(sc.min)}" stroke="var(--watch)" stroke-dasharray="6 4"/><text x="${L + 4}" y="${y(sc.min) - 5}" style="fill:var(--watch);font-weight:600">scorta minima ${sc.min}</text>`;
    // linee
    s += `<path d="${step(a)}" fill="none" stroke="var(--brand)" stroke-width="2.5"/>`;
    if (b) s += `<path d="${step(b)}" fill="none" stroke="var(--mint-ink)" stroke-width="2.5" stroke-dasharray="7 4"/>`;
    // somministrazioni e ordini
    for (let d = 0; d < 14; d++) {
      const cx = x(d + 0.5);
      if (sc.adm[d]) s += `<rect x="${cx - 9}" y="${H - B + 6}" width="18" height="14" rx="3" fill="var(--brand-tint)"/><text x="${cx}" y="${H - B + 17}" text-anchor="middle" style="fill:var(--brand);font-weight:700">−${sc.adm[d]}</text>`;
      if (sc.orders[d]) s += `<path d="M${cx - 6},${T + 2} h12 l-6,8z" fill="var(--brand)"/><text x="${cx}" y="${T - 4}" text-anchor="middle" style="fill:var(--brand);font-weight:700">ordine +${sc.orders[d]}</text>`;
      if (b && sc.realloc.day === d) s += `<path d="M${cx - 6},${T + 2} h12 l-6,8z" fill="var(--mint-ink)"/><text x="${cx}" y="${T - 4}" text-anchor="middle" style="fill:var(--mint-ink);font-weight:700">+${sc.realloc.qty} da ${sc.realloc.from.split(' ')[0]}</text>`;
      s += `<text x="${cx}" y="${H - B + 36}" text-anchor="middle">${S.days[d].split(' ')[1]}</text>`;
      if (d === 0 || S.days[d].startsWith('lun')) s += `<text x="${cx}" y="${H - B + 50}" text-anchor="middle" style="font-weight:600">${S.days[d].split(' ')[0]}</text>`;
    }
    s += `</svg><div class="onc-meter__legend" style="margin-top:6px"><span><i style="background:var(--brand)"></i>Giacenza con i soli ordini</span>${b ? `<span><i style="background:var(--mint-ink)"></i>Con riallocazione da ${sc.realloc.from} (+${sc.realloc.qty})</span>` : ''}<span><i style="background:var(--brand-tint)"></i>Unità somministrate</span><span><i style="background:var(--watch)"></i>Scorta minima</span></div>`;
    el.innerHTML = s;
    return { a, b };
  }
  window.OncChart = { proj, series };
})();
