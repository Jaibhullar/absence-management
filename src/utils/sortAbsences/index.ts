import type { FormattedAbsence, AbsenceSortConfig } from "@/types";

export const sortAbsences = (
  absences: FormattedAbsence[],
  sortConfig: AbsenceSortConfig,
): FormattedAbsence[] => {
  const { key: sortKey, order: sortOrder } = sortConfig;
  const sortedAbsences = [...absences].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (a[sortKey] > b[sortKey]) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });
  return sortedAbsences;
};
