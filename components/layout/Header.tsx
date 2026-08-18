"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Globe, ChevronDown, Sun, Moon, Monitor } from "lucide-react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import posthog from "posthog-js";

export const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTheme, setActiveTheme] = useState<"light" | "dark" | "system">("system");
 
  useEffect(() => {
    const isSubscribed = localStorage.getItem("biasly_newsletter_subscribed") === "true";
    const storedEmail = localStorage.getItem("biasly_newsletter_email") || "";
    const storedTheme = (localStorage.getItem("biasly_theme") || "system") as "light" | "dark" | "system";

    const applyTheme = (themeVal: "light" | "dark" | "system") => {
      setActiveTheme(themeVal);
      if (themeVal === "dark") {
        document.documentElement.classList.add("dark");
      } else if (themeVal === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isSystemDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    const timer = setTimeout(() => {
      setSubscribed(isSubscribed);
      setEmail(storedEmail);
      applyTheme(storedTheme);
    }, 0);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const currentStored = localStorage.getItem("biasly_theme") || "system";
      if (currentStored === "system") {
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
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
 
  const handleThemeChange = (themeVal: "light" | "dark" | "system") => {
    localStorage.setItem("biasly_theme", themeVal);
    setActiveTheme(themeVal);
    if (themeVal === "dark") {
      document.documentElement.classList.add("dark");
    } else if (themeVal === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isSystemDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const handleSubscribeSubmit = async (e: React.FormEvent) => {
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
        console.error("Header subscription request failed:", data.error || res.statusText);
      }
    } catch (err) {
      console.error("Header subscription request error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="w-full flex flex-col font-sans select-none z-50 bg-bg-primary">
      {/* Top Utility Bar (Hidden on Mobile) */}
      <div className="w-full bg-surface border-b border-border-color px-8 py-2.5 hidden md:flex items-center justify-between text-[11px] text-brand-secondary font-medium">
        {/* Left Links */}
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-brand-primary transition-colors">
            Browser Extension
          </a>
          <span className="text-divider-color">|</span>
          <div className="flex items-center gap-1.5 select-none">
            <span>Theme:</span>
            <button
              onClick={() => handleThemeChange("light")}
              className={`cursor-pointer transition-colors ${activeTheme === "light" ? "text-brand-primary font-semibold underline" : "hover:text-brand-primary"}`}
            >
              Light
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`cursor-pointer transition-colors ${activeTheme === "dark" ? "text-brand-primary font-semibold underline" : "hover:text-brand-primary"}`}
            >
              Dark
            </button>
            <button
              onClick={() => handleThemeChange("system")}
              className={`cursor-pointer transition-colors ${activeTheme === "system" ? "text-brand-primary font-semibold underline" : "hover:text-brand-primary"}`}
            >
              Auto
            </button>
          </div>
        </div>

        {/* Center Date */}
        <div>Monday, June 1, 2026</div>

        {/* Right Options */}
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-brand-primary transition-colors">
            Set Location
          </a>
          <span className="text-divider-color">|</span>
          <div className="flex items-center gap-1 cursor-pointer hover:text-brand-primary transition-colors">
            <Globe className="w-3.5 h-3.5" />
            <span>International Edition</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full h-[72px] border-b border-border-color px-8 flex items-center justify-between bg-bg-primary shadow-sm-custom">
        {/* Left Side (Logo and Hamburger) */}
        <div className="flex items-center gap-4">
          <button className="p-1.5 hover:bg-surface rounded-sm-custom transition-colors cursor-pointer text-brand-primary">
            <Menu className="w-5 h-5 stroke-[2px]" />
          </button>
          
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-2xl tracking-tight text-brand-primary">
              biasly
            </span>
            <span className="bg-brand-primary text-white text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm-custom">
              News
            </span>
          </Link>
        </div>

        {/* Center Navigation Links (Hidden on Mobile/Tablet) */}
        <nav className="hidden lg:flex items-center gap-8 text-[14px] font-semibold text-brand-secondary">
          <Link href="/" className="text-brand-primary border-b-2 border-brand-primary py-[23px]">
            Home
          </Link>
          <a href="#" className="relative flex items-center gap-1 hover:text-brand-primary transition-colors py-[23px]">
            For You
            <span className="absolute top-[21px] -right-1.5 w-1.5 h-1.5 bg-left-bias rounded-full" />
          </a>
          <a href="#" className="hover:text-brand-primary transition-colors py-[23px]">
            Local
          </a>
          <a href="#" className="hover:text-brand-primary transition-colors py-[23px]">
            Blindspot
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const nextTheme = activeTheme === "light" ? "dark" : activeTheme === "dark" ? "system" : "light";
              handleThemeChange(nextTheme);
            }}
            className="p-2 hover:bg-surface rounded-md-custom text-brand-secondary hover:text-brand-primary transition-colors cursor-pointer mr-1 flex items-center justify-center"
            title={`Current Theme: ${activeTheme}`}
          >
            {activeTheme === "light" && <Sun className="w-4.5 h-4.5" />}
            {activeTheme === "dark" && <Moon className="w-4.5 h-4.5" />}
            {activeTheme === "system" && <Monitor className="w-4.5 h-4.5" />}
          </button>

          <Button 
            onClick={() => setIsModalOpen(true)}
            variant="primary" 
            className="py-2 px-5 text-xs font-semibold rounded-md-custom"
          >
            Subscribe
          </Button>
          
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="secondary" className="py-2 px-5 text-xs font-semibold border border-border-color rounded-md-custom">
                Login
              </Button>
            </SignInButton>
          </Show>
          
          <Show when="signed-in">
            <div className="flex items-center justify-center pl-2">
              <UserButton />
            </div>
          </Show>
        </div>
      </div>
 
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-bg-primary border border-border-color rounded-lg-custom p-8 max-w-md w-full mx-4 shadow-lg-custom flex flex-col gap-6 relative animate-fade-in">
            <button 
              onClick={() => { setIsModalOpen(false); }}
              disabled={isLoading}
              className="absolute top-4 right-4 text-brand-secondary hover:text-brand-primary transition-colors cursor-pointer text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✕
            </button>
            
            <form onSubmit={handleSubscribeSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 text-center select-none">
                <h3 className="text-xl font-bold text-brand-primary">
                  {subscribed ? "Manage Subscription" : "Subscribe to biasly"}
                </h3>
                <p className="text-sm text-brand-secondary leading-relaxed">
                  {subscribed 
                    ? "You are currently subscribed to daily news updates and bias metrics." 
                    : "Get daily bias analyses and balanced news summaries delivered straight to your inbox."}
                </p>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={subscribed || isLoading}
                className={`bg-white border border-border-color rounded-md-custom px-4 py-2.5 text-sm font-medium text-brand-primary placeholder-brand-secondary/60 outline-none focus:border-brand-primary transition-colors w-full ${
                  subscribed ? "opacity-75 cursor-not-allowed select-none bg-surface/50" : ""
                }`}
              />
              <Button 
                type="submit" 
                variant={subscribed ? "outline" : "primary"} 
                disabled={isLoading}
                className={`py-3 px-6 text-sm font-semibold rounded-md-custom w-full transition-colors ${
                  subscribed ? "border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600" : ""
                }`}
              >
                {isLoading ? "Processing..." : subscribed ? "Unsubscribe" : "Subscribe"}
              </Button>
              <p className="text-[10px] text-brand-secondary/60 text-center select-none italic mt-1">
                Anytime unsubscribe, no questions asked
              </p>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
