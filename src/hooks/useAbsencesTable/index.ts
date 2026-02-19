import type { FormattedAbsence } from "@/types";
import {
  useSortTable,
  type AbsenceSortDirection,
  type AbsenceSortKey,
} from "../useSortTable";
import { getAbsences } from "@/services/getAbsences";
import { formatAbsences } from "@/utils/formatAbsences";
import { parseDate } from "@/utils/parseDate";
import { useQuery } from "@tanstack/react-query";

export const ABSENCES_QUERY_KEY = ["absences"];

export type useAbsencesTableResponse = {
  absences: FormattedAbsence[];
  absencesError: string | null;
  absencesLoading: boolean;
  filterAbsencesByUser: (userId: string, name: string) => void;
  clearFilterAbsencesByUser: () => void;
  filteredUser: { name: string; id: string } | null;
  sortAbsencesBy: (key: AbsenceSortKey) => void;
  absenceSortKey: AbsenceSortKey | null;
  absenceSortDirection: AbsenceSortDirection;
};

export const useAbsencesTable = (): useAbsencesTableResponse => {
  const {
    data: absences = [],
    isError,
    isLoading: absencesLoading,
  } = useQuery({
    queryKey: ABSENCES_QUERY_KEY,
    queryFn: async () => {
      const resp = await getAbsences();
      return formatAbsences(resp).sort((a, b) => {
        return parseDate(b.startDate) - parseDate(a.startDate);
      });
    },
  });

  const {
    filterAbsencesByUser,
    clearFilterAbsencesByUser,
    filteredUser,
    sortAbsencesBy,
    absenceSortKey,
    absenceSortDirection,
    sortedAndFilteredAbsences,
  } = useSortTable({ absences });

  return {
    absences: sortedAndFilteredAbsences,
    absencesError: isError ? "There was an error fetching absences..." : null,
    absencesLoading,
    filterAbsencesByUser,
    clearFilterAbsencesByUser,
    filteredUser,
    sortAbsencesBy,
    absenceSortKey,
    absenceSortDirection,
  };
};
