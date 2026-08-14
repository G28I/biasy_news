# Implementation Prompt - Newsletter Sub/Unsub Email Notification and Toggle

This prompt outlines the plan to implement automated subscription email notifications using `nodemailer` and dynamic unsubscribe buttons for the newsletter banner and header.

---

## Goal
1. Send a beautiful HTML confirmation email (or create an Ethereal SMTP test preview link in the console) when a user subscribes.
2. Replace success banners with a dynamic toggle where the "Subscribe" button changes to "Unsubscribe" upon subscribing, allowing users to inline unsubscribe.
3. Sync subscription state globally across the Header and Newsletter Banner using LocalStorage and custom window events.

---

## Skills Read
- `.agents/skills/supabase` (since no database subscriptions table is needed yet; we are to use PostHog user property identification, localStorage state sync, and Ethereal SMTP)

---

## Existing Code Inspected
- `components/ui/NewsletterBanner.tsx`: Bottom banner containing a simple client-side form.
- `components/layout/Header.tsx`: Header component containing the mock/modal button.
- `package.json`: Contains the newly installed `nodemailer` dependency.

---

## Decisions & Assumptions
- We will implement a Next.js API route `POST /api/subscribe` that handles sending the confirmation/unsubscription emails.
- If SMTP credentials are not configured in `.env.local`, we will fallback to dynamically creating a free Ethereal Email test account. This generates a real, clickable message preview link in the dev console log.
- Both the header modal and bottom banner will call this API.
- Upon successful subscription, the input field will display the email address as read-only/disabled, and the button will turn into a destructive "Unsubscribe" button. Clicking "Unsubscribe" will call the unsubscribe API and reset the state.

---

## Proposed Changes

### 1. Subscription API Endpoint
#### [NEW] [route.ts](file:///c:/Users/ramak/OneDrive/Desktop/new-skew/app/api/subscribe/route.ts)
- Implement `POST` handler expecting `{ email, action: 'subscribe' | 'unsubscribe' }`.
- Connect to SMTP transporter using `nodemailer`. Create a test account dynamically if no custom variables are provided.
- Send a beautifully structured HTML email confirming subscription (or unsubscription).
- Return a JSON response with the email status and the Ethereal message preview URL if applicable.

### 2. Newsletter Banner Inline Unsubscribe
#### [MODIFY] [NewsletterBanner.tsx](file:///c:/Users/ramak/OneDrive/Desktop/new-skew/components/ui/NewsletterBanner.tsx)
- Connect to LocalStorage for persistence.
- Implement subscription state sync across components using custom storage/window events.
- On click "Subscribe", make a POST request to `/api/subscribe` for `subscribe`, then update LocalStorage.
- When `subscribed` is true, display the email in a disabled/read-only input field and change the button to "Unsubscribe" (red/destructive style).
- On click "Unsubscribe", make a POST request to `/api/subscribe` for `unsubscribe`, capture unsubscription in PostHog, and reset the form.

### 3. Header Modal Inline Unsubscribe
#### [MODIFY] [Header.tsx](file:///c:/Users/ramak/OneDrive/Desktop/new-skew/components/layout/Header.tsx)
- Sync subscription state with LocalStorage.
- If already subscribed, clicking the Header's "Subscribe" button opens the modal in the "Subscribed" state, showing their active email and an "Unsubscribe" button.
- Submit handler calls `/api/subscribe` for `subscribe`/`unsubscribe` actions and updates LocalStorage.

---

## Acceptance Criteria
1. TypeScript compiles with 0 errors.
2. Linter runs with 0 errors.
3. Subscribing in either the header or bottom banner:
   - Synchronizes both views to the "Subscribed" state.
   - Disables/marks input as read-only and turns the button into "Unsubscribe".
   - Sends a confirmation email and prints a clickable Ethereal preview link in the Next.js server console.
4. Clicking "Unsubscribe" in either component reverts both views back to the "Subscribe" state.

---

## Verification Plan

### Automated Checks
- `npx tsc --noEmit`
- `npx eslint .`

### Manual Verification
- Open http://localhost:3000/
- Enter an email at the bottom banner and click "Subscribe".
- Verify the button turns into "Unsubscribe" and check the terminal log to click the Ethereal email preview URL.
- Open the Header's "Subscribe" modal. Verify it displays in the active subscribed state showing "Unsubscribe".
- Click "Unsubscribe" in the header modal. Verify both the modal and bottom banner revert to the unsubscribed state.
