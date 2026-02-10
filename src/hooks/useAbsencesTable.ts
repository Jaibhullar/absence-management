import { getAbsenceConflict } from "@/services/getAbsenceConflict";
import { getAbsences } from "@/services/getAbsences";
import type { Absence, FormattedAbsence } from "@/types";
import { formatAbsences } from "@/utils/FormatAbsences";
import { parseDate } from "@/utils/parseDate";
import { useEffect, useState } from "react";

export type useAbsencesTableResponse = {
  absences: Absence[];
  error: string | null;
  loading: boolean;
};

export const useAbsencesTable = () => {
  const [absences, setAbsences] = useState<FormattedAbsence[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchAbsences();
  }, []);

  return {
    absences,
    error,
    loading,
  };
};
