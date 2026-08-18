import React from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface BiasAnalysisProps {
  biasLeft: number;
  biasCenter: number;
  biasRight: number;
  sourcesCount: number;
}

export const BiasAnalysis: React.FC<BiasAnalysisProps> = ({
  biasLeft,
  biasCenter,
  biasRight,
  sourcesCount,
}) => {
  // Determine overall bias
  let overallLabel = "Center";
  let overallValue = biasCenter;
  let overallColorClass = "text-brand-primary";

  if (biasLeft > biasCenter && biasLeft > biasRight) {
    overallLabel = "Left";
    overallValue = biasLeft;
    overallColorClass = "text-left-bias";
  } else if (biasRight > biasCenter && biasRight > biasLeft) {
    overallLabel = "Right";
    overallValue = biasRight;
    overallColorClass = "text-right-bias";
  } else if (biasCenter >= biasLeft && biasCenter >= biasRight) {
    overallLabel = "Center";
    overallValue = biasCenter;
    overallColorClass = "text-brand-primary";
  }

  return (
    <div className="bg-bg-primary border border-border-color rounded-lg-custom p-6 shadow-sm-custom font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-divider-color pb-4 mb-4">
        <h3 className="text-sm font-bold tracking-wider text-brand-secondary uppercase flex items-center gap-1.5 select-none">
          Bias Analysis
        </h3>
        <Info className="w-4.5 h-4.5 text-brand-secondary stroke-[2px] cursor-pointer hover:text-brand-primary transition-colors" />
      </div>

      {/* Overall Bias */}
      <div className="mb-6">
        <div className="text-[11px] font-bold text-brand-secondary uppercase select-none">Overall Bias</div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className={`text-2xl font-bold ${overallColorClass}`}>
            {overallLabel} {overallValue}%
          </span>
        </div>
        <div className="text-[11px] text-brand-secondary font-medium mt-0.5 select-none">
          Based on {sourcesCount} balanced sources
        </div>
      </div>

      {/* Progress Bars Grid */}
      <div className="flex flex-col gap-3.5 mb-6">
        {/* Left Row */}
        <div className="grid grid-cols-12 items-center gap-3 text-xs font-semibold">
          <span className="col-span-3 text-brand-secondary select-none">Left</span>
          <span className="col-span-2 text-left-bias text-right">{biasLeft}%</span>
          <div className="col-span-7 bg-bg-secondary h-2.5 rounded-full overflow-hidden">
            <div
              style={{ width: `${biasLeft}%` }}
              className="bg-left-bias h-full rounded-full transition-all duration-500"
            />
          </div>
        </div>

        {/* Center Row */}
        <div className="grid grid-cols-12 items-center gap-3 text-xs font-semibold">
          <span className="col-span-3 text-brand-secondary select-none">Center</span>
          <span className="col-span-2 text-brand-primary text-right">{biasCenter}%</span>
          <div className="col-span-7 bg-bg-secondary h-2.5 rounded-full overflow-hidden">
            <div
              style={{ width: `${biasCenter}%` }}
              className="bg-center-bias h-full rounded-full border border-black/5 transition-all duration-500"
            />
          </div>
        </div>

        {/* Right Row */}
        <div className="grid grid-cols-12 items-center gap-3 text-xs font-semibold">
          <span className="col-span-3 text-brand-secondary select-none">Right</span>
          <span className="col-span-2 text-right-bias text-right">{biasRight}%</span>
          <div className="col-span-7 bg-bg-secondary h-2.5 rounded-full overflow-hidden">
            <div
              style={{ width: `${biasRight}%` }}
              className="bg-right-bias h-full rounded-full transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* Explaining Text */}
      <p className="text-[12px] leading-relaxed text-brand-secondary mb-5 select-none">
        Our analysis is based on the political leaning of the publication and how the story is framed. Sources are weighted by reliability and recency.
      </p>

      {/* Button */}
      <Button variant="outline" className="w-full text-xs font-semibold py-2.5 border border-border-color rounded-md-custom">
        How We Analyze Bias
      </Button>
    </div>
  );
};
