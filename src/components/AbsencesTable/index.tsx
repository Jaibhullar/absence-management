import { useAbsencesTable } from "@/hooks/useAbsencesTable";
import { FilteringByUserBanner } from "./FilteringByUserBanner";
import { Table } from "../Table";
import { useState } from "react";
import { Button } from "../ui/Button";
import {
  mapAbsencesToTableData,
  ABSENCE_TABLE_HEADER_COLUMNS,
} from "@/utils/mapAbsencesToTableData";

export const AbsencesTable = () => {
  const [paginationFormat, setPaginationFormat] = useState<
    "show-more" | "next-prev" | "page-numbers"
  >("show-more");

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
      <div className="shrink-0 space-y-3">
        <div className="space-x-3">
          <Button
            variant={paginationFormat === "show-more" ? "default" : "outline"}
            size={"sm"}
            onClick={() => setPaginationFormat("show-more")}
          >
            Show more btn
          </Button>
          <Button
            variant={paginationFormat === "next-prev" ? "default" : "outline"}
            size={"sm"}
            onClick={() => setPaginationFormat("next-prev")}
          >
            Prev-Next btns
          </Button>
          <Button
            variant={
              paginationFormat === "page-numbers" ? "default" : "outline"
            }
            size={"sm"}
            onClick={() => setPaginationFormat("page-numbers")}
          >
            Page Number btns
          </Button>
        </div>
        {filteredUser && (
          <FilteringByUserBanner
            filteredUser={filteredUser}
            clearFilterAbsencesByUser={clearFilterAbsencesByUser}
          />
        )}
      </div>
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
            format: paginationFormat,
            recordsPerPage: 4,
          }}
        />
      </div>
    </section>
  );
};
