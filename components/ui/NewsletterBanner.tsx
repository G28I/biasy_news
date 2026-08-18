"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import posthog from "posthog-js";

export const NewsletterBanner: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isSubscribed = localStorage.getItem("biasly_newsletter_subscribed") === "true";
    const storedEmail = localStorage.getItem("biasly_newsletter_email") || "";
    const timer = setTimeout(() => {
      setSubscribed(isSubscribed);
      setEmail(storedEmail);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const syncState = () => {
      const isSubscribed = localStorage.getItem("biasly_newsletter_subscribed") === "true";
      const storedEmail = localStorage.getItem("biasly_newsletter_email") || "";
      setSubscribed(isSubscribed);
      setEmail(storedEmail);
    };

    window.addEventListener("storage", syncState);
    window.addEventListener("biasly_subscribe_event", syncState);
    return () => {
      window.removeEventListener("storage", syncState);
      window.removeEventListener("biasly_subscribe_event", syncState);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const action = subscribed ? "unsubscribe" : "subscribe";
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), action }),
      });

      if (res.ok) {
        const nextSubscribed = !subscribed;
        localStorage.setItem("biasly_newsletter_subscribed", String(nextSubscribed));
        localStorage.setItem("biasly_newsletter_email", nextSubscribed ? email.trim() : "");
        window.dispatchEvent(new Event("biasly_subscribe_event"));

        if (nextSubscribed) {
          posthog.identify(posthog.get_distinct_id(), { email: email.trim() });
          posthog.capture("newsletter_subscribed");
        } else {
          posthog.capture("newsletter_unsubscribed");
          setEmail("");
        }
      } else {
        const data = await res.json();
        console.error("Subscription request failed:", data.error || res.statusText);
      }
    } catch (err) {
      console.error("Subscription API request error:", err);
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="flex flex-col gap-2 w-full md:w-auto max-w-md">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={subscribed || isLoading}
            className={`bg-bg-primary border border-border-color rounded-md-custom px-4 py-2 text-xs font-medium text-brand-primary placeholder-brand-secondary/60 outline-none focus:border-brand-primary transition-colors flex-grow md:w-[260px] ${
              subscribed ? "opacity-75 cursor-not-allowed select-none bg-surface/50" : ""
            }`}
          />
          <Button
            type="submit"
            variant={subscribed ? "outline" : "primary"}
            disabled={isLoading}
            className={`py-2.5 px-6 text-xs font-semibold rounded-md-custom whitespace-nowrap transition-colors ${
              subscribed ? "border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600" : ""
            }`}
          >
            {isLoading ? "Processing..." : subscribed ? "Unsubscribe" : "Subscribe"}
          </Button>
        </form>
        <p className="text-[10px] text-brand-secondary/60 text-center md:text-left select-none italic">
          Anytime unsubscribe, no questions asked
        </p>
      </div>
    </div>
  );
};
