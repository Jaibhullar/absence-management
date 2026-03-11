import { TableSkeleton } from "./TableSkeleton";
import { SortIcon } from "../SortIcon";
import type { TableProps } from "./types";
import { Pagination } from "../pagination";
import { Button } from "../ui/Button";

const testIds = {
  dataTable: "data-table",
  errorMessage: "error-message",
  noResultsMessage: "no-results-message",
  dataRow: "data-row",
  headerCell: "header-cell",
  sortButton: "sort-button",
};

export const Table = ({
  ariaLabel,
  headerColumns,
  data,
  loading,
  error,
  errorMessage,
  sortConfig,
  paginationConfig,
}: TableProps) => {
  if (loading)
    return <TableSkeleton cols={headerColumns.length} rows={8}></TableSkeleton>;

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
                    ? sortConfig.order === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
                key={column.key}
                style={column.width ? { width: column.width } : undefined}
                className="py-3"
              >
                {column.customCell ? (
                  column.customCell
                ) : column.sortable ? (
                  <Button
                    variant="ghost"
                    data-testid={testIds.sortButton}
                    className="flex items-center gap-3 justify-center w-full text-foreground font-bold text-md"
                    onClick={() => column.onSort?.()}
                    aria-label={`Sort by ${column.text}`}
                  >
                    <span>{column.text}</span>
                    <SortIcon columnKey={column.key} sortConfig={sortConfig} />
                  </Button>
                ) : (
                  <div className="flex items-center gap-3 justify-center">
                    <span>{column.text}</span>
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>

        {/* body */}
        <tbody>
          {data.length === 0 ? (
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
            data.map((row) => (
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
                      <span>{cell.value.toString()}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {paginationConfig && paginationConfig.numberOfPages > 1 && (
        <Pagination {...paginationConfig} />
      )}
    </>
  );
};

Table.testIds = testIds;
