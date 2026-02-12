import { TableTitle } from "./TableTitle";
import { TableContent } from "./TableContent";
import { useAbsencesTable } from "@/hooks/useAbsencesTable";
import { FilteringByUserBanner } from "./FilteringByUserBanner";

export const AbsencesTable = () => {
  const {
    absences,
    loading,
    error,
    filterAbsencesByUser,
    clearFilter,
    filteredUser,
    sortBy,
    sortKey,
    sortDirection,
  } = useAbsencesTable();

  return (
    <section className="flex flex-col max-h-[calc(100vh-200px)] overflow-hidden px-4 py-6 rounded-md space-y-6">
      <div className="shrink-0 space-y-4">
        <TableTitle />
        {filteredUser && (
          <FilteringByUserBanner
            filteredUser={filteredUser}
            clearFilter={clearFilter}
          />
        )}
      </div>
      <div className="flex-1 min-h-0 overflow-auto border rounded-md">
        <TableContent
          absences={absences}
          loading={loading}
          error={error}
          filterAbsencesByUser={filterAbsencesByUser}
          sortBy={sortBy}
          sortKey={sortKey}
          sortDirection={sortDirection}
        />
      </div>
    </section>
  );
};
