# Navbar / Header — QA Checklist

Run this checklist whenever `src/components/site/Navbar.tsx`, the logo asset,
the strip items (`STRIP_SLUGS` / `SERVICES`), `NAV_LINKS`, or any global
typography / spacing token in `src/styles.css` changes.

## Canonical heights (source of truth)

| Breakpoint        | Tailwind class | Pixel height |
| ----------------- | -------------- | ------------ |
| Mobile (<640px)   | `h-20`         | 80px         |
| Tablet (≥640px)   | `sm:h-24`      | 96px         |
| Desktop (≥1024px) | `lg:h-20`      | 80px         |

The header MUST use **fixed heights per breakpoint** — never `min-h-*` + `py-*`
combinations that let content stretch the bar. If you need more room, bump the
breakpoint height itself.

## Visual checks

Test at each viewport with the device toggle above the preview:

### 320 × 568 (smallest mobile)
- [ ] Logo + service strip ("Siding – Painting – Windows") fit inside the navy
      bar with no clipping at top/bottom edges.
- [ ] Strip text stays on a single line (no wrap).
- [ ] Hamburger button is vertically centered, not pushed outside the bar.
- [ ] Bar height is exactly 80px (inspect `<div class="... h-20 ...">`).

### 375 × 812 / 414 × 896 (typical phones)
- [ ] Strip separator dashes (`–`) render in green and are centered.
- [ ] No horizontal scrollbar appears on `<body>`.

### 768 × 1024 (tablet)
- [ ] Bar height is exactly 96px.
- [ ] Logo scales to `sm:h-14` (56px) without overflowing.
- [ ] Hamburger still visible (desktop nav appears only at `lg`).

### 1024 × 768 (desktop minimum)
- [ ] Bar height is exactly 80px.
- [ ] Full `NAV_LINKS` row visible, no wrapping.
- [ ] "Call …" CTA button visible on the right.
- [ ] Active link is `text-sd-green`.

### 1440 × 900 / 1920 × 1080 (large desktop)
- [ ] Content max-width capped at `max-w-7xl` (1280px), centered.
- [ ] Logo at `lg:h-16` (64px), strip at `text-[11px]`.

## Regression triggers — re-run the full checklist if any of these change

- `Navbar.tsx` outer wrapper class list (heights, padding, gap)
- Logo source / intrinsic dimensions
- Number of `STRIP_SLUGS` items or label length
- Number of `NAV_LINKS` items
- Tailwind theme (`tailwind.config.*` or `src/styles.css` font sizes)
- Sticky offset users of `sticky top-20` / `scroll-mt-*` elsewhere

## Automated smoke test (optional)

If you want a one-shot guard, add a Playwright test that asserts the computed
height of `header > div` at each breakpoint:

```ts
// tests/navbar-height.spec.ts
import { test, expect } from "@playwright/test";

const cases = [
  { w: 375, h: 812, expected: 80 },
  { w: 768, h: 1024, expected: 96 },
  { w: 1280, h: 800, expected: 80 },
];

for (const { w, h, expected } of cases) {
  test(`header is ${expected}px at ${w}x${h}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/");
    const bar = page.locator("header > div").first();
    await expect(bar).toHaveCSS("height", `${expected}px`);
    // Overflow guard: no child taller than the bar.
    const overflow = await bar.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return [...el.querySelectorAll("*")].some(
        (c) => c.getBoundingClientRect().bottom > r.bottom + 0.5,
      );
    });
    expect(overflow).toBe(false);
  });
}
```

Playwright is **not** installed by default in this project. Add it with
`bun add -d @playwright/test && bunx playwright install` only if the team
decides to wire automated visual regression in CI.
