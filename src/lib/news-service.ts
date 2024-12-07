import { supabase } from './supabase';
import { NewsArticle } from '@/types/news';

const BING_API_KEY = import.meta.env.VITE_BING_API_KEY;
const BING_ENDPOINT = 'https://api.bing.microsoft.com/v7.0/news/search';

export async function searchNews(category: string = ''): Promise<NewsArticle[]> {
  try {
    const query = category === 'all' ? 'financial news' : `${category} financial news`;
    const response = await fetch(`${BING_ENDPOINT}?q=${encodeURIComponent(query)}&count=10`, {
      headers: {
        'Ocp-Apim-Subscription-Key': BING_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data = await response.json();
    const articles: NewsArticle[] = data.value.map((item: any) => ({
      id: item.name,
      title: item.name,
      summary: item.description,
      url: item.url,
      source: item.provider[0].name,
      category: category === 'all' ? 'markets' : category,
      publishedAt: item.datePublished
    }));

    // Store articles in Supabase
    await storeArticles(articles);
    return articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export async function storeArticles(articles: NewsArticle[]) {
  const { error } = await supabase
    .from('news_articles')
    .upsert(
      articles.map(article => ({
        id: article.id,
        title: article.title,
        summary: article.summary,
        url: article.url,
        source: article.source,
        category: article.category,
        published_at: article.publishedAt
      })),
      { onConflict: 'id' }
    );

  if (error) {
    console.error('Error storing articles:', error);
  }
}

export async function getStoredArticles(): Promise<NewsArticle[]> {
  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching stored articles:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    title: item.title,
    summary: item.summary,
    url: item.url,
    source: item.source,
    category: item.category,
    publishedAt: item.published_at
  }));
}