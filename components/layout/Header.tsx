import React from "react";
import Link from "next/link";
import { Menu, Globe, ChevronDown } from "lucide-react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";

export const Header: React.FC = () => {
  return (
    <header className="w-full flex flex-col font-sans select-none z-50 bg-white">
      {/* Top Utility Bar (Hidden on Mobile) */}
      <div className="w-full bg-surface border-b border-border-color px-8 py-2.5 hidden md:flex items-center justify-between text-[11px] text-brand-secondary font-medium">
        {/* Left Links */}
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-brand-primary transition-colors">
            Browser Extension
          </a>
          <span className="text-divider-color">|</span>
          <div className="flex items-center gap-1.5">
            <span>Theme:</span>
            <button className="text-brand-primary font-semibold hover:underline cursor-pointer">Light</button>
            <button className="hover:text-brand-primary transition-colors cursor-pointer">Dark</button>
            <button className="hover:text-brand-primary transition-colors cursor-pointer">Auto</button>
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
      <div className="w-full h-[72px] border-b border-border-color px-8 flex items-center justify-between bg-white shadow-sm-custom">
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
          <Button variant="primary" className="py-2 px-5 text-xs font-semibold rounded-md-custom">
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
    </header>
  );
};
