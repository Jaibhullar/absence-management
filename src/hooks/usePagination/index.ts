import { useMemo, useState } from "react";
import { paginateData } from "@/utils/paginateData";
import type { PaginationConfig } from "@/types";

export const DEFAULT_ITEMS_PER_PAGE = 8;

type UsePaginationOptions<T> = {
  data: T[];
  itemsPerPage?: number;
  initialPage?: number;
};

type UsePaginationResponse<T> = {
  paginatedData: T[];
  paginationConfig: PaginationConfig;
  resetToFirstPage: () => void;
};

export const usePagination = <T>({
  data,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  initialPage = 1,
}: UsePaginationOptions<T>): UsePaginationResponse<T> => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const numberOfPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = useMemo(
    () => paginateData(data, currentPage, itemsPerPage),
    [data, currentPage, itemsPerPage],
  );

  const handlePageChange = (page: number) => {
    const clampedPage = Math.max(1, Math.min(page, numberOfPages));
    setCurrentPage(clampedPage);
  };

  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  return {
    paginatedData,
    paginationConfig: {
      currentPage,
      numberOfPages,
      handlePageChange,
    },
    resetToFirstPage,
  };
};
