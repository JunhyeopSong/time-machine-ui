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

  // ---- globe shell (three.js r128, global THREE): scene, atmosphere rim, lights, a distant star sky that wheels
  // around a celestial pole as time flows, and Google-Earth-like navigation (grab-and-drag with north up, pinch and
  // wheel zoom, inertia, double-click to fly, Shift+arrows / + − keys, auto-rotate).
  //   o.stage       element that receives the canvas
  //   o.texture     canvas painted by the product (the globe's surface)
  //   o.onView()    after every view change (e.g. scale a city marker by distance)
  //   o.onStopAuto()  when auto-rotate is switched off by an interaction (e.g. untick a checkbox)
  //   o.stars       { layers, jump, maxRate } — drift per time unit; defaults suit millions of years
  // Call resize() once the product's own objects exist, and every frame: stepTween(now), stepInertia(dt),
  // applyView(), drift(dt, age), then renderer.render(scene, camera).
  function globe(o) {
    const THREE = window.THREE, D2R = Math.PI / 180;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    o.stage.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 4.3);
    // the globe rotates; the camera stays on +Z looking at the centre
    const earth = new THREE.Group(); scene.add(earth);
    const texture = new THREE.CanvasTexture(o.texture);
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 96), new THREE.MeshPhongMaterial({ map: texture, shininess: 12, specular: 0x223344 }));
    earth.add(mesh);
    // atmosphere rim
    const atm = new THREE.Mesh(new THREE.SphereGeometry(1.06, 64, 48), new THREE.ShaderMaterial({
      transparent: true, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: 'varying vec3 n; void main(){ n = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'varying vec3 n; void main(){ float i = pow(0.72 - dot(n, vec3(0,0,1.0)), 3.0); gl_FragColor = vec4(0.35,0.6,1.0,1.0) * i; }',
    }));
    scene.add(atm);
    scene.add(new THREE.AmbientLight(0xffffff, 0.62));
    const sun = new THREE.DirectionalLight(0xffffff, 0.7); sun.position.set(-2, 1.5, 3);
    camera.add(sun); scene.add(camera);

    // navigation state: orientation = Rx(tilt) * Ry(spin); tilt > 0 brings the northern hemisphere toward the viewer
    const MIN_D = 1.22, MAX_D = 9, TILT_MAX = 85 * D2R;
    const view = { spin: 0, tilt: 0.45, dist: 4.3 };
    let vel = { spin: 0, tilt: 0 };      // inertia, radians per second
    let tween = null;                    // animated fly-to
    let autoSpin = true;
    const qX = new THREE.Quaternion(), qY = new THREE.Quaternion(), AX = new THREE.Vector3(1, 0, 0), AY = new THREE.Vector3(0, 1, 0);
    const wrapA = a => Math.atan2(Math.sin(a), Math.cos(a));

    // stars: a far-away sky. It turns only a little when the globe is dragged (so it reads as distant), and while
    // time moves it wheels slowly around a celestial pole, like star trails seen from Earth: counter-clockwise toward
    // the future, clockwise toward the past. Brightness layers turn at slightly different rates for a hint of depth.
    const so = o.stars || {};
    const sky = new THREE.Group(); scene.add(sky);
    const SKY_FOLLOW = 0.22;                    // share of the globe's drag rotation the sky follows
    const celestial = new THREE.Group(); sky.add(celestial);
    const starDot = (() => {                    // soft round dot, so stars are not square sprites
      const c = document.createElement('canvas'); c.width = c.height = 32;
      const g = c.getContext('2d'), gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,.85)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 32, 32); return new THREE.CanvasTexture(c);
    })();
    const STAR_LAYERS = (so.layers || [         // count, point size (CSS px), colour, drift (rad per time unit)
      { n: 1700, px: 1.5, color: 0x8794b4, k: 0.005 },
      { n: 520, px: 2.1, color: 0xaab8d6, k: 0.008 },
      { n: 180, px: 2.8, color: 0xdde5f5, k: 0.011 },
    ]).map(L => {
      const pos = new Float32Array(L.n * 3);
      for (let i = 0; i < L.n; i++) {
        const u = Math.random()*2-1, th = Math.random()*Math.PI*2, r = 60 + Math.random()*25, s = Math.sqrt(1-u*u);
        pos.set([r*s*Math.cos(th), r*u, r*s*Math.sin(th)], i*3);
      }
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: L.color, size: L.px * renderer.getPixelRatio(), sizeAttenuation: false, map: starDot, transparent: true, depthWrite: false }));
      celestial.add(pts); return { pts, k: L.k };
    });
    let skySpin = 0, skyTilt = 0, skyPrev = null, poleSet = false;
    const qSX = new THREE.Quaternion(), qSY = new THREE.Quaternion();
    function followSky() {                      // a fraction of the globe's rotation, so the stars feel much farther away
      if (skyPrev === null) skyPrev = { spin: view.spin, tilt: view.tilt };
      const ds = wrapA(view.spin - skyPrev.spin), dt = view.tilt - skyPrev.tilt;
      if (Math.abs(ds) < 0.5) skySpin += ds * SKY_FOLLOW;          // instant jumps (start-up placement) are not motion
      if (Math.abs(dt) < 0.5) skyTilt = Math.max(-0.4, Math.min(0.4, skyTilt + dt * SKY_FOLLOW));
      skyPrev.spin = view.spin; skyPrev.tilt = view.tilt;
      qSX.setFromAxisAngle(AX, skyTilt); qSY.setFromAxisAngle(AY, skySpin);
      sky.quaternion.copy(qSX).multiply(qSY);
      if (!poleSet) {                           // put the celestial pole at a point in the upper left of the first view
        poleSet = true; sky.updateMatrixWorld();
        const ray = new THREE.Vector3(-0.56, 0.62, 0.5).unproject(camera).sub(camera.position).normalize();
        const dir = camera.position.clone().addScaledVector(ray, 72).normalize();
        dir.applyQuaternion(sky.quaternion.clone().invert());
        celestial.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      }
    }
    const calmMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const JUMP = so.jump ?? 4, MAX_RATE = so.maxRate ?? 6;
    let starRate = 0, starAge = null;          // smoothed time units per second toward the future (negative = past)
    function drift(dt, age) {
      followSky();
      if (starAge === null) starAge = age;
      let d = starAge - age; starAge = age;
      if (Math.abs(d) > JUMP) d = 0;            // a jump (shortcut chip, event) is not a flow
      const want = dt > 0 ? Math.max(-MAX_RATE, Math.min(MAX_RATE, d / dt)) : 0;
      starRate += (want - starRate) * Math.min(1, dt * 2);
      if (calmMotion.matches || Math.abs(starRate) < 1e-4) return;
      for (const L of STAR_LAYERS) L.pts.rotation.y -= starRate * L.k * dt;
    }

    function applyView() {
      view.tilt = Math.max(-TILT_MAX, Math.min(TILT_MAX, view.tilt));
      view.dist = Math.max(MIN_D, Math.min(MAX_D, view.dist));
      qX.setFromAxisAngle(AX, view.tilt); qY.setFromAxisAngle(AY, view.spin);
      earth.quaternion.copy(qX).multiply(qY);
      camera.position.set(0, 0, view.dist); camera.lookAt(0, 0, 0);
      camera.near = Math.max(0.01, (view.dist - 1) * 0.5); camera.updateProjectionMatrix();
      o.onView?.(view);
      camera.updateMatrixWorld(); earth.updateMatrixWorld();
    }
    // where a screen point hits the unit sphere (world space), or null
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    function hitSphere(cx, cy) {
      ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const r0 = ray.ray.origin, d = ray.ray.direction, b = r0.dot(d), c = r0.dot(r0) - 1, disc = b * b - c;
      if (disc < 0) return null;
      return r0.clone().addScaledVector(d, -b - Math.sqrt(disc));
    }
    // rotate so the geographic point under h0 moves to h1 (both world-space hits)
    function dragBy(h0, h1) {
      const ct = Math.cos(view.tilt), st = Math.sin(view.tilt);
      const az = h => { const y = h.y * ct + h.z * st, z = -h.y * st + h.z * ct; return Math.atan2(h.x, z); }; // undo tilt
      const ds = wrapA(az(h1) - az(h0));
      const dt = -(Math.atan2(h1.y, h1.z) - Math.atan2(h0.y, h0.z));
      view.spin += ds; view.tilt += dt;
      return { ds, dt };
    }
    function zoomAt(factor, cx, cy) {
      const h0 = cx == null ? null : hitSphere(cx, cy), held = h0 ? earth.worldToLocal(h0) : null;
      view.dist = 1 + (view.dist - 1) * factor; applyView();
      if (held) for (let i = 0; i < 4; i++) { // keep the point under the cursor fixed while zooming
        const h = hitSphere(cx, cy); if (!h) break;
        dragBy(earth.localToWorld(held.clone()), h); applyView();
      }
    }
    function flyTo(spin, tilt, dist, dur = 900) {
      tween = { s0: view.spin, t0: view.tilt, d0: view.dist, ds: wrapA(spin - view.spin), dt: tilt - view.tilt, dd: (dist ?? view.dist) - view.dist, start: performance.now(), dur };
      vel = { spin: 0, tilt: 0 };
    }
    function stepTween(now) {
      if (!tween) return;
      let f = Math.min(1, (now - tween.start) / tween.dur); f = f < .5 ? 4*f*f*f : 1 - Math.pow(-2*f + 2, 3) / 2;
      view.spin = tween.s0 + tween.ds * f; view.tilt = tween.t0 + tween.dt * f; view.dist = tween.d0 + tween.dd * f;
      if (f >= 1) tween = null;
    }
    function stopAuto() { if (autoSpin) { autoSpin = false; o.onStopAuto?.(); } }
    // face a local (globe-frame) point
    function faceLocal(p, dist) {
      const v = p.clone().normalize();
      flyTo(-Math.atan2(v.x, v.z), Math.max(-TILT_MAX, Math.min(TILT_MAX, Math.asin(v.y) - 0.12)), dist);
    }

    // pointer handling: one pointer drags, two pointers pinch-zoom and drag
    const cvs = renderer.domElement, pts = new Map();
    let last = null, anchor = null, pinch0 = null, samples = [];
    cvs.style.cursor = 'grab';
    function centroid() { let x = 0, y = 0; pts.forEach(p => { x += p.x; y += p.y; }); return { x: x / pts.size, y: y / pts.size }; }
    function spread() { const a = [...pts.values()]; return a.length < 2 ? 0 : Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y); }
    // the geographic point (globe frame) that is held under the cursor / finger centroid
    function grab(c) { const h = hitSphere(c.x, c.y); anchor = h ? earth.worldToLocal(h) : null; last = c; }
    cvs.addEventListener('pointerdown', e => {
      view.touched = true;
      try { cvs.setPointerCapture(e.pointerId); } catch (_) {}
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      stopAuto(); tween = null; vel = { spin: 0, tilt: 0 }; samples = [];
      grab(centroid()); pinch0 = pts.size === 2 ? spread() : null;
      cvs.style.cursor = 'grabbing';
    });
    cvs.addEventListener('pointermove', e => {
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const c = centroid(), now = performance.now(), s0 = view.spin, t0 = view.tilt;
      if (pts.size === 2 && pinch0) {
        const s = spread();
        if (s > 4) { view.dist = 1 + (view.dist - 1) * (pinch0 / s); applyView(); pinch0 = s; }
      }
      let held = false;
      if (anchor) {
        for (let i = 0; i < 4; i++) { // converge so the held point sits exactly under the cursor
          const h = hitSphere(c.x, c.y); if (!h) break;
          dragBy(earth.localToWorld(anchor.clone()), h); applyView(); held = true;
        }
      }
      if (!held) { // off the globe: turn by pixel distance, slower when zoomed in
        const k = 0.0035 * Math.min(1.5, (view.dist - 1) / 2.5 + 0.08);
        view.spin += (c.x - last.x) * k; view.tilt += (c.y - last.y) * k; applyView();
        grab(c);
      }
      last = c;
      samples.push({ t: now, ds: wrapA(view.spin - s0), dt: view.tilt - t0 }); samples = samples.filter(s => now - s.t < 90);
    });
    function endPointer(e) {
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId);
      if (pts.size === 0) {
        const now = performance.now(), recent = samples.filter(s => now - s.t < 90);
        if (recent.length > 1) {
          const span = Math.max(16, now - recent[0].t) / 1000;
          vel = { spin: recent.reduce((a, s) => a + s.ds, 0) / span, tilt: recent.reduce((a, s) => a + s.dt, 0) / span };
        }
        cvs.style.cursor = 'grab';
      } else { grab(centroid()); pinch0 = pts.size === 2 ? spread() : null; }
    }
    cvs.addEventListener('pointerup', endPointer); cvs.addEventListener('pointercancel', endPointer);
    cvs.addEventListener('wheel', e => {
      e.preventDefault(); stopAuto(); tween = null;
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      zoomAt(Math.exp(Math.max(-1, Math.min(1, dy * 0.0016))), e.clientX, e.clientY);
    }, { passive: false });
    cvs.addEventListener('dblclick', e => {
      const h = hitSphere(e.clientX, e.clientY); if (!h) return;
      stopAuto();
      faceLocal(earth.worldToLocal(h.clone()), 1 + (view.dist - 1) * (e.shiftKey ? 2 : 0.45));
    });
    addEventListener('keydown', e => {
      if (/INPUT|SELECT|BUTTON/.test(e.target.tagName) && e.target.type !== 'checkbox') return;
      const step = 0.12 * Math.min(1, (view.dist - 1) / 2.5 + 0.1);
      const k = e.shiftKey ? { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }[e.key]
        : { ArrowUp: [0, step], ArrowDown: [0, -step] }[e.key];
      if (k) { e.preventDefault(); stopAuto(); flyTo(view.spin + k[0], view.tilt + k[1], view.dist, 250); }
      if (e.key === '+' || e.key === '=') { stopAuto(); flyTo(view.spin, view.tilt, 1 + (view.dist - 1) * 0.7, 250); }
      if (e.key === '-' || e.key === '_') flyTo(view.spin, view.tilt, 1 + (view.dist - 1) / 0.7, 250);
    });
    function stepInertia(dt) {
      if (pts.size || tween) return;
      if (autoSpin) { view.spin += 0.09 * dt; return; }
      if (Math.abs(vel.spin) + Math.abs(vel.tilt) < 1e-3) return;
      view.spin += vel.spin * dt; view.tilt += vel.tilt * dt;
      const decay = Math.exp(-dt * 3.2); vel.spin *= decay; vel.tilt *= decay;
    }
    let homeDist = 4.3, sized = false;
    function resize() {
      const w = innerWidth, h = innerHeight;
      renderer.setSize(w, h); camera.aspect = w / h;
      homeDist = w < 640 ? 5.2 : 4.3;
      if (!sized) { view.dist = homeDist; sized = true; }
      applyView();
    }
    return { renderer, scene, camera, earth, mesh, texture, canvas: cvs, view, sky, stars: STAR_LAYERS,
      applyView, hitSphere, flyTo, faceLocal, stopAuto, stepTween, stepInertia, drift, resize,
      get homeDist() { return homeDist; },
      get autoSpin() { return autoSpin; }, set autoSpin(v) { autoSpin = v; },
      halt() { vel = { spin: 0, tilt: 0 }; } };
  }

  // ---- places: nearest city and a rough guess from the time zone (no permission, nothing sent anywhere) ----
  // City objects: { names: { ko, en, … } | name, en?, country, lat, lon }
  const TZ_ALIAS = { 'Asia/Saigon': 'Ho Chi Minh City', 'Asia/Ho_Chi_Minh': 'Ho Chi Minh City', 'Asia/Katmandu': 'Kathmandu',
    'Asia/Rangoon': 'Yangon', 'Asia/Calcutta': 'Kolkata', 'Asia/Chungking': 'Chongqing', 'Asia/Kuwait': 'Kuwait City', 'Asia/Qatar': 'Doha',
    'Asia/Bahrain': 'Manama', 'Asia/Brunei': 'Bandar Seri Begawan', 'Asia/Ujung_Pandang': 'Makassar', 'America/New_York': 'New York City',
    'America/St_Johns': "St. John's", 'America/Puerto_Rico': 'San Juan', 'America/Costa_Rica': 'San Jose', 'America/El_Salvador': 'San Salvador',
    'America/Guatemala': 'Guatemala City', 'America/Jamaica': 'Kingston', 'America/Bahia': 'Salvador', 'America/Mazatlan': null,
    'Australia/NSW': 'Sydney', 'Australia/ACT': 'Canberra', 'Australia/Queensland': 'Brisbane', 'Australia/West': 'Perth',
    'Australia/South': 'Adelaide', 'Australia/North': 'Darwin', 'Australia/Tasmania': 'Hobart', 'Pacific/Guam': 'Hagåtña',
    'Pacific/Fiji': 'Suva', 'Pacific/Tahiti': 'Papeete', 'Pacific/Tongatapu': "Nuku'alofa", 'Pacific/Apia': 'Apia', 'Pacific/Port_Moresby': 'Port Moresby',
    'Europe/Kiev': 'Kyiv', 'Europe/Kyiv': 'Kyiv', 'Europe/Malta': 'Valletta', 'Europe/Tirane': 'Tirana', 'Asia/Kamchatka': 'Petropavlovsk-Kamchatsky',
    'Asia/Sakhalin': 'Yuzhno-Sakhalinsk', 'Africa/Asmera': 'Asmara', 'Africa/El_Aaiun': 'Laayoune' };
  const normName = x => String(x).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[.']/g, '');
  const geo = {
    TZ_ALIAS, normName,
    cityFromTimeZone(cities) {
      let tz; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (_) { return -1; }
      if (!tz || !tz.includes('/')) return -1;
      const want = tz in TZ_ALIAS ? TZ_ALIAS[tz] : tz.split('/').pop().replace(/_/g, ' ');
      if (!want) return -1;
      const q = normName(want);
      let k = cities.findIndex(c => normName(c.en || '') === q);                      // English name first (list is by population)
      if (k < 0) k = cities.findIndex(c => c.names && Object.values(c.names).some(v => normName(v) === q));
      return k;
    },
    nearestCity(cities, latDeg, lonDeg) {
      const D2R = Math.PI / 180, la = latDeg * D2R, lo = lonDeg * D2R;
      let best = -1, bd = Infinity;
      cities.forEach((c, i) => {
        const cl = c.lat * D2R, co = c.lon * D2R;
        const d = Math.acos(Math.min(1, Math.sin(la) * Math.sin(cl) + Math.cos(la) * Math.cos(cl) * Math.cos(co - lo)));
        if (d < bd) { bd = d; best = i; }
      });
      return best;
    },
  };

  // ---- city search: a combobox whose dropdown floats over the settings sheet (moved to <body>) ----
  //   o.input, o.list (ul), o.scroller (re-place the list when it scrolls)
  //   o.cities()   → array      o.name(c) → label in the current language      o.current() → label to restore on blur
  //   o.onPick(i)  a city was chosen      o.empty() → "no matches" text
  function citySearch(o) {
    const cs = o.input, cl = o.list;
    let hits = [], sel = -1;
    document.body.appendChild(cl);
    function place() {
      const g = cs.closest('.group').getBoundingClientRect(), r = cs.closest('.combo').getBoundingClientRect();
      cl.style.left = g.left + 'px'; cl.style.width = g.width + 'px'; cl.style.top = (r.bottom + 6) + 'px';
      cl.style.maxHeight = Math.max(120, Math.min(264, innerHeight - r.bottom - 24)) + 'px';
    }
    addEventListener('resize', () => { if (!cl.hidden) place(); });
    if (o.scroller) o.scroller.addEventListener('scroll', () => { if (!cl.hidden) place(); });
    function close() { cl.hidden = true; cs.setAttribute('aria-expanded', 'false'); sel = -1; }
    function pick(i) { close(); o.onPick(i); }
    function render() {
      const q = cs.value.trim().toLowerCase(), CITIES = o.cities();
      cl.innerHTML = '';
      if (!q) { close(); return; }
      const starts = [], has = [];
      CITIES.forEach((c, i) => {
        const all = c.names ? Object.values(c.names) : [c.name], k = (c.country || '').toLowerCase();
        const low = c._low || (c._low = all.map(x => String(x).toLowerCase()));
        if (low.some(x => x.startsWith(q))) starts.push(i); else if (low.some(x => x.includes(q)) || k.includes(q)) has.push(i);
      });
      hits = starts.concat(has).slice(0, 8);
      if (!hits.length) { cl.innerHTML = '<li class="empty"></li>'; cl.firstChild.textContent = o.empty(); }
      hits.forEach((i, k) => {
        const c = CITIES[i], li = document.createElement('li');
        li.id = 'city-opt-' + k; li.setAttribute('role', 'option'); li.setAttribute('aria-selected', k === sel);
        const nm = o.name(c), en = c.names ? c.names.en : c.en;
        li.innerHTML = '<span></span><small></small>'; li.firstChild.textContent = nm; li.lastChild.textContent = [en !== nm ? en : '', c.country].filter(Boolean).join(', ');
        li.onpointerdown = ev => { ev.preventDefault(); pick(i); };
        cl.appendChild(li);
      });
      cl.hidden = false; place(); cs.setAttribute('aria-expanded', 'true');
    }
    cs.addEventListener('input', () => { sel = -1; render(); });
    cs.addEventListener('focus', () => cs.select());
    cs.addEventListener('blur', () => setTimeout(() => { close(); cs.value = o.current(); }, 120));
    cs.addEventListener('keydown', e => {
      e.stopPropagation();                                   // keep Space / arrows / 1-2-3 for typing
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault(); if (!hits.length) return;
        sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + hits.length) % hits.length;
        [...cl.children].forEach((li, k) => li.setAttribute('aria-selected', k === sel));
        cs.setAttribute('aria-activedescendant', 'city-opt-' + sel);
      } else if (e.key === 'Enter') { e.preventDefault(); if (hits.length) pick(hits[Math.max(0, sel)]); }
      else if (e.key === 'Escape') { close(); cs.blur(); }
    });
    return { close, render, place };
  }

  window.TMUI = { version: '1.4.0', icon, fillIcons, edgeFade, popover, segmented, scale, timeline, globe, geo, citySearch };
})();
