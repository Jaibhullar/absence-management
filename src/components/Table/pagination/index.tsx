import { Button } from "@/components/Button";

const testIds = {
  paginationContainer: "pagination-container",
  showMoreButton: "show-more-button",
  prevButton: "prev-button",
  nextButton: "next-button",
  pageNumberButton: "page-number-button",
};

export type PaginationProps = {
  paginationFormat: "show-more" | "next-prev" | "page-numbers";
  numberOfPages: number;
  currentPage: number;
  disableShowMoreButton: boolean;
  disableNextButton: boolean;
  disablePrevButton: boolean;
  handleShowMore: () => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handlePageChange: (page: number) => void;
};

export const Pagination = ({
  paginationFormat,
  numberOfPages,
  currentPage,
  disableShowMoreButton,
  disableNextButton,
  disablePrevButton,
  handleShowMore,
  handleNextPage,
  handlePrevPage,
  handlePageChange,
}: PaginationProps) => {
  return (
    <div
      className="py-3 px-2 text-center space-x-4 space-y-4"
      data-testid={testIds.paginationContainer}
    >
      {paginationFormat === "show-more" && (
        <Button
          onClick={handleShowMore}
          disabled={disableShowMoreButton}
          data-testid={testIds.showMoreButton}
        >
          Show More
        </Button>
      )}
      {paginationFormat === "next-prev" && (
        <>
          <Button
            onClick={handlePrevPage}
            disabled={disablePrevButton}
            data-testid={testIds.prevButton}
          >
            Prev
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={disableNextButton}
            data-testid={testIds.nextButton}
          >
            Next
          </Button>
        </>
      )}
      {paginationFormat === "page-numbers" && (
        <>
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
        </>
      )}
    </div>
  );
};

Pagination.testIds = testIds;
