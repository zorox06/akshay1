
export interface NewsArticle {
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

export interface TaxUpdate {
  id: number;
  title: string;
  date: string;
  description: string;
  category: string;
  content: string;
  details: string[];
  source: string;
}
