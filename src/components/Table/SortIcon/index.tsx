import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon } from "lucide-react";
import type { HeaderColumn, SortConfig } from "../types";

const testIds = {
  unsortedIcon: "unsorted-icon",
  ascendingIcon: "ascending-icon",
  descendingIcon: "descending-icon",
};

export const SortIcon = ({
  sortConfig,
  column,
}: {
  sortConfig?: SortConfig;
  column: HeaderColumn;
}) => {
  if (!sortConfig || sortConfig.key !== column.key)
    return (
      <ArrowUpDown
        className="h-4 w-4"
        aria-label="Not sorted"
        data-testid={testIds.unsortedIcon}
      ></ArrowUpDown>
    );
  if (sortConfig.direction === "asc")
    return (
      <ArrowUpIcon
        className="h-4 w-4"
        aria-label="Sorted ascending"
        data-testid={testIds.ascendingIcon}
      />
    );
  return (
    <ArrowDownIcon
      className="h-4 w-4"
      aria-label="Sorted descending"
      data-testid={testIds.descendingIcon}
    />
  );
};

SortIcon.testIds = testIds;
