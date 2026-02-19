import { cn } from "@/lib/utils";

export type SectionContainerProps = {
  children: React.ReactNode;
  className?: string;
};

// sets the max width of the section and centers it horizontally
export const SectionContainer = ({
  children,
  className,
}: SectionContainerProps) => {
  return (
    <div className={cn("w-[90vw] max-w-7xl mx-auto", className)}>
      {children}
    </div>
  );
};
