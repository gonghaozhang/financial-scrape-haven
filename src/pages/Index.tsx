import { useEffect, useState } from "react";
import { NewsArticle, NewsCategory } from "@/types/news";
import { NewsCard } from "@/components/NewsCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SearchBar } from "@/components/SearchBar";
import { saveArticles, getStoredArticles } from "@/utils/storage";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // For demo purposes, we'll use stored articles or create sample ones
        let newsArticles = getStoredArticles();
        
        if (newsArticles.length === 0) {
          // Sample data - in a real app, this would be fetched from an API
          newsArticles = [
            {
              id: "1",
              title: "Bitcoin Surges Past $50,000 Mark",
              summary: "The world's largest cryptocurrency has reached a new milestone...",
              url: "#",
              source: "CryptoNews",
              category: "crypto",
              publishedAt: new Date().toISOString(),
            },
            {
              id: "2",
              title: "Federal Reserve Hints at Rate Cuts",
              summary: "The Federal Reserve chairman suggested potential rate cuts...",
              url: "#",
              source: "MarketWatch",
              category: "economy",
              publishedAt: new Date().toISOString(),
            },
            // Add more sample articles here
          ];
          saveArticles(newsArticles);
        }
        
        setArticles(newsArticles);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch news articles",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-primary text-primary-foreground p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Financial News Center</h1>
        
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {loading ? (
          <div className="text-center py-10">Loading news...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;