"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, Share2, MoreHorizontal, Info } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BiasMeter } from "@/components/ui/BiasMeter";
import { NewsletterBanner } from "@/components/ui/NewsletterBanner";
import { BiasAnalysis } from "@/components/details/BiasAnalysis";
import { AISummary } from "@/components/details/AISummary";
import { SourceBreakdown } from "@/components/details/SourceBreakdown";
import { Chip } from "@/components/ui/Chip";
import { Database } from "@/lib/supabase/types";
import { supabaseAnon } from "@/lib/supabase/client";
import posthog from "posthog-js";

type Article = Database["public"]["Tables"]["articles"]["Row"] & {
  sources: Database["public"]["Tables"]["sources"]["Row"] | null;
  article_analyses: Database["public"]["Tables"]["article_analyses"]["Row"] | Database["public"]["Tables"]["article_analyses"]["Row"][] | null;
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ArticleDetails({ params }: PageProps) {
  // Unwrap the params promise using React's use hook
  const { id } = use(params);

  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: artData, error: artError } = await (supabaseAnon as any)
          .from("articles")
          .select(`
            *,
            sources (*),
            article_analyses (*)
          `)
          .eq("id", id)
          .single();

        if (artError) {
          console.error("Failed to load article:", artError.message);
        } else if (artData) {
          setArticle(artData);

          // Track article view (top of engagement funnel)
          posthog.capture("article_viewed", {
            article_id: artData.id,
            source_name: artData.sources?.name ?? null,
            bias_label: Array.isArray(artData.article_analyses)
              ? artData.article_analyses[0]?.bias_label ?? null
              : (artData.article_analyses as { bias_label?: string } | null)?.bias_label ?? null,
          });

          // Fetch related articles (using pgvector similarity query via API route)
          const relRes = await fetch(`/api/article/${id}/related`);
          if (relRes.ok) {
            const relData = await relRes.json();
            setRelatedArticles(relData);
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // Handle Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-secondary flex flex-col font-sans">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center gap-4 py-20">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-brand-secondary font-medium animate-pulse">Loading analysis data...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Handle article not found
  if (!article) {
    return (
      <div className="min-h-screen bg-bg-secondary flex flex-col font-sans">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center gap-4 py-20">
          <h2 className="text-xl font-bold text-brand-primary">Article Not Found</h2>
          <p className="text-sm text-brand-secondary">We couldn&apos;t find the article you were looking for.</p>
          <Link
            href="/"
            className="px-6 py-2.5 bg-brand-primary text-white text-xs font-semibold rounded-md-custom hover:bg-brand-primary/95 transition-colors"
          >
            Return to Homepage
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const rawAnalysis = article.article_analyses;
  const analysis = Array.isArray(rawAnalysis) ? rawAnalysis[0] : rawAnalysis;
  const sourceName = article.sources?.name || "News Source";
  const publishedDate = new Date(article.published_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const wordCount = article.raw_text ? article.raw_text.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200)) + " min read";
  const paragraphs = article.raw_text ? article.raw_text.split(/\n\s*\n/).filter((p: string) => p.trim().length > 0) : [];
  
  const biasLeft = analysis?.left_percentage ?? 0;
  const biasCenter = analysis?.center_percentage ?? 100;
  const biasRight = analysis?.right_percentage ?? 0;
  
  // Extract highlights list from framing_notes
  const highlights = analysis?.framing_notes
    ? analysis.framing_notes.split(/\n+/).map((s: string) => s.replace(/^-\s*/, "").trim()).filter(Boolean)
    : [];

  const loadedTerms = analysis?.loaded_terms || [];

  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col font-sans antialiased text-brand-primary">
      <Header />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 py-8 flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="text-[12px] font-semibold text-brand-secondary tracking-wide uppercase select-none">
              {sourceName} - News Article
            </div>

            <h1 className="text-3xl md:text-[32px] font-bold leading-tight text-brand-primary select-text">
              {article.title}
            </h1>

            <div className="flex items-center justify-between border-b border-divider-color pb-4 select-none">
              <div className="text-xs font-semibold text-brand-secondary">
                Source: <span className="text-brand-primary font-bold">{sourceName}</span>
                <span className="mx-2 text-divider-color">|</span>
                {publishedDate}
                <span className="mx-2 text-divider-color">|</span>
                {readTime}
              </div>

              <div className="flex items-center gap-3.5 text-brand-secondary">
                <button
                  onClick={() =>
                    posthog.capture("article_bookmarked", {
                      article_id: article.id,
                      source_name: sourceName,
                    })
                  }
                  className="flex items-center gap-1.5 text-xs font-semibold hover:text-brand-primary transition-colors cursor-pointer"
                >
                  <Bookmark className="w-4 h-4 stroke-[2px]" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() =>
                    posthog.capture("article_shared", {
                      article_id: article.id,
                      source_name: sourceName,
                    })
                  }
                  className="flex items-center gap-1.5 text-xs font-semibold hover:text-brand-primary transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 stroke-[2px]" />
                  <span>Share</span>
                </button>
                <button className="hover:text-brand-primary transition-colors cursor-pointer p-0.5 rounded-full hover:bg-surface">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="relative w-full aspect-[16/9] rounded-lg-custom overflow-hidden shadow-sm-custom">
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-w-[768px]) 100vw, 840px"
                  priority
                />
              </div>
              <p className="text-[11px] text-brand-secondary/80 leading-normal select-none italic">
                Photo courtesy of {sourceName}.
              </p>
            </div>

            <div className="bg-white border border-border-color rounded-lg-custom p-5 shadow-sm-custom flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-brand-secondary uppercase tracking-wider flex items-center gap-1.5 select-none">
                  Bias Distribution
                </h4>
                <Info className="w-4 h-4 text-brand-secondary cursor-pointer hover:text-brand-primary transition-colors" />
              </div>
              <BiasMeter left={biasLeft} center={biasCenter} right={biasRight} showScale={false} />
              <div className="text-[11px] font-bold text-brand-secondary select-none">
                1 source analyzed
              </div>
            </div>

            <div className="flex flex-col gap-5 text-[15px] leading-[1.75] text-brand-primary font-medium tracking-normal select-text">
              {paragraphs.map((para: string, i: number) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {analysis && (
              <div className="bg-white border border-border-color rounded-lg-custom p-6 shadow-sm-custom flex flex-col gap-6 mt-4">
                <div className="flex items-center gap-2 border-b border-divider-color pb-3 select-none">
                  <h3 className="text-lg font-bold text-brand-primary">AI Framing & Sentiment Analysis</h3>
                  <Chip label="AI-Estimated" className="bg-surface border-border-color text-brand-secondary font-semibold" />
                </div>

                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-bold text-brand-primary">Neutral Summary</h4>
                  <p className="text-sm text-brand-secondary leading-relaxed select-text">{analysis.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-bold text-brand-primary">Sentiment Assessment</h4>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        analysis.sentiment_label === 'positive' ? 'bg-green-100 text-green-700' :
                        analysis.sentiment_label === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {analysis.sentiment_label}
                      </span>
                      <span className="text-xs text-brand-secondary font-semibold">
                        Score: {analysis.sentiment_score.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-bold text-brand-primary">Model Confidence</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex-grow bg-bg-secondary h-2.5 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${analysis.confidence * 100}%` }}
                          className="bg-brand-primary h-full rounded-full"
                        />
                      </div>
                      <span className="text-xs font-bold text-brand-primary select-none">
                        {(analysis.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                {loadedTerms.length > 0 && (
                  <div className="flex flex-col gap-2.5">
                    <h4 className="text-sm font-bold text-brand-primary">Loaded or Biased Terms Detected</h4>
                    <div className="flex flex-wrap gap-2">
                      {loadedTerms.map((term: string, idx: number) => (
                        <span key={idx} className="text-xs font-semibold px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-md-custom">
                          &ldquo;{term}&rdquo;
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-divider-color pt-4 select-none">
                  <p className="text-[11px] text-brand-secondary/80 italic leading-relaxed">
                    {analysis.disclaimer} (Analyzed via {analysis.model})
                  </p>
                </div>
              </div>
            )}

            {relatedArticles.length > 0 && (
              <div className="flex flex-col gap-4 mt-8">
                <div className="flex flex-col gap-1 select-none">
                  <h3 className="text-lg font-bold text-brand-primary">Related Stories</h3>
                  <div className="h-0.5 w-10 bg-brand-primary rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {relatedArticles.map((rel) => {
                    const relSourceName = rel.sources?.name || "News Source";
                    const relPublishedDate = new Date(rel.published_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    });
                    const relWordCount = rel.raw_text ? rel.raw_text.split(/\s+/).length : 0;
                    const relReadTime = Math.max(1, Math.ceil(relWordCount / 200)) + " min read";

                    return (
                      <Link
                        key={rel.id}
                        href={`/article/${rel.id}`}
                        onClick={() =>
                          posthog.capture("related_article_clicked", {
                            from_article_id: article.id,
                            to_article_id: rel.id,
                            related_source_name: relSourceName,
                          })
                        }
                        className="flex gap-4 p-3 bg-white border border-border-color rounded-lg-custom shadow-sm-custom hover:shadow-md-custom hover:scale-[1.01] transition-all duration-200"
                      >
                        <div className="relative w-[110px] h-[74px] rounded-md-custom overflow-hidden flex-shrink-0">
                          <Image
                            src={rel.image_url}
                            alt={rel.title}
                            fill
                            className="object-cover"
                            sizes="110px"
                          />
                        </div>
                        <div className="flex flex-col justify-between flex-grow gap-1">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider select-none">
                              {relSourceName}
                            </span>
                            <h4 className="text-[12px] font-bold leading-snug text-brand-primary line-clamp-2 hover:text-right-bias transition-colors">
                              {rel.title}
                            </h4>
                          </div>
                          <span className="text-[10px] text-brand-secondary/80 select-none">
                            {relPublishedDate} • {relReadTime}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-6">
            <BiasAnalysis
              biasLeft={biasLeft}
              biasCenter={biasCenter}
              biasRight={biasRight}
              sourcesCount={1}
            />
            {highlights.length > 0 && (
              <AISummary
                publishedDate={publishedDate}
                readTime={readTime}
                highlights={highlights}
              />
            )}
            <SourceBreakdown
              biasLeft={biasLeft}
              biasCenter={biasCenter}
              biasRight={biasRight}
              sourcesCount={1}
            />
          </div>
        </div>

        <div className="w-full mt-4">
          <NewsletterBanner />
        </div>
      </main>

      <Footer />
    </div>
  );
}
