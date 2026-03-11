import type {
  FormattedAbsence,
  PaginationConfig,
  AbsenceSortConfig,
} from "@/types";
import { getAbsences } from "@/services/getAbsences";
import { formatAbsences } from "@/utils/formatAbsences";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { getFilteredAbsences } from "@/utils/getFilteredAbsences";
import { sortAbsences } from "@/utils/sortAbsences";
import { paginateData } from "@/utils/paginateData";

export const ABSENCES_QUERY_KEY = ["absences"];
export const ITEMS_PER_PAGE = 8;

export type useAbsencesTableResponse = {
  // states
  absences: FormattedAbsence[];
  absencesError: string | null;
  absencesLoading: boolean;
  filteredUser: { name: string; id: string } | null;
  sortConfig: AbsenceSortConfig;

  // handlers
  handleFilterAbsencesByUser: (userId: string, name: string) => void;
  handleClearFilterAbsencesByUser: () => void;
  handleSortAbsences: (key: keyof FormattedAbsence) => void;

  // pagination config
  paginationConfig: PaginationConfig;
};

export const useAbsencesTable = (): useAbsencesTableResponse => {
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

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);

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

  // filtering, sorting, and paginating absences
  const absences = useMemo(() => {
    const filteredResult = getFilteredAbsences(rawAbsences, filteredUser);
    const sortedResult = sortAbsences(filteredResult, sortConfig);
    return sortedResult;
  }, [rawAbsences, filteredUser, sortConfig]);

  const numberOfPages = Math.ceil(absences.length / ITEMS_PER_PAGE);

  // handlers
  const handleFilterAbsencesByUser = (userId: string, name: string) => {
    setFilteredUser({
      id: userId,
      name,
    });
    setCurrentPage(1);
  };

  const handleClearFilterAbsencesByUser = () => {
    setFilteredUser(null);
    setCurrentPage(1);
  };

  const handleSortAbsences = (key: keyof FormattedAbsence) => {
    if (sortConfig.key === key) {
      setSortConfig((prevConfig) => ({
        ...prevConfig,
        order: prevConfig.order === "asc" ? "desc" : "asc",
      }));
    } else {
      setSortConfig({
        key,
        order: "asc",
      });
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    const clampedPage = Math.max(1, Math.min(page, numberOfPages));
    setCurrentPage(clampedPage);
  };

  return {
    // states
    absences: paginateData(absences, currentPage, ITEMS_PER_PAGE),
    absencesError: isError ? "There was an error fetching absences..." : null,
    absencesLoading,
    filteredUser,
    sortConfig,

    // handlers
    handleFilterAbsencesByUser,
    handleClearFilterAbsencesByUser,
    handleSortAbsences,

    // pagination config
    paginationConfig: {
      currentPage,
      numberOfPages,
      handlePageChange,
    },
  };
};
