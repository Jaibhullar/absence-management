import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FormattedAbsence } from "@/types";
import { AlertTriangleIcon } from "lucide-react";

export type TableRowProps = {
  absence: FormattedAbsence;
};

export const TableRow = ({ absence }: TableRowProps) => {
  return (
    <tr className="text-center border-t border-b transition-colors hover:bg-secondary text-sm">
      <td className="py-3">
        <Button variant="link" className="cursor-pointer text-[#0000EE]">
          {absence.employeeName}
        </Button>
      </td>
      <td className="py-3">{absence.startDate}</td>
      <td className="py-3">{absence.endDate}</td>
      <td className="py-3">{absence.type}</td>
      <td className="py-3">
        {absence.approved ? (
          <Badge className="bg-green-300 text-green-800">Approved</Badge>
        ) : (
          <Badge className="bg-amber-300 text-amber-800">Pending</Badge>
        )}
      </td>
      <td className="py-3">
        {absence.conflicts && (
          <AlertTriangleIcon className="text-destructive mx-auto" />
        )}
      </td>
    </tr>
  );
};
