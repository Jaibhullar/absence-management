import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertTriangleIcon } from "lucide-react";

export type ConflictTooltipProps = {
  testId?: string;
};

export const ConflictTooltip = ({ testId }: ConflictTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost">
          <AlertTriangleIcon
            className="text-destructive mx-auto size-5"
            data-testid={testId}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Absence Conflict</p>
      </TooltipContent>
    </Tooltip>
  );
};
