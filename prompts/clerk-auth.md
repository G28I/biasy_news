# Implementation Prompt - biasly Clerk Authentication

## Goal
Integrate **Clerk** authentication into the **biasly** news application. The user will be able to sign in and sign up using prebuilt Clerk components, while public pages (homepage, article details, and showcase) remain accessible. The header navbar will reflect the user's authentication state dynamically.

## Skills Read
- Clerk router and setup guides (`.agents/skills/clerk`, `clerk-setup`, `clerk-nextjs-patterns`)
- Next.js documentation (from `node_modules/next/dist/docs/`)

## Existing Code Inspected
- `app/layout.tsx` (Root layout)
- `components/layout/Header.tsx` (Navbar header)
- `.env.local` (Local environment variables)

## Decisions or Assumptions
1. **Routing Strategy**: Custom sign-in/up routes hosted at `/sign-in` and `/sign-up`.
2. **Middleware**: A `middleware.ts` file in the root directory protects routes, keeping static assets and public paths (`/`, `/showcase`) open. The article details path (`/article/[id]`) is protected and requires authentication.
3. **Dynamic State**: Use `<SignedIn>`, `<SignedOut>`, `<SignInButton>`, and `<UserButton>` to swap the "Login" button with the profile avatar dynamically.

## Files Likely to Change
- [MODIFY] `.env.local` (Add Clerk URL configs)
- [MODIFY] `app/layout.tsx` (Add ClerkProvider wrapper)
- [MODIFY] `components/layout/Header.tsx` (Add authentication hooks/buttons)
- [NEW] `middleware.ts` (Add Clerk routing middleware)
- [NEW] `app/sign-in/[[...sign-in]]/page.tsx` (Sign-in page view)
- [NEW] `app/sign-up/[[...sign-up]]/page.tsx` (Sign-up page view)

## Visual & Layout Requirements
- **Sign-in & Sign-up Pages**:
  - Centered vertically and horizontally in the viewport with a subtle, modern gradient or light gray background (#F9FAFB).
  - Clean card styling for the Clerk components matching the Poppins font variable.
- **Navbar Header State**:
  - If signed out, display "Login" button. Clicking it triggers the sign-in modal/route.
  - If signed in, replace the "Login" button with `<UserButton afterSignOutUrl="/" />` to show the user avatar.

## Security Requirements
- Ensure `CLERK_SECRET_KEY` remains server-side only and is never exposed in client bundles.
- Protect any non-public page routes.

## Acceptance Criteria
1. The root layout correctly integrates `<ClerkProvider dynamic>`.
2. The application compiles and runs without Next.js middleware execution warnings.
3. Unauthenticated users can view `/` and `/showcase` but attempting to view `/article/[id]` redirects them to the sign-in page.
4. Clicking a news card on the homepage redirects unauthenticated users to `/sign-in`.
5. Signing in successfully routes the user to their intended `/article/[id]` page, and the header now displays their user avatar.
6. Clicking log out from the user avatar menu returns the user to the signed-out state and restricts access to `/article/[id]` routes again.

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

## Manual Verification Steps
1. Run `npm run dev`.
2. Navigate to `http://localhost:3000`.
3. Confirm the "Login" button is present and click the Trump news card.
4. Verify the application redirects to `/sign-in` (or prompts sign-in).
5. Sign in and verify that the page routes to `/article/1` and displays the user profile avatar in the header.
6. Click logout on the profile menu and confirm that the page redirects and prompts sign-in when attempting to reload `/article/1`.
