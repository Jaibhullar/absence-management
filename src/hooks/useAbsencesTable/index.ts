import type { FormattedAbsence } from "@/types";
import {
  useSortTable,
  type SortDirection,
  type SortKey,
} from "../useSortTable";
import { useAbsences } from "../useAbsences";

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
  const { data: absences = [], isError, isLoading: loading } = useAbsences();

  const {
    filterAbsencesByUser,
    clearFilter,
    filteredUser,
    sortBy,
    sortKey,
    sortDirection,
    sortedAndFilteredAbsences,
  } = useSortTable({ absences });

  return {
    absences: sortedAndFilteredAbsences,
    error: isError ? "There was an error fetching absences..." : null,
    loading,
    filterAbsencesByUser,
    clearFilter,
    filteredUser,
    sortBy,
    sortKey,
    sortDirection,
  };
};
