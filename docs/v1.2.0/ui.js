/* time-machine-ui v1 · ui.js — shared behaviour for the time-machine products (classic script, no build).
   Exposes window.TMUI. Load after base.css; works on GitHub Pages, locally and inlined.
   Icons: Lucide (https://lucide.dev), ISC license, from lucide-static 0.460.0. */
(function () {
  'use strict';
  const ICONS = {
    'sliders-horizontal': '<line x1="21" x2="14" y1="4" y2="4" /><line x1="10" x2="3" y1="4" y2="4" /><line x1="21" x2="12" y1="12" y2="12" /><line x1="8" x2="3" y1="12" y2="12" /><line x1="21" x2="16" y1="20" y2="20" /><line x1="12" x2="3" y1="20" y2="20" /><line x1="14" x2="14" y1="2" y2="6" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="16" x2="16" y1="18" y2="22" />',
    'plus': '<path d="M5 12h14" /><path d="M12 5v14" />',
    'minus': '<path d="M5 12h14" />',
    'globe': '<circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />',
    'locate-fixed': '<line x1="2" x2="5" y1="12" y2="12" /><line x1="19" x2="22" y1="12" y2="12" /><line x1="12" x2="12" y1="2" y2="5" /><line x1="12" x2="12" y1="19" y2="22" /><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="3" />',
    'layout-grid': '<rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" />',
    'earth': '<path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" /><path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17" /><path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" /><circle cx="12" cy="12" r="10" />',
    'footprints': '<path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z" /><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z" /><path d="M16 17h4" /><path d="M4 13h4" />',
    'check': '<path d="M20 6 9 17l-5-5" />',
    'arrow-right': '<path d="M5 12h14" /><path d="m12 5 7 7-7 7" />',
    'chevron-down': '<path d="m6 9 6 6 6-6" />'
  };
  // <svg> string for a Lucide icon, same attributes the products used inline
  function icon(name, size = 18) {
    const b = ICONS[name]; if (!b) return '';
    return '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + b + '</svg>';
  }
  // fill every [data-icon] element under root with its icon (data-icon-size optional)
  function fillIcons(root = document) {
    root.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon, +el.dataset.iconSize || 18); });
  }

  // Edge fade + soften for a scrolling row (axis 'x') or panel (axis 'y'): while more content lies beyond an edge,
  // the marker element gets more-l/more-r (x) or more-t/more-b (y) — base.css fades that edge with a mask — and the
  // items reaching the outer part of the fade get .soft (blurred). Returns an update() to call after content changes.
  //   scroller  the element that scrolls
  //   marker    element that gets the more-* classes (default: scroller)
  //   items     () => list of elements that may soften (default: scroller.children)
  //   zone      px from the edge in which an item softens (default 28)
  //   maxSize   items larger than this along the axis only fade, never blur (default: no limit)
  //   observe   also re-check when these elements resize (default: scroller and its children)
  //   when      () => false skips the update (e.g. while the panel is hidden)
  function edgeFade(scroller, o = {}) {
    const x = o.axis !== 'y', marker = o.marker || scroller, zone = o.zone ?? 28, maxSize = o.maxSize ?? Infinity;
    const items = o.items || (() => scroller.children);
    const [lo, hi] = x ? ['more-l', 'more-r'] : ['more-t', 'more-b'];
    function update() {
      if (o.when && !o.when()) return;
      const pos = Math.abs(x ? scroller.scrollLeft : scroller.scrollTop);
      const view = x ? scroller.clientWidth : scroller.clientHeight, full = x ? scroller.scrollWidth : scroller.scrollHeight;
      const a = pos > 2, b = pos + view < full - 2;
      marker.classList.toggle(lo, a); marker.classList.toggle(hi, b);
      const r = scroller.getBoundingClientRect();
      for (const n of items()) {
        const q = n.getBoundingClientRect(), size = x ? q.width : q.height;
        const s = x ? (a && q.left < r.left + zone) || (b && q.right > r.right - zone)
                    : (a && q.top < r.top + zone) || (b && q.bottom > r.bottom - zone);
        n.classList.toggle('soft', size < maxSize && s);
      }
    }
    scroller.addEventListener('scroll', update, { passive: true });
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(update);
      (o.observe || [scroller, ...scroller.children]).forEach(el => ro.observe(el));
    } else addEventListener('resize', update);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
    return update;
  }

  // A panel opened by a button: toggles [hidden] and aria-expanded; closes on a press outside or Escape.
  //   ignore   extra elements whose presses do not close it (e.g. a dropdown that lives elsewhere)
  //   onOpen / onClose  callbacks
  function popover(button, panel, o = {}) {
    const ignore = o.ignore || [];
    const set = open => {
      panel.hidden = !open; button.setAttribute('aria-expanded', open);
      (open ? o.onOpen : o.onClose)?.();
    };
    button.addEventListener('click', e => { e.stopPropagation(); set(panel.hidden); });
    document.addEventListener('pointerdown', e => {
      if (!panel.hidden && !panel.contains(e.target) && !button.contains(e.target) && !ignore.some(el => el && el.contains(e.target))) set(false);
    });
    addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) set(false); });
    return { open: () => set(true), close: () => set(false), toggle: () => set(panel.hidden) };
  }

  // Segmented control of role="radio" buttons: keeps aria-checked in step and calls onPick(button)
  function segmented(group, onPick) {
    const bs = [...group.querySelectorAll('button')];
    bs.forEach(b => b.onclick = () => { bs.forEach(x => x.setAttribute('aria-checked', x === b)); onPick(b); });
    return bs;
  }


  // ---- time scales: map an age (larger = older; negative = future) to a position 0–100 % from the left (oldest) ----
  //   pct(age)       position in %          age(f)       age at fraction f (0 = oldest, 1 = newest)
  //   span(a, b)     width in % between two ages (a older than b)
  //   slider         how the range input is driven: { min, max, step, value(age), age(v) }
  const scale = {
    // same arithmetic the continent app always used, so linear timelines stay exact
    linear(oldest, newest, step = 0.5) {
      const F = oldest - newest;
      return { kind: 'linear', oldest, newest,
        pct: a => (oldest - a) / F * 100, span: (a, b) => (a - b) / F * 100, age: f => oldest - f * F,
        slider: { min: -oldest, max: -newest, step, value: a => -a, age: v => -v } };
    },
    // shifted logarithm x ∝ log(age + c): recent times get more room, smoothly, and the present (0) is included
    shiftedLog(oldest, newest = 0, c = 10) {
      const L = a => Math.log(a + c), L0 = L(oldest), D = L0 - L(newest);
      const pct = a => (L0 - L(a)) / D * 100, age = f => Math.exp(L0 - f * D) - c;
      return { kind: 'log', oldest, newest, c, pct, span: (a, b) => pct(b) - pct(a), age,
        slider: { min: 0, max: 1000, step: 'any', value: a => pct(a) * 10, age: v => age(v / 1000) } };
    },
  };

  // ---- timeline: period bands with hover/drag tooltip, tick labels, and the range input, on any scale ----
  // Markup (styles in base.css): .track > .strata + .tltip(i, b, span) + input[type=range]; .ticks next to it.
  //   o.track, o.strata, o.tip, o.ticks, o.slider   the elements
  //   o.scale        a TMUI.scale (can be swapped later with setScale)
  //   o.bands()      → [{ from, to, name, range, color } | { …, fut: true }]   (oldest first, covering the scale)
  //   o.tickList()   → [{ age, label, now? }]
  //   o.getAge()     → the current age (for the slider and the drag tooltip)
  //   o.onRebuild()  called after every rebuild (e.g. to re-place event dots)
  // Returns { rebuild, setScale, pct, scale, bandAt, hideTip }.
  function timeline(o) {
    let sc = o.scale, bands = [], tipBand = null, tipDrag = false;
    const { track, strata, tip, ticks, slider } = o;
    const FUT_SWATCH = 'repeating-linear-gradient(135deg,#9aa6c4 0 2px,#3b4560 2px 4px)';
    const bandAt = a => bands.find(b => a <= b.from && a >= b.to) || (a > 0 ? bands[0] : bands[bands.length - 1]);
    function showTip(bd, x) {                          // x: px from the track's left edge where the tooltip points
      if (tipBand !== bd) {
        bands.forEach(b => b.el.classList.toggle('hov', b === bd)); strata.classList.add('hovering');
        tip.querySelector('i').style.background = bd.fut ? FUT_SWATCH : bd.color;
        tip.querySelector('b').textContent = bd.name; tip.querySelector('span').textContent = bd.range;
        tip.hidden = false; tipBand = bd;
      }
      const half = tip.offsetWidth / 2, tw = track.clientWidth;
      const cx = Math.max(half - 8, Math.min(tw - half + 2, x));        // keep the bubble inside the dock
      tip.style.left = cx + 'px'; tip.style.setProperty('--ax', (half + x - cx) + 'px');
    }
    function hideTip() {
      if (!tipBand) return;
      tipBand = null; tip.hidden = true; strata.classList.remove('hovering');
      bands.forEach(b => b.el.classList.remove('hov'));
    }
    function rebuild() {
      strata.innerHTML = ''; ticks.innerHTML = '';
      const sl = sc.slider;
      slider.min = String(sl.min); slider.max = String(sl.max); if (sl.step != null) slider.step = String(sl.step);
      slider.value = String(sl.value(o.getAge()));
      bands = o.bands();
      for (const bd of bands) {
        const d = document.createElement('div');
        d.style.width = sc.span(bd.from, bd.to) + '%';
        if (bd.fut) d.className = 'fut'; else d.style.background = bd.color;
        strata.appendChild(d); bd.el = d;
      }
      for (const tk of o.tickList()) {
        const x = sc.pct(tk.age), sp = document.createElement('span'); sp.style.left = x + '%';
        sp.textContent = tk.label;
        if (tk.now) sp.className = 'now';
        if (x < 4) sp.style.transform = 'none';                    // edge labels stay inside the bar
        if (x > 96) sp.style.transform = 'translateX(-100%)';
        ticks.appendChild(sp);
      }
      tipBand = null; tip.hidden = true; strata.classList.remove('hovering');
      o.onRebuild?.();
    }
    track.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' || e.buttons) return;
      const r = strata.getBoundingClientRect(), f = (e.clientX - r.left) / r.width;
      if (f < 0 || f > 1) return hideTip();
      const bd = bandAt(sc.age(f));
      showTip(bd, (sc.pct(bd.from) + sc.pct(bd.to)) / 200 * r.width);
    });
    track.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') hideTip(); });
    function thumbTip() {                               // tooltip over the handle while it is dragged (touch / pen)
      const tw = track.clientWidth, f = (+slider.value - +slider.min) / (+slider.max - +slider.min);
      showTip(bandAt(sc.slider.age(+slider.value)), 10 + f * (tw - 20));  // handle travels 10px … width-10px; age from the handle itself
    }
    track.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse') { hideTip(); return; }
      tipDrag = true; requestAnimationFrame(thumbTip);
    });
    slider.addEventListener('input', () => { if (tipDrag) thumbTip(); });
    ['pointerup', 'pointercancel'].forEach(k => addEventListener(k, () => { if (tipDrag) { tipDrag = false; hideTip(); } }));
    const api = { rebuild, hideTip, bandAt, pct: a => sc.pct(a), get scale() { return sc; },
      setScale(next) { sc = next; rebuild(); } };
    return api;
  }

  window.TMUI = { version: '1.2.0', icon, fillIcons, edgeFade, popover, segmented, scale, timeline };
})();
