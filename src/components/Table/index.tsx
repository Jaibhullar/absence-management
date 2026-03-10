import { TableSkeleton } from "./TableSkeleton";
import { SortIcon } from "./SortIcon";
import { TableFilters } from "./TableFilters";
import type { TableProps } from "./types";
import { Pagination } from "./pagination";
import { cn } from "@/lib/utils";
import { useTableLogic } from "./hooks/useTableLogic";

const testIds = {
  dataTable: "data-table",
  errorMessage: "error-message",
  noResultsMessage: "no-results-message",
  dataRow: "data-row",
  headerCell: "header-cell",
};

export const Table = ({
  ariaLabel,
  headerColumns,
  data,
  loading,
  error,
  errorMessage,
  onSort,
  pagination,
}: TableProps) => {
  const {
    displayedData,
    currentPage,
    sortConfig,
    filterConfig,
    numberOfPages,
    paginationEnabled,
    paginationFormat,
    filteringEnabled,
    filterableColumns,
    disableShowMoreButton,
    resetTable,
    handleShowMore,
    handlePageChange,
    handleSortColumn,
    handleFiltering,
  } = useTableLogic({
    data,
    headerColumns,
    pagination,
    onSort,
  });

  if (!loading)
    return (
      <TableSkeleton cols={headerColumns.length} rows={20}></TableSkeleton>
    );

  if (error) {
    return (
      <div
        className="text-destructive text-center"
        data-testid={testIds.errorMessage}
        aria-label="Error fetching data"
      >
        {errorMessage ? errorMessage : "There was an error fetching data..."}
      </div>
    );
  }

  return (
    <>
      {filteringEnabled && (
        <TableFilters
          filterableColumns={filterableColumns}
          filterConfig={filterConfig}
          onFilterChange={handleFiltering}
          onClearFilters={resetTable}
        />
      )}

      <table
        aria-label={ariaLabel}
        className="w-full border-collapse min-w-225 border-spacing-0 border"
        data-testid={testIds.dataTable}
      >
        {/* head */}
        <thead className="sticky top-0 z-10 bg-white">
          <tr className="border-b">
            {headerColumns.map((column) => (
              <th
                data-testid={testIds.headerCell}
                scope="col"
                aria-sort={
                  sortConfig?.key === column.key
                    ? sortConfig.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
                key={column.key}
                style={column.width ? { width: column.width } : undefined}
                className={cn(
                  "py-3",
                  column.sortable
                    ? "cursor-pointer transition-colors hover:bg-secondary"
                    : "",
                )}
                onClick={
                  column.sortable ? () => handleSortColumn(column) : undefined
                }
              >
                {column.customCell ? (
                  column.customCell
                ) : (
                  <div className="flex items-center gap-3 justify-center">
                    <span>{column.text}</span>
                    {column.sortable && (
                      <SortIcon column={column} sortConfig={sortConfig} />
                    )}
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>

        {/* body */}
        <tbody>
          {displayedData.length === 0 ? (
            <tr>
              <td colSpan={headerColumns.length}>
                <p
                  className="my-6 text-center text-muted-foreground text-sm"
                  data-testid={testIds.noResultsMessage}
                >
                  No results to show
                </p>
              </td>
            </tr>
          ) : (
            displayedData.map((row) => (
              <tr
                key={row.key}
                className="text-center border-t border-b transition-colors hover:bg-secondary text-sm"
                data-testid={testIds.dataRow}
              >
                {row.cells.map((cell, index) => (
                  <td key={index} className="py-3">
                    {cell.customCell ? (
                      cell.customCell
                    ) : (
                      <span>{cell.displayedValue?.toString()}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {paginationEnabled && paginationFormat && (
        <Pagination
          paginationFormat={paginationFormat}
          numberOfPages={numberOfPages}
          currentPage={currentPage}
          disableShowMoreButton={disableShowMoreButton}
          handleShowMore={handleShowMore}
          handlePageChange={handlePageChange}
        />
      )}
    </>
  );
};

Table.testIds = testIds;
