import { useAbsencesTable } from "@/hooks/useAbsencesTable";
import { FilteringByUserBanner } from "./FilteringByUserBanner";
import { Table } from "../Table";
import { getAbsenceConflict } from "@/services/getAbsenceConflict";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangleIcon } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/utils/formatDate";
import type { Data, HeaderColumn } from "../Table/types";
import { Button } from "../Button";
import { Badge } from "../Badge";
import { Spinner } from "../Spinner";
import { Tooltip } from "../Tooltip";

type AbsenceConflictTooltipProps = {
  absenceId: number;
};

const AbsenceConflictTooltip = ({ absenceId }: AbsenceConflictTooltipProps) => {
  const {
    data,
    isLoading: conflictsLoading,
    isError,
  } = useQuery({
    queryKey: ["conflict", absenceId],
    queryFn: () => getAbsenceConflict(absenceId),
  });
  const conflicts = isError ? null : (data?.conflicts ?? null);

  return (
    <div className="absolute -right-5 top-1/2 -translate-y-1/2">
      {conflictsLoading && (
        <Spinner className="justify-self-center text-primary" />
      )}
      {!conflictsLoading && conflicts === null && (
        <span className="text-destructive">Unknown</span>
      )}
      {!conflictsLoading && conflicts && (
        <Tooltip content={<p>Absence Conflict</p>}>
          <AlertTriangleIcon className="text-destructive mx-auto size-5" />
        </Tooltip>
      )}
    </div>
  );
};

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

  const tableData: Data[] = absences.map((absence) => ({
    key: absence.id.toString(),
    cells: [
      {
        key: "employeeName",
        value: absence.employeeName,
        customCell: (
          <>
            <Button
              variant="link"
              className="relative"
              onClick={() => {
                filterAbsencesByUser(absence.userId, absence.employeeName);
              }}
              aria-label={`Filter absences by ${absence.employeeName}`}
            >
              {absence.employeeName}
              <AbsenceConflictTooltip absenceId={absence.id} />
            </Button>
          </>
        ),
      },
      {
        key: "startDate",
        value: absence.startDate,
        displayedValue: formatDate(absence.startDate),
      },
      {
        key: "endDate",
        value: absence.endDate,
        displayedValue: formatDate(absence.endDate),
      },
      { key: "days", value: absence.days, displayedValue: absence.days },
      { key: "type", value: absence.type, displayedValue: absence.type },
      {
        key: "approved",
        value: absence.approved ? "Approved" : "Pending",
        customCell: absence.approved ? (
          <Badge className="bg-green-300 text-green-800">Approved</Badge>
        ) : (
          <Badge className="bg-amber-300 text-amber-800">Pending</Badge>
        ),
      },
    ],
  }));

  const headerColumns: HeaderColumn[] = [
    { key: "employeeName", text: "Employee", sortable: true, filterable: true },
    { key: "startDate", text: "Start Date", sortable: true, filterable: true },
    { key: "endDate", text: "End Date", sortable: true, filterable: true },
    { key: "days", text: "Days", sortable: true, filterable: true },
    { key: "type", text: "Type", sortable: true, filterable: true },
    { key: "approved", text: "Status" },
  ];

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
          headerColumns={headerColumns}
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
