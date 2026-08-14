import * as React from "react";

export interface BiasMeterProps {
  left?: number;
  center?: number;
  right?: number;
  showScale?: boolean;
  className?: string;
}

export const BiasMeter: React.FC<BiasMeterProps> = ({
  left = 25,
  center = 50,
  right = 25,
  showScale = false,
  className = "",
}) => {
  // Normalize values if they sum to more than 0
  const total = left + center + right;
  const scaleLeft = total > 0 ? (left / total) * 100 : 0;
  const scaleCenter = total > 0 ? (center / total) * 100 : 0;
  const scaleRight = total > 0 ? (right / total) * 100 : 0;

  return (
    <div className={`w-full font-sans ${className}`}>
      {/* Horizontal Bar */}
      <div className="w-full flex h-7 rounded-sm-custom overflow-hidden text-[11px] font-semibold select-none shadow-sm-custom">
        {/* Left Segment */}
        {left > 0 && (
          <div
            style={{ width: `${scaleLeft}%` }}
            className="bg-left-bias text-white flex items-center justify-center transition-all duration-300"
          >
            <span>L {left}%</span>
          </div>
        )}

        {/* Center Segment */}
        {center > 0 && (
          <div
            style={{ width: `${scaleCenter}%` }}
            className="bg-center-bias text-brand-primary flex items-center justify-center transition-all duration-300 border-l border-r border-border-color"
          >
            <span>Center {center}%</span>
          </div>
        )}

        {/* Right Segment */}
        {right > 0 && (
          <div
            style={{ width: `${scaleRight}%` }}
            className="bg-right-bias text-white flex items-center justify-center transition-all duration-300"
          >
            <span>Right {right}%</span>
          </div>
        )}
      </div>

      {/* Axis Scale underneath (optional) */}
      {showScale && (
        <div className="flex justify-between text-[11px] text-brand-secondary mt-1 px-0.5">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
};
