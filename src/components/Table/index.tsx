import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

const testIds = {
  tableSkeleton: "table-skeleton",
  tableSkeletonCol: "table-skeleton-col",
  dataTable: "data-table",
  errorMessage: "error-message",
  noResultsMessage: "no-results-message",
};

export type HeaderColumn = {
  key: string;
  text?: string;
  customCell?: React.ReactNode;
};

export type Data = {
  key: string;
  cells: {
    value?: string | number | boolean;
    customCell?: React.ReactNode;
  }[];
};

export type TableProps = {
  ariaLabel?: string;
  headerColumns: HeaderColumn[];
  data: Data[];
  loading?: boolean;
  error?: boolean;
  errorMessage?: string;
  frontendPagination?: boolean;
  backendPagination?: boolean;
  recordsPerPage?: number;
  onShowMore?: () => void;
  displayShowMoreButton?: boolean;
};

export const Table = ({
  ariaLabel,
  headerColumns,
  data,
  loading,
  error,
  errorMessage,
  frontendPagination,
  backendPagination,
  recordsPerPage = 10,
  onShowMore,
  displayShowMoreButton,
}: TableProps) => {
  const [paginatedData, setPaginatedData] = useState<Data[]>(
    data.slice(0, recordsPerPage),
  );
  const displayedData = frontendPagination ? paginatedData : data;

  useEffect(() => {
    setPaginatedData(data.slice(0, recordsPerPage));
  }, [data, recordsPerPage]);

  const showPaginationControls = backendPagination || frontendPagination;

  const disableShowMoreButton = backendPagination
    ? !displayShowMoreButton
    : paginatedData.length >= data.length;

  const handleShowMore = () => {
    if (disableShowMoreButton) return;

    if (backendPagination) {
      onShowMore?.();
      return;
    }
    setPaginatedData(data.slice(0, paginatedData.length + recordsPerPage));
  };

  if (loading)
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
    <table
      aria-label={ariaLabel}
      className="w-full border-collapse min-w-225 border-spacing-0"
      data-testid={testIds.dataTable}
    >
      {/* Table head will go here */}
      <thead className="sticky top-0 z-10 bg-white">
        <tr className="border-b">
          {headerColumns.map((column) => (
            <th key={column.key} className="py-3">
              {column.customCell ? (
                column.customCell
              ) : (
                <span>{column.text}</span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      {/* Table body will go here */}
      <tbody>
        {displayedData.length === 0 ? (
          <tr>
            <td colSpan={7}>
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
            >
              {row.cells.map((cell, index) => (
                <td key={index} className="py-3">
                  {cell.customCell ? (
                    cell.customCell
                  ) : (
                    <span>{cell.value?.toString()}</span>
                  )}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
      {showPaginationControls && (
        <tfoot>
          <tr>
            <td
              className="py-3 px-2 text-center"
              colSpan={headerColumns.length}
            >
              <Button
                onClick={handleShowMore}
                disabled={disableShowMoreButton}
                className=""
              >
                Show More
              </Button>
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  );
};

Table.testIds = testIds;

type TableSkeletonProps = {
  cols: number;
  rows: number;
};

const TableSkeleton = ({ cols, rows }: TableSkeletonProps) => {
  const rowArray = Array.from({ length: rows }, (_, i) => i);
  const colArray = Array.from({ length: cols }, (_, i) => i);

  return (
    <table
      className="w-full border-collapse min-w-225 border-spacing-0"
      data-testid={testIds.tableSkeleton}
      aria-label="Loading table"
    >
      <thead>
        <tr>
          {colArray.map((_, colIndex) => {
            return (
              <th
                key={`header-col-${colIndex}`}
                className="py-3"
                data-testid={testIds.tableSkeletonCol}
              >
                <Skeleton
                  className={`w-[calc(100%/${cols})] h-8 mx-6`}
                ></Skeleton>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rowArray.map((_, rowIndex) => {
          return (
            <tr key={`row-${rowIndex}`}>
              {colArray.map((_, colIndex) => {
                return (
                  <td
                    className="py-5 border-t border-b"
                    key={`row-${rowIndex}-col-${colIndex}`}
                  >
                    <Skeleton
                      className={`w-[calc(100%/${cols})] h-7 mx-4`}
                    ></Skeleton>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
