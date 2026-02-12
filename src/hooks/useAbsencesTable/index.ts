import { getAbsenceConflict } from "@/services/getAbsenceConflict";
import { getAbsences } from "@/services/getAbsences";
import type { FormattedAbsence } from "@/types";
import { formatAbsences } from "@/utils/formatAbsences";
import { parseDate } from "@/utils/parseDate";
import { useCallback, useEffect, useMemo, useState } from "react";

export type SortKey =
  | "employeeName"
  | "startDate"
  | "endDate"
  | "type"
  | "days";
export type SortDirection = "asc" | "desc";

export type useAbsencesTableResponse = {
  absences: FormattedAbsence[];
  error: string | null;
  loading: boolean;
  filterAbsencesByUser: (userId: string, name: string) => void;
  clearFilter: () => void;
  filteredUser: { name: string; id: string } | null;
  sortBy: (key: SortKey) => void;
  sortKey: SortKey | null;
  sortDirection: SortDirection;
};

export const useAbsencesTable = (): useAbsencesTableResponse => {
  const [absences, setAbsences] = useState<FormattedAbsence[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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

  const fetchAbsences = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const resp = await getAbsences();

      let formattedAbsences = formatAbsences(resp).sort((a, b) => {
        return parseDate(b.startDate) - parseDate(a.startDate);
      });
      formattedAbsences = await Promise.all(
        formattedAbsences.map(async (item) => {
          const conflicts = await fetchConflicts(item.id);
          return { ...item, conflicts };
        }),
      );
      setAbsences(formattedAbsences);
    } catch {
      setError("There was an error fetching absences...");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchConflicts = async (absenceId: number) => {
    try {
      const { conflicts } = await getAbsenceConflict(absenceId);
      return conflicts;
    } catch {
      return null;
    }
  };

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

  useEffect(() => {
    fetchAbsences();
  }, [fetchAbsences]);

  return {
    absences: sortedAndFilteredAbsences,
    error,
    loading,
    filterAbsencesByUser,
    clearFilter,
    filteredUser,
    sortBy,
    sortKey,
    sortDirection,
  };
};
