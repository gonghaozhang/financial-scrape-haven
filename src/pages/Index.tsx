import { useEffect, useState } from "react";
import { NewsArticle, NewsCategory } from "@/types/news";
import { NewsCard } from "@/components/NewsCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SearchBar } from "@/components/SearchBar";
import { useToast } from "@/components/ui/use-toast";
import { searchNews, getStoredArticles } from "@/lib/news-service";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: articles = [], isLoading, refetch } = useQuery({
    queryKey: ['news', selectedCategory, searchQuery],
    queryFn: () => searchNews(selectedCategory, searchQuery),
    initialData: [],
    staleTime: 5 * 60 * 1000,
    meta: {
      onSettled: (data, error) => {
        if (error) {
          toast({
            title: "错误",
            description: "获取新闻文章失败。显示已存储的文章。",
            variant: "destructive",
          });
          return getStoredArticles();
        }
      }
    }
  });

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, refetch]);

  return (
    <div className="min-h-screen bg-primary text-primary-foreground p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">金融新闻中心</h1>
        
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {isLoading ? (
          <div className="text-center py-10">加载新闻中...</div>
        ) : articles.length === 0 ? (
          <div className="text-center py-10">没有找到相关新闻</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;