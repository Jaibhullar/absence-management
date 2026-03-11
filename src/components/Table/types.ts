export type TablePaginationConfig = {
  numberOfPages: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
};

export type TableSortConfig = {
  key: string;
  order: "asc" | "desc";
};

export type TableProps = {
  ariaLabel?: string;
  headerColumns: HeaderColumn[];
  data: Data[];
  loading?: boolean;
  error?: boolean;
  errorMessage?: string;
  sortConfig?: TableSortConfig;
  paginationConfig?: TablePaginationConfig;
};

export type BaseHeaderColumn = {
  key: string;
  text?: string;
  customCell?: React.ReactNode;
  width?: string;
};

export type SortableHeaderColumn = BaseHeaderColumn & {
  sortable: true;
  onSort: () => void;
};

export type NonSortableHeaderColumn = BaseHeaderColumn & {
  sortable?: false;
};

export type HeaderColumn = SortableHeaderColumn | NonSortableHeaderColumn;

export type Data = {
  key: string;
  cells: {
    key: string;
    value: string | number | boolean;
    customCell?: React.ReactNode;
  }[];
};
