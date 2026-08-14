"use client";

import React from "react";
import { Button } from "./Button";
import posthog from "posthog-js";

export const NewsletterBanner: React.FC = () => {
  return (
    <div className="w-full bg-surface border-t border-b border-border-color py-8 px-8 flex flex-col md:flex-row items-center justify-between gap-6 font-sans">
      {/* Left side text info */}
      <div className="flex flex-col gap-1.5 text-center md:text-left select-none">
        <h3 className="text-lg font-bold text-brand-primary">
          Stay Informed. Stay Balanced.
        </h3>
        <p className="text-xs text-brand-secondary font-medium">
          Get the top stories and bias analysis delivered to your inbox.
        </p>
      </div>

      {/* Right side form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const emailInput = form.querySelector<HTMLInputElement>('input[type="email"]');
          if (emailInput?.value) {
            // Identify the user with their email (person property, not event property)
            posthog.identify(posthog.get_distinct_id(), { email: emailInput.value });
            posthog.capture("newsletter_subscribed");
          }
        }}
        className="flex items-center gap-3 w-full md:w-auto max-w-md"
      >
        <input
          type="email"
          placeholder="Enter your email"
          required
          className="bg-white border border-border-color rounded-md-custom px-4 py-2 text-xs font-medium text-brand-primary placeholder-brand-secondary/60 outline-none focus:border-brand-primary transition-colors flex-grow md:w-[260px]"
        />
        <Button
          type="submit"
          variant="primary"
          className="py-2.5 px-6 text-xs font-semibold rounded-md-custom whitespace-nowrap"
        >
          Subscribe
        </Button>
      </form>
    </div>
  );
};
