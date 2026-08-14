import * as cheerio from "cheerio";

export interface ParsedArticle {
  title: string;
  imageUrl: string;
  publishedAt: string;
  rawText: string;
  canonicalUrl: string;
}

/**
 * Checks if a given candidate URL is a valid article detail URL based on source-specific rules
 * and the general non-article reject list.
 */
export function isCandidateArticleUrl(urlStr: string, strategy: string): boolean {
  try {
    const url = new URL(urlStr);
    const path = url.pathname.toLowerCase();

    // 1. General non-article reject list check (section 9)
    const rejectWords = [
      "/category/", "/section/", "/tag/", "/author/", "/search/", 
      "/navigation/", "/menu/", "/footer/", "/show/", "/program/", 
      "/podcast/", "/live/", "/game/", "/product/", "/review/", 
      "/shopping/", "/corporate/", "/support/", "/newsletter/", 
      "/subscription/", "/video-only/", "/contact", "/about",
      "/privacy", "/terms", "/help", "/careers", "/advertise",
      "/cookies", "/site-map", "/feedback", "/sitemap", "/rss"
    ];

    if (rejectWords.some((word) => path.includes(word))) {
      return false;
    }

    // Reject static assets and images
    if (/\.(png|jpg|jpeg|gif|svg|webp|mp4|mp3|pdf|css|js|json)$/i.test(path)) {
      return false;
    }

    // 2. Source-specific rules (section 11 and 12)
    if (strategy === "reuters") {
      const segmentCount = path.split("/").filter(Boolean).length;
      if (segmentCount < 2) return false;
      
      const sections = ["world", "business", "markets", "legal", "technology", "breakingviews", "lifestyle", "graphics", "sports"];
      if (segmentCount === 2 && sections.includes(path.split("/").filter(Boolean)[1])) {
        return false;
      }
      return true;
    }

    if (strategy === "npr") {
      // NPR articles have a date structure: /yyyy/mm/dd/id/slug
      const datePattern = /\/\d{4}\/\d{2}\/\d{2}\/\d{8,12}\//;
      return datePattern.test(path);
    }

    if (strategy === "ap") {
      // AP News articles have `/article/` pattern
      return path.includes("/article/");
    }

    if (strategy === "bbc") {
      // BBC articles: /news/articles/cxxxxxxxxx or /news/world-xxxxx-12345678
      if (path.includes("/news/articles/")) {
        return true;
      }
      const bbcIdPattern = /-\d{7,10}$/;
      if (path.startsWith("/news/") && bbcIdPattern.test(path)) {
        return true;
      }
      return false;
    }

    // Fallback: must have a path and be reasonably long
    return path.split("/").filter(Boolean).length >= 2;
  } catch {
    return false;
  }
}

/**
 * Extracts candidate links from a source homepage content
 */
export function extractHomepageLinks(html: string, homepageUrl: string, strategy: string): string[] {
  const $ = cheerio.load(html);
  const links: string[] = [];

  // Remove header, footer, navigation and sidebar elements to avoid picking navigation links
  const ignoredNavSelectors = [
    "header", "footer", "nav", ".nav", ".navigation", ".menu", ".footer",
    ".sidebar", "#sidebar", ".header", "#header", "#footer", "#nav"
  ];
  ignoredNavSelectors.forEach((sel) => $(sel).remove());

  // Extract from remaining <a> tags
  $("a[href]").each((_, el) => {
    let href = $(el).attr("href")?.trim() || "";
    if (!href) return;

    // Convert relative links to absolute
    if (!href.startsWith("http")) {
      try {
        href = new URL(href, homepageUrl).toString();
      } catch {
        return;
      }
    }

    // Normalize URL: strip hash and UTM / tracking params
    try {
      const url = new URL(href);
      url.hash = "";
      const paramsToDelete = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref", "rss"];
      paramsToDelete.forEach((p) => url.searchParams.delete(p));
      href = url.toString();
    } catch {
      return;
    }

    // Filter to candidate article URLs matching strategy rules
    if (isCandidateArticleUrl(href, strategy)) {
      if (!links.includes(href)) {
        links.push(href);
      }
    }
  });

  return links;
}

/**
 * Parses article detail page HTML and extracts metadata + text paragraphs
 */
