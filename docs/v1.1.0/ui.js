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

  window.TMUI = { version: '1.1.0', icon, fillIcons, edgeFade, popover, segmented };
})();
