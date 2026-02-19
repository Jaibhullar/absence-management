import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertTriangleIcon } from "lucide-react";

const testIds = {
  conflictIcon: "conflict-icon",
};

export const ConflictTooltip = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost">
          <AlertTriangleIcon
            className="text-destructive mx-auto size-5"
            data-testid={testIds.conflictIcon}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Absence Conflict</p>
      </TooltipContent>
    </Tooltip>
  );
};

ConflictTooltip.testIds = testIds;
