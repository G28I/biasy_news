import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-brand-primary text-white font-sans py-12 px-8 border-t border-white/10 select-none">
      <div className="mx-auto max-w-[1280px] grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-2xl tracking-tight">biasly</span>
            <span className="bg-white text-brand-primary text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm-custom">
              News
            </span>
          </div>
          <p className="text-[13px] text-white/70 leading-relaxed max-w-[200px]">
            Balanced news coverage powered by AI.
          </p>
        </div>

        {/* Company Links */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[12px] font-bold tracking-wider text-white/50 uppercase">
            Company
          </h4>
          <ul className="flex flex-col gap-2 text-[13px] text-white/80">
            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Help Links */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[12px] font-bold tracking-wider text-white/50 uppercase">
            Help
          </h4>
          <ul className="flex flex-col gap-2 text-[13px] text-white/80">
            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        {/* Connect Links */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[12px] font-bold tracking-wider text-white/50 uppercase">
            Connect
          </h4>
          <div className="flex items-center gap-4 text-white/80">
            {/* Custom X Logo */}
            <a href="#" className="hover:text-white transition-colors" title="X (Twitter)">
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* Custom LinkedIn Logo */}
            <a href="#" className="hover:text-white transition-colors" title="LinkedIn">
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            {/* Custom YouTube Logo */}
            <a href="#" className="hover:text-white transition-colors" title="YouTube">
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.388.555A3.002 3.002 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.48 20.5 12 20.5 12 20.5s7.52 0 9.388-.555a3.002 3.002 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="mx-auto max-w-[1280px] border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-[11px] text-white/50 gap-4">
        <div>© 2026 Biasly News. All rights reserved.</div>
        <div className="font-medium tracking-wide">Stay consistent. Stay unbiased.</div>
      </div>
    </footer>
  );
};
