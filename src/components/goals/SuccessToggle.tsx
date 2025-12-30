import { cn } from "@/lib/utils";

interface SuccessToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export const SuccessToggle = ({
  checked,
  onCheckedChange,
  className,
}: SuccessToggleProps) => {
  return (
    <label className={cn("relative inline-block w-14 h-6 cursor-pointer", className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only peer"
      />
      
      {/* Track */}
      <span
        className={cn(
          "absolute inset-0 transition-all duration-300",
          "rounded-tl-2xl rounded-br-2xl rounded-tr-none rounded-bl-none",
          checked ? "bg-success" : "bg-muted"
        )}
      />
      
      {/* Thumb */}
      <span
        className={cn(
          "absolute h-6 w-5 transition-all duration-300",
          "rounded-tl-2xl rounded-br-2xl rounded-tr-none rounded-bl-none",
          "border-[3px] border-white dark:border-card",
          "left-0 bottom-0",
          checked 
            ? "translate-x-[34px] bg-success shadow-success-glow" 
            : "translate-x-0 bg-white dark:bg-muted"
        )}
      />
      
      {/* Check mark when checked */}
      {checked && (
        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white text-xs font-bold rotate-45 transition-opacity">
          |
        </span>
      )}
    </label>
  );
};
