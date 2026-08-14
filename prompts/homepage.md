# Implementation Prompt - biasly Homepage

## Goal
Implement the main homepage for **biasly** news website according to the provided UI reference. The page will display the header bar, horizontal category filter chips, a 3-column grid of 12 vertical news cards representing actual stories, and a detailed navigation footer.

## Skills Read
- Next.js documentation (from `node_modules/next/dist/docs/`)
- Tailwind CSS v4 styling rules

## Existing Code Inspected
- `app/globals.css` (Tailwind CSS v4 config)
- `components/ui/Button.tsx` (Button component)
- `components/ui/Chip.tsx` (Chip component)
- `components/ui/BiasMeter.tsx` (BiasMeter component)
- `components/ui/NewsCard.tsx` (Horizontal news card component)
- `app/page.tsx` (Currently hosts the design system showcase)

## Decisions or Assumptions
1. **Route Reorganization**: Move the current design system showcase in `app/page.tsx` to a new file `app/showcase/page.tsx` to preserve it.
2. **Vertical Cards**: Modify `NewsCard.tsx` to support a `variant` prop so it can render both vertical (for homepage grid) and horizontal (for showcase and detail pages) cards.
3. **Mock Data**: Create 12 items representing the exact stories, bias percentages, and source counts displayed in the homepage mockup image.
4. **Interactive Filters**: The category chips bar will be styled as a horizontal scrolling list with chevron/arrow controls.

## Files Likely to Change
- [NEW] `app/showcase/page.tsx` (Preserved design system showcase)
- [MODIFY] `app/page.tsx` (Main homepage)
- [MODIFY] `components/ui/NewsCard.tsx` (Support vertical cards)
- [NEW] `components/layout/Header.tsx` (Global header navbar)
- [NEW] `components/layout/Footer.tsx` (Global footer section)
- [NEW] `lib/mock/articles.ts` (12 articles mock database)

## Visual & Layout Requirements
- **Top Utility Bar**: Small text (11px Caption), gray background (`#F6F6F6`), borders (`#E5E7EB`). Spans full width. Includes date "Monday, June 1, 2026", theme buttons (Light/Dark/Auto), and location/edition links.
- **Main Navbar**: Height ~72px, background `#FFFFFF`, border-bottom `#E5E7EB`.
  - Left: Hamburger menu icon + biasly logo with black text, bold, 24px + small dark "News" badge.
  - Center: Nav links "Home", "For You" (with a red badge `#B42318` dot), "Local", "Blindspot" (Regular 14px, dark gray `#6B7280` hover text).
  - Right: "Subscribe" button (black fill) + "Login" button (outline style).
- **Categories Bar**: Horizontal scrolling bar of rounded-full Chips with small spacing (`gap-2` or `gap-3`). Icons included.
- **Grid Layout**: 3 columns on desktop, 2 columns on tablet, 1 column on mobile (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`). Max-width 1280px, centered.
- **Vertical News Cards**:
  - Border `#E5E7EB`, background `#FFFFFF`, rounded corners `12px` (large), shadow `0px 4px 12px rgba(0,0,0,0.08)` (medium).
  - Image at top: `h-[200px]`, `w-full`, rounded top edge. Info icon overlay in top-right.
  - Text Content: Category/Location (11px gray text), H3 Title (18px, font-semibold, line-clamp-2), compact BiasMeter (no axis scale below, segments showing "L [left]%", "Center [center]%", "Right [right]%").
  - Footer: "[X] sources" (12px gray text).
- **Footer**:
  - Background `#0D0D0F`, text `#FFFFFF`, sub-texts `#6B7280` (or white/70).
  - Top half: 4-column layout (Brand info, Company links, Help links, Connect social icons).
  - Bottom half: Divider border `#E5E7EB`/10 + copyright text + "Stay consistent. Stay unbiased." text.

## Security Requirements
- Ensure no credential or API keys are written.
- Rely purely on client-side routing and static mock files for the layout.

## Acceptance Criteria
1. Root URL `/` loads the news homepage layout successfully.
2. Sub-route `/showcase` loads the original design system showcase.
3. 12 news cards render correctly in a 3-column grid with their respective categories, titles, bias meters, and source counts.
4. Header navbar and utility bar are fully styled and responsive.
5. Footer is fully implemented matching the dark theme layout.
6. The project compiles successfully with no TS/ESLint errors.

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

## Manual Verification Steps
1. Run `npm run dev`.
2. Open `http://localhost:3000` in the browser and verify the full homepage.
3. Scroll down to inspect cards, grid, location bar, and footer details.
4. Verify `/showcase` displays the design system playground.
