import type { FormattedAbsence } from "@/types";
import { parseDate } from "@/utils/parseDate";
import { useMemo, useState } from "react";

export type AbsenceSortKey =
  | "employeeName"
  | "startDate"
  | "endDate"
  | "type"
  | "days";
export type AbsenceSortDirection = "asc" | "desc";

export type useSortTableParams = {
  absences: FormattedAbsence[];
};

export type useSortTableResponse = {
  filterAbsencesByUser: (userId: string, name: string) => void;
  clearFilterAbsencesByUser: () => void;
  filteredUser: { name: string; id: string } | null;
  sortAbsencesBy: (key: AbsenceSortKey) => void;
  absenceSortKey: AbsenceSortKey | null;
  absenceSortDirection: AbsenceSortDirection;
  sortedAndFilteredAbsences: FormattedAbsence[];
};

export const useSortTable = ({
  absences,
}: useSortTableParams): useSortTableResponse => {
  const [filteredUser, setFilteredUser] = useState<{
    name: string;
    id: string;
  } | null>(null);
  const [absenceSortKey, setAbsenceSortKey] = useState<AbsenceSortKey | null>(
    null,
  );
  const [absenceSortDirection, setAbsenceSortDirection] =
    useState<AbsenceSortDirection>("asc");

  const sortedAndFilteredAbsences = useMemo(() => {
    let result = absences.filter(
      (a) => !filteredUser || a.userId === filteredUser.id,
    );

    if (absenceSortKey) {
      result = [...result].sort((a, b) => {
        const aVal = a[absenceSortKey];
        const bVal = b[absenceSortKey];

        if (absenceSortKey === "startDate" || absenceSortKey === "endDate") {
          const aDate = parseDate(aVal.toString());
          const bDate = parseDate(bVal.toString());
          if (aDate < bDate) return absenceSortDirection === "asc" ? -1 : 1;
          if (aDate > bDate) return absenceSortDirection === "asc" ? 1 : -1;
          return 0;
        } else {
          if (aVal < bVal) return absenceSortDirection === "asc" ? -1 : 1;
          if (aVal > bVal) return absenceSortDirection === "asc" ? 1 : -1;
          return 0;
        }
      });
    }

    return result;
  }, [absences, filteredUser, absenceSortKey, absenceSortDirection]);

  const filterAbsencesByUser = (userId: string, name: string) => {
    if (!absences) return;
    setFilteredUser({
      id: userId,
      name,
    });
  };

  const clearFilterAbsencesByUser = () => {
    if (!absences) return;
    setFilteredUser(null);
  };

  const sortAbsencesBy = (key: AbsenceSortKey) => {
    const direction =
      absenceSortKey === key && absenceSortDirection === "asc" ? "desc" : "asc";
    setAbsenceSortKey(key);
    setAbsenceSortDirection(direction);
  };

  return {
    filterAbsencesByUser,
    clearFilterAbsencesByUser,
    filteredUser,
    sortAbsencesBy,
    absenceSortKey,
    absenceSortDirection,
    sortedAndFilteredAbsences,
  };
};
