import { useAbsencesTable } from "@/hooks/useAbsencesTable";
import { Spinner } from "../ui/spinner";
import { DataTable } from "./DataTable";
import { columns } from "./Columns";

export const AbsencesTable = () => {
  const { absences, loading, error } = useAbsencesTable();

  if (loading) {
    return <Spinner className="mx-auto text-primary size-12"></Spinner>;
  }
  if (error) {
    return <div className="text-destructive text-center">{error}</div>;
  }

  return (
    <>
      <DataTable columns={columns} data={absences}></DataTable>
    </>
  );
};
