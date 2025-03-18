
import { useState, useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NewsArticle } from './types';
import NewsTable from './NewsTable';
import NewsPagination from './NewsPagination';

const NewsSection = () => {
  const { toast } = useToast();
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery] = useState('tax india');
  const articlesPerPage = 5;
  
  const fetchNewsArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.functions.invoke('google-news', {
        body: { query: searchQuery }
      });

      if (error) {
        console.error('Error invoking function:', error);
        setError('Failed to fetch news. Please try again later.');
        toast({
          title: "Error fetching news",
          description: "Could not load the latest news articles. Please try again later.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      if (data && data.articles) {
        setNewsArticles(data.articles);
        toast({
          title: "News Loaded",
          description: `${data.articles.length} latest tax news articles have been loaded.`,
          duration: 3000,
        });
      } else {
        setError(data?.error || 'Received unexpected data format from news service.');
        toast({
          title: "Error",
          description: data?.error || "Received unexpected data from news service.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (err) {
      console.error('Exception:', err);
      setError('An unexpected error occurred');
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchNewsArticles();
  }, [toast]);

  // Calculate pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = newsArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(newsArticles.length / articlesPerPage);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-tax-blue mb-4">Latest Tax News</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {loading ? (
        <div className="p-8 text-center">
          <p>Loading latest news articles...</p>
        </div>
      ) : (
        <>
          {currentArticles.length > 0 ? (
            <NewsTable articles={currentArticles} />
          ) : (
            <div className="p-4 border rounded-md bg-muted/50">
              <p className="text-center">No news articles found. Try a different search term.</p>
            </div>
          )}
          
          {newsArticles.length > articlesPerPage && (
            <NewsPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default NewsSection;
