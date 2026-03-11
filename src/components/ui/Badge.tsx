import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link"
  | "success"
  | "warning";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-primary text-white",
  secondary: "bg-gray-100 text-gray-900",
  destructive: "bg-red-500 text-white",
  outline: "border border-gray-300 text-gray-900 bg-transparent",
  ghost: "bg-transparent text-gray-900",
  link: "text-[#0000EE] underline-offset-4 hover:underline bg-transparent",
  success: "bg-green-500/60 text-white",
  warning: "bg-yellow-500/60 text-white",
};

export const Badge = ({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      variantStyles[variant],
      className,
    )}
    {...props}
  >
    {children}
  </span>
);
