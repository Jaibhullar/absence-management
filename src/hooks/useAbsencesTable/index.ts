import type { FormattedAbsence } from "@/types";
import { getAbsences } from "@/services/getAbsences";
import { formatAbsences } from "@/utils/formatAbsences";
import { parseDate } from "@/utils/parseDate";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { getFilteredAbsences } from "@/utils/getFilteredAbsences";

export const ABSENCES_QUERY_KEY = ["absences"];

export type useAbsencesTableResponse = {
  absences: FormattedAbsence[];
  absencesError: string | null;
  absencesLoading: boolean;
  filterAbsencesByUser: (userId: string, name: string) => void;
  clearFilterAbsencesByUser: () => void;
  filteredUser: { name: string; id: string } | null;
};

export const useAbsencesTable = (): useAbsencesTableResponse => {
  const [filteredUser, setFilteredUser] = useState<{
    name: string;
    id: string;
  } | null>(null);

  const {
    data: absences = [],
    isError,
    isLoading: absencesLoading,
  } = useQuery({
    queryKey: ABSENCES_QUERY_KEY,
    queryFn: async () => {
      const resp = await getAbsences();
      return formatAbsences(resp).sort(
        (a: FormattedAbsence, b: FormattedAbsence) => {
          return parseDate(b.startDate) - parseDate(a.startDate);
        },
      );
    },
  });

  const filteredAbsences = useMemo(() => {
    const result = getFilteredAbsences(absences, filteredUser);
    return result;
  }, [absences, filteredUser]);

  const filterAbsencesByUser = (userId: string, name: string) => {
    setFilteredUser({
      id: userId,
      name,
    });
  };

  const clearFilterAbsencesByUser = () => {
    setFilteredUser(null);
  };

  return {
    absences: filteredAbsences,
    absencesError: isError ? "There was an error fetching absences..." : null,
    absencesLoading,
    filterAbsencesByUser,
    clearFilterAbsencesByUser,
    filteredUser,
  };
};
