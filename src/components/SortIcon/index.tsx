import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon } from "lucide-react";
const testIds = {
  unsortedIcon: "unsorted-icon",
  ascendingIcon: "ascending-icon",
  descendingIcon: "descending-icon",
};

export type SortConfig = {
  key: string;
  order: "asc" | "desc";
};

export const SortIcon = ({
  sortConfig,
  columnKey,
}: {
  sortConfig?: SortConfig | null;
  columnKey: string;
}) => {
  if (!sortConfig || sortConfig.key !== columnKey)
    return (
      <ArrowUpDown
        className="h-4 w-4"
        aria-label="Not sorted"
        data-testid={testIds.unsortedIcon}
      ></ArrowUpDown>
    );
  if (sortConfig.order === "asc")
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
