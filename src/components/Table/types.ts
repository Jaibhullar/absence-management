// Pagination format types
export type PaginationFormat = "show-more" | "page-numbers";

// Frontend pagination config
type FrontendPaginationConfig = {
  mode: "frontend";
  format: PaginationFormat;
  recordsPerPage?: number;
};

// Backend pagination configs (discriminated by format)
type BackendShowMoreConfig = {
  mode: "backend";
  format: "show-more";
  recordsPerPage?: number;
  numberOfPages: number;
  onShowMore: () => void;
  enableShowMoreButton: boolean;
};

type BackendPageNumbersConfig = {
  mode: "backend";
  format: "page-numbers";
  recordsPerPage?: number;
  numberOfPages: number;
  onPageChange: (page: number) => void;
};

type BackendPaginationConfig = BackendShowMoreConfig | BackendPageNumbersConfig;

export type PaginationConfig =
  | FrontendPaginationConfig
  | BackendPaginationConfig;

export type TableProps = {
  ariaLabel?: string;
  headerColumns: HeaderColumn[];
  data: Data[];
  loading?: boolean;
  error?: boolean;
  errorMessage?: string;
  onSort?: (column: HeaderColumn) => void;
  pagination?: PaginationConfig;
};

export type HeaderColumn = {
  key: string;
  text?: string;
  sortable?: boolean;
  filterable?: boolean;
  customCell?: React.ReactNode;
  width?: string;
};

export type Data = {
  key: string;
  cells: {
    key: string;
    value: string | number | boolean;
    displayedValue?: string | number | boolean;
    customCell?: React.ReactNode;
  }[];
};

export type SortConfig = {
  key: string;
  direction: "asc" | "desc";
} | null;

export type FilterConfig = {
  [columnKey: string]: string;
};
