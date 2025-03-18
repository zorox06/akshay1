
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NewsArticle } from "./types";

interface NewsTableProps {
  articles: NewsArticle[];
}

const NewsTable = ({ articles }: NewsTableProps) => {
  return (
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
        {articles.map((article, index) => (
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
  );
};

export default NewsTable;
