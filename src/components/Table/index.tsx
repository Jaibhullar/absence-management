import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { TableSkeleton } from "./TableSkeleton";
import { SortIcon } from "./SortIcon";
import type { TableProps, Data, SortConfig, HeaderColumn } from "./types";
import { Pagination } from "./pagination";

const testIds = {
  dataTable: "data-table",
  errorMessage: "error-message",
  noResultsMessage: "no-results-message",
};

export const Table = (props: TableProps) => {
  const {
    ariaLabel,
    headerColumns,
    data,
    loading,
    error,
    errorMessage,
    onSort,
    frontendPagination,
    backendPagination,
  } = props;

  const paginationFormat =
    "paginationFormat" in props ? props.paginationFormat : undefined;
  const recordsPerPage =
    "recordsPerPage" in props
      ? props.recordsPerPage
        ? props.recordsPerPage
        : 10
      : 10;
  const onShowMore = "onShowMore" in props ? props.onShowMore : undefined;
  const onNextPage = "onNextPage" in props ? props.onNextPage : undefined;
  const onPrevPage = "onPrevPage" in props ? props.onPrevPage : undefined;
  const onPageChange = "onPageChange" in props ? props.onPageChange : undefined;
  const numberOfPages =
    "numberOfPages" in props
      ? props.numberOfPages
      : data.length > 0
        ? Math.ceil(data.length / recordsPerPage)
        : 0;
  const enableShowMoreButton =
    "enableShowMoreButton" in props ? props.enableShowMoreButton : undefined;
  const enableNextButton =
    "enableNextButton" in props ? props.enableNextButton : undefined;
  const enablePrevButton =
    "enablePrevButton" in props ? props.enablePrevButton : undefined;

  const fullDataSetRef = useRef<Data[]>(data);
  const [paginatedData, setPaginatedData] = useState<Data[]>(
    fullDataSetRef.current.slice(0, recordsPerPage),
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const displayedData = frontendPagination
    ? paginatedData
    : fullDataSetRef.current;
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [filterConfig, setFilterConfig] = useState<{ [key: string]: string }>(
    {},
  );

  useEffect(() => {
    const resetPagination = () => {
      fullDataSetRef.current = data;
      setCurrentPage(1);
      setPaginatedData(fullDataSetRef.current.slice(0, recordsPerPage));
      setSortConfig(null);
    };

    resetPagination();
  }, [data, recordsPerPage]);

  // pagination
  const showPaginationControls = backendPagination || frontendPagination;

  const disableShowMoreButton = backendPagination
    ? !enableShowMoreButton
    : paginatedData.length >= fullDataSetRef.current.length;

  const disableNextButton = backendPagination
    ? !enableNextButton
    : currentPage >= Math.ceil(fullDataSetRef.current.length / recordsPerPage);

  const disablePrevButton = backendPagination
    ? !enablePrevButton
    : currentPage <= 1;

  const handleShowMore = () => {
    if (disableShowMoreButton) return;

    if (backendPagination) {
      onShowMore?.();
      return;
    }
    setPaginatedData(
      fullDataSetRef.current.slice(0, paginatedData.length + recordsPerPage),
    );
  };

  const handleNextPage = () => {
    if (disableNextButton) return;

    if (backendPagination) {
      onNextPage?.();
      return;
    }
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    setPaginatedData(
      fullDataSetRef.current.slice(
        (nextPage - 1) * recordsPerPage,
        nextPage * recordsPerPage,
      ),
    );
  };

  const handlePrevPage = () => {
    if (disablePrevButton) return;

    if (backendPagination) {
      onPrevPage?.();
      return;
    }
    const prevPage = currentPage - 1;
    setCurrentPage(prevPage);
    setPaginatedData(
      fullDataSetRef.current.slice(
        (prevPage - 1) * recordsPerPage,
        prevPage * recordsPerPage,
      ),
    );
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > (numberOfPages ?? Infinity)) return;

    if (backendPagination) {
      onPageChange?.(page);
      return;
    }
    setCurrentPage(page);
    setPaginatedData(
      fullDataSetRef.current.slice(
        (page - 1) * recordsPerPage,
        page * recordsPerPage,
      ),
    );
  };

  // Sorting and filtering

  const filteringEnabled = headerColumns.some((col) => col.filterable);

  const handleSort = (column: HeaderColumn) => {
    if (!column.sortable) return;

    setCurrentPage(1);

    if (onSort) {
      onSort(column);
      return;
    }

    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === column.key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    setSortConfig({ key: column.key, direction });

    const sortedData: Data[] = [...fullDataSetRef.current].sort((a, b) => {
      const aValue = a.cells.find((cell) => cell.key === column.key)?.value;
      const bValue = b.cells.find((cell) => cell.key === column.key)?.value;

      if (aValue === undefined || bValue === undefined) return 0;

      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return direction === "asc"
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });

    fullDataSetRef.current = sortedData;
    setPaginatedData(sortedData.slice(0, recordsPerPage));
  };

  const handleFiltering = useCallback(() => {
    const filteredData = data.filter((row) => {
      return Object.entries(filterConfig).every(([key, value]) => {
        const cellValue = row.cells.find((cell) => cell.key === key)?.value;
        const cellDisplayValue = row.cells.find(
          (cell) => cell.key === key,
        )?.displayedValue;
        return (
          cellValue?.toString().toLowerCase().includes(value.toLowerCase()) ||
          cellDisplayValue
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      });
    });

    fullDataSetRef.current = filteredData;
    setCurrentPage(1);
    setPaginatedData(filteredData.slice(0, recordsPerPage));
  }, [data, filterConfig, recordsPerPage]);

  useEffect(() => {
    handleFiltering();
  }, [filterConfig, handleFiltering]);

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
    <>
      <div className="mb-6 flex flex-wrap gap-3">
        {headerColumns
          .filter((col) => col.filterable)
          .map((col) => (
            <input
              type="text"
              key={col.key}
              placeholder={`Filter by ${col.text}`}
              onChange={(e) => {
                if (!e.target.value) {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { [col.key]: _, ...rest } = filterConfig;
                  setFilterConfig(rest);
                  return;
                }
                setFilterConfig((prev) => ({
                  ...prev,
                  [col.key]: e.target.value,
                }));
              }}
              className="border rounded px-3 py-2"
              aria-label={`Filter by ${col.text}`}
            />
          ))}
        {filteringEnabled && (
          <Button
            variant={"destructive"}
            disabled={Object.keys(filterConfig).length === 0}
            onClick={() => setFilterConfig({})}
          >
            Clear Filters
          </Button>
        )}
      </div>

      <table
        aria-label={ariaLabel}
        className="w-full border-collapse min-w-225 border-spacing-0 border"
        data-testid={testIds.dataTable}
      >
        {/* head */}
        <thead className="sticky top-0 z-10 bg-white">
          <tr className="border-b ">
            {headerColumns.map((column) => (
              <th
                key={column.key}
                className="py-3 cursor-pointer transition-colors hover:bg-secondary"
                onClick={() => handleSort(column)}
              >
                {column.customCell ? (
                  column.customCell
                ) : (
                  <div className="flex items-center gap-3 justify-center">
                    <span>{column.text}</span>
                    <SortIcon
                      column={column}
                      sortConfig={sortConfig}
                    ></SortIcon>
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
        {showPaginationControls && paginationFormat && (
          <Pagination
            paginationFormat={paginationFormat}
            headerColumnsLength={headerColumns.length}
            numberOfPages={numberOfPages}
            currentPage={currentPage}
            disableShowMoreButton={disableShowMoreButton}
            disableNextButton={disableNextButton}
            disablePrevButton={disablePrevButton}
            handleShowMore={handleShowMore}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            handlePageChange={handlePageChange}
          ></Pagination>
        )}
      </table>
    </>
  );
};

Table.testIds = testIds;
