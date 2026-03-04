import { useAbsencesTable } from "@/hooks/useAbsencesTable";
import { FilteringByUserBanner } from "./FilteringByUserBanner";
import { Table, type Data, type HeaderColumn } from "../Table";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import type { AbsenceSortDirection } from "@/hooks/useSortTable";
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon } from "lucide-react";
import { getAbsenceConflict } from "@/services/getAbsenceConflict";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertTriangleIcon } from "lucide-react";

type SortableCellProps = {
  sortAbsencesBy: () => void;
  text: string;
  absenceSortDirection?: AbsenceSortDirection;
};

const SortableCell = ({
  sortAbsencesBy,
  text,
  absenceSortDirection,
}: SortableCellProps) => {
  return (
    <button
      className="mx-auto flex items-center gap-2 justify-center cursor-pointer"
      onClick={sortAbsencesBy}
      aria-label={`Sort by ${text}`}
    >
      <span>{text}</span>
      <SortIcon absenceSortDirection={absenceSortDirection}></SortIcon>
    </button>
  );
};

const SortIcon = ({
  absenceSortDirection,
}: {
  absenceSortDirection?: AbsenceSortDirection;
}) => {
  if (!absenceSortDirection)
    return (
      <ArrowUpDown className="h-4 w-4" aria-label="Not sorted"></ArrowUpDown>
    );
  if (absenceSortDirection === "asc")
    return <ArrowUpIcon className="h-4 w-4" aria-label="Sorted ascending" />;
  return <ArrowDownIcon className="h-4 w-4" aria-label="Sorted descending" />;
};

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
    <div className="absolute -right-6">
      {conflictsLoading && (
        <Spinner className="justify-self-center text-primary" />
      )}
      {!conflictsLoading && conflicts === null && (
        <span className="text-destructive">Unknown</span>
      )}
      {!conflictsLoading && conflicts && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" aria-label="Absence has conflict">
              <AlertTriangleIcon className="text-destructive mx-auto size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Absence Conflict</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

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

  const tableData: Data[] = absences.map((absence) => ({
    key: absence.id.toString(),
    cells: [
      {
        customCell: (
          <>
            <Button
              variant="link"
              className="cursor-pointer text-[#0000EE] relative"
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
      { value: absence.startDate },
      { value: absence.endDate },
      { value: absence.days },
      { value: absence.type },
      {
        customCell: absence.approved ? (
          <Badge className="bg-green-300 text-green-800">Approved</Badge>
        ) : (
          <Badge className="bg-amber-300 text-amber-800">Pending</Badge>
        ),
      },
    ],
  }));

  const tableHeaderColumns: HeaderColumn[] = [
    {
      key: "employeeName",
      customCell: (
        <SortableCell
          sortAbsencesBy={() => sortAbsencesBy("employeeName")}
          text="Employee"
          absenceSortDirection={
            absenceSortKey === "employeeName" ? absenceSortDirection : undefined
          }
        />
      ),
    },
    {
      key: "startDate",
      customCell: (
        <SortableCell
          sortAbsencesBy={() => sortAbsencesBy("startDate")}
          text="Start Date"
          absenceSortDirection={
            absenceSortKey === "startDate" ? absenceSortDirection : undefined
          }
        />
      ),
    },
    {
      key: "endDate",
      customCell: (
        <SortableCell
          sortAbsencesBy={() => sortAbsencesBy("endDate")}
          text="End Date"
          absenceSortDirection={
            absenceSortKey === "endDate" ? absenceSortDirection : undefined
          }
        />
      ),
    },
    {
      key: "days",
      customCell: (
        <SortableCell
          sortAbsencesBy={() => sortAbsencesBy("days")}
          text="Days"
          absenceSortDirection={
            absenceSortKey === "days" ? absenceSortDirection : undefined
          }
        />
      ),
    },
    {
      key: "type",
      customCell: (
        <SortableCell
          sortAbsencesBy={() => sortAbsencesBy("type")}
          text="Type"
          absenceSortDirection={
            absenceSortKey === "type" ? absenceSortDirection : undefined
          }
        />
      ),
    },
    {
      key: "approved",
      customCell: (
        <SortableCell
          sortAbsencesBy={() => sortAbsencesBy("approved")}
          text="Status"
          absenceSortDirection={
            absenceSortKey === "approved" ? absenceSortDirection : undefined
          }
        />
      ),
    },
  ];

  return (
    <section className="flex flex-col max-h-[calc(100vh-116px)] overflow-hidden pt-4 pb-12 rounded-md space-y-6">
      <div className="shrink-0">
        {filteredUser && (
          <FilteringByUserBanner
            filteredUser={filteredUser}
            clearFilterAbsencesByUser={clearFilterAbsencesByUser}
          />
        )}
      </div>
      <div className="flex-1 min-h-0 overflow-auto border rounded-md">
        <Table
          data={tableData}
          headerColumns={tableHeaderColumns}
          loading={absencesLoading}
          error={!!absencesError}
          errorMessage={absencesError ?? undefined}
          ariaLabel="Employee absences"
          frontendPagination
        ></Table>
      </div>
    </section>
  );
};
