import * as React from "react";
import { Plus } from "lucide-react";

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  active?: boolean;
  showIcon?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  active = false,
  showIcon = true,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[13px] font-medium cursor-pointer transition-all duration-150 select-none font-sans
        ${
          active
            ? "bg-brand-primary text-white border-brand-primary"
            : "bg-surface text-brand-primary border-border-color hover:bg-bg-secondary hover:border-brand-secondary/30"
        }
        ${className}`}
      {...props}
    >
      <span>{label}</span>
      {showIcon && <Plus className="w-3.5 h-3.5" />}
    </div>
  );
};
