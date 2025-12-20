import * as React from "react";
import { cn } from "@/lib/utils";

interface LeafToggleProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: {
    toggle: "w-14 h-7",
    circle: "w-6 h-6",
    circleMargin: "calc(3.5rem - 0.375rem - 1.5rem)",
    leafScale: 0.5,
  },
  md: {
    toggle: "w-20 h-10",
    circle: "w-8 h-8",
    circleMargin: "calc(5rem - 0.375rem - 2rem)",
    leafScale: 0.7,
  },
  lg: {
    toggle: "w-28 h-14",
    circle: "w-12 h-12",
    circleMargin: "calc(7rem - 0.375rem - 3rem)",
    leafScale: 1,
  },
};

const LeafToggle = React.forwardRef<HTMLButtonElement, LeafToggleProps>(
  ({ checked = false, onCheckedChange, disabled = false, className, size = "md" }, ref) => {
    const sizeConfig = sizes[size];
    const uniqueId = React.useId();

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          "relative flex items-center rounded-full p-[3px] transition-all duration-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          sizeConfig.toggle,
          checked
            ? "bg-primary shadow-glow"
            : "bg-muted shadow-sm",
          className
        )}
      >
        {/* The circle with leaves */}
        <span
          className={cn(
            "relative flex items-center justify-center rounded-full transition-all duration-400 ease-in-out",
            sizeConfig.circle,
            checked
              ? "bg-background"
              : "bg-primary"
          )}
          style={{
            marginLeft: checked ? sizeConfig.circleMargin : "0",
          }}
        >
          {/* Leaves SVG - styled like Spira logo */}
          <svg
            viewBox="0 0 40 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute transition-all duration-300"
            style={{
              width: `${28 * sizeConfig.leafScale}px`,
              height: `${32 * sizeConfig.leafScale}px`,
              bottom: `${75 * sizeConfig.leafScale}%`,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <defs>
              {/* Gradients matching the toggle background state */}
              <linearGradient id={`leafGradientLeft-${uniqueId}`} x1="0%" y1="100%" x2="100%" y2="0%">
                {checked ? (
                  <>
                    <stop offset="0%" stopColor="hsl(175, 60%, 35%)" />
                    <stop offset="50%" stopColor="hsl(165, 60%, 50%)" />
                    <stop offset="100%" stopColor="hsl(155, 70%, 45%)" />
                  </>
                ) : (
                  <>
                    <stop offset="0%" stopColor="hsl(40, 20%, 96%)" />
                    <stop offset="50%" stopColor="hsl(160, 15%, 94%)" />
                    <stop offset="100%" stopColor="hsl(40, 15%, 90%)" />
                  </>
                )}
              </linearGradient>
              <linearGradient id={`leafGradientRight-${uniqueId}`} x1="100%" y1="100%" x2="0%" y2="0%">
                {checked ? (
                  <>
                    <stop offset="0%" stopColor="hsl(175, 55%, 45%)" />
                    <stop offset="50%" stopColor="hsl(155, 60%, 50%)" />
                    <stop offset="100%" stopColor="hsl(85, 70%, 50%)" />
                  </>
                ) : (
                  <>
                    <stop offset="0%" stopColor="hsl(40, 20%, 96%)" />
                    <stop offset="50%" stopColor="hsl(160, 15%, 94%)" />
                    <stop offset="100%" stopColor="hsl(40, 10%, 92%)" />
                  </>
                )}
              </linearGradient>
            </defs>

            {/* Left leaf */}
            <path
              d="M20 28
                 C16 24, 8 18, 2 10
                 C6 8, 12 10, 16 14
                 C19 18, 20 24, 20 28"
              fill={`url(#leafGradientLeft-${uniqueId})`}
              className="transition-all duration-300"
            />
            
            {/* Left leaf vein */}
            <path
              d="M19 25 C14 19, 8 13, 4 10"
              stroke={checked ? "hsl(170, 50%, 22%)" : "hsl(40, 10%, 75%)"}
              strokeWidth="0.8"
              strokeLinecap="round"
              fill="none"
              opacity="0.4"
              className="transition-all duration-300"
            />

            {/* Right leaf */}
            <path
              d="M21 24
                 C25 20, 32 14, 38 8
                 C34 6, 28 8, 24 12
                 C21 16, 21 21, 21 24"
              fill={`url(#leafGradientRight-${uniqueId})`}
              className="transition-all duration-300"
            />

            {/* Right leaf vein */}
            <path
              d="M22 22 C28 16, 34 10, 36 8"
              stroke={checked ? "hsl(175, 60%, 35%)" : "hsl(40, 10%, 75%)"}
              strokeWidth="0.6"
              strokeLinecap="round"
              fill="none"
              opacity="0.35"
              className="transition-all duration-300"
            />
          </svg>
        </span>
      </button>
    );
  }
);

LeafToggle.displayName = "LeafToggle";

export { LeafToggle };
