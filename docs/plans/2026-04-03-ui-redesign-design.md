# UI Redesign: Apple Pro Minimalist with Glass Accents

## Design System Foundation

### Color Palette
- **Background:** Pure black (`#000000`) for OLED-friendliness, deep charcoal (`#1C1C1E`) for cards/panels
- **Surface:** `#2C2C2E` (elevated surfaces), `#3A3A3C` (borders/dividers)
- **Glass:** `rgba(255,255,255,0.06)` base with `backdrop-blur(20px)`, `rgba(255,255,255,0.12)` on hover
- **Text:** `#FFFFFF` primary, `rgba(255,255,255,0.6)` secondary, `rgba(255,255,255,0.3)` tertiary
- **Accent:** Restrained blue (`#0A84FF`) for CTA button only

### Typography
- System font stack (`-apple-system, SF Pro` fallback)
- Username: `font-weight: 600`, `15px`
- Summary: `font-weight: 400`, `14px`, line-height 1.5
- Labels/badges: `font-weight: 500`, `11px`, `text-transform: uppercase`, letter-spacing

### Spacing & Radius
- 16px base unit for padding
- Corner radii: `20px` panels, `14px` buttons, `10px` small elements
- Consistent 4px grid

### Motion
- Spring easing (`cubic-bezier(0.175, 0.885, 0.32, 1.275)`) for interactive elements
- 300ms transitions for panels/expands
- Subtle scale (1.02) on button press

---

## Landing Page

- Full-screen `#1C1C1E` with subtle radial gradient (lighter center fading to edges)
- Vertically centered content, generous whitespace
- App name in large light-weight type (`font-weight: 300`, `28px`)
- Thin frosted glass divider line below header (`1px`, `rgba(255,255,255,0.08)` with blur)
- Two large rounded glass cards (`border-radius: 20px`) stacked vertically with 12px gap
  - Condition label in `font-weight: 600` with subtle right-pointing chevron icon
  - Hover: glass opacity increases, gentle 1.02 scale
  - Press: slight depression (scale 0.98)
  - Both use same glass treatment, differentiated only by label text
- Footer: tertiary-colored research/version info (`11px`, `rgba(255,255,255,0.3)`)

## Feed Screen

### Top Bar
- Floating frosted glass pill (`border-radius: 20px`) pinned top-center
- Contains thin "Finish Task" text label in secondary white
- Auto-hides after 3 seconds of no interaction, reappears on any tap

### Right-side Action Buttons
- Vertically stacked, positioned at `bottom-32`
- Thin frosted glass circles (`48px`, `border-radius: 50%`) with refined icons (`20px`, stroke-width 1.5)
- Labels in `11px` secondary white
- Spinning music disc replaced with subtle pulsing ring animation
- Heart icon starts unfilled, no random counts visible

### Bottom Text (Collapsed - Default)
- Single line: `@username` in `font-weight: 600`, `15px`
- Fades with gradient overlay, no summary visible
- Tiny chevron-down indicator (`8px`) to hint at expandability

### Bottom Text (Expanded - On Tap)
- Glass panel slides up from bottom (`border-radius: 20px 20px 0 0`) with `backdrop-blur(24px)`
- Full username and full summary text
- 300ms spring animation on expand/collapse
- Tap elsewhere or swipe down to dismiss
- Covers roughly bottom 30% of screen

## End Task Page

- Full-screen `#1C1C1E` matching landing page
- Centered content with generous vertical spacing
- Single thin checkmark icon (lucide `Check`, `48px`, stroke-width 1.5) in secondary white
- "Task Complete" in `font-weight: 300`, `24px`
- Instruction text in secondary white, `15px`: "Please return to your survey to continue"
- No buttons - dead-end by design
- Checkmark fades in with scale animation (0.8 to 1.0) on load
- Text elements stagger in 150ms apart
