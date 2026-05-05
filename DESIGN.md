# Design Brief

## Direction

FPay — a modern, playful payment simulator that communicates transaction confidence through electric cyan accents, warm success states, and purposeful motion.

## Tone

Bold Modern Fintech. High-contrast dark aesthetic with vibrant accents (not corporate navy). Smooth animations signal transaction processing without sacrificing clarity.

## Differentiation

Payment processing animation (pulsing states) + persistent DEMO disclaimer banner that feels integrated, not corporate.

## Color Palette

| Token          | OKLCH              | Role                          |
| -------------- | ------------------ | ----------------------------- |
| background     | 0.14 0.015 280     | Dark charcoal base (dark mode)|
| foreground     | 0.92 0.01 280      | High-contrast text            |
| card           | 0.19 0.018 280     | Transaction cards, surfaces   |
| primary        | 0.68 0.26 200      | CTAs, Send Money, active ui   |
| accent         | 0.72 0.18 50       | Success states, payment done  |
| destructive    | 0.65 0.2 25        | Cancel, delete, error states  |
| muted          | 0.25 0.025 280     | Secondary text, disabled      |

## Typography

- Display: Space Grotesk — hero payment amounts, screen headings (bold, confident)
- Body: DM Sans — UI labels, transaction details, form inputs (clean, neutral)
- Scale: Hero `text-5xl font-bold tracking-tight`, H2 `text-2xl font-bold`, Label `text-xs font-semibold uppercase tracking-widest`, Body `text-base`

## Elevation & Depth

Subtle card hierarchy: muted base (`bg-card`) for all interactive surfaces, elevated shadow (`shadow-elevated`) for modals and success screens, minimal base shadow (`shadow-xs`) on secondary elements.

## Structural Zones

| Zone    | Background        | Border            | Notes                                                |
| ------- | ----------------- | ----------------- | ---------------------------------------------------- |
| Header  | bg-card           | border-b border-border | DEMO disclaimer always visible, subtle grain       |
| Content | bg-background     | —                 | Spacious padding (2rem mobile, 3rem tablet)        |
| Footer  | bg-muted/20       | border-t border-border | Action buttons, transaction count, session info   |

## Spacing & Rhythm

Mobile-first: 16px base unit, 24px section gaps, 12px component gutters. Transaction cards stacked with 12px gap, 16px internal padding. Form inputs 48px min height (thumb-friendly).

## Component Patterns

- Buttons: Pill shape (rounded-full), 48px min height, primary cyan, hover/active state with 0.9 opacity, transition-smooth
- Cards: 12px rounded corners, subtle border (border-border/50), bg-card with no shadow baseline, shadow-card on hover
- Badges: Pill (rounded-full), accent color with bg-accent/10, text-accent-foreground, text-xs font-semibold
- Forms: 12px rounded input, border-border, focus:ring-2 ring-primary, placeholder-muted-foreground

## Motion

- Entrance: fade-in (0.4s) on screens, slide-up (0.35s, spring easing) on transaction success
- Hover: opacity 0.9 on buttons, subtle shadow-card on cards
- Decorative: pulse-processing (1.5s infinite) on payment processing screen, success checkmark scale-in (0.3s)

## Constraints

- No gradients in backgrounds (use solid OKLCH tokens only)
- All interactive elements 48px+ touch target
- DEMO disclaimer on every screen, non-dismissible
- No blur, glow, or neon effects (clarity over decoration)
- Dark mode primary (light mode available as fallback)

## Signature Detail

Electric cyan primary (`0.68 0.26 200`) paired with warm amber success (`0.72 0.18 50`) creates a distinctive fintech personality — modern and confident without copying Google Pay's navy or PhonePe's gradient chaos.
