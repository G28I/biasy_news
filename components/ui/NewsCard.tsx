import * as React from "react";
import Image from "next/image";
import { Clock, Bookmark, Info } from "lucide-react";
import { BiasMeter } from "./BiasMeter";

export interface NewsCardProps {
  category?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  biasLeft?: number;
  biasCenter?: number;
  biasRight?: number;
  time?: string;
  readTime?: string;
  sourcesCount?: number;
  variant?: "horizontal" | "vertical";
  className?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  category = "Politics • United States",
  title = "Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report",
  description = "The proposal includes stricter limits on uranium enrichment and enhanced verification measures.",
  imageUrl = "/trump_portrait_official.jpg",
  biasLeft = 25,
  biasCenter = 50,
  biasRight = 49,
  time = "2h ago",
  readTime = "12 min read",
  sourcesCount = 12,
  variant = "horizontal",
  className = "",
}) => {
  if (variant === "vertical") {
    return (
      <div
        className={`flex flex-col bg-bg-primary border border-border-color rounded-lg-custom shadow-md-custom font-sans w-full transition-all duration-300 hover:shadow-lg-custom overflow-hidden ${className}`}
      >
        {/* Top Image */}
        <div className="relative w-full h-[180px] flex-shrink-0 overflow-hidden group">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-w-768px) 100vw, 360px"
            priority
          />
          {/* Info Icon Overlay */}
          <div className="absolute top-2.5 right-2.5 p-1 bg-black/60 rounded-full text-white cursor-pointer hover:bg-black/80 transition-colors">
            <Info className="w-4 h-4" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col justify-between flex-grow gap-4 p-5">
          <div className="flex flex-col gap-2">
            {/* Category / Location */}
            <div className="caption-style text-brand-secondary font-medium tracking-wide uppercase">
              {category}
            </div>

            {/* Title */}
            <h3 className="h4-style font-semibold text-brand-primary line-clamp-3 hover:text-right-bias transition-colors cursor-pointer min-h-[66px]">
              {title}
            </h3>
          </div>

          {/* Bias Meter */}
          <div className="w-full">
            <BiasMeter left={biasLeft} center={biasCenter} right={biasRight} showScale={false} />
          </div>

          {/* Footer showing sources count */}
          <div className="text-[12px] text-brand-secondary font-medium select-none">
            {sourcesCount} sources
          </div>
        </div>
      </div>
    );
  }

  // Horizontal Card (default)
  return (
    <div
      className={`flex flex-col md:flex-row gap-6 p-6 bg-bg-primary border border-border-color rounded-lg-custom shadow-md-custom font-sans max-w-4xl transition-all duration-300 hover:shadow-lg-custom ${className}`}
    >
      {/* Left side - Image */}
      <div className="relative w-full md:w-[280px] h-[180px] flex-shrink-0 rounded-md-custom overflow-hidden group">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-w-768px) 100vw, 280px"
          priority
        />
        {/* Info Icon Overlay */}
        <div className="absolute top-2.5 right-2.5 p-1 bg-black/60 rounded-full text-white cursor-pointer hover:bg-black/80 transition-colors">
          <Info className="w-4 h-4" />
        </div>
      </div>

      {/* Right side - Content */}
      <div className="flex flex-col justify-between flex-grow gap-4">
        <div className="flex flex-col gap-2">
          {/* Category */}
          <div className="caption-style text-brand-secondary font-medium tracking-wide uppercase">
            {category}
          </div>

          {/* Title */}
          <h3 className="h3-style text-brand-primary line-clamp-2 hover:text-right-bias transition-colors cursor-pointer">
            {title}
          </h3>

          {/* Description */}
          <p className="body-small-style text-brand-secondary line-clamp-2">
            {description}
          </p>
        </div>

        {/* Bias Meter */}
        <div className="w-full">
          <BiasMeter left={biasLeft} center={biasCenter} right={biasRight} showScale={false} />
        </div>

        {/* Footer Meta */}
        <div className="flex items-center gap-4 text-brand-secondary caption-style font-medium select-none">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 stroke-[2px]" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5 stroke-[2px]" />
            <span>{readTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
