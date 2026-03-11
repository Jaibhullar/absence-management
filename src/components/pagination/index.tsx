import { Button } from "@/components/ui/Button";

const testIds = {
  paginationContainer: "pagination-container",
  showMoreButton: "show-more-button",
  pageNumberButton: "page-number-button",
};

export type PaginationProps = {
  paginationConfig: {
    numberOfPages: number;
    currentPage: number;
    handlePageChange: (page: number) => void;
  };
};

export const Pagination = ({
  paginationConfig: { numberOfPages, currentPage, handlePageChange },
}: PaginationProps) => {
  return (
    <div
      className="py-3 px-2 text-center space-x-4 space-y-4"
      data-testid={testIds.paginationContainer}
    >
      {Array.from({ length: numberOfPages ?? 0 }, (_, i) => i + 1).map(
        (page) => (
          <Button
            key={page}
            onClick={() => handlePageChange(page)}
            disabled={page === currentPage}
            data-testid={testIds.pageNumberButton}
          >
            {page}
          </Button>
        ),
      )}
    </div>
  );
};

Pagination.testIds = testIds;
