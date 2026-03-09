import { useCallback, useEffect, useRef, useState } from "react";
import type {
  TableProps,
  Data,
  SortConfig,
  HeaderColumn,
  PaginationConfig,
} from "./types";

type UseTableLogicProps = Pick<TableProps, "data" | "onSort"> & {
  headerColumns: HeaderColumn[];
  pagination?: PaginationConfig;
};

// Helper to safely extract pagination values from the config
const getPaginationValues = (pagination?: PaginationConfig) => {
  if (!pagination) {
    return {
      mode: undefined,
      format: undefined,
      recordsPerPage: 10,
      numberOfPages: undefined,
      enableShowMoreButton: undefined,
      enableNextButton: undefined,
      enablePrevButton: undefined,
      onShowMore: undefined,
      onNextPage: undefined,
      onPrevPage: undefined,
      onPageChange: undefined,
    };
  }

  return {
    mode: pagination.mode,
    format: pagination.format,
    recordsPerPage: pagination.recordsPerPage ?? 10,
    numberOfPages:
      "numberOfPages" in pagination ? pagination.numberOfPages : undefined,
    enableShowMoreButton:
      "enableShowMoreButton" in pagination
        ? pagination.enableShowMoreButton
        : undefined,
    enableNextButton:
      "enableNextButton" in pagination
        ? pagination.enableNextButton
        : undefined,
    enablePrevButton:
      "enablePrevButton" in pagination
        ? pagination.enablePrevButton
        : undefined,
    onShowMore: "onShowMore" in pagination ? pagination.onShowMore : undefined,
    onNextPage: "onNextPage" in pagination ? pagination.onNextPage : undefined,
    onPrevPage: "onPrevPage" in pagination ? pagination.onPrevPage : undefined,
    onPageChange:
      "onPageChange" in pagination ? pagination.onPageChange : undefined,
  };
};

export const useTableLogic = ({
  data,
  headerColumns,
  pagination,
  onSort,
}: UseTableLogicProps) => {
  const {
    mode,
    format: paginationFormat,
    recordsPerPage,
    numberOfPages: externalNumberOfPages,
    enableShowMoreButton,
    enableNextButton,
    enablePrevButton,
    onShowMore,
    onNextPage,
    onPrevPage,
    onPageChange,
  } = getPaginationValues(pagination);

  const isFrontendPagination = mode === "frontend";
  const isBackendPagination = mode === "backend";
  const paginationEnabled = isFrontendPagination || isBackendPagination;

  const [fullDataSet, setFullDataSet] = useState<Data[]>(data);
  const [paginatedData, setPaginatedData] = useState<Data[]>(
    data.slice(0, recordsPerPage),
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [filterConfig, setFilterConfig] = useState<{ [key: string]: string }>(
    {},
  );

  // Derived values
  const displayedData = isFrontendPagination ? paginatedData : fullDataSet;
  const filteringEnabled = headerColumns.some((col) => col.filterable);
  const filterableColumns = headerColumns.filter((col) => col.filterable);

  const numberOfPages =
    externalNumberOfPages ??
    (data.length > 0 ? Math.ceil(data.length / recordsPerPage) : 0);

  const disableShowMoreButton = isBackendPagination
    ? !enableShowMoreButton
    : paginatedData.length >= fullDataSet.length;

  const disableNextButton = isBackendPagination
    ? !enableNextButton
    : currentPage >= Math.ceil(fullDataSet.length / recordsPerPage);

  const disablePrevButton = isBackendPagination
    ? !enablePrevButton
    : currentPage <= 1;

  // Track previous data to avoid infinite loops
  const prevDataRef = useRef<Data[]>(data);

  // Reset handler
  const resetTable = useCallback(() => {
    setFullDataSet(data);
    setCurrentPage(1);
    setPaginatedData(data.slice(0, recordsPerPage));
    setSortConfig(null);
    setFilterConfig({});
  }, [data, recordsPerPage]);

  useEffect(() => {
    // Only reset if data reference actually changed (not on every render)
    if (prevDataRef.current !== data) {
      prevDataRef.current = data;
      resetTable();
    }
  }, [data, resetTable]);

  // Pagination handlers
  const handleShowMore = () => {
    if (disableShowMoreButton) return;

    if (isBackendPagination) {
      onShowMore?.();
      return;
    }
    setPaginatedData(
      fullDataSet.slice(0, paginatedData.length + recordsPerPage),
    );
  };

  const handleNextPage = () => {
    if (disableNextButton) return;

    if (isBackendPagination) {
      onNextPage?.();
      return;
    }
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    setPaginatedData(
      fullDataSet.slice(
        (nextPage - 1) * recordsPerPage,
        nextPage * recordsPerPage,
      ),
    );
  };

  const handlePrevPage = () => {
    if (disablePrevButton) return;

    if (isBackendPagination) {
      onPrevPage?.();
      return;
    }
    const prevPage = currentPage - 1;
    setCurrentPage(prevPage);
    setPaginatedData(
      fullDataSet.slice(
        (prevPage - 1) * recordsPerPage,
        prevPage * recordsPerPage,
      ),
    );
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > (numberOfPages ?? Infinity)) return;

    if (isBackendPagination) {
      onPageChange?.(page);
      return;
    }
    setCurrentPage(page);
    setPaginatedData(
      fullDataSet.slice((page - 1) * recordsPerPage, page * recordsPerPage),
    );
  };

  // Sorting handler
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

    const sortedData: Data[] = [...fullDataSet].sort((a, b) => {
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

    setFullDataSet(sortedData);
    setPaginatedData(sortedData.slice(0, recordsPerPage));
  };

  // Filtering handler
  const handleFiltering = (colKey: string, value: string) => {
    let newFilterConfig;
    if (!value) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [colKey]: _, ...rest } = filterConfig;
      newFilterConfig = rest;
    } else {
      newFilterConfig = { ...filterConfig, [colKey]: value };
    }
    setFilterConfig(newFilterConfig);

    const filteredData = data.filter((row) => {
      return Object.entries(newFilterConfig).every(([key, value]) => {
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

    setFullDataSet(filteredData);
    setCurrentPage(1);
    setPaginatedData(filteredData.slice(0, recordsPerPage));
  };

  return {
    // State
    displayedData,
    currentPage,
    sortConfig,
    filterConfig,
    numberOfPages,

    // Derived
    paginationEnabled,
    paginationFormat,
    filteringEnabled,
    filterableColumns,
    disableShowMoreButton,
    disableNextButton,
    disablePrevButton,

    // Handlers
    resetTable,
    handleShowMore,
    handleNextPage,
    handlePrevPage,
    handlePageChange,
    handleSort,
    handleFiltering,
  };
};
