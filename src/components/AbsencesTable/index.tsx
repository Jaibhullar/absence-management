import { useAbsencesTable } from "@/hooks/useAbsencesTable";
import { FilteringByUserBanner } from "./FilteringByUserBanner";
import { Table } from "../Table";
import { mapAbsencesToTableData } from "@/utils/mapAbsencesToTableData";
import type { HeaderColumn } from "../Table/types";

export const AbsencesTable = () => {
  const {
    absences,
    absencesLoading,
    absencesError,
    filteredUser,
    sortConfig,
    paginationConfig,
    handleFilterAbsencesByUser,
    handleClearFilterAbsencesByUser,
    handleSortAbsences,
  } = useAbsencesTable();

  const ABSENCE_TABLE_HEADER_COLUMNS: HeaderColumn[] = [
    {
      key: "employeeName",
      text: "Employee",
      sortable: true,
      onSort: () => handleSortAbsences("employeeName"),
      width: "30%",
    },
    {
      key: "startDate",
      text: "Start Date",
      sortable: true,
      onSort: () => handleSortAbsences("startDate"),
      width: "17.5%",
    },
    {
      key: "endDate",
      text: "End Date",
      sortable: true,
      onSort: () => handleSortAbsences("endDate"),
      width: "17.5%",
    },
    {
      key: "days",
      text: "Days",
      sortable: true,
      onSort: () => handleSortAbsences("days"),
      width: "10%",
    },
    {
      key: "type",
      text: "Type",
      sortable: true,
      onSort: () => handleSortAbsences("type"),
      width: "15%",
    },
    { key: "approved", text: "Status", width: "10%" },
  ];

  const tableData = mapAbsencesToTableData({
    absences,
    onFilterByUser: handleFilterAbsencesByUser,
  });

  return (
    <section className="flex flex-col max-h-[calc(100vh-116px)] overflow-hidden pt-4 pb-12 rounded-md space-y-6">
      {filteredUser && (
        <FilteringByUserBanner
          filteredUser={filteredUser}
          clearFilterAbsencesByUser={handleClearFilterAbsencesByUser}
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
          paginationConfig={paginationConfig}
          sortConfig={sortConfig}
        />
      </div>
    </section>
  );
};
