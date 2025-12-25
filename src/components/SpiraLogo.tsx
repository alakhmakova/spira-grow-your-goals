import { cn } from "@/lib/utils";

interface SpiraLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  animated?: boolean;
}

const sizes = {
  sm: { icon: 28, text: "text-lg", letterSpacing: "tracking-widest" },
  md: { icon: 36, text: "text-xl", letterSpacing: "tracking-widest" },
  lg: { icon: 52, text: "text-3xl", letterSpacing: "tracking-[0.2em]" },
  xl: { icon: 72, text: "text-4xl", letterSpacing: "tracking-[0.25em]" },
};

export const SpiraLogo = ({ 
  size = "md", 
  showText = true, 
  className,
  animated = false 
}: SpiraLogoProps) => {
  const { icon, text, letterSpacing } = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(animated && "animate-float")}
      >
        <defs>
          {/* Gradient for checkmark - teal to lime matching site theme */}
          <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(175, 60%, 35%)" />
            <stop offset="50%" stopColor="hsl(155, 70%, 45%)" />
            <stop offset="100%" stopColor="hsl(85, 70%, 50%)" />
          </linearGradient>
        </defs>

        {/* Circle */}
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="url(#checkGradient)"
          strokeWidth="2"
          fill="none"
        />

        {/* Checkmark */}
        <path
          d="M8 12L11 15L16 9"
          stroke="url(#checkGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      
      {showText && (
        <span className={cn(
          "font-display font-bold bg-clip-text text-transparent",
          "bg-gradient-to-r from-primary via-accent to-lime",
          text,
          letterSpacing
        )}>
          Spira
        </span>
      )}
    </div>
  );
};

export const SpiraSproutIcon = ({ className, size = 18 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="miniCheck" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(175, 60%, 35%)" />
        <stop offset="50%" stopColor="hsl(155, 70%, 45%)" />
        <stop offset="100%" stopColor="hsl(85, 70%, 50%)" />
      </linearGradient>
    </defs>
    
    {/* Circle */}
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="url(#miniCheck)"
      strokeWidth="2"
      fill="none"
    />
    
    {/* Checkmark */}
    <path
      d="M8 12L11 15L16 9"
      stroke="url(#miniCheck)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);
