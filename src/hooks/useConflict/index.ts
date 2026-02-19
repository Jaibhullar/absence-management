import { getAbsenceConflict } from "@/services/getAbsenceConflict";
import { useQuery } from "@tanstack/react-query";

export type useConflictResponse = {
  conflicts: boolean | null;
  loading: boolean;
  error: boolean;
};

export const useConflict = (absenceId: number): useConflictResponse => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["conflict", absenceId],
    queryFn: () => getAbsenceConflict(absenceId),
  });

  return {
    conflicts: isError ? null : (data?.conflicts ?? null),
    loading: isLoading,
    error: isError,
  };
};
