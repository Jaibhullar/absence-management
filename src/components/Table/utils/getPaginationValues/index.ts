import type { PaginationConfig, PaginationFormat } from "../../types";

export type PaginationValues = {
  mode: "frontend" | "backend" | undefined;
  format: PaginationFormat | undefined;
  recordsPerPage: number;
  numberOfPages: number | undefined;
  enableShowMoreButton: boolean | undefined;
  enableNextButton: boolean | undefined;
  enablePrevButton: boolean | undefined;
  onShowMore: (() => void) | undefined;
  onNextPage: (() => void) | undefined;
  onPrevPage: (() => void) | undefined;
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
    recordsPerPage: pagination.recordsPerPage ?? DEFAULT_RECORDS_PER_PAGE,
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
