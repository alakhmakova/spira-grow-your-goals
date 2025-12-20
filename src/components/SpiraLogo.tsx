import { cn } from "@/lib/utils";

interface SpiraLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  animated?: boolean;
}

const sizes = {
  sm: { icon: 24, text: "text-lg" },
  md: { icon: 32, text: "text-xl" },
  lg: { icon: 48, text: "text-3xl" },
  xl: { icon: 64, text: "text-4xl" },
};

export const SpiraLogo = ({ 
  size = "md", 
  showText = true, 
  className,
  animated = false 
}: SpiraLogoProps) => {
  const { icon, text } = sizes[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(animated && "animate-float")}
      >
        <defs>
          {/* Main gradient - purple to pink */}
          <linearGradient id="spiraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="50%" stopColor="hsl(var(--accent))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </linearGradient>
          
          {/* Accent gradient - blue to cyan */}
          <linearGradient id="spiraAccent" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--accent))" />
            <stop offset="100%" stopColor="hsl(var(--primary-light))" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background circle with gradient */}
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="url(#spiraGradient)"
          opacity="0.15"
        />

        {/* Outer spiral ring */}
        <path
          d="M32 8C45.3 8 56 18.7 56 32C56 45.3 45.3 56 32 56"
          stroke="url(#spiraGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          filter="url(#glow)"
        />
        
        {/* Middle spiral ring */}
        <path
          d="M32 56C22.6 56 15 48.4 15 39C15 29.6 22.6 22 32 22"
          stroke="url(#spiraAccent)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Inner spiral ring */}
        <path
          d="M32 22C38.6 22 44 27.4 44 34C44 40.6 38.6 46 32 46"
          stroke="url(#spiraGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Center spiral */}
        <path
          d="M32 46C28 46 25 43 25 39C25 35 28 32 32 32"
          stroke="url(#spiraAccent)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Core dot with glow */}
        <circle
          cx="32"
          cy="32"
          r="4"
          fill="url(#spiraGradient)"
          filter="url(#glow)"
        />
        
        {/* Inner core */}
        <circle
          cx="32"
          cy="32"
          r="2"
          className="fill-primary-foreground"
        />

        {/* Accent orbs */}
        <circle cx="48" cy="18" r="3" fill="url(#spiraAccent)" opacity="0.8" />
        <circle cx="16" cy="48" r="2.5" fill="url(#spiraGradient)" opacity="0.7" />
        <circle cx="52" cy="40" r="2" fill="url(#spiraAccent)" opacity="0.6" />
      </svg>
      
      {showText && (
        <span className={cn(
          "font-display font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary",
          text
        )}>
          Spira
        </span>
      )}
    </div>
  );
};

export const SpiraSproutIcon = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="sproutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--primary))" />
        <stop offset="100%" stopColor="hsl(var(--accent))" />
      </linearGradient>
    </defs>
    
    {/* Spiral growth icon */}
    <path
      d="M12 20C12 20 12 14 12 12"
      stroke="url(#sproutGradient)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 12C12 12 8 10 6 6C8 4 12 5 12 8"
      fill="url(#sproutGradient)"
    />
    <path
      d="M12 8C12 8 16 7 18 4C20 6 17 10 12 10"
      className="fill-accent"
    />
    <circle cx="12" cy="6" r="2" fill="url(#sproutGradient)" />
  </svg>
);
