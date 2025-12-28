import * as React from "react";
import { cn } from "@/lib/utils";

interface DoneToggleProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

// Length of the checkmark SVG path for animation
const CHECKMARK_PATH_LENGTH = 24;

const DoneToggle = React.forwardRef<HTMLButtonElement, DoneToggleProps>(
  ({ checked = false, onCheckedChange, disabled = false, className }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          "group relative flex items-center justify-center w-12 h-12 cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        {/* Checkbox container */}
        <div
          className={cn(
            "relative w-8 h-8 rounded-md border-2 transition-all duration-300 flex items-center justify-center overflow-hidden",
            checked
              ? "bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-500 shadow-lg shadow-emerald-500/50 scale-110"
              : "bg-background border-muted-foreground/30 hover:border-muted-foreground/50 hover:scale-105"
          )}
        >
          {/* Checkmark SVG with animation */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={cn(
              "w-5 h-5 text-white transition-all duration-300",
              checked ? "opacity-100 scale-100" : "opacity-0 scale-0"
            )}
          >
            <path
              d="M4 12.6111L8.92308 17.5L20 6.5"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                "transition-all duration-300",
                checked ? "animate-checkmark" : ""
              )}
              style={{
                strokeDasharray: CHECKMARK_PATH_LENGTH,
                strokeDashoffset: checked ? 0 : CHECKMARK_PATH_LENGTH,
              }}
            />
          </svg>

          {/* Ripple effect on check */}
          {checked && (
            <div className="absolute inset-0 rounded-md bg-emerald-400 animate-ping opacity-75" />
          )}
        </div>

        {/* Particles effect */}
        {checked && (
          <>
            <div className="absolute top-0 left-0 w-1 h-1 bg-emerald-400 rounded-full animate-particle-1" />
            <div className="absolute top-0 right-0 w-1 h-1 bg-teal-400 rounded-full animate-particle-2" />
            <div className="absolute bottom-0 left-0 w-1 h-1 bg-emerald-300 rounded-full animate-particle-3" />
            <div className="absolute bottom-0 right-0 w-1 h-1 bg-teal-300 rounded-full animate-particle-4" />
          </>
        )}
      </button>
    );
  }
);

DoneToggle.displayName = "DoneToggle";

export { DoneToggle };
