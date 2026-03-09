import { Button } from "@/components/Button";
import type { HeaderColumn } from "../types";

const testIds = {
  clearFiltersButton: "clear-filters-button",
  filterInputContainer: "filter-input-container",
};

export type TableFiltersProps = {
  filterableColumns: HeaderColumn[];
  filterConfig: { [key: string]: string };
  onFilterChange: (colKey: string, value: string) => void;
  onClearFilters: () => void;
};

export const TableFilters = ({
  filterableColumns,
  filterConfig,
  onFilterChange,
  onClearFilters,
}: TableFiltersProps) => {
  if (filterableColumns.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap gap-3 items-end">
      {filterableColumns.map((col) => (
        <div
          className="flex flex-col gap-y-1 text-sm"
          key={col.key}
          data-testid={testIds.filterInputContainer}
        >
          <label htmlFor={`filter-${col.key}`} className="font-semibold">
            {col.text}
          </label>
          <input
            type="text"
            id={`filter-${col.key}`}
            value={filterConfig[col.key] || ""}
            placeholder={`Filter by ${col.text}`}
            onChange={(e) => onFilterChange(col.key, e.target.value)}
            className="border rounded px-3 py-2"
            aria-label={`Filter by ${col.text}`}
          />
        </div>
      ))}
      <Button
        variant="destructive"
        disabled={Object.keys(filterConfig).length === 0}
        onClick={onClearFilters}
        data-testid={testIds.clearFiltersButton}
      >
        Clear Filters
      </Button>
    </div>
  );
};

TableFilters.testIds = testIds;
