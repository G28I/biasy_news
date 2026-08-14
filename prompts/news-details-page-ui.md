# Implementation Prompt - biasly News Details Page

## Goal
Implement the news details page for **biasly** according to the provided UI reference. This page will display the full article content, including dynamic titles, author bars, hero images, inline bias distribution meters, detailed paragraphs, Related Stories grid, a dark newsletter signup, and a detailed sidebar analysis (Bias Analysis, AI Summary, and Source Breakdown).

## Skills Read
- Next.js documentation (from `node_modules/next/dist/docs/`)
- Tailwind CSS v4 styling rules

## Existing Code Inspected
- `app/globals.css` (Tailwind CSS v4 config)
- `components/layout/Header.tsx` (Navbar header)
- `components/layout/Footer.tsx` (Navbar footer)
- `components/ui/BiasMeter.tsx` (BiasMeter component)
- `components/ui/NewsCard.tsx` (NewsCard component)
- `lib/mock/articles.ts` (Mock articles database)
- `app/page.tsx` (Main homepage)

## Decisions or Assumptions
1. **Dynamic Routing**: Details page lives in a dynamic route `app/article/[id]/page.tsx` using dynamic parameters to fetch articles.
2. **Interactive Navigation**: Homepage cards are wrapped in `<Link>` elements pointing to `/article/[id]`.
3. **Structured Data Expansion**: Extend the `mockArticles` in `lib/mock/articles.ts` with properties for `author`, `publishedDate`, `paragraphs`, and `highlights` representing actual mockup content.
4. **Layout**: Two-column responsive layout (Main Article column left ~68%, Sidebar analysis column right ~32%) on desktop, stacking vertically on mobile devices.

## Files Likely to Change
- [MODIFY] `lib/mock/articles.ts` (Data expansion)
- [MODIFY] `app/page.tsx` (Add navigation links)
- [NEW] `app/article/[id]/page.tsx` (Article details view)
- [NEW] `components/details/BiasAnalysis.tsx` (Bias Analysis Sidebar block)
- [NEW] `components/details/AISummary.tsx` (AI Summary Sidebar block)
- [NEW] `components/details/SourceBreakdown.tsx` (Source Breakdown Sidebar block)
- [NEW] `components/ui/NewsletterBanner.tsx` (Newsletter Signup block)

## Visual & Layout Requirements
- **Sidebar Blocks**:
  - Border `#E5E7EB`, background `#FFFFFF`, rounded corners `8px` (medium) or `12px` (large), padding `p-6`, shadow `0px 4px 12px rgba(0,0,0,0.08)`.
  - Header: Muted bold uppercase label with information overlay icon.
  - Buttons: Outlined buttons (`border border-border-color hover:bg-surface text-brand-primary font-semibold text-xs py-2.5 px-4 rounded-md-custom`).
- **Bias Analysis Sidebar**:
  - "Overall Bias" -> Large colored text: "Right 49%" (or Left/Center text) and "Based on 12 balanced sources" in caption size.
  - Horizontal stacked progress bars for Left (Red), Center (Gray), and Right (Blue) proportions, displaying percentages next to labels.
- **AI Summary Sidebar**:
  - Generated date meta.
  - Bulleted list of summaries using clean list icons/dots with generous line-height (`leading-relaxed`, `text-sm`, `space-y-3.5`).
- **Source Breakdown Sidebar**:
  - Bar indicators representing source numbers.
  - Simple list showing: Source Name (Left aligned, black text) and Bias Label (Right aligned, colored text: Right in blue, Center in gray, Left in red).
- **Related Stories Grid**:
  - Displayed under the article text.
  - 2 columns of cards on desktop, 1 column on mobile.
  - Cards are smaller horizontal layouts displaying a thumbnail (`w-24 h-16` or similar), category, title, date, and reading time.
- **Newsletter Signup Banner**:
  - Full width wrapper, background `#F6F6F6` (surface color), padding `py-8 px-6`, border-t and border-b.
  - Flex layout (row on desktop, column on mobile).
  - Left: Headline "Stay Informed. Stay Balanced." (H3 style) + subhead.
  - Right: Text input box with placeholder "Enter your email" + solid black button "Subscribe".

## Security Requirements
- All details pages are client-rendered/server-prerendered mock states, no API keys or backend tokens required.

## Acceptance Criteria
1. Clicking a homepage news card navigates to `/article/[id]`.
2. The dynamic route loads the correct article details.
3. Left column displays Title, Author bar with bookmark/share buttons, Hero image with description, Bias Distribution meter, article paragraphs, and Related Stories grid.
4. Right column displays Bias Analysis, AI Summary, and Source Breakdown cards matching the spec layout.
5. The newsletter sign-up banner is rendered below the main grid.
6. Footer and Header are fully integrated.
7. Next.js production build (`npm run build`) completes successfully.

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

## Manual Verification Steps
1. Run `npm run dev`.
2. Visit `http://localhost:3000` and click the Trump article card.
3. Verify that `/article/1` loads the details page matching the attached UI spec.
4. Verify sidebar progress bars and tables are styled correctly.
5. Verify clicking related stories updates the details view.
