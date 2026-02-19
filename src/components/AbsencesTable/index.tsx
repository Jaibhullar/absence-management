import { TableContent } from "./TableContent";
import { useAbsencesTable } from "@/hooks/useAbsencesTable";
import { FilteringByUserBanner } from "./FilteringByUserBanner";

export const AbsencesTable = () => {
  const {
    absences,
    absencesLoading,
    absencesError,
    filterAbsencesByUser,
    clearFilterAbsencesByUser,
    filteredUser,
    sortAbsencesBy,
    absenceSortKey,
    absenceSortDirection,
  } = useAbsencesTable();

  return (
    <section className="flex flex-col max-h-[calc(100vh-84px)] overflow-hidden py-12 rounded-md space-y-6">
      <div className="shrink-0 space-y-4">
        <div className="space-y-2 border-b pb-4">
          <h2 className="text-xl font-bold">Employee Absences</h2>
          <p className="text-muted-foreground text-sm">
            View and manage all employee absence requests
          </p>
        </div>
        {filteredUser && (
          <FilteringByUserBanner
            filteredUser={filteredUser}
            clearFilterAbsencesByUser={clearFilterAbsencesByUser}
          />
        )}
      </div>
      <div className="flex-1 min-h-0 overflow-auto border rounded-md">
        <TableContent
          absences={absences}
          absencesLoading={absencesLoading}
          absencesError={absencesError}
          filterAbsencesByUser={filterAbsencesByUser}
          sortAbsencesBy={sortAbsencesBy}
          absenceSortKey={absenceSortKey}
          absenceSortDirection={absenceSortDirection}
        />
      </div>
    </section>
  );
};
