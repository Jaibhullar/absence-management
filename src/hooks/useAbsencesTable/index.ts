import { getAbsenceConflict } from "@/services/getAbsenceConflict";
import { getAbsences } from "@/services/getAbsences";
import type { FormattedAbsence } from "@/types";
import { formatAbsences } from "@/utils/FormatAbsences";
import { parseDate } from "@/utils/parseDate";
import { useEffect, useRef, useState } from "react";

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
  filteredUser: string | null;
  sortBy: (key: SortKey) => void;
};

export const useAbsencesTable = (): useAbsencesTableResponse => {
  const [absences, setAbsences] = useState<FormattedAbsence[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filteredUser, setFilteredUser] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const absencesRef = useRef<null | FormattedAbsence[]>(null);

  const fetchAbsences = async () => {
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
      absencesRef.current = formattedAbsences;
    } catch {
      setError("There was an error fetching absences...");
    } finally {
      setLoading(false);
    }
  };

  const fetchConflicts = async (absenceId: number) => {
    try {
      const { conflicts } = await getAbsenceConflict(absenceId);
      return conflicts;
    } catch {
      return false;
    }
  };

  const filterAbsencesByUser = (userId: string, name: string) => {
    if (!absencesRef.current) return [];
    setAbsences(
      absencesRef.current.filter((absence) => absence.userId === userId),
    );
    setFilteredUser(name);
  };

  const clearFilter = () => {
    if (!absencesRef.current) return [];
    setAbsences(absencesRef.current);
    setFilteredUser(null);
  };

  const sortBy = (key: SortKey) => {
    const direction =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDirection(direction);

    const sorted = [...absences].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (key === "startDate" || key === "endDate") {
        const aDate = parseDate(aVal.toString());
        const bDate = parseDate(bVal.toString());
        if (aDate < bDate) return direction === "asc" ? -1 : 1;
        if (aDate > bDate) return direction === "asc" ? 1 : -1;
        return 0;
      } else {
        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      }
    });

    setAbsences(sorted);
  };

  useEffect(() => {
    fetchAbsences();
  }, []);

  return {
    absences,
    error,
    loading,
    filterAbsencesByUser,
    clearFilter,
    filteredUser,
    sortBy,
  };
};
