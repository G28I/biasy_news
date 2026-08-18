import React from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface AISummaryProps {
  publishedDate: string;
  readTime: string;
  highlights: string[];
}

export const AISummary: React.FC<AISummaryProps> = ({
  publishedDate,
  readTime,
  highlights,
}) => {
  return (
    <div className="bg-bg-primary border border-border-color rounded-lg-custom p-6 shadow-sm-custom font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-divider-color pb-4 mb-4">
        <h3 className="text-sm font-bold tracking-wider text-brand-secondary uppercase flex items-center gap-1.5 select-none">
          AI Summary
        </h3>
        <Info className="w-4.5 h-4.5 text-brand-secondary stroke-[2px] cursor-pointer hover:text-brand-primary transition-colors" />
      </div>

      {/* Subhead Meta */}
      <div className="text-[11px] text-brand-secondary font-medium mb-4 select-none">
        Generated {publishedDate} • {readTime}
      </div>

      {/* Bulleted list of key highlights */}
      <ul className="flex flex-col gap-4 list-none mb-6">
        {highlights.map((highlight, index) => (
          <li key={index} className="flex gap-2.5 text-[13px] leading-relaxed text-brand-primary">
            {/* Custom Dot */}
            <span className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2 flex-shrink-0" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      {/* Disclaimer warning */}
      <div className="text-[11px] text-brand-secondary/80 italic mb-5 select-none">
        AI summaries can make mistakes.
      </div>

      {/* Feedback Button */}
      <Button variant="outline" className="text-xs font-semibold py-2 px-4 border border-border-color rounded-md-custom">
        Provide Feedback
      </Button>
    </div>
  );
};
