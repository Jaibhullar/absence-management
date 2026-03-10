import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  TableProps,
  Data,
  SortConfig,
  HeaderColumn,
  FilterConfig,
  PaginationFormat,
  PaginationConfig,
} from "../../types";
import { compareValues } from "../../utils/compareValues";
import { getPaginationValues } from "../../utils/getPaginationValues";
import { filterData } from "../../utils/filterData";

type UseTableLogicProps = Pick<TableProps, "data" | "onSort"> & {
  headerColumns: HeaderColumn[];
  pagination?: PaginationConfig;
};

type UseTableLogicReturn = {
  // State
  displayedData: Data[];
  currentPage: number;
  sortConfig: SortConfig;
  filterConfig: FilterConfig;
  numberOfPages: number;

  // Derived
  paginationEnabled: boolean;
  paginationFormat?: PaginationFormat;
  filteringEnabled: boolean;
  filterableColumns: HeaderColumn[];
  disableShowMoreButton: boolean;
  disableNextButton: boolean;
  disablePrevButton: boolean;

  // Handlers
  resetTable: () => void;
  handleShowMore: () => void;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handlePageChange: (page: number) => void;
  handleSortColumn: (column: HeaderColumn) => void;
  handleFiltering: (colKey: string, value: string) => void;
};

export const useTableLogic = ({
  data,
  headerColumns,
  pagination,
  onSort,
}: UseTableLogicProps): UseTableLogicReturn => {
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
  const [itemsToShow, setItemsToShow] = useState<number>(recordsPerPage);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({});

  // Derived: paginatedData computed from state
  const paginatedData = useMemo(() => {
    if (paginationFormat === "show-more") {
      return fullDataSet.slice(0, itemsToShow);
    }
    return fullDataSet.slice(
      (currentPage - 1) * recordsPerPage,
      currentPage * recordsPerPage,
    );
  }, [fullDataSet, paginationFormat, itemsToShow, currentPage, recordsPerPage]);

  // Derived values
  const displayedData = isFrontendPagination ? paginatedData : fullDataSet;
  const filteringEnabled = headerColumns.some((col) => col.filterable);
  const filterableColumns = useMemo(() => {
    return headerColumns.filter((col) => col.filterable);
  }, [headerColumns]);

  const numberOfPages =
    externalNumberOfPages ??
    (data.length > 0 ? Math.ceil(data.length / recordsPerPage) : 0);

  const disableShowMoreButton = isBackendPagination
    ? !enableShowMoreButton
    : itemsToShow >= fullDataSet.length;

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
    setItemsToShow(recordsPerPage);
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
  const handleShowMore = useCallback(() => {
    if (disableShowMoreButton) return;

    if (isBackendPagination) {
      onShowMore?.();
      return;
    }
    setItemsToShow((prev) => prev + recordsPerPage);
  }, [disableShowMoreButton, isBackendPagination, onShowMore, recordsPerPage]);

  const handleNextPage = useCallback(() => {
    if (disableNextButton) return;

    if (isBackendPagination) {
      onNextPage?.();
      return;
    }
    setCurrentPage((prev) => prev + 1);
  }, [disableNextButton, isBackendPagination, onNextPage]);

  const handlePrevPage = useCallback(() => {
    if (disablePrevButton) return;

    if (isBackendPagination) {
      onPrevPage?.();
      return;
    }
    setCurrentPage((prev) => prev - 1);
  }, [disablePrevButton, isBackendPagination, onPrevPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > (numberOfPages ?? Infinity)) return;

      if (isBackendPagination) {
        onPageChange?.(page);
        return;
      }
      setCurrentPage(page);
    },
    [numberOfPages, isBackendPagination, onPageChange],
  );

  // Sorting handler
  const handleSortColumn = useCallback(
    (column: HeaderColumn) => {
      if (!column.sortable) return;

      if (onSort) {
        onSort(column);
        return;
      }

      setCurrentPage(1);
      setItemsToShow(recordsPerPage);

      setSortConfig((prevSortConfig) => {
        let direction: "asc" | "desc" = "asc";
        if (prevSortConfig && prevSortConfig.key === column.key) {
          direction = prevSortConfig.direction === "asc" ? "desc" : "asc";
        }

        setFullDataSet((prevData) => {
          const sortedData: Data[] = [...prevData].sort((a, b) => {
            const aValue = a.cells.find(
              (cell) => cell.key === column.key,
            )?.value;
            const bValue = b.cells.find(
              (cell) => cell.key === column.key,
            )?.value;

            return compareValues(aValue, bValue, direction);
          });

          return sortedData;
        });

        return { key: column.key, direction };
      });
    },
    [onSort, recordsPerPage],
  );

  // Filtering handler
  const handleFiltering = useCallback(
    (colKey: string, value: string) => {
      setFilterConfig((prevFilterConfig) => {
        let newFilterConfig;
        if (!value) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [colKey]: _, ...rest } = prevFilterConfig;
          newFilterConfig = rest;
        } else {
          newFilterConfig = { ...prevFilterConfig, [colKey]: value };
        }

        // Always filter from original data to avoid cumulative filtering issues
        const filteredData = filterData(data, newFilterConfig);

        setFullDataSet(filteredData);
        setCurrentPage(1);
        setItemsToShow(recordsPerPage);

        return newFilterConfig;
      });
    },
    [data, recordsPerPage],
  );

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
    handleSortColumn,
    handleFiltering,
  };
};
