import { cn } from "@/lib/utils";

type ButtonVariant =
  | "default"
  | "outline"
  | "destructive"
  | "secondary"
  | "ghost"
  | "link";
type ButtonSize =
  | "default"
  | "xs"
  | "sm"
  | "lg"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantStyles: Record<ButtonVariant, string> = {
  default: "bg-primary text-white hover:bg-primary/90",
  outline: "border border-primary text-primary hover:bg-gray-100",
  destructive: "bg-red-500 text-white hover:bg-red-600",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  ghost: "text-primary hover:bg-gray-100",
  link: "text-[#0000EE] underline-offset-4 hover:underline",
};

const sizeStyles: Record<ButtonSize, string> = {
  default: "h-9 px-4 py-2 text-sm",
  xs: "h-6 px-2 py-1 text-xs",
  sm: "h-8 px-3 py-1.5 text-sm",
  lg: "h-10 px-5 py-3 text-lg",
  icon: "size-9 p-2",
  "icon-xs": "size-6 p-1",
  "icon-sm": "size-8 p-1.5",
  "icon-lg": "size-10 p-3",
};

export const Button = ({
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md cursor-pointer font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
