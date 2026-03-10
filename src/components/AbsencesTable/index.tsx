import { useAbsencesTable } from "@/hooks/useAbsencesTable";
import { FilteringByUserBanner } from "./FilteringByUserBanner";
import { Table } from "../Table";
import {
  mapAbsencesToTableData,
  ABSENCE_TABLE_HEADER_COLUMNS,
} from "@/utils/mapAbsencesToTableData";

export const AbsencesTable = () => {
  const {
    absences,
    absencesLoading,
    absencesError,
    filterAbsencesByUser,
    clearFilterAbsencesByUser,
    filteredUser,
  } = useAbsencesTable();

  const tableData = mapAbsencesToTableData({
    absences,
    onFilterByUser: filterAbsencesByUser,
  });

  return (
    <section className="flex flex-col max-h-[calc(100vh-116px)] overflow-hidden pt-4 pb-12 rounded-md space-y-6">
      {filteredUser && (
        <FilteringByUserBanner
          filteredUser={filteredUser}
          clearFilterAbsencesByUser={clearFilterAbsencesByUser}
        />
      )}
      <div className="flex-1 min-h-0 overflow-auto">
        <Table
          data={tableData}
          headerColumns={[...ABSENCE_TABLE_HEADER_COLUMNS]}
          loading={absencesLoading}
          error={!!absencesError}
          errorMessage={absencesError ?? undefined}
          ariaLabel="Employee absences"
          pagination={{
            mode: "frontend",
            format: "show-more",
            recordsPerPage: 10,
          }}
        />
      </div>
    </section>
  );
};
