import { cn } from "@/lib/utils";

export type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={cn("w-[90vw] max-w-7xl mx-auto", className)}>
      {children}
    </div>
  );
};
