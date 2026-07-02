# Next Gen Employee Portal

A lightweight, public-facing employee portal prototype (MVP) built with **vanilla HTML, CSS, and JavaScript** — no frameworks, no build tools, no dependencies. It displays company announcements and an employee directory in a clean, corporate-styled, fully responsive interface.

LINK TO PORTAL http://employee-portal-nextgen.s3-website.eu-north-1.amazonaws.com/
---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [File-by-File Breakdown](#file-by-file-breakdown)
- [Design System](#design-system)
- [Sortable Table — How It Works](#sortable-table--how-it-works)
- [Responsive Behavior](#responsive-behavior)
- [Sample Data](#sample-data)
- [Browser Support](#browser-support)
- [Known Limitations](#known-limitations)
- [Future Enhancements](#future-enhancements)

---

## Overview

This project is a static, single-page dashboard for a fictional company, **Next Gen**. It requires no backend, no authentication, and no build process — it's meant to be opened directly in a browser or dropped onto any static file host. All data (employees and announcements) is hardcoded directly into `script.js`, making it easy to demo, extend, or wire up to a real API later.

**Goals of this MVP:**
- Present core company information (branding, announcements, staff directory) in one view
- Demonstrate a sortable data table using only native JavaScript
- Apply a traditional, professional corporate visual style
- Work cleanly on desktop, tablet, and mobile without any external CSS/JS libraries

---

## Features

| Feature | Description |
|---|---|
| **Company header** | Branded header with logo mark, company name, tagline, live date, and status indicator |
| **Employee directory** | Table of 10 employees (ID, Name, Department, Email, Status) |
| **Sortable columns** | Click any column header to sort ascending/descending; active sort is indicated visually and via `aria-sort` |
| **Announcements panel** | 5 company announcements with title, date, and summary |
| **Status indicators** | Color-coded pills for "Active" vs "On Leave" |
| **Responsive layout** | CSS Grid-based two-column layout that collapses to a single column on smaller screens; table scrolls horizontally on narrow viewports |
| **No login required** | Publicly viewable dashboard — no auth layer |
| **Zero dependencies** | Pure HTML/CSS/JS, no frameworks or CDN scripts |

---

## Project Structure

```
nextgen-portal/
├── index.html      # Semantic page structure and markup
├── styles.css       # All styling, layout, and responsive rules
├── script.js        # Data, rendering, and sorting logic
└── README.md         # This file
```

---

## Getting Started

No build step or server is strictly required, but a local server is recommended so the browser doesn't apply any extra restrictions to local file loading.

### Option 1 — Open directly
Double-click `index.html` or drag it into a browser window.

### Option 2 — Local server (recommended)
```bash
# Python 3
python3 -m http.server 8000

# Node (if you have `serve` installed)
npx serve .
```
Then visit `http://localhost:8000` (or the port shown).

### Option 3 — Static hosting
Upload all three files (`index.html`, `styles.css`, `script.js`) to any static host (GitHub Pages, Netlify, Vercel, S3, etc.) — no configuration needed.

---

## File-by-File Breakdown

### `index.html`
- Semantic HTML5 (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`)
- Two main content sections inside `<main>`:
  - `.announcements` — populated dynamically from `script.js`
  - `.directory` — contains the `#employee-table` with sortable `<th>` headers
- Table headers use `<button>` elements (not plain clickable `<th>`) for keyboard accessibility
- Accessible labeling via `aria-labelledby`, `scope="col"`, and dynamic `aria-sort`

### `styles.css`
- CSS custom properties (`:root`) define the entire design token system (colors, fonts, spacing, radius, shadows)
- CSS Grid used for the two-panel main layout (`announcements` + `directory`)
- Flexbox used for header, footer, and internal component alignment
- Mobile-first breakpoints at `900px` (layout stacks to one column) and `560px` (spacing/typography tighten, table gets a defined `min-width` for horizontal scroll)
- No external fonts or icon libraries — uses system font stacks and Unicode triangle characters (▲ / ▼) for sort indicators

### `script.js`
- Wrapped in an IIFE (`(function () { "use strict"; ... })()`) to avoid polluting the global scope
- `employees` and `announcements` arrays hold all hardcoded sample data
- Rendering functions (`renderEmployees`, `renderAnnouncements`) build HTML strings and inject them via `innerHTML`
- `sortEmployees(key, type)` handles column sorting logic (toggles direction on repeated clicks)
- `updateSortIndicators()` updates the arrow icons and `aria-sort` attributes to reflect current sort state
- `renderMeta()` fills in the live date in the header and the current year in the footer
- All logic runs after `DOMContentLoaded`

---

## Design System

The visual style follows a **traditional corporate aesthetic**: navy and gold, serif headings, generous whitespace, and restrained motion.

| Token | Value | Usage |
|---|---|---|
| `--color-navy-900` / `--color-navy-800` | `#16274a` / `#1b2a4a` | Header background, headings |
| `--color-gold-500` / `--color-gold-600` | `#b8933f` / `#a8802f` | Accents, active sort state, header border |
| `--color-bg` | `#f4f6f9` | Page background |
| `--color-surface` | `#ffffff` | Panel backgrounds |
| `--color-success-bg` / `--color-success-text` | `#e6f4ea` / `#256d3f` | "Active" status pill |
| `--color-warning-bg` / `--color-warning-text` | `#fbf1de` / `#8a6111` | "On Leave" status pill |
| `--font-display` | Georgia, serif | Company name, section headings |
| `--font-body` | System sans-serif stack | Body copy, table content |
| `--font-mono` | Courier New, monospace | Employee ID column |

All colors and type choices are centralized as CSS variables at the top of `styles.css`, so re-theming the portal (e.g., different accent color) only requires editing the `:root` block.

---

## Sortable Table — How It Works

1. Each `<th>` in `index.html` carries two data attributes:
   - `data-sort` — the object key to sort by (`id`, `name`, `department`, `email`, `status`)
   - `data-type` — `"number"` or `"text"`, determines comparison logic
2. Clicking a header's inner `<button>` calls `sortEmployees(key, type)`.
3. If the same column is clicked again, the sort direction flips (ascending ↔ descending). Clicking a different column resets to ascending.
4. The employee array is sorted with a copy (`[...employees]`) so the original dataset is never mutated.
5. The table body is re-rendered, and `updateSortIndicators()` updates the ▲/▼ icon and `aria-sort` attribute on the active column header only.

This is implemented with zero external libraries — just `Array.prototype.sort()` and DOM APIs.

---

## Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `> 900px` | Two-column grid: announcements (300px sidebar) + employee directory (fluid) |
| `≤ 900px` | Layout collapses to a single column; announcements stack above the directory |
| `≤ 560px` | Header stacks vertically, panel padding tightens, table retains a `min-width` and scrolls horizontally within its container rather than breaking the layout |

The table intentionally uses **horizontal scroll** rather than a stacked/card view on mobile, to preserve column alignment and readability for tabular HR-style data.

---

## Sample Data

**Employees (10 total)** — spread across Engineering, Sales, HR, Marketing, Finance, and IT Support, with statuses of `Active` or `On Leave`.

**Announcements (5 total)** — realistic internal company updates (all-hands meetings, benefits enrollment, office closures, awards, policy changes), each with a title, ISO date, and short summary.

All data lives in `script.js` inside the `employees` and `announcements` arrays and can be edited directly — no other file needs to change.

---

## Browser Support

Built with standard, widely-supported web platform features (CSS Grid, Flexbox, `Array.sort`, template literals, `IntersectionObserver`-free vanilla JS). Verified to work in current versions of:

- Chrome / Edge
- Firefox
- Safari (desktop & iOS)

No polyfills are included; very old browsers (e.g., IE11) are not supported.

---

## Known Limitations

- Data is static and hardcoded — refreshing the page resets any state (there is none to reset, by design)
- No backend, so nothing is persisted or fetched over the network
- No login/auth — the portal is intentionally public-read
- Sorting is single-column only (no multi-column sort)

---

## Future Enhancements

Ideas for extending this MVP into a fuller product:

- Replace hardcoded arrays with a fetch call to a real API/JSON endpoint
- Add a search/filter input above the employee table
- Add pagination for larger employee datasets
- Add a login layer if the portal needs to become internal-only
- Persist sort preference in `localStorage` or the URL query string
- Add unit tests for the sorting logic
- Add dark mode via a second CSS custom-property theme
