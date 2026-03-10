import type { FormattedAbsence } from "@/types";
import type { Data } from "@/components/Table/types";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AbsenceConflictTooltip } from "@/components/AbsencesTable/AbsenceConflictTooltip";

export const ABSENCE_TABLE_HEADER_COLUMNS = [
  {
    key: "employeeName",
    text: "Employee",
    sortable: true,
    filterable: true,
    width: "30%",
  },
  {
    key: "startDate",
    text: "Start Date",
    sortable: true,
    filterable: true,
    width: "17.5%",
  },
  {
    key: "endDate",
    text: "End Date",
    sortable: true,
    filterable: true,
    width: "17.5%",
  },
  { key: "days", text: "Days", sortable: true, width: "10%" },
  { key: "type", text: "Type", sortable: true, filterable: true, width: "15%" },
  { key: "approved", text: "Status", width: "10%" },
];

type MapAbsencesToTableDataOptions = {
  absences: FormattedAbsence[];
  onFilterByUser: (userId: string, name: string) => void;
};

/**
 * Transforms absence data into Table component data format.
 */
export const mapAbsencesToTableData = ({
  absences,
  onFilterByUser,
}: MapAbsencesToTableDataOptions): Data[] => {
  return absences.map((absence) => ({
    key: absence.id.toString(),
    cells: [
      {
        key: "employeeName",
        value: absence.employeeName,
        customCell: (
          <Button
            variant="link"
            className="relative"
            onClick={() => {
              onFilterByUser(absence.userId, absence.employeeName);
            }}
            aria-label={`Filter absences by ${absence.employeeName}`}
          >
            {absence.employeeName}
            <AbsenceConflictTooltip absenceId={absence.id} />
          </Button>
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
};
