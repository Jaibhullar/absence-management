import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FormattedAbsence } from "@/types";
import { ConflictTooltip } from "./ConflictTooltip";
import { useConflict } from "@/hooks/useConflict";
import { Spinner } from "@/components/ui/spinner";

const testIds = {
  employeeName: "employee-name-button",
  badge: "status-badge",
  conflictAlert: "conflict-alert",
};

export type TableRowProps = {
  absence: FormattedAbsence;
  filterAbsenceByUser: (userId: string, name: string) => void;
};

export const TableRow = ({ absence, filterAbsenceByUser }: TableRowProps) => {
  const { conflicts, loading: conflictsLoading } = useConflict(absence.id);
  return (
    <tr className="text-center border-t border-b transition-colors hover:bg-secondary text-sm">
      <td className="py-3">
        <Button
          variant="link"
          className="cursor-pointer text-[#0000EE]"
          onClick={() => {
            filterAbsenceByUser(absence.userId, absence.employeeName);
          }}
          data-testid={testIds.employeeName}
        >
          {absence.employeeName}
        </Button>
      </td>
      <td className="py-3">{absence.startDate}</td>
      <td className="py-3">{absence.endDate}</td>
      <td className="py-3">{absence.days}</td>
      <td className="py-3">{absence.type}</td>
      <td className="py-3">
        {absence.approved ? (
          <Badge
            className="bg-green-300 text-green-800"
            data-testid={testIds.badge}
          >
            Approved
          </Badge>
        ) : (
          <Badge
            className="bg-amber-300 text-amber-800"
            data-testid={testIds.badge}
          >
            Pending
          </Badge>
        )}
      </td>
      <td className="py-3">
        {conflictsLoading && (
          <Spinner className="justify-self-center text-primary" />
        )}
        {!conflictsLoading && conflicts === null && (
          <span className="text-destructive">Unknown</span>
        )}
        {!conflictsLoading && conflicts && (
          <ConflictTooltip testId={testIds.conflictAlert} />
        )}
      </td>
    </tr>
  );
};

TableRow.testIds = testIds;
