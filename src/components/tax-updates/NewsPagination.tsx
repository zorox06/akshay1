
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface NewsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const NewsPagination = ({ currentPage, totalPages, onPageChange }: NewsPaginationProps) => {
  return (
    <Pagination className="mt-4">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(currentPage - 1)} 
              className="cursor-pointer"
            />
          </PaginationItem>
        )}
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink 
              isActive={page === currentPage}
              onClick={() => onPageChange(page)}
              className="cursor-pointer"
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(currentPage + 1)} 
              className="cursor-pointer"
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default NewsPagination;
