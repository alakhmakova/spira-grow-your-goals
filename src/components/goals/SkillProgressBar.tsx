import { cn } from "@/lib/utils";

interface SkillProgressBarProps {
  progress: number;
  startLabel: string;
  endLabel: string;
  showTooltip?: boolean;
  className?: string;
}

export const SkillProgressBar = ({
  progress,
  startLabel,
  endLabel,
  showTooltip = true,
  className,
}: SkillProgressBarProps) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  return (
    <div className={cn("w-full", className)}>
      {/* Labels */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
        <span>{startLabel}</span>
        <span>{endLabel}</span>
      </div>
      
      {/* Progress bar */}
      <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out",
            clampedProgress >= 100 ? "bg-success" : "bg-primary"
          )}
          style={{ 
            width: `${clampedProgress}%`,
            animation: "skill-progress 0.4s ease-in-out forwards",
          }}
        />
        
        {/* Tooltip */}
        {showTooltip && clampedProgress > 0 && (
          <div
            className={cn(
              "absolute -top-7 transform -translate-x-1/2 px-1.5 py-0.5 rounded text-[10px] font-medium text-white z-10",
              clampedProgress >= 100 ? "bg-success" : "bg-primary"
            )}
            style={{ left: `${clampedProgress}%` }}
          >
            {clampedProgress}%
            {/* Arrow */}
            <div 
              className={cn(
                "absolute left-1/2 -bottom-1 w-2 h-2 transform -translate-x-1/2 rotate-45",
                clampedProgress >= 100 ? "bg-success" : "bg-primary"
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};
