---
name: SaaS Manager
description: A focused delivery console for fast-moving startup teams.
colors:
  canvas: "oklch(97.5% 0.006 255)"
  surface: "oklch(99.5% 0.003 255)"
  surface-muted: "oklch(95.5% 0.01 255)"
  ink: "oklch(20% 0.025 260)"
  ink-muted: "oklch(50% 0.025 260)"
  line: "oklch(89% 0.012 255)"
  action: "oklch(58% 0.19 255)"
  action-hover: "oklch(51% 0.19 255)"
  action-soft: "oklch(94% 0.035 255)"
  success: "oklch(58% 0.14 155)"
  warning: "oklch(67% 0.14 75)"
  danger: "oklch(58% 0.2 25)"
typography:
  headline:
    fontFamily: "SF Pro Display, SF Pro Text, Segoe UI, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "SF Pro Text, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "SF Pro Text, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "SF Pro Text, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "0.02em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
---

# Design System: SaaS Manager

## 1. Overview

**Creative North Star: "The Delivery Console"**

SaaS Manager is a compact operating surface for teams already in motion. It uses disciplined hierarchy, restrained color, and flat structural layers so projects and tasks remain the most visually important objects on every screen.

The interface feels fast, technical, and quietly confident. It rejects playful multicolor task boards, heavy enterprise administration, decorative glass effects, oversized rounded cards, and generic dashboard grids.

**Key Characteristics:**

- Compact but readable information density
- One electric-blue action color used only for interaction and selection
- Flat surfaces separated by tone and hairline dividers
- Familiar controls with explicit loading, empty, error, and saving states
- Structural responsive behavior from 320px through wide desktop layouts

## 2. Colors

Cool graphite neutrals establish the workspace while electric blue marks the next action or current location.

### Primary

- **Signal Blue:** The only primary action and selection color. Its rarity makes interactive state immediately legible.

### Secondary

- **Operational Green:** Completion and successful persistence only.
- **Attention Amber:** Due-soon and recoverable warning states only.
- **Blocking Red:** Destructive, failed, or blocked states only.

### Neutral

- **Paper Canvas:** The application background, slightly cool and never pure white.
- **Working Surface:** Primary content and control surfaces.
- **Quiet Layer:** Toolbars, grouped metadata, and selected neutral states.
- **Graphite Ink:** Primary text and strong icons.
- **Steel Ink:** Secondary copy and metadata.
- **Hairline:** Structural boundaries between navigation, rows, and controls.

**The One Signal Rule.** Signal Blue is reserved for primary action, current navigation, focus, and selection. It is never decorative.

## 3. Typography

**Display Font:** SF Pro Display (with Segoe UI fallback)
**Body Font:** SF Pro Text (with Segoe UI fallback)

**Character:** Native, compact, and technical. Weight and spacing create hierarchy without oversized marketing typography.

### Hierarchy

- **Headline** (650, 24px, 1.2): Page titles and the most important workspace context.
- **Title** (600, 14px, 1.4): Section titles, task names, buttons, and navigation.
- **Body** (400, 14px, 1.55): Operational copy with a maximum reading width of 72ch.
- **Label** (600, 12px, 0.02em): Metadata and form labels. Sentence case is the default.

**The Product Voice Rule.** Headings describe the current object or action. They never become marketing slogans inside the authenticated product.

## 4. Elevation

The system is flat by default. Tone, dividers, and adjacency establish depth. Shadows appear only on transient overlays such as the mobile navigation and task detail sheet.

### Shadow Vocabulary

- **Overlay:** A broad, low-opacity shadow used only for navigation drawers and sheets above the workspace.

**The Flat Workspace Rule.** Persistent content never floats. If a dashboard starts looking like a collection of cards, remove surfaces before adding shadows.

## 5. Components

### Buttons

- **Shape:** Compact gently curved corners (10px).
- **Primary:** Signal Blue with high-contrast text and 10px by 14px padding.
- **Hover / Focus:** Darker action tone on hover and a visible two-layer focus ring on keyboard focus.
- **Secondary / Ghost:** Hairline border or transparent background, with no decorative fill at rest.

### Chips

- **Style:** Small rounded rectangles (6px), not pills. Include text or an icon so status never depends on color alone.
- **State:** Muted at rest; stronger tone only for selected or urgent states.

### Cards / Containers

- **Corner Style:** Subtle 10px to 14px corners.
- **Background:** Working Surface for primary content and Quiet Layer for grouped metadata.
- **Shadow Strategy:** None for persistent content.
- **Border:** One-pixel Hairline dividers.
- **Internal Padding:** 16px by default, 24px only for sparse empty states.

### Inputs / Fields

- **Style:** Working Surface, Hairline stroke, compact 10px corners.
- **Focus:** Signal Blue border plus an external focus ring.
- **Error / Disabled:** Error copy is explicit; disabled controls reduce contrast but remain readable.

### Navigation

The left rail uses compact rows, line icons, and a quiet blue selected state. On mobile it becomes an overlay drawer with an explicit close control. The top bar names the current route and keeps global search, theme, and sign-out actions consistent.

### Delivery Board

Columns are structural lanes rather than floating cards. Tasks use compact rows with ticket, priority, title, and ownership visible before secondary detail. Drag state changes border and background, never scale or bounce.

## 6. Do's and Don'ts

### Do:

- **Do** keep persistent surfaces flat and separated with one-pixel Hairline dividers.
- **Do** use Signal Blue only for action, current navigation, focus, and selection.
- **Do** pair every status color with text or an icon.
- **Do** keep controls at least 40px high and preserve visible keyboard focus.
- **Do** show recovery guidance for offline, unauthorized, empty, and failed states.

### Don't:

- **Don't** use playful multicolor task-board styling.
- **Don't** introduce heavy enterprise administration or dense configuration without progressive disclosure.
- **Don't** use decorative glass effects, oversized rounded cards, or generic dashboard grids.
- **Don't** use side-stripe borders, gradient text, glassmorphism, or decorative hero metrics.
- **Don't** use color alone to communicate status or priority.
