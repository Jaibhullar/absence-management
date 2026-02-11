import { getAbsenceConflict } from "@/services/getAbsenceConflict";
import { getAbsences } from "@/services/getAbsences";
import type { FormattedAbsence } from "@/types";
import { formatAbsences } from "@/utils/FormatAbsences";
import { parseDate } from "@/utils/parseDate";
import { useEffect, useRef, useState } from "react";

export type useAbsencesTableResponse = {
  absences: FormattedAbsence[];
  error: string | null;
  loading: boolean;
  filterAbsencesByUser: (userId: string, name: string) => void;
  clearFilter: () => void;
  filteredUser: string | null;
};

export const useAbsencesTable = (): useAbsencesTableResponse => {
  const [absences, setAbsences] = useState<FormattedAbsence[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filteredUser, setFilteredUser] = useState<string | null>(null);

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
  };
};
