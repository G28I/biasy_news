# Implementation Prompt - Newsletter Subscription Functionality

This prompt outlines the plan to implement working subscription handlers, premium UI feedback, and PostHog event tracking for the "Subscribe" buttons in the Header and Newsletter Banner.

---

## Goal
Make the "Subscribe" buttons functional on the homepage/header:
1. Show a beautiful, interactive modal when the header's "Subscribe" button is clicked, prompting the user for their email and showing a premium success confirmation upon submission.
2. Add a success feedback state to the `NewsletterBanner` component at the bottom of the page when a user submits their email.
3. Track subscriptions in PostHog with user identification.

---

## Skills Read
- `.agents/skills/supabase` (since no database subscriptions table is needed yet; we are to use PostHog user property identification and local state feedback)

---

## Existing Code Inspected
- `components/layout/Header.tsx`: Header component containing the mock "Subscribe" button.
- `components/ui/NewsletterBanner.tsx`: Bottom banner containing a mock posthog-tracked form without success feedback.
- `components/ui/Button.tsx`: Button component for custom styles.

---

## Decisions & Assumptions
- We will manage the subscription state locally with React hooks.
- Header's "Subscribe" button will open a custom, premium backdrop-blur modal.
- PostHog identification (`posthog.identify` & `posthog.capture("newsletter_subscribed")`) will be invoked on successful subscriptions in both components.

---

## Proposed Changes

### 1. Newsletter Banner Feedback
#### [MODIFY] [NewsletterBanner.tsx](file:///c:/Users/ramak/OneDrive/Desktop/new-skew/components/ui/NewsletterBanner.tsx)
- Add state variable `subscribed` to track submission.
- Render the text info: *"Anytime unsubscribe, no questions asked"* under the input field.
- When submitted:
  - Identify user in PostHog.
  - Trigger `newsletter_subscribed` capture event.
  - Render a clean success state: *"Thank you for subscribing! Stay informed, stay balanced."*

### 2. Header Subscription Modal
#### [MODIFY] [Header.tsx](file:///c:/Users/ramak/OneDrive/Desktop/new-skew/components/layout/Header.tsx)
- Import `posthog` from `"posthog-js"`.
- Add state variables:
  - `isModalOpen`: boolean to control custom modal visibility.
  - `modalSubscribed`: boolean to control success state inside modal.
- Attach click handler to header's "Subscribe" button to set `isModalOpen(true)`.
- Render a premium overlay with a subscription form.
- Include the subtext: *"Anytime unsubscribe, no questions asked"* inside the modal.
- Upon submission:
  - Identify user in PostHog.
  - Trigger `newsletter_subscribed` capture.
  - Transition to a success checkmark view.

---

## Acceptance Criteria
1. TypeScript compiles with 0 errors.
2. Linter runs with 0 errors.
3. Header "Subscribe" button opens the modal.
4. Inputting an email and clicking "Subscribe" in either location tracks in PostHog and presents clear success feedback.

---

## Verification Plan

### Automated Checks
- `npx tsc --noEmit`
- `npx eslint .`

### Manual Verification
- Open `http://localhost:3000/` in the browser.
- Click "Subscribe" in the Header. Verify that the subscription modal opens, type an email, and submit to see the checkmark success view.
- Scroll to the bottom and enter an email in the Newsletter Banner. Submit and verify the success state renders.
