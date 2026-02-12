import type { FormattedAbsence } from "@/types";
import { parseDate } from "@/utils/parseDate";
import { useMemo, useState } from "react";

export type SortKey =
  | "employeeName"
  | "startDate"
  | "endDate"
  | "type"
  | "days";
export type SortDirection = "asc" | "desc";

export type useSortTableParams = {
  absences: FormattedAbsence[];
};

export type useSortTableResponse = {
  filterAbsencesByUser: (userId: string, name: string) => void;
  clearFilter: () => void;
  filteredUser: { name: string; id: string } | null;
  sortBy: (key: SortKey) => void;
  sortKey: SortKey | null;
  sortDirection: SortDirection;
  sortedAndFilteredAbsences: FormattedAbsence[];
};

export const useSortTable = ({
  absences,
}: useSortTableParams): useSortTableResponse => {
  const [filteredUser, setFilteredUser] = useState<{
    name: string;
    id: string;
  } | null>(null);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedAndFilteredAbsences = useMemo(() => {
    let result = absences.filter(
      (a) => !filteredUser || a.userId === filteredUser.id,
    );

    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (sortKey === "startDate" || sortKey === "endDate") {
          const aDate = parseDate(aVal.toString());
          const bDate = parseDate(bVal.toString());
          if (aDate < bDate) return sortDirection === "asc" ? -1 : 1;
          if (aDate > bDate) return sortDirection === "asc" ? 1 : -1;
          return 0;
        } else {
          if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
          if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
          return 0;
        }
      });
    }

    return result;
  }, [absences, filteredUser, sortKey, sortDirection]);

  const filterAbsencesByUser = (userId: string, name: string) => {
    if (!absences) return;
    setFilteredUser({
      id: userId,
      name,
    });
  };

  const clearFilter = () => {
    if (!absences) return;
    setFilteredUser(null);
  };

  const sortBy = (key: SortKey) => {
    const direction =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDirection(direction);
  };

  return {
    filterAbsencesByUser,
    clearFilter,
    filteredUser,
    sortBy,
    sortKey,
    sortDirection,
    sortedAndFilteredAbsences,
  };
};
