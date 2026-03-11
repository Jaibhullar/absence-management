import { cn } from "@/lib/utils";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export const Skeleton = ({ className, ...props }: SkeletonProps) => (
  <div
    className={cn("bg-gray-200 animate-pulse rounded-md", className)}
    {...props}
  />
);
