import type { PaginationConfig, PaginationFormat } from "../../types";

export type PaginationValues = {
  mode: "frontend" | "backend" | undefined;
  format: PaginationFormat | undefined;
  recordsPerPage: number;
  numberOfPages: number | undefined;
  enableShowMoreButton: boolean | undefined;
  onShowMore: (() => void) | undefined;
  onPageChange: ((page: number) => void) | undefined;
};

const DEFAULT_RECORDS_PER_PAGE = 10;

/**
 * Safely extracts pagination values from a PaginationConfig.
 * Handles both frontend and backend pagination configurations.
 */
export const getPaginationValues = (
  pagination?: PaginationConfig,
): PaginationValues => {
  if (!pagination) {
    return {
      mode: undefined,
      format: undefined,
      recordsPerPage: DEFAULT_RECORDS_PER_PAGE,
      numberOfPages: undefined,
      enableShowMoreButton: undefined,
      onShowMore: undefined,
      onPageChange: undefined,
    };
  }

  return {
    mode: pagination.mode,
    format: pagination.format,
    recordsPerPage: pagination.recordsPerPage ?? DEFAULT_RECORDS_PER_PAGE,
    numberOfPages:
      "numberOfPages" in pagination ? pagination.numberOfPages : undefined,
    enableShowMoreButton:
      "enableShowMoreButton" in pagination
        ? pagination.enableShowMoreButton
        : undefined,
    onShowMore: "onShowMore" in pagination ? pagination.onShowMore : undefined,
    onPageChange:
      "onPageChange" in pagination ? pagination.onPageChange : undefined,
  };
};
