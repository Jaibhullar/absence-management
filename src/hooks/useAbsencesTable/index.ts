import { getAbsenceConflict } from "@/services/getAbsenceConflict";
import { getAbsences } from "@/services/getAbsences";
import type { FormattedAbsence } from "@/types";
import { formatAbsences } from "@/utils/formatAbsences";
import { parseDate } from "@/utils/parseDate";
import { useCallback, useEffect, useState } from "react";
import { useSortTable } from "../useSortTable";

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

  const {
    filterAbsencesByUser,
    clearFilter,
    filteredUser,
    sortBy,
    sortKey,
    sortDirection,
    sortedAndFilteredAbsences,
  } = useSortTable({ absences });

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
