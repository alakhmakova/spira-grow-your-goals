import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: "default" | "success" | "warning" | "nature"
  showLabel?: boolean
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant = "default", showLabel = false, ...props }, ref) => {
  const variants = {
    default: "bg-primary",
    success: "gradient-progress",
    warning: "bg-warning",
    nature: "bg-gradient-to-r from-primary to-accent",
  }

  const isComplete = value === 100

  return (
    <div className="relative">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-3 w-full overflow-hidden rounded-full bg-muted",
          isComplete && "shadow-success-glow",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 transition-all duration-500 ease-out rounded-full",
            isComplete ? "gradient-progress" : variants[variant]
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      {showLabel && (
        <span className={cn(
          "absolute right-0 -top-6 text-sm font-medium",
          isComplete ? "text-success" : "text-muted-foreground"
        )}>
          {value}%
        </span>
      )}
    </div>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

// Circular Progress Component
interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
  showLabel?: boolean
  labelClassName?: string
}

const CircularProgress = ({
  value,
  size = 80,
  strokeWidth = 8,
  className,
  showLabel = true,
  labelClassName,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference
  const isComplete = value === 100

  // Color based on progress percentage
  const getProgressColor = () => {
    if (value === 100) return "stroke-success"
    if (value >= 75) return "stroke-primary"
    if (value >= 50) return "stroke-accent"
    if (value >= 25) return "stroke-warning"
    return "stroke-muted-foreground"
  }

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-muted"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={cn(
            "transition-all duration-500 ease-out",
            getProgressColor()
          )}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            filter: isComplete ? "drop-shadow(0 0 8px hsl(var(--success) / 0.5))" : undefined
          }}
        />
      </svg>
      {showLabel && (
        <span className={cn(
          "absolute font-semibold",
          isComplete ? "text-success" : "text-foreground",
          labelClassName
        )}>
          {Math.round(value)}%
        </span>
      )}
    </div>
  )
}

export { Progress, CircularProgress }
