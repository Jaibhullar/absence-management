import type {
  FormattedAbsence,
  PaginationConfig,
  AbsenceSortConfig,
  FilteredUser,
} from "@/types";
import { getAbsences } from "@/services/getAbsences";
import { formatAbsences } from "@/utils/formatAbsences";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { getFilteredAbsences } from "@/utils/getFilteredAbsences";
import { sortAbsences } from "@/utils/sortAbsences";
import { usePagination } from "@/hooks/usePagination";

export const ABSENCES_QUERY_KEY = ["absences"];

export type UseAbsencesTableResponse = {
  // states
  absences: FormattedAbsence[];
  absencesError: string | null;
  absencesLoading: boolean;
  filteredUser: FilteredUser | null;
  sortConfig: AbsenceSortConfig;

  // handlers
  handleFilterAbsencesByUser: (userId: string, name: string) => void;
  handleClearFilterAbsencesByUser: () => void;
  handleSortAbsences: (key: keyof FormattedAbsence) => void;

  // pagination config
  paginationConfig: PaginationConfig;
};

export const useAbsencesTable = (): UseAbsencesTableResponse => {
  // filtering state
  const [filteredUser, setFilteredUser] = useState<{
    name: string;
    id: string;
  } | null>(null);
  // sorting state
  const [sortConfig, setSortConfig] = useState<AbsenceSortConfig>({
    key: "startDate",
    order: "desc",
  });

  // fetching absences
  const {
    data: rawAbsences = [],
    isError,
    isLoading: absencesLoading,
  } = useQuery({
    queryKey: ABSENCES_QUERY_KEY,
    queryFn: async () => {
      const resp = await getAbsences();
      return formatAbsences(resp);
    },
  });

  // filtering and sorting absences
  const sortedAbsences = useMemo(() => {
    const filteredResult = getFilteredAbsences(rawAbsences, filteredUser);
    return sortAbsences(filteredResult, sortConfig);
  }, [rawAbsences, filteredUser, sortConfig]);

  // pagination
  const { paginatedData, paginationConfig, resetToFirstPage } = usePagination({
    data: sortedAbsences,
  });

  // handlers
  const handleFilterAbsencesByUser = (userId: string, name: string) => {
    setFilteredUser({ id: userId, name });
    resetToFirstPage();
  };

  const handleClearFilterAbsencesByUser = () => {
    setFilteredUser(null);
    resetToFirstPage();
  };

  const handleSortAbsences = (key: keyof FormattedAbsence) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        return {
          ...prevConfig,
          order: prevConfig.order === "asc" ? "desc" : "asc",
        };
      }
      return { key, order: "asc" };
    });
    resetToFirstPage();
  };

  return {
    // states
    absences: paginatedData,
    absencesError: isError ? "There was an error fetching absences..." : null,
    absencesLoading,
    filteredUser,
    sortConfig,

    // handlers
    handleFilterAbsencesByUser,
    handleClearFilterAbsencesByUser,
    handleSortAbsences,

    // pagination config
    paginationConfig,
  };
};
