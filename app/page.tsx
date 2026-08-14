"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Chip } from "@/components/ui/Chip";
import { NewsCard } from "@/components/ui/NewsCard";
import { supabaseAnon } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { Database } from "@/lib/supabase/types";
import posthog from "posthog-js";

type Article = Database["public"]["Tables"]["articles"]["Row"] & {
  sources: Database["public"]["Tables"]["sources"]["Row"] | null;
  article_analyses: Database["public"]["Tables"]["article_analyses"]["Row"] | Database["public"]["Tables"]["article_analyses"]["Row"][] | null;
};

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabaseAnon as any)
          .from("articles")
          .select(`
            id,
            title,
            image_url,
            published_at,
            analyzed_at,
            sources (
              name,
              logo_url
            ),
            article_analyses (
              left_percentage,
              center_percentage,
              right_percentage,
              bias_label
            )
          `)
          .not("analyzed_at", "is", null)
          .order("published_at", { ascending: false });

        if (error) {
          console.error("Failed to fetch articles:", error.message);
        } else if (data) {
          setArticles(data);
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const categories = [
    "World Cup",
    "IPL",
    "Social Media",
    "Business & Markets",
    "Health & Medicine",
    "Soccer",
    "Artificial Intelligence",
    "Arsenal FC",
    "Extreme Weather and Disasters",
  ];

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col font-sans antialiased text-brand-primary">
      {/* Navbar Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 py-6 flex flex-col gap-6">
        
        {/* Category Filters Bar */}
        <div className="relative flex items-center bg-white border border-border-color rounded-md-custom py-3 px-4 shadow-sm-custom">
          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-3 overflow-x-auto scrollbar-none pr-10 scroll-smooth w-full"
            style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
          >
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                active={category === "Home"}
                onClick={() =>
                  posthog.capture("category_selected", { category })
                }
              />
            ))}
          </div>

          {/* Right Scroll Indicator Button */}
          <button
            onClick={scrollRight}
            className="absolute right-2 p-1.5 bg-white border border-border-color rounded-full shadow-sm-custom hover:bg-surface cursor-pointer text-brand-secondary hover:text-brand-primary transition-all duration-150"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5px]" />
          </button>
        </div>

        {/* Top News Heading */}
        <div className="flex flex-col gap-1.5 mt-2">
          <h2 className="h2-style text-brand-primary">Top News</h2>
          <div className="h-1 w-12 bg-brand-primary rounded-full" />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-brand-secondary font-medium">
            No analyzed articles found. Run manual scraping and AI analysis to load content.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {articles.map((article) => {
              const rawAnalysis = article.article_analyses;
              const analysis = (
                Array.isArray(rawAnalysis) ? rawAnalysis[0] : rawAnalysis
              ) || {
                left_percentage: 0,
                center_percentage: 100,
                right_percentage: 0
              };
              const sourceName = article.sources?.name || "News Source";
              const publishedDate = new Date(article.published_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              });

              return (
                <Link key={article.id} href={`/article/${article.id}`} className="flex">
                  <NewsCard
                    category={`${sourceName} • ${publishedDate}`}
                    title={article.title}
                    imageUrl={article.image_url}
                    biasLeft={analysis.left_percentage}
                    biasCenter={analysis.center_percentage}
                    biasRight={analysis.right_percentage}
                    sourcesCount={1}
                    variant="vertical"
                    className="hover:scale-[1.01]"
                  />
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer Layout */}
      <Footer />
    </div>
  );
}
