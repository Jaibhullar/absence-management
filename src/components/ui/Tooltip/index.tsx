import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

export type TooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: TooltipPlacement;
  delayDuration?: number;
  className?: string;
};

const testIds = {
  tooltip: "tooltip",
};

const placementStyles: Record<TooltipPlacement, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowStyles: Record<TooltipPlacement, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-x-transparent border-b-transparent",
  bottom:
    "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 border-x-transparent border-t-transparent",
  left: "left-full top-1/2 -translate-y-1/2 border-l-gray-900 border-y-transparent border-r-transparent",
  right:
    "right-full top-1/2 -translate-y-1/2 border-r-gray-900 border-y-transparent border-l-transparent",
};

export const Tooltip = ({
  children,
  content,
  placement = "top",
  delayDuration = 0,
  className,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = () => {
    if (delayDuration > 0) {
      timeoutRef.current = setTimeout(() => setIsVisible(true), delayDuration);
    } else {
      setIsVisible(true);
    }
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && content && (
        <div
          data-testid={testIds.tooltip}
          role="tooltip"
          className={cn(
            "absolute z-50 px-3 py-1.5 text-xs text-white bg-gray-900 rounded-md whitespace-nowrap",
            "animate-in fade-in-0 zoom-in-95 duration-150",
            placementStyles[placement],
            className,
          )}
        >
          {content}
          <span
            className={cn("absolute w-0 h-0 border-4", arrowStyles[placement])}
          />
        </div>
      )}
    </div>
  );
};

Tooltip.testIds = testIds;
