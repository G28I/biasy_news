import React from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface SourceBreakdownProps {
  biasLeft: number;
  biasCenter: number;
  biasRight: number;
  sourcesCount: number;
}

export const SourceBreakdown: React.FC<SourceBreakdownProps> = ({
  biasLeft,
  biasCenter,
  biasRight,
  sourcesCount,
}) => {
  // Calculate source counts dynamically
  const leftCount = Math.round((biasLeft / 100) * sourcesCount);
  const centerCount = Math.round((biasCenter / 100) * sourcesCount);
  const rightCount = Math.max(0, sourcesCount - leftCount - centerCount);

  // List of top sources matching mockup details
  const topSources = [
    { name: "Fox News", bias: "Right", color: "text-right-bias" },
    { name: "The Wall Street Journal", bias: "Center", color: "text-brand-secondary" },
    { name: "Reuters", bias: "Center", color: "text-brand-secondary" },
    { name: "BBC", bias: "Center", color: "text-brand-secondary" },
    { name: "CNN", bias: "Left", color: "text-left-bias" },
    { name: "The New York Times", bias: "Center", color: "text-brand-secondary" },
    { name: "The Washington Post", bias: "Center", color: "text-brand-secondary" },
    { name: "Newsmax", bias: "Right", color: "text-right-bias" },
  ];

  return (
    <div className="bg-white border border-border-color rounded-lg-custom p-6 shadow-sm-custom font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-divider-color pb-4 mb-4">
        <h3 className="text-sm font-bold tracking-wider text-brand-secondary uppercase flex items-center gap-1.5 select-none">
          Source Breakdown
        </h3>
        <Info className="w-4.5 h-4.5 text-brand-secondary stroke-[2px] cursor-pointer hover:text-brand-primary transition-colors" />
      </div>

      {/* Subtitle */}
      <div className="text-xs font-bold text-brand-primary mb-4 select-none">
        {sourcesCount} Total Sources
      </div>

      {/* Mini Progress Bars */}
      <div className="flex flex-col gap-3 mb-6">
        {/* Left Row */}
        <div className="grid grid-cols-12 items-center gap-3 text-xs font-semibold">
          <span className="col-span-3 text-brand-secondary select-none">Left</span>
          <span className="col-span-3 text-left-bias">{leftCount} ({biasLeft}%)</span>
          <div className="col-span-6 bg-bg-secondary h-2 rounded-full overflow-hidden">
            <div
              style={{ width: `${biasLeft}%` }}
              className="bg-left-bias h-full rounded-full transition-all duration-500"
            />
          </div>
        </div>

        {/* Center Row */}
        <div className="grid grid-cols-12 items-center gap-3 text-xs font-semibold">
          <span className="col-span-3 text-brand-secondary select-none">Center</span>
          <span className="col-span-3 text-brand-primary">{centerCount} ({biasCenter}%)</span>
          <div className="col-span-6 bg-bg-secondary h-2 rounded-full overflow-hidden">
            <div
              style={{ width: `${biasCenter}%` }}
              className="bg-center-bias h-full rounded-full transition-all duration-500"
            />
          </div>
        </div>

        {/* Right Row */}
        <div className="grid grid-cols-12 items-center gap-3 text-xs font-semibold">
          <span className="col-span-3 text-brand-secondary select-none">Right</span>
          <span className="col-span-3 text-right-bias">{rightCount} ({biasRight}%)</span>
          <div className="col-span-6 bg-bg-secondary h-2 rounded-full overflow-hidden">
            <div
              style={{ width: `${biasRight}%` }}
              className="bg-right-bias h-full rounded-full transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* Sources List Table */}
      <div className="mb-6">
        {/* Table Headers */}
        <div className="flex justify-between text-[10px] font-bold text-brand-secondary uppercase border-b border-divider-color pb-1 mb-2 select-none">
          <span>Top Sources</span>
          <span>Bias</span>
        </div>

        {/* Source Rows */}
        <div className="flex flex-col divide-y divide-divider-color/60">
          {topSources.map((src) => (
            <div key={src.name} className="flex justify-between py-2 text-xs font-semibold">
              <span className="text-brand-primary">{src.name}</span>
              <span className={src.color}>{src.bias}</span>
            </div>
          ))}
        </div>
      </div>

      {/* View All Sources Button */}
      <Button variant="outline" className="w-full text-xs font-semibold py-2.5 border border-border-color rounded-md-custom">
        View All Sources
      </Button>
    </div>
  );
};
