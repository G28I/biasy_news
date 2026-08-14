"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import posthog from "posthog-js";

/**
 * Identifies the currently signed-in Clerk user with PostHog.
 * Place this inside ClerkProvider so it can read auth state.
 */
export function PostHogUserIdentifier() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      const primaryEmail = user.primaryEmailAddress?.emailAddress;
      posthog.identify(user.id, {
        name: user.fullName ?? undefined,
        ...(primaryEmail ? { email: primaryEmail } : {}),
      });
    } else {
      // User signed out — reset to an anonymous session
      posthog.reset();
    }
  }, [user, isLoaded]);

  return null;
}
