import React from "react";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center py-12 px-6 font-sans">
      <div className="w-full max-w-md flex flex-col gap-6 items-center">
        {/* Brand Header */}
        <div className="flex items-center gap-2 select-none">
          <span className="font-bold text-3xl tracking-tight text-brand-primary">
            biasly
          </span>
          <span className="bg-brand-primary text-white text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm-custom">
            News
          </span>
        </div>
        
        {/* Clerk Sign In component */}
        <SignIn />
      </div>
    </div>
  );
}
