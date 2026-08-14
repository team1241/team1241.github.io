# CLAUDE.md — Interactive Robotics Lessons

## What this repo is

Self-contained interactive HTML lessons teaching control theory and estimation
concepts to **high school robotics students** (FRC context). Each lesson is a
single `.html` file with zero build step and zero runtime dependencies (only a
Google Fonts stylesheet, which degrades gracefully to system fonts). Hosted via
GitHub Pages; lesson links are pasted into Linear docs for students.

## Current lessons

| File | Topic | Status |
|---|---|---|
| `where-am-i-kalman-filters.html` | Sensor fusion, dead reckoning, GPS, vision/AprilTag localization, Kalman filters | Complete |
| `boxes-arrows-circles-block-diagrams.html` | Block diagram notation primer (signals, blocks, junctions, open/closed loop, disturbances) | Complete |
| `close-the-loop-pid-control.html` | Feedback/PID control: bang-bang, P/I/D each with tuning exercises, full-PID tuning bay on a simulated elevator | Complete (intentionally excludes practice topics — see TODO) |
| `push-first-feedforward-control.html` | Feedforward control for flywheels/arms/elevators, WPILib models, characterization/SysId | **Learning content complete — case problem still TODO** |

Reading order: block diagrams → PID feedback → feedforward → Kalman (the
index numbers them 01–04 and each page's bottom "next lesson" card follows
the same chain). Planned next: swerve drivetrain control, same format.

## Outstanding TODO

- [ ] **Add a case problem to the feedforward lesson** once content is signed
      off. This was explicitly deferred — remind the user if they touch that
      file without addressing it.
- [ ] **"PIDs in practice" lesson** — a follow-up page covering the add-on
      topics deliberately kept out of `close-the-loop-pid-control.html`:
      integral windup / anti-windup, derivative filtering and
      pseudo-derivative (derivative-on-measurement, derivative kick), sensor
      noise, output saturation. Do not fold these into the intro PID lesson.

## Design system (do not deviate without asking)

- **Layout**: single 860px column, numbered parts (`.step` eyebrow + `h2`),
  graph-paper background (28px CSS grid lines over `#F4F7F9`).
- **Type**: Space Grotesk (display/buttons), IBM Plex Mono (labels, readouts,
  equations, captions), Public Sans (body). Loaded from Google Fonts with
  system fallbacks.
- **Palette** (CSS variables in `:root`): ink `#16283B`, muted `#5B7186`,
  line `#C7D5DE`, panel white. Concept colors are assigned per lesson and used
  consistently in prose (`.xx-t` spans), widgets, readouts, and legends:
  - Kalman lesson: dead reckoning violet `#7A4FD0`, GPS orange `#E07B1F`,
    fused green `#0B8F6B`, truth ink (dashed).
  - Feedforward + block-diagram lessons: setpoint violet, feedback orange,
    feedforward green, plant/measured ink.
  - PID lesson: setpoint violet (dashed), P orange, I green, D blue `#2076C7`
    (soft `#DFEBF8`) — the one lesson with a fourth concept color.
- **Components**: `.widget` cards (head strip + body), `.readout` chips,
  `.toggle` pills, `.callout` left-border asides, `.diagram` panels for SVG
  block diagrams, `.eq` equation cards, `details.plots` collapsible plot panels.

## Content conventions (user's standing rules)

1. **Every equation gets a legend.** `.eq` card = equation line(s) + `.who`
   legend below a dashed divider, defining *every* symbol as a `<code>` chip
   followed by plain-language meaning. Interpretive commentary goes in a
   trailing `.note` span, separate from the definitions.
2. **Jargon is welcome but introduced** — bold the term, define it in plain
   words at first use, collect terms in a recap "pocket glossary" `.eq` block.
3. **Low text density.** A visual (widget, animated diagram, plot) roughly
   every 1–2 paragraphs. Prefer cutting connective prose over cutting
   equations/legends.
4. **Animations everywhere it helps**: SMIL `animateMotion` pulses on static
   SVG wires, auto-start simulations on scroll (`IntersectionObserver`),
   ambient auto-sweeps that stop on first user input. Everything auto-moving
   must respect `prefers-reduced-motion` (pulses hidden via CSS; JS gated on
   the `reduceMotion` const; user-initiated buttons still work).
5. **Widgets are real simulations, not canned animations.** The physics ground
   truth is the actual model being taught (e.g., WPILib's
   `V = kS·sgn(v) + kV·v + kA·a`; a genuine `K = P/(P+R)` Kalman loop).
   Displayed numbers must be the sim's real internal state. If lesson text
   makes a quantitative claim, the sim must actually demonstrate it (e.g., Q
   scales quadratically with its slider so equal Q/R settings hold the gain
   constant).
6. **Plots never scroll horizontally.** Time-series axes anchor at the last
   reset and grow (`x0 = 0, x1 = max(minSpan, t)`); history is decimated
   (drop every other sample past a cap), never discarded — kids must always
   be able to see what happened. Extra plots live in `details.plots` panels,
   **closed by default**.
7. **Guided experiments** in every widget's `.hint` — numbered things to try,
   with predicted outcomes students can verify against readouts.
8. **WPILib is the reference** for FRC-adjacent content. Link to
   docs.wpilib.org (feedforward intro, feedforward controllers page, SysId
   intro). Match WPILib's equation forms and constant names (kS, kV, kA, kG).
9. **Cross-references are always links.** Any prose mention of another lesson
   — by title, "the primer", "the next lesson", etc. — must be an `<a href>`
   to that page (relative, same directory); never a bare italicized title.
   Every lesson header starts with an `a.home` "← All lessons" link to
   `index.html`, and every page ends with an `a.next` card following the
   reading-order chain (last lesson links back to `index.html`). When adding, renaming, or
   reordering a lesson, update in the same change: the index cards and their
   numbering, the neighboring pages' `a.next` cards, any prose references,
   and this file's reading order. Apply this check to every ongoing edit, not
   just new pages.

## Code conventions

- Vanilla JS, one IIFE per widget inside a single `<script>` at the end of
  `<body>`; `"use strict"`.
- Shared helpers per file: `setupCanvas` (DPR-aware, `ResizeObserver`,
  `c._redraw` hook — this is also what makes canvases inside initially-closed
  `<details>` render correctly on open), `grid`, `arrow`, `box`, `wireValue`,
  `linePlot` (generic axes/series/hlines/dots plotter), `randn` (Box–Muller),
  `onVisible`, `makeFlywheel`.
- Canvases: fixed CSS height, fluid width; positions scaled by `w/760` where
  diagrams need proportional layout.
- SVG block diagrams: `.bd-*` classes, one `<defs><marker id="arr">` per file
  **defined in the first SVG that uses it** (markers are referenced by URL
  across the document).
- After any edit, sanity-check: extract the `<script>` and run
  `node --check`; verify `<div>` open/close counts match; verify every canvas
  id referenced in JS exists in the HTML.

## Tone

Warm, punchy, second person, zero condescension. Analogies before formalism
(bike on a hill, gravity as a "bill to pay", "y = b + m·x wearing a lab
coat"). Short paragraphs. The recap is always "N ideas to walk away with" +
pocket glossary. Footer states that the sims are real physics, not animations.
