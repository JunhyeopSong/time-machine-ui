# time-machine-ui

Shared design for the time-machine products · 타임머신 제품들이 함께 쓰는 디자인

- [Continental Time Machine · 지구 대륙 타임머신](https://junhyeopsong.github.io/earth-time-machine/) ([repo](https://github.com/JunhyeopSong/earth-time-machine))
- [Human Journey · 인류의 여정](https://junhyeopsong.github.io/human-journey/) ([repo](https://github.com/JunhyeopSong/human-journey))

## Use · 사용법

```html
<link rel="stylesheet" href="https://junhyeopsong.github.io/time-machine-ui/v1/tokens.css">
<link rel="stylesheet" href="https://junhyeopsong.github.io/time-machine-ui/v1/base.css">
<!-- then the product's own styles · 그다음 제품 고유 스타일 -->
<script src="https://junhyeopsong.github.io/time-machine-ui/v1/ui.js"></script>  <!-- window.TMUI -->
```

| File · 파일 | Contents · 내용 |
|---|---|
| `v1/tokens.css` | Colours, glass, radii, spacing, fonts · 색·유리·반경·간격·글꼴 |
| `v1/base.css` | Layout shell, glass surfaces, era card, settings sheet, toggles, segmented controls, globe controls, time dock, timeline, shortcut chips, pins, event popover |
| `v1/ui.js` | `TMUI.icon` / `fillIcons` (Lucide icons, ISC), `edgeFade` (fade + soften at scroll edges), `popover`, `segmented`, `scale.linear` / `scale.shiftedLog`, `timeline` (period bands + hover/drag tooltip + ticks + slider on any scale), `globe` (three.js r128 shell: scene, atmosphere, star sky, drag/pinch/wheel/keys navigation), `geo` (nearest city, time-zone guess), `citySearch` (city combobox) — demo: [`demo/timeline.html`](https://junhyeopsong.github.io/time-machine-ui/demo/timeline.html) |
| `v1/products.json` | Product list for the product switcher · 제품 전환 메뉴 목록 |

## Versions · 버전

- `v1/` only gets compatible fixes, so every product picks them up at once. · `v1/`은 호환되는 수정만 받으며 모든 제품에 바로 반영됩니다.
- Breaking changes go to `v2/`; products move over one at a time. · 호환되지 않는 변경은 `v2/`로 내고 제품을 하나씩 옮깁니다.
- `v1.0.0/`, `v1.1.0/` … are frozen snapshots. · `v1.0.0/`, `v1.1.0/` 같은 정확한 버전은 바뀌지 않는 사본입니다.

| Version | Changes |
|---|---|
| 1.4.0 | `box-sizing: border-box` and `body { margin: 0 }` for every product; settings sheet: language select with its own chevron and fixed width, segmented controls that keep one line, disabled rows (`.item.off`) |
| 1.3.0 | `TMUI.globe`, `TMUI.geo`, `TMUI.citySearch`; the city list follows the settings panel when it scrolls |
| 1.2.0 | `TMUI.scale` (linear, shifted log) and `TMUI.timeline`; drag tooltip follows the handle |
| 1.1.0 | `ui.js`: shared icons and behaviour (edge fade, popover, segmented controls) |
| 1.0.0 | `tokens.css`, `base.css`, `products.json` |

Served from `docs/` on GitHub Pages. · GitHub Pages의 `docs/`에서 배포합니다.
