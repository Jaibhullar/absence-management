import { getAbsences } from "@/services/getAbsences";
import { formatAbsences } from "@/utils/formatAbsences";
import { parseDate } from "@/utils/parseDate";
import { useQuery } from "@tanstack/react-query";

export const ABSENCES_QUERY_KEY = ["absences"];

export const useAbsences = () => {
  return useQuery({
    queryKey: ABSENCES_QUERY_KEY,
    queryFn: async () => {
      const resp = await getAbsences();
      return formatAbsences(resp).sort((a, b) => {
        return parseDate(b.startDate) - parseDate(a.startDate);
      });
    },
  });
};
