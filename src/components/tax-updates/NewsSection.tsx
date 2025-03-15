
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

const NewsSection = () => {
  const { toast } = useToast();
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('tax india');
  const articlesPerPage = 5;
  
  const fetchNewsArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching news articles with query:', searchQuery);
      
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
        console.log('Received articles:', data.articles.length);
        setNewsArticles(data.articles);
        toast({
          title: "News Loaded",
          description: `${data.articles.length} latest tax news articles have been loaded.`,
          duration: 3000,
        });
      } else if (data && data.error) {
        console.error('API Error:', data.error);
        setError(data.error);
        toast({
          title: "API Error",
          description: data.error,
          variant: "destructive",
          duration: 3000,
        });
      } else {
        console.error('Unexpected response format:', data);
        setError('Received unexpected data format from news service.');
        toast({
          title: "Error",
          description: "Received unexpected data from news service.",
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

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentArticles.map((article, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>{article.source.name}</TableCell>
                    <TableCell>{new Date(article.publishedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-tax-blue hover:underline"
                      >
                        Read More
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-4 border rounded-md bg-muted/50">
              <p className="text-center">No news articles found. Try a different search term.</p>
            </div>
          )}
          
          {/* Pagination */}
          {newsArticles.length > articlesPerPage && (
            <Pagination className="mt-4">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => paginate(currentPage - 1)} 
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                )}
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      isActive={page === currentPage}
                      onClick={() => paginate(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => paginate(currentPage + 1)} 
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default NewsSection;
