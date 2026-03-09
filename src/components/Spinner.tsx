import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

export type SpinnerProps = React.SVGAttributes<SVGSVGElement> & {
  size?: "sm" | "default" | "lg";
};

const sizeStyles = {
  sm: "size-3",
  default: "size-4",
  lg: "size-6",
};

export const Spinner = ({
  className,
  size = "default",
  ...props
}: SpinnerProps) => {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("animate-spin", sizeStyles[size], className)}
      {...props}
    />
  );
};
