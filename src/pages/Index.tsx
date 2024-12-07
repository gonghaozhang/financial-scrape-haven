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

  const { data: articles = [], isLoading, error } = useQuery({
    queryKey: ['news', selectedCategory],
    queryFn: () => searchNews(selectedCategory),
    initialData: [],
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch news articles. Showing stored articles instead.",
        variant: "destructive",
      });
      return getStoredArticles();
    },
  });

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
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

        {isLoading ? (
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