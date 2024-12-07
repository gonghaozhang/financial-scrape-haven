import { NewsArticle } from "@/types/news";
import { formatDistanceToNow } from "date-fns";

interface NewsCardProps {
  article: NewsArticle;
}

export const NewsCard = ({ article }: NewsCardProps) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-medium px-2 py-1 rounded bg-accent/10 text-accent">
          {article.category}
        </span>
        <span className="text-xs text-gray-400">
          {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
        </span>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-foreground">{article.title}</h3>
      <p className="text-sm text-gray-300 mb-4">{article.summary}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">{article.source}</span>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-accent/80 text-sm font-medium"
        >
          Read more →
        </a>
      </div>
    </div>
  );
};