"use client";

import React from "react";
import {
  Menu,
  Search,
  Bookmark,
  Clock,
  Info,
  Share,
  ExternalLink,
  Calendar,
  BarChart3,
  Tag,
  User,
  Bell,
  SlidersHorizontal,
  CheckCircle2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { BiasMeter } from "@/components/ui/BiasMeter";
import { NewsCard } from "@/components/ui/NewsCard";

export default function DesignSystemShowcase() {
  return (
    <div className="min-h-screen bg-bg-secondary p-8 font-sans antialiased text-brand-primary">
      {/* Container */}
      <div className="mx-auto max-w-[1280px] bg-white border border-border-color rounded-lg-custom shadow-lg-custom overflow-hidden">
        {/* Top Header */}
        <div className="border-b border-divider-color px-8 py-6 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="font-sans font-bold text-2xl tracking-tight text-brand-primary">
              biasly
            </span>
            <span className="bg-brand-primary text-white text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm-custom">
              News
            </span>
          </div>
          <div className="text-brand-secondary body-small-style font-medium">
            Design System v1.0 • June 1, 2026
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 bg-bg-secondary">
          {/* LEFT COLUMN: BRAND, COLORS, SPACING */}
          <div className="flex flex-col gap-8">
            {/* Brand Module */}
            <div className="bg-white border border-border-color rounded-md-custom p-6 shadow-sm-custom">
              <h3 className="caption-style font-bold tracking-wider text-brand-secondary uppercase mb-6">
                Brand
              </h3>
              <div className="flex flex-col items-center justify-center text-center py-6">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="font-sans font-bold text-4xl tracking-tight text-brand-primary">
                    biasly
                  </span>
                  <span className="bg-brand-primary text-white text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm-custom">
                    News
                  </span>
                </div>
                <p className="body-medium-style text-brand-secondary max-w-[200px]">
                  Balanced news coverage, powered by AI.
                </p>
              </div>
            </div>

            {/* Colors Module */}
            <div className="bg-white border border-border-color rounded-md-custom p-6 shadow-sm-custom">
              <h3 className="caption-style font-bold tracking-wider text-brand-secondary uppercase mb-6">
                Colors
              </h3>

              {/* Primary */}
              <div className="mb-6">
                <h4 className="caption-style font-bold text-brand-secondary mb-3">Primary</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="h-12 w-full bg-brand-primary rounded-sm-custom border border-black/10" />
                    <div className="mt-1.5">
                      <div className="text-[11px] font-semibold">TEXT PRIMARY</div>
                      <div className="text-[10px] text-brand-secondary">#0D0D0F</div>
                    </div>
                  </div>
                  <div>
                    <div className="h-12 w-full bg-brand-secondary rounded-sm-custom" />
                    <div className="mt-1.5">
                      <div className="text-[11px] font-semibold">TEXT SEC.</div>
                      <div className="text-[10px] text-brand-secondary">#6B7280</div>
                    </div>
                  </div>
                  <div>
                    <div className="h-12 w-full bg-surface rounded-sm-custom border border-border-color" />
                    <div className="mt-1.5">
                      <div className="text-[11px] font-semibold">SURFACE</div>
                      <div className="text-[10px] text-brand-secondary">#F6F6F6</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Semantic */}
              <div className="mb-6">
                <h4 className="caption-style font-bold text-brand-secondary mb-3">Semantic</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="h-12 w-full bg-left-bias rounded-sm-custom" />
                    <div className="mt-1.5">
                      <div className="text-[11px] font-semibold">LEFT BIAS</div>
                      <div className="text-[10px] text-brand-secondary">#B42318</div>
                    </div>
                  </div>
                  <div>
                    <div className="h-12 w-full bg-center-bias rounded-sm-custom border border-border-color" />
                    <div className="mt-1.5">
                      <div className="text-[11px] font-semibold">CENTER</div>
                      <div className="text-[10px] text-brand-secondary">#E5E7EB</div>
                    </div>
                  </div>
                  <div>
                    <div className="h-12 w-full bg-right-bias rounded-sm-custom" />
                    <div className="mt-1.5">
                      <div className="text-[11px] font-semibold">RIGHT BIAS</div>
                      <div className="text-[10px] text-brand-secondary">#1D4ED8</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Neutrals */}
              <div>
                <h4 className="caption-style font-bold text-brand-secondary mb-3">Neutrals</h4>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <div className="h-10 w-full bg-bg-primary rounded-sm-custom border border-border-color" />
                    <div className="mt-1">
                      <div className="text-[9px] font-semibold">BG PRIMARY</div>
                      <div className="text-[8px] text-brand-secondary">#FFFFFF</div>
                    </div>
                  </div>
                  <div>
                    <div className="h-10 w-full bg-bg-secondary rounded-sm-custom border border-border-color" />
                    <div className="mt-1">
                      <div className="text-[9px] font-semibold">BG SEC.</div>
                      <div className="text-[8px] text-brand-secondary">#F0F0F0</div>
                    </div>
                  </div>
                  <div>
                    <div className="h-10 w-full bg-border-color rounded-sm-custom" />
                    <div className="mt-1">
                      <div className="text-[9px] font-semibold">BORDER</div>
                      <div className="text-[8px] text-brand-secondary">#E5E7EB</div>
                    </div>
                  </div>
                  <div>
                    <div className="h-10 w-full bg-divider-color rounded-sm-custom" />
                    <div className="mt-1">
                      <div className="text-[9px] font-semibold">DIVIDER</div>
                      <div className="text-[8px] text-brand-secondary">#E5E7EB</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Spacing System Module */}
            <div className="bg-white border border-border-color rounded-md-custom p-6 shadow-sm-custom">
              <h3 className="caption-style font-bold tracking-wider text-brand-secondary uppercase mb-2">
                Spacing System
              </h3>
              <p className="caption-style text-brand-secondary mb-6">
                Consistent spacing scale based on 4px base unit
              </p>
              <div className="flex items-end gap-3.5 h-24">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="h-1 w-4 bg-brand-secondary/35 rounded-sm-custom" />
                  <span className="text-[10px] text-brand-secondary">4px</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="h-2 w-5 bg-brand-secondary/40 rounded-sm-custom" />
                  <span className="text-[10px] text-brand-secondary">8px</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="h-4 w-6 bg-brand-secondary/50 rounded-sm-custom" />
                  <span className="text-[10px] text-brand-secondary">16px</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="h-6 w-7 bg-brand-secondary/60 rounded-sm-custom" />
                  <span className="text-[10px] text-brand-secondary">24px</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="h-8 w-8 bg-brand-secondary/70 rounded-sm-custom" />
                  <span className="text-[10px] text-brand-secondary">32px</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="h-10 w-9 bg-brand-secondary/80 rounded-sm-custom" />
                  <span className="text-[10px] text-brand-secondary">40px</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="h-16 w-11 bg-brand-secondary/90 rounded-sm-custom" />
                  <span className="text-[10px] text-brand-secondary">64px</span>
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN: TYPOGRAPHY, ICONS, GRID */}
          <div className="flex flex-col gap-8">
            {/* Typography Module */}
            <div className="bg-white border border-border-color rounded-md-custom p-6 shadow-sm-custom">
              <h3 className="caption-style font-bold tracking-wider text-brand-secondary uppercase mb-4">
                Typography
              </h3>
              <div className="mb-4">
                <div className="text-[11px] text-brand-secondary font-bold uppercase mb-1">Font Family</div>
                <div className="text-2xl font-bold tracking-tight mb-1">Poppins</div>
                <p className="caption-style text-brand-secondary leading-relaxed">
                  Poppins is a modern geometric sans-serif typeface that ensures clarity and excellent readability.
                </p>
              </div>

              <div className="border-t border-divider-color pt-4 flex flex-col gap-3.5">
                <div className="flex items-baseline justify-between border-b border-divider-color pb-1 text-[10px] font-bold text-brand-secondary">
                  <span>STYLE</span>
                  <span>SIZE/WEIGHT</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="h1-style">H1 Title</span>
                  <span className="text-xs text-brand-secondary font-medium">32px Bold / 1.2</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="h2-style">H2 Section</span>
                  <span className="text-xs text-brand-secondary font-medium">24px SemiBold / 1.3</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="h3-style">H3 Card Title</span>
                  <span className="text-xs text-brand-secondary font-medium">20px SemiBold / 1.3</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="h4-style">H4 Subheading</span>
                  <span className="text-xs text-brand-secondary font-medium">16px Medium / 1.4</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="body-large-style">Body Large</span>
                  <span className="text-xs text-brand-secondary font-medium">16px Regular / 1.6</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="body-medium-style">Body Medium</span>
                  <span className="text-xs text-brand-secondary font-medium">14px Regular / 1.6</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="body-small-style">Body Small</span>
                  <span className="text-xs text-brand-secondary font-medium">13px Regular / 1.6</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="caption-style">Caption label</span>
                  <span className="text-xs text-brand-secondary font-medium">11px Regular / 1.4</span>
                </div>
              </div>
            </div>

            {/* Icons Module */}
            <div className="bg-white border border-border-color rounded-md-custom p-6 shadow-sm-custom">
              <h3 className="caption-style font-bold tracking-wider text-brand-secondary uppercase mb-2">
                Icons
              </h3>
              <p className="caption-style text-brand-secondary mb-6">
                Line style • 2px stroke • Rounded caps
              </p>
              <div className="grid grid-cols-5 gap-y-6 gap-x-4 justify-items-center text-brand-primary">
                <Menu className="w-5 h-5 stroke-[2px] stroke-linecap-round" />
                <Search className="w-5 h-5 stroke-[2px] stroke-linecap-round" />
                <Bookmark className="w-5 h-5 stroke-[2px] stroke-linecap-round" />
                <Clock className="w-5 h-5 stroke-[2px] stroke-linecap-round" />
                <Info className="w-5 h-5 stroke-[2px] stroke-linecap-round" />
                <Share className="w-5 h-5 stroke-[2px] stroke-linecap-round" />
                <ExternalLink className="w-5 h-5 stroke-[2px] stroke-linecap-round" />
                <Calendar className="w-5 h-5 stroke-[2px] stroke-linecap-round" />
                <BarChart3 className="w-5 h-5 stroke-[2px] stroke-linecap-round" />
                <Tag className="w-5 h-5 stroke-[2px] stroke-linecap-round" />
                <User className="w-5 h-5 stroke-[2px] stroke-linecap-round" />
                <Bell className="w-5 h-5 stroke-[2px] stroke-linecap-round" />
                <SlidersHorizontal className="w-5 h-5 stroke-[2px] stroke-linecap-round" />
                <CheckCircle2 className="w-5 h-5 stroke-[2px] stroke-linecap-round" />
                <MoreHorizontal className="w-5 h-5 stroke-[2px] stroke-linecap-round" />
              </div>
            </div>

            {/* Grid System Module */}
            <div className="bg-white border border-border-color rounded-md-custom p-6 shadow-sm-custom">
              <h3 className="caption-style font-bold tracking-wider text-brand-secondary uppercase mb-4">
                Grid System
              </h3>
              <div className="flex justify-between items-center text-[10px] text-brand-secondary mb-4">
                <span>Container: 1280px</span>
                <span>Columns: 12</span>
                <span>Gutter: 24px</span>
              </div>
              <div className="grid grid-cols-12 gap-1.5 h-16 bg-surface p-1.5 rounded-sm-custom">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-brand-secondary/20 h-full rounded-sm-custom" />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: UI ELEMENTS, CARD EXAMPLE, SHADOWS & RADIUS */}
          <div className="flex flex-col gap-8 lg:col-span-1">
            {/* UI Elements Module */}
            <div className="bg-white border border-border-color rounded-md-custom p-6 shadow-sm-custom">
              <h3 className="caption-style font-bold tracking-wider text-brand-secondary uppercase mb-6">
                UI Elements
              </h3>

              {/* Buttons Section */}
              <div className="mb-6">
                <h4 className="text-[11px] font-bold text-brand-secondary uppercase mb-4">Buttons</h4>
                <div className="flex flex-col gap-4">
                  {/* Headers */}
                  <div className="grid grid-cols-4 gap-2 text-[9px] font-bold text-brand-secondary uppercase text-center items-center">
                    <span>Type</span>
                    <span>Default</span>
                    <span>Outline</span>
                    <span>Disabled</span>
                  </div>

                  {/* Primary Row */}
                  <div className="grid grid-cols-4 gap-2 items-center text-center">
                    <span className="text-[10px] font-bold text-left">Primary</span>
                    <Button variant="primary" className="text-[11px] py-1 px-2.5">Button</Button>
                    <Button variant="primary" isOutline={true} className="text-[11px] py-1 px-2.5">Button</Button>
                    <Button variant="primary" disabled className="text-[11px] py-1 px-2.5">Button</Button>
                  </div>

                  {/* Secondary Row */}
                  <div className="grid grid-cols-4 gap-2 items-center text-center">
                    <span className="text-[10px] font-bold text-left">Secondary</span>
                    <Button variant="secondary" className="text-[11px] py-1 px-2.5">Button</Button>
                    <Button variant="secondary" isOutline={true} className="text-[11px] py-1 px-2.5">Button</Button>
                    <Button variant="secondary" disabled className="text-[11px] py-1 px-2.5">Button</Button>
                  </div>

                  {/* Text Row */}
                  <div className="grid grid-cols-4 gap-2 items-center text-center">
                    <span className="text-[10px] font-bold text-left">Text</span>
                    <Button variant="text" className="text-[11px] py-1">Button</Button>
                    <span className="text-brand-secondary/45 text-[10px] font-medium">—</span>
                    <Button variant="text" disabled className="text-[11px] py-1">Button</Button>
                  </div>
                </div>
              </div>

              {/* Chips Section */}
              <div className="mb-6">
                <h4 className="text-[11px] font-bold text-brand-secondary uppercase mb-3">Chip / Category</h4>
                <div className="flex flex-wrap gap-2">
                  <Chip label="World Cup" />
                  <Chip label="IPL" />
                  <Chip label="Business & Markets" />
                  <Chip label="More" />
                </div>
              </div>

              {/* Bias Meter Section */}
              <div>
                <h4 className="text-[11px] font-bold text-brand-secondary uppercase mb-3">Bias Meter</h4>
                <BiasMeter left={25} center={50} right={25} showScale={true} />
              </div>
            </div>

            {/* Shadows & Radius Module */}
            <div className="grid grid-cols-2 gap-6">
              {/* Shadows */}
              <div className="bg-white border border-border-color rounded-md-custom p-5 shadow-sm-custom flex flex-col gap-4">
                <h4 className="text-[11px] font-bold text-brand-secondary uppercase">Shadows</h4>
                <div className="flex flex-col gap-3">
                  <div className="p-3 bg-white rounded-sm-custom border border-border-color shadow-sm-custom text-center text-[10px] font-semibold">
                    SMALL
                  </div>
                  <div className="p-3 bg-white rounded-sm-custom border border-border-color shadow-md-custom text-center text-[10px] font-semibold">
                    MEDIUM
                  </div>
                  <div className="p-3 bg-white rounded-sm-custom border border-border-color shadow-lg-custom text-center text-[10px] font-semibold">
                    LARGE
                  </div>
                </div>
              </div>

              {/* Radius */}
              <div className="bg-white border border-border-color rounded-md-custom p-5 shadow-sm-custom flex flex-col gap-4">
                <h4 className="text-[11px] font-bold text-brand-secondary uppercase">Border Radius</h4>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-surface border border-border-color rounded-sm-custom" />
                    <span className="text-[11px] font-medium">Small (4px)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-surface border border-border-color rounded-md-custom" />
                    <span className="text-[11px] font-medium">Medium (8px)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-surface border border-border-color rounded-lg-custom" />
                    <span className="text-[11px] font-medium">Large (12px)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-surface border border-border-color rounded-full" />
                    <span className="text-[11px] font-medium">Full</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: CARD EXAMPLE */}
        <div className="border-t border-divider-color p-8 bg-white flex flex-col gap-4">
          <h3 className="caption-style font-bold tracking-wider text-brand-secondary uppercase mb-2">
            Card Example
          </h3>
          <div className="flex justify-center">
            <NewsCard className="w-full" />
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="border-t border-divider-color px-8 py-5 bg-brand-primary flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="font-sans font-bold text-lg tracking-tight">biasly</span>
            <span className="bg-white text-brand-primary text-[8px] font-black uppercase tracking-wider px-1 py-0.5 rounded-sm-custom">
              News
            </span>
          </div>
          <div className="text-[10px] text-brand-secondary text-white/70">
            Stay consistent. Stay unbiased.
          </div>
        </div>
      </div>
    </div>
  );
}
