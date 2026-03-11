import { Spinner } from "@/components/ui/Spinner";
import { Tooltip } from "@/components/ui/Tooltip";
import { getAbsenceConflict } from "@/services/getAbsenceConflict";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangleIcon } from "lucide-react";

type AbsenceConflictTooltipProps = {
  absenceId: number;
};

const testIds = {
  unknown: "conflict-unknown",
};

export const AbsenceConflictTooltip = ({
  absenceId,
}: AbsenceConflictTooltipProps) => {
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
        <span className="text-destructive" data-testid={testIds.unknown}>
          Unknown
        </span>
      )}
      {!conflictsLoading && conflicts && (
        <Tooltip content={<p>Absence Conflict</p>}>
          <AlertTriangleIcon className="text-destructive mx-auto size-5" />
        </Tooltip>
      )}
    </div>
  );
};

AbsenceConflictTooltip.testIds = testIds;
