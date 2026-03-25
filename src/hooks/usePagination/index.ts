import { useEffect, useMemo, useState } from "react";
import { paginateData } from "@/utils/paginateData";
import type { PaginationConfig } from "@/types";

export const DEFAULT_ITEMS_PER_PAGE = 8;

type UsePaginationOptions<T> = {
  data: T[];
  itemsPerPage?: number;
};

type UsePaginationResponse<T> = {
  paginatedData: T[];
  paginationConfig: PaginationConfig;
};

export const usePagination = <T>({
  data,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
}: UsePaginationOptions<T>): UsePaginationResponse<T> => {
  const [currentPage, setCurrentPage] = useState(1);

  const safeItemsPerPage =
    itemsPerPage > 0 ? itemsPerPage : DEFAULT_ITEMS_PER_PAGE;

  const numberOfPages = Math.ceil(data.length / safeItemsPerPage);

  const paginatedData = useMemo(
    () => paginateData(data, currentPage, safeItemsPerPage),
    [data, currentPage, safeItemsPerPage],
  );

  const handlePageChange = (page: number) => {
    const clampedPage = Math.max(1, Math.min(page, numberOfPages));
    setCurrentPage(clampedPage);
  };

  useEffect(() => {
    const resetToFirstPage = () => setCurrentPage(1);
    resetToFirstPage();
  }, [data, itemsPerPage]);

  return {
    paginatedData,
    paginationConfig: {
      currentPage,
      numberOfPages,
      handlePageChange,
    },
  };
};
