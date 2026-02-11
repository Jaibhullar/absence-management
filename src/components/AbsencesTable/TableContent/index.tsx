import { Spinner } from "@/components/ui/spinner";
import { useAbsencesTable } from "@/hooks/useAbsencesTable";
import { TableRow } from "./TableRow";
import { TableHeader } from "./TableHeader";

export const TableContent = () => {
  const {
    absences,
    loading,
    error,
    filterAbsencesByUser,
    clearFilter,
    filteredUser,
  } = useAbsencesTable();

  if (loading) {
    return <Spinner className="mx-auto text-primary size-12"></Spinner>;
  }
  if (error) {
    return <div className="text-destructive text-center">{error}</div>;
  }

  return (
    <table className="w-full border-collapse min-w-225 border-spacing-0">
      <TableHeader />
      <tbody>
        {absences.map((absence) => {
          return <TableRow absence={absence} />;
        })}
      </tbody>
    </table>
  );
};
