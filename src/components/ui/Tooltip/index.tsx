import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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

const arrowStyles: Record<TooltipPlacement, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-x-transparent border-b-transparent",
  bottom:
    "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 border-x-transparent border-t-transparent",
  left: "left-full top-1/2 -translate-y-1/2 border-l-gray-900 border-y-transparent border-r-transparent",
  right:
    "right-full top-1/2 -translate-y-1/2 border-r-gray-900 border-y-transparent border-l-transparent",
};

const ARROW_OFFSET = 8;

const getTooltipPosition = (
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  placement: TooltipPlacement,
) => {
  let top = 0;
  let left = 0;

  switch (placement) {
    case "top":
      top = triggerRect.top - tooltipRect.height - ARROW_OFFSET;
      left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
      break;
    case "bottom":
      top = triggerRect.bottom + ARROW_OFFSET;
      left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
      break;
    case "left":
      top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
      left = triggerRect.left - tooltipRect.width - ARROW_OFFSET;
      break;
    case "right":
      top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
      left = triggerRect.right + ARROW_OFFSET;
      break;
  }

  return { top, left };
};

export const Tooltip = ({
  children,
  content,
  placement = "top",
  delayDuration = 0,
  className,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      setPosition(getTooltipPosition(triggerRect, tooltipRect, placement));
    }
  }, [placement]);

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

  useEffect(() => {
    if (isVisible) {
      updatePosition();
    }
  }, [isVisible, updatePosition]);

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible &&
        content &&
        createPortal(
          <div
            ref={tooltipRef}
            data-testid={testIds.tooltip}
            role="tooltip"
            style={{
              top: position.top,
              left: position.left,
            }}
            className={cn(
              "fixed z-50 px-3 py-1.5 text-xs text-white bg-gray-900 rounded-md whitespace-nowrap",
              className,
            )}
          >
            {content}
            <span
              className={cn(
                "absolute w-0 h-0 border-4",
                arrowStyles[placement],
              )}
            />
          </div>,
          document.body,
        )}
    </div>
  );
};

Tooltip.testIds = testIds;
