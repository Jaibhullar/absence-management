import { Button } from "@/components/ui/button";

export type PaginationProps = {
  paginationFormat: "show-more" | "next-prev" | "page-numbers";
  headerColumnsLength: number;
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
  headerColumnsLength,
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
    <tfoot>
      <tr>
        <td
          className="py-3 px-2 text-center space-x-4"
          colSpan={headerColumnsLength}
        >
          {paginationFormat === "show-more" && (
            <Button onClick={handleShowMore} disabled={disableShowMoreButton}>
              Show More
            </Button>
          )}
          {paginationFormat === "next-prev" && (
            <>
              <Button onClick={handlePrevPage} disabled={disablePrevButton}>
                Prev
              </Button>
              <Button onClick={handleNextPage} disabled={disableNextButton}>
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
                  >
                    {page}
                  </Button>
                ),
              )}
            </>
          )}
        </td>
      </tr>
    </tfoot>
  );
};
