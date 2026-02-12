import { Spinner } from "@/components/ui/spinner";
import { TableRow } from "./TableRow";
import { TableHeader } from "./TableHeader";
import type { FormattedAbsence } from "@/types";
import type { SortKey } from "@/hooks/useAbsencesTable";

export type TableContentProps = {
  absences: FormattedAbsence[];
  loading: boolean;
  error: string | null;
  filterAbsencesByUser: (userId: string, name: string) => void;
  sortBy: (key: SortKey) => void;
};

export const TableContent = ({
  absences,
  loading,
  error,
  filterAbsencesByUser,
  sortBy,
}: TableContentProps) => {
  if (loading) {
    return <Spinner className="mx-auto text-primary size-12"></Spinner>;
  }
  if (error) {
    return <div className="text-destructive text-center">{error}</div>;
  }

  return (
    <table className="w-full border-collapse min-w-225 border-spacing-0">
      <TableHeader sortBy={sortBy} />
      <tbody>
        {absences.map((absence) => {
          return (
            <TableRow
              absence={absence}
              filterAbsenceByUser={filterAbsencesByUser}
            />
          );
        })}
      </tbody>
    </table>
  );
};
