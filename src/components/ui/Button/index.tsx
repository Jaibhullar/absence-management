import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "ghost" | "link";
type ButtonSize = "default" | "icon-sm";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantStyles: Record<ButtonVariant, string> = {
  default: "bg-primary text-white hover:bg-primary/90",
  outline: "border border-primary text-primary hover:bg-gray-100",
  ghost: "text-primary hover:bg-gray-100",
  link: "text-[#0000EE] underline-offset-4 hover:underline",
};

const sizeStyles: Record<ButtonSize, string> = {
  default: "h-9 px-4 py-2 text-sm",
  "icon-sm": "size-8 p-1.5",
};

const testIds = {
  button: "button",
};

export const Button = ({
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}: ButtonProps) => (
  <button
    data-testid={testIds.button}
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
Button.testIds = testIds;
