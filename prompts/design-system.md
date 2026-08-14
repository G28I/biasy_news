# Implementation Prompt - biasly Design System

## Goal
Implement the core design system for **biasly** based on the provided UI reference. This sets the stage for the rest of the product UI, including typography, spacing, colors, buttons, chips, bias meters, and card layouts.

## Skills Read
- Next.js documentation (from `node_modules/next/dist/docs/`)
- Tailwind CSS v4 styling rules

## Existing Code Inspected
- `app/globals.css` (Tailwind CSS v4 config)
- `app/layout.tsx` (Current root layout)
- `app/page.tsx` (Current landing page)
- `package.json` (Dependencies and scripts)

## Decisions or Assumptions
1. **Google Font**: We use Poppins loaded via `next/font/google` for optimal web font delivery and performance.
2. **Tailwind v4 Configuration**: Since Tailwind v4 is in use, we define the theme tokens inside `@theme` in `app/globals.css` rather than a `tailwind.config.js` file.
3. **Showcase Page**: To allow instant visual validation, `app/page.tsx` will be replaced with a design system dashboard containing all sections from the spec (Colors, Typography, Icons, Grid, Shadows, Buttons, Chips, BiasMeter, and Card Example).
4. **Icons**: We will use `lucide-react` for standard 2px stroke, rounded-cap UI icons matching the spec visual characteristics.

## Files Likely to Change
- [MODIFY] `package.json`
- [MODIFY] `app/layout.tsx`
- [MODIFY] `app/globals.css`
- [NEW] `components/ui/Button.tsx`
- [NEW] `components/ui/Chip.tsx`
- [NEW] `components/ui/BiasMeter.tsx`
- [NEW] `components/ui/NewsCard.tsx`
- [MODIFY] `app/page.tsx`

## Visual & Layout Requirements
- **Colors**:
  - Primary Text: `#0D0D0F`
  - Secondary Text: `#6B7280`
  - Surface: `#F6F6F6`
  - Semantic Left Bias: `#B42318`
  - Semantic Center Bias: `#E5E7EB`
  - Semantic Right Bias: `#1D4ED8`
  - Neutral BG Primary: `#FFFFFF`
  - Neutral BG Secondary: `#F0F0F0`
  - Neutral Border/Divider: `#E5E7EB`
- **Typography (Poppins)**:
  - H1: 32px / line-height 1.2, font-bold
  - H2: 24px / line-height 1.3, font-semibold
  - H3: 20px / line-height 1.3, font-semibold
  - H4: 16px / line-height 1.4, font-medium
  - Body Large: 16px / line-height 1.6, font-normal
  - Body Medium: 14px / line-height 1.6, font-normal
  - Body Small: 13px / line-height 1.6, font-normal
  - Caption: 11px / line-height 1.4, font-normal
- **Spacing**: Consistent 4px base spacing system (using Tailwind's `p-1` (4px), `p-2` (8px), `p-4` (16px), `p-6` (24px), `p-8` (32px), `p-10` (40px), `p-16` (64px) equivalents).
- **Border Radii**:
  - Small: `4px` (rounded-sm)
  - Medium: `8px` (rounded-md)
  - Large: `12px` (rounded-lg)
  - Full: `9999px` (rounded-full)
- **Shadows**:
  - Small: `0px 1px 2px rgba(0, 0, 0, 0.05)`
  - Medium: `0px 4px 12px rgba(0, 0, 0, 0.08)`
  - Large: `0px 12px 24px rgba(0, 0, 0, 0.12)`
- **Grid**:
  - Container width 1280px, 12 columns, 24px gutter, 24px margin.

## UI Elements & Components Implementation
1. **Buttons**:
   - Primary: Background `#0D0D0F`, Text `#FFFFFF`, Hover (dark gray/black state), Active, Disabled (`opacity-50`, no pointer events).
   - Secondary: Background `#F6F6F6`, Text `#0D0D0F`, Hover (subtle border/darker shift), Disabled.
   - Outline: Border `#E5E7EB`, Text `#0D0D0F`, Hover (subtle background shift), Disabled.
   - Text: Border-none, Text `#0D0D0F`, Hover (underline/blue shift), Disabled.
2. **Chips**:
   - Rounded-full pill, border `#E5E7EB`, background `#F6F6F6`, text `#0D0D0F` (`Body Small` or `Caption` typography).
   - Interactive with positive sign ("+") indicator.
3. **Bias Meter**:
   - Proportional bar showing left, center, right percentages.
   - Red color (`#B42318`) for Left, light gray (`#E5E7EB`) for Center, blue (`#1D4ED8`) for Right.
   - Underneath axis indicators at 0%, 50%, 100%.
4. **News Card**:
   - Left side: Article thumbnail image (rounded corners, standard size).
   - Right side: Category, H3 title, body teaser, inline compact BiasMeter, footer metadata (time icon + reading duration, bookmark icon).

## Security Requirements
- Ensure no API keys or server-only credentials are exposed to client components.
- Rely strictly on local theme variables and static page mockups for the design system.

## Acceptance Criteria
1. Standard styles are completely integrated into `globals.css` and layout using Poppins font.
2. Reusable components (Button, Chip, BiasMeter, NewsCard) function correctly and match the UI spec.
3. Showcase dashboard compiles successfully and displays all visual elements of the spec.
4. Tailwind class names are applied correctly for spacing, shadows, and radii.

## Checks to Run
- `npm run typecheck` or `npx tsc --noEmit`
- `npm run lint`

## Manual Verification Steps
1. Run `npm run dev` to start the development server.
2. Open `http://localhost:3000` in the browser.
3. Inspect and verify the page structure, ensuring it visualizes:
   - Colors swatches and codes.
   - Typography samples.
   - Standard button variations & interactive states.
   - Chips list.
   - Standalone Bias Meter.
   - Layout of the Trump article News Card example.
   - Icons matrix.
   - Spacing visual guide and shadows.
