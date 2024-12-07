import { NewsArticle } from "@/types/news";

const STORAGE_KEY = "financial_news_articles";

export const saveArticles = (articles: NewsArticle[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
};

export const getStoredArticles = (): NewsArticle[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};