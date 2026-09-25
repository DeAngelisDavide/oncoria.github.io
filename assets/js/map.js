/* Oncoria — mappa della rete (provincia di Salerno). Dati simulati in data.js */
(function () {
  const D = window.ONC;
  const byId = Object.fromEntries(D.nodes.map(n => [n.id, n]));
  const STATE = {
    deficit: { c: 'var(--deficit)', f: 'var(--deficit-tint)', l: 'Deficit' },
    watch: { c: 'var(--watch)', f: 'var(--watch-tint)', l: 'A rischio' },
    balance: { c: 'var(--balance)', f: 'var(--balance-tint)', l: 'Equilibrio' },
    surplus: { c: 'var(--mint-ink)', f: 'var(--mint-tint)', l: 'Surplus' }
  };
  const fs = v => v === 0 ? '0' : (v > 0 ? '+' + v : '−' + (-v));
  function km(a, b) {
    if (a === 'ruggi') return byId[b].km;
    if (b === 'ruggi') return byId[a].km;
    const A = byId[a], B = byId[b], R = 6371, r = Math.PI / 180;
    const dLat = (B.lat - A.lat) * r, dLon = (B.lon - A.lon) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(A.lat * r) * Math.cos(B.lat * r) * Math.sin(dLon / 2) ** 2;
    return Math.round(2 * R * Math.asin(Math.sqrt(h)) * 1.35 / 5) * 5;
  }
  function eta(k) {
    const h = Math.round((2 + k / 60) * 2) / 2;
    const H = Math.floor(h);
    return '~' + H + ' h' + (h > H ? ' 30' : '');
  }
  const radius = s => 10 + Math.sqrt(s) * 4;

  /* Suggerimenti: per ogni presidio in deficit, il cedente più vicino in surplus
     che copre l'intero deficit e resta in equilibrio dopo la cessione. */
  function suggestions(drug) {
    const val = D.values, out = [];
    const busy = D.transfers.filter(t => t.drug === drug && t.status !== 'received');
    D.nodes.forEach(n => {
      const v = val[n.id][drug];
      if (v.state !== 'deficit') return;
      const need = v.fabb - v.stock;
      if (busy.some(t => t.dst === n.id)) return;
      const cands = D.nodes.filter(m => m.id !== n.id)
        .map(m => ({ m, v: val[m.id][drug], k: km(m.id, n.id) }))
        .filter(o => o.v.state === 'surplus' && o.v.stock - o.v.fabb >= need)
        .sort((a, b) => a.k - b.k);
      if (cands[0]) out.push({ src: cands[0].m.id, dst: n.id, qty: need, km: cands[0].k, eta: eta(cands[0].k), alt: cands[1] ? { src: cands[1].m.id, km: cands[1].k, eta: eta(cands[1].k) } : null });
    });
    return out;
  }

  function curve(a, b, bend, ra, rb) {
    const [x1, y1] = a.xy, [x2, y2] = b.xy;
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    const mx = (x1 + x2) / 2 - dy / L * bend, my = (y1 + y2) / 2 + dx / L * bend;
    const t1 = ra / Math.hypot(mx - x1, my - y1), t2 = rb / Math.hypot(mx - x2, my - y2);
    const sx = x1 + (mx - x1) * t1, sy = y1 + (my - y1) * t1;
    const ex = x2 + (mx - x2) * t2, ey = y2 + (my - y2) * t2;
    return { nx: -dy / L * Math.sign(bend), ny: dx / L * Math.sign(bend), d: `M${sx.toFixed(1)},${sy.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`, mx: (sx + 2 * mx + ex) / 4, my: (sy + 2 * my + ey) / 4 };
  }

  function render(el, opt) {
    opt = Object.assign({ drug: 'tdxd', you: 'ruggi', alt: true, link: null }, opt || {});
    const drug = D.drugs.find(d => d.id === opt.drug);
    const g = D.geo, V = D.values;
    let s = `<svg class="map" viewBox="0 0 ${g.W} ${g.H}" role="img" aria-label="Mappa della provincia di Salerno: saldo a 14 giorni di ${drug.name} per presidio">
<defs><marker id="ar-${el.id}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--mint-ink)"/></marker>
<pattern id="sea-${el.id}" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="0.9" fill="var(--line)"/></pattern></defs>
<rect width="${g.W}" height="${g.H}" fill="url(#sea-${el.id})"/>
<path d="${g.com}" class="com"/><path d="${g.outline}" class="prov"/>`;
    D.areas.forEach(([t, c, [x, y], a]) => { s += `<text x="${x}" y="${y}" class="${c}" text-anchor="${a}">${t}</text>`; });
    const r = id => radius(V[id][drug.id].stock);
    const sugg = suggestions(drug.id);
    // alternative
    if (opt.alt) sugg.forEach(sg => {
      if (!sg.alt) return;
      const cv = curve(byId[sg.alt.src], byId[sg.dst], -60, r(sg.alt.src) + 4, r(sg.dst) + 6);
      s += `<path d="${cv.d}" class="alt"/><text x="${cv.mx.toFixed(0)}" y="${(cv.my + 16).toFixed(0)}" class="altl" text-anchor="middle">alternativa · ${sg.alt.km} km · ${sg.alt.eta}</text>`;
    });
    // transfers in corso
    D.transfers.filter(t => t.drug === drug.id && t.status !== 'received').forEach(t => {
      const cv = curve(byId[t.src], byId[t.dst], 24, r(t.src) + 3, r(t.dst) + 3);
      const id = `${el.id}-${t.id}`;
      s += `<path id="${id}" d="${cv.d}" class="${t.status === 'transit' ? 'transit' : 'reserved'}"/>`;
      if (t.status === 'transit') s += `<circle r="5" class="truck"><animateMotion dur="6s" repeatCount="indefinite"><mpath href="#${id}"/></animateMotion></circle>`;
      s += `<text x="${cv.mx.toFixed(0)}" y="${(cv.my + 16).toFixed(0)}" class="trl" text-anchor="middle" dy="10">${t.id} · ${t.status === 'transit' ? 'in viaggio' : 'riservato'}</text>`;
    });
    // suggerimenti
    sugg.forEach(sg => {
      const cv = curve(byId[sg.src], byId[sg.dst], 28, r(sg.src) + 3, r(sg.dst) + 8);
      s += `<path d="${cv.d}" class="sugg" marker-end="url(#ar-${el.id})"/>`;
      const S0 = byId[sg.src].xy, rs = r(sg.src); const px = Math.max(4, Math.min(g.W - 124, S0[0] - 60 + cv.nx * (rs + 34))), py = Math.max(4, Math.min(g.H - 40, S0[1] - 18 + cv.ny * (rs + 34)));
      s += `<g transform="translate(${px.toFixed(0)},${py.toFixed(0)})"><rect width="120" height="36" rx="8" class="pill"/><text x="60" y="15" class="pillt" text-anchor="middle">Suggerito · ${sg.qty} ${sg.qty > 1 ? drug.unit : drug.u1}</text><text x="60" y="29" class="pills" text-anchor="middle">${sg.km} km · ${sg.eta}</text></g>`;
    });
    // nodi
    D.nodes.forEach(n => {
      const v = V[n.id][drug.id], st = STATE[v.state], sal = v.stock - v.fabb, [x, y] = n.xy, rr = r(n.id);
      const [dx, dy, anc] = n.lab, you = n.id === opt.you;
      const inner = `<title>${n.name}, ${n.town} — giacenza ${v.stock}, fabbisogno 14 gg ${v.fabb}, saldo ${fs(sal)} (${st.l})</title>` +
        (you ? `<circle cx="${x}" cy="${y}" r="${(rr + 7).toFixed(0)}" class="halo"/>` : '') +
        `<circle cx="${x}" cy="${y}" r="${rr.toFixed(1)}" class="dot" style="fill:${st.f};stroke:${st.c}"/>` +
        `<text x="${x}" y="${y + 4.5}" text-anchor="middle" class="sal" style="fill:${st.c}">${fs(sal)}</text>` +
        `<text x="${x + dx}" y="${y + dy}" text-anchor="${anc}" class="nm">${n.town}${you ? ' · il tuo presidio' : ''}</text>` +
        `<text x="${x + dx}" y="${y + dy + 14}" text-anchor="${anc}" class="nms">${n.short}</text>`;
      s += opt.link ? `<a href="${opt.link}#${n.id}" class="node">${inner}</a>` : `<g class="node" data-node="${n.id}">${inner}</g>`;
    });
    s += '</svg>';
    s += `<div class="mlegend"><span><i style="background:var(--deficit-tint);border-color:var(--deficit)"></i>Deficit</span><span><i style="background:var(--watch-tint);border-color:var(--watch)"></i>A rischio</span><span><i style="background:var(--balance-tint);border-color:var(--balance)"></i>Equilibrio</span><span><i style="background:var(--mint-tint);border-color:var(--mint-ink)"></i>Surplus</span><span><b class="ln"></b>Suggerito</span><span><b class="ln ln-transit"></b>In viaggio</span></div>`;
    el.innerHTML = s;
    return sugg;
  }
  window.OncMap = { render, suggestions, km, eta, fs, STATE, byId };
})();
