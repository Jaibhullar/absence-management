type CommonTableProps = {
  ariaLabel?: string;
  headerColumns: HeaderColumn[];
  data: Data[];
  loading?: boolean;
  error?: boolean;
  errorMessage?: string;
  onSort?: (column: HeaderColumn) => void;
};

type NoPaginationProps = CommonTableProps & {
  frontendPagination?: false;
  backendPagination?: false;
};

type BaseFrontendPaginationProps = CommonTableProps & {
  frontendPagination: true;
  backendPagination?: false;
  paginationFormat: "show-more" | "next-prev" | "page-numbers";
  recordsPerPage?: number;
};

type FrontendPaginationShowMoreProps = BaseFrontendPaginationProps & {
  paginationFormat: "show-more";
  enableShowMoreButton?: boolean;
};

type FrontendPaginationNextPrevProps = BaseFrontendPaginationProps & {
  paginationFormat: "next-prev";
  enableNextButton?: boolean;
  enablePrevButton?: boolean;
};

type FrontendPaginationPageNumbersProps = BaseFrontendPaginationProps & {
  paginationFormat: "page-numbers";
};

type BaseBackendPaginationProps = CommonTableProps & {
  backendPagination: true;
  frontendPagination?: false;
  recordsPerPage?: number;
  paginationFormat: "show-more" | "next-prev" | "page-numbers";
  numberOfPages: number;
};

type BackendPaginationShowMoreProps = BaseBackendPaginationProps & {
  paginationFormat: "show-more";
  onShowMore: () => void;
  enableShowMoreButton: boolean;
};

type BackendPaginationNextPrevProps = BaseBackendPaginationProps & {
  paginationFormat: "next-prev";
  onNextPage: () => void;
  onPrevPage: () => void;
  enableNextButton: boolean;
  enablePrevButton: boolean;
};

type BackendPaginationPageNumbersProps = BaseBackendPaginationProps & {
  paginationFormat: "page-numbers";
  onPageChange: (page: number) => void;
};

export type TableProps =
  | NoPaginationProps
  | FrontendPaginationShowMoreProps
  | FrontendPaginationNextPrevProps
  | FrontendPaginationPageNumbersProps
  | BackendPaginationShowMoreProps
  | BackendPaginationNextPrevProps
  | BackendPaginationPageNumbersProps;

export type HeaderColumn = {
  key: string;
  text?: string;
  sortable?: boolean;
  filterable?: boolean;
  customCell?: React.ReactNode;
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