export function parseArticleDetail(html: string, url: string, strategy: string): ParsedArticle {
  const $ = cheerio.load(html);
  
  // 1. Extract canonical URL
  let canonicalUrl = $('link[rel="canonical"]').attr("href") || url;
  if (!canonicalUrl.startsWith("http")) {
    try {
      canonicalUrl = new URL(canonicalUrl, url).toString();
    } catch {
      canonicalUrl = url;
    }
  }

  // 2. Extract Title
  let title = "";
  if (strategy === "reuters") {
    title = $("h1").first().text().trim() || $('meta[property="og:title"]').attr("content")?.trim() || "";
  } else if (strategy === "npr") {
    title = $(".storytitle h1").text().trim() || $("h1").text().trim() || $('meta[property="og:title"]').attr("content")?.trim() || "";
  } else if (strategy === "ap") {
    title = $("h1").first().text().trim() || $('meta[property="og:title"]').attr("content")?.trim() || "";
  } else if (strategy === "bbc") {
    title = $("h1").text().trim() || $('meta[property="og:title"]').attr("content")?.trim() || "";
  }
  
  if (!title) {
    title = $("title").text().trim();
  }

  // Clean title suffixes
  title = title
    .replace(/\s*\|\s*Reuters\s*$/i, "")
    .replace(/\s*:\s*NPR\s*$/i, "")
    .replace(/\s*\|\s*AP News\s*$/i, "")
    .replace(/\s*-\s*BBC News\s*$/i, "");

  // 3. Extract Image URL
  let imageUrl = $('meta[property="og:image"]').attr("content") || 
                  $('meta[name="twitter:image"]').attr("content") || "";
  if (imageUrl && !imageUrl.startsWith("http")) {
    try {
      imageUrl = new URL(imageUrl, url).toString();
    } catch {
      // ignore
    }
  }

  // 4. Extract Published Date
  let publishedAtStr = $('meta[property="article:published_time"]').attr("content") || 
                       $('meta[property="og:article:published_time"]').attr("content") || 
                       $('meta[name="article:published_time"]').attr("content") ||
                       $("time[datetime]").first().attr("datetime") || 
                       $("time").first().attr("datetime") || "";
                       
  if (!publishedAtStr) {
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).html() || "{}");
        if (json.datePublished) {
          publishedAtStr = json.datePublished;
        } else if (json["@graph"]) {
          for (const graphItem of json["@graph"]) {
            if (graphItem.datePublished) {
              publishedAtStr = graphItem.datePublished;
              break;
            }
          }
        }
      } catch {
        // ignore
      }
    });
  }

  // 5. Extract Body Paragraphs
  const paragraphs: string[] = [];
  
  // Clone the DOM body to remove ads/scripts before pulling text
  const bodyClone = $("body").clone();
  
  const ignoredSelectors = [
    "script", "style", "noscript", "iframe", "header", "footer", "nav", 
    ".advertisement", ".ad-box", ".newsletter-signup", ".social-share", 
    ".related-links", ".most-popular", ".caption", "figcaption", 
    ".author-bio", ".comments-section", "#comments", ".sponsor-text"
  ];
  ignoredSelectors.forEach((sel) => bodyClone.find(sel).remove());

  // Strategy-specific body extraction on the cleaned clone
  if (strategy === "npr") {
    bodyClone.find("#storytext p, .storytext p").each((_, el) => {
      const txt = $(el).text().trim();
      if (txt) paragraphs.push(txt);
    });
  } else if (strategy === "reuters") {
    bodyClone.find('[class*="Paragraph__paragraph"], .article-body__content p, .article-body p').each((_, el) => {
      const txt = $(el).text().trim();
      if (txt) paragraphs.push(txt);
    });
  } else if (strategy === "ap") {
    bodyClone.find(".Article p, .Article-Body p, .RichTextStoryBody p, [class*=" + '"' + "articleBody" + '"' + "] p").each((_, el) => {
      const txt = $(el).text().trim();
      if (txt) paragraphs.push(txt);
    });
  } else if (strategy === "bbc") {
    bodyClone.find("article p, [data-component=" + '"' + "text-block" + '"' + "] p").each((_, el) => {
      const txt = $(el).text().trim();
      if (txt) paragraphs.push(txt);
    });
  }

  // Fallback: extract all p elements if none extracted yet
  if (paragraphs.length === 0) {
    bodyClone.find("p").each((_, el) => {
      const txt = $(el).text().trim();
      if (txt && txt.length > 40 && !txt.toLowerCase().includes("all rights reserved")) {
        paragraphs.push(txt);
      }
    });
  }

  // Join paragraphs into a clean raw text output
  const rawText = paragraphs.join("\n\n");

  return {
    title,
    imageUrl,
    publishedAt: publishedAtStr,
    rawText,
    canonicalUrl,
  };
}
