import type { Data, FilterConfig } from "../../types";

export const filterData = (
  data: Data[],
  filterConfig: FilterConfig,
): Data[] => {
  if (Object.keys(filterConfig).length === 0) {
    return data;
  }

  return data.filter((row) => {
    return Object.entries(filterConfig).every(([columnKey, filterValue]) => {
      const cell = row.cells.find((cell) => cell.key === columnKey);

      if (!cell) return false;

      const cellValue = cell.value;
      const cellDisplayValue = cell.displayedValue;
      const lowerFilterValue = filterValue.toLowerCase();

      const matchesValue = cellValue
        ?.toString()
        .toLowerCase()
        .includes(lowerFilterValue);

      const matchesDisplayValue = cellDisplayValue
        ?.toString()
        .toLowerCase()
        .includes(lowerFilterValue);

      return matchesValue || matchesDisplayValue;
    });
  });
};
