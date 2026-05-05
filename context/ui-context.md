# UI Context

## Theme

Light and dark modes. Both themes use a warm neutral palette — no brand accent color. Interactive elements use maximum contrast: black on light, white on dark. The visual language is clean, strict, and functional — inspired by Nike's minimal monochrome aesthetic.

All colors are defined as CSS custom properties in `globals.css` and mapped to Tailwind tokens via `@theme inline`. Components must use these tokens — no hardcoded hex values or raw Tailwind color classes.

### Light Theme (default)

| Role             | CSS Variable           | Hex / Value               |
| ---------------- | ---------------------- | ------------------------- |
| Page background  | `--bg-base`            | `#f5f3ef`                 |
| Surface          | `--bg-surface`         | `#ffffff`                 |
| Elevated surface | `--bg-elevated`        | `#f0ece6`                 |
| Subtle surface   | `--bg-subtle`          | `#e8e4de`                 |
| Default border   | `--border-default`     | `#d4cfc8`                 |
| Subtle border    | `--border-subtle`      | `#e0dbd4`                 |
| Primary text     | `--text-primary`       | `#131210`                 |
| Secondary text   | `--text-secondary`     | `#4a4845`                 |
| Muted text       | `--text-muted`         | `#7a7772`                 |
| Faint text       | `--text-faint`         | `#b0ada8`                 |
| Accent           | `--accent-primary`     | `#131210` (black)         |
| Accent dim       | `--accent-primary-dim` | `rgba(19, 18, 16, 0.06)`  |

### Dark Theme

| Role             | CSS Variable           | Hex / Value               |
| ---------------- | ---------------------- | ------------------------- |
| Page background  | `--bg-base`            | `#111110`                 |
| Surface          | `--bg-surface`         | `#1a1917`                 |
| Elevated surface | `--bg-elevated`        | `#222120`                 |
| Subtle surface   | `--bg-subtle`          | `#2a2926`                 |
| Default border   | `--border-default`     | `#333230`                 |
| Subtle border    | `--border-subtle`      | `#3d3c39`                 |
| Primary text     | `--text-primary`       | `#f2f0ed`                 |
| Secondary text   | `--text-secondary`     | `#b8b5b0`                 |
| Muted text       | `--text-muted`         | `#7a7772`                 |
| Faint text       | `--text-faint`         | `#4a4845`                 |
| Accent           | `--accent-primary`     | `#f2f0ed` (white)         |
| Accent dim       | `--accent-primary-dim` | `rgba(242, 240, 237, 0.08)` |

### Semantic States (both themes)

| Role    | CSS Variable       | Hex       |
| ------- | ------------------ | --------- |
| Error   | `--state-error`    | `#ef4444` |
| Success | `--state-success`  | `#4ade80` |
| Warning | `--state-warning`  | `#fbbf24` |

---

## RPE Scale

RPE values (1–10) and sRPE totals use a fixed color scale to communicate training load at a glance. These colors are shared across both themes.

| Range | Label   | CSS Variable      | Hex       | Dim (bg use)              |
| ----- | ------- | ----------------- | --------- | ------------------------- |
| 1–3   | Low     | `--rpe-low`       | `#4ade80` | `rgba(74, 222, 128, 0.12)` |
| 4–6   | Medium  | `--rpe-medium`    | `#fbbf24` | `rgba(251, 191, 36, 0.12)` |
| 7–8   | High    | `--rpe-high`      | `#f97316` | `rgba(249, 115, 22, 0.12)` |
| 9–10  | Max     | `--rpe-max`       | `#ef4444` | `rgba(239, 68, 68, 0.12)`  |

Use the solid color for text and badges; use the dim variant for background fills behind those badges.

---

## Typography

| Role          | Font       | CSS Variable        | Usage                               |
| ------------- | ---------- | ------------------- | ----------------------------------- |
| UI text       | Geist Sans | `--font-geist-sans` | All labels, body, buttons           |
| Numeric data  | Geist Mono | `--font-geist-mono` | RPE values, sRPE totals, durations  |

Both fonts are loaded via `next/font/google` and applied as CSS variables on `<html>`. The base `body` uses Geist Sans with `antialiased`.

Numeric data columns (RPE input, sRPE, duration) always use Geist Mono with `tabular-nums` to keep columns aligned.

---

## Border Radius

Angular and strict — radius is smaller than a typical SaaS product, consistent with the sporty aesthetic.

| Context              | Class        |
| -------------------- | ------------ |
| Badges / chips       | `rounded`    |
| Buttons / inputs     | `rounded-lg` |
| Cards / panels       | `rounded-lg` |
| Bottom sheet / modal | `rounded-t-2xl` (top corners only) |

---

## Component Library

shadcn/ui on top of Tailwind. Components live in `src/shared/ui/`. Use the `shadcn` CLI to add new components. Customize tokens in `globals.css`, not inside component files.

---

## Layout Patterns

- **Mobile-first.** All layouts are designed for a single-column phone screen first.
- **Touch targets.** Interactive list items: `min-h-14`. Primary action buttons: `min-h-12`, full width.
- **Cards.** Sessions, microcycles, and players are displayed as full-width cards with `bg-surface`, `border-default`, `rounded-lg`.
- **Bottom sheet.** Modals and forms slide up from the bottom (`rounded-t-2xl`), not centered. Used for: RPE entry, create session, create microcycle, export options.
- **Stat blocks.** RPE values and sRPE totals are displayed in `font-mono tabular-nums` with an RPE-scale color badge beside them.
- **Page header.** Each page has a sticky top bar: back arrow (← for nested routes) on the left, page title centered or left-aligned, optional action icon on the right.
- **Empty states.** Centered, minimal — icon + short label + primary action button. No illustrations.

---

## Navigation Patterns

The coach selects a navigation style in `/settings`. Both modes are always available.

### Bottom Tab Bar (default)

Persistent bar fixed to the bottom of the screen. Two tabs:

| Tab       | Icon      | Route       |
| --------- | --------- | ----------- |
| Home      | `home`    | `/`         |
| Settings  | `settings`| `/settings` |

Nested routes (`/microcycles/[id]`, `/sessions/[id]`, `/microcycles/[id]/report`) show a back arrow in the page header instead of adding more tabs.

### Top Navbar

Persistent bar at the top. App name or current page title on the left; settings icon on the right. Back navigation handled by the browser / Next.js router.

---

## Icons

Lucide React. Stroke-based icons only — no filled variants.

| Context                   | Size        |
| ------------------------- | ----------- |
| Inline / list rows        | `h-4 w-4`   |
| Buttons / navigation tabs | `h-5 w-5`   |
| Empty state icons         | `h-8 w-8`   |
