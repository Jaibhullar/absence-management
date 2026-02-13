import { getAbsences } from "@/services/getAbsences";
import type { FormattedAbsence } from "@/types";
import { formatAbsences } from "@/utils/formatAbsences";
import { parseDate } from "@/utils/parseDate";
import { useEffect, useState } from "react";
import {
  useSortTable,
  type SortDirection,
  type SortKey,
} from "../useSortTable";

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
    const fetchAbsences = async () => {
      setLoading(true);
      setError(null);

      try {
        const resp = await getAbsences();

        const formattedAbsences = formatAbsences(resp).sort((a, b) => {
          return parseDate(b.startDate) - parseDate(a.startDate);
        });

        setAbsences(formattedAbsences);
      } catch {
        setError("There was an error fetching absences...");
      } finally {
        setLoading(false);
      }
    };
    fetchAbsences();
  }, []);

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
