import { getAbsenceConflict } from "@/services/getAbsenceConflict";
import { useEffect, useState } from "react";

export const useConflict = (absenceId: number) => {
  const [conflicts, setConflicts] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConflict = async () => {
      try {
        const { conflicts } = await getAbsenceConflict(absenceId);

        setConflicts(conflicts);
      } catch {
        console.log(`Error fetching conflict for absence ${absenceId}`);
        setConflicts(null);
      } finally {
        setLoading(false);
      }
    };

    fetchConflict();
  }, [absenceId]);

  return { conflicts, loading };
};
