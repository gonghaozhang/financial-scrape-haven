export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  category: NewsCategory;
  publishedAt: string;
}

export type NewsCategory = "markets" | "stocks" | "crypto" | "economy" | "all";