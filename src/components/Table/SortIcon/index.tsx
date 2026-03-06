import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon } from "lucide-react";
import type { HeaderColumn, SortConfig } from "../types";

export const SortIcon = ({
  sortConfig,
  column,
}: {
  sortConfig?: SortConfig;
  column: HeaderColumn;
}) => {
  if (!sortConfig || sortConfig.key !== column.key)
    return (
      <ArrowUpDown className="h-4 w-4" aria-label="Not sorted"></ArrowUpDown>
    );
  if (sortConfig.direction === "asc")
    return <ArrowUpIcon className="h-4 w-4" aria-label="Sorted ascending" />;
  return <ArrowDownIcon className="h-4 w-4" aria-label="Sorted descending" />;
};
