import { getAbsences } from "@/services/getAbsences";
import type { Absence, FormattedAbsence } from "@/types";
import { formatAbsences } from "@/utils/FormatAbsences";
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
      const FormattedAbsences = formatAbsences(resp);
      setAbsences(FormattedAbsences);
    } catch {
      setError("There was an error fetching absences...");
    } finally {
      setLoading(false);
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
