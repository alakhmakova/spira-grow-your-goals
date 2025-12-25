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
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(animated && "animate-float")}
      >
        <defs>
          {/* Spiral gradient - vibrant green progression */}
          <linearGradient id="spiralGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(175, 60%, 35%)" />
            <stop offset="33%" stopColor="hsl(165, 65%, 45%)" />
            <stop offset="66%" stopColor="hsl(155, 70%, 48%)" />
            <stop offset="100%" stopColor="hsl(85, 70%, 50%)" />
          </linearGradient>
          
          {/* Inner spiral gradient */}
          <linearGradient id="innerSpiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(85, 70%, 50%)" />
            <stop offset="50%" stopColor="hsl(155, 70%, 48%)" />
            <stop offset="100%" stopColor="hsl(175, 60%, 35%)" />
          </linearGradient>

          {/* Center dot gradient */}
          <radialGradient id="centerGlow">
            <stop offset="0%" stopColor="hsl(85, 75%, 55%)" />
            <stop offset="100%" stopColor="hsl(155, 70%, 45%)" />
          </radialGradient>
        </defs>

        {/* Outer spiral arm - flowing from center outward */}
        <path
          d="M32 32
             C32 28, 34 24, 38 22
             C42 20, 46 20, 50 24
             C54 28, 56 34, 54 40
             C52 46, 46 50, 40 50
             C32 50, 24 46, 18 40
             C12 34, 10 26, 12 18
             C14 12, 20 8, 28 8
             C36 8, 44 12, 50 18"
          stroke="url(#spiralGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Inner spiral arm - creating depth */}
        <path
          d="M32 32
             C32 30, 30 28, 28 28
             C26 28, 24 30, 24 32
             C24 34, 26 36, 28 36
             C32 36, 36 34, 38 30"
          stroke="url(#innerSpiralGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Center growth point */}
        <circle
          cx="32"
          cy="32"
          r="3"
          fill="url(#centerGlow)"
          opacity="0.9"
        />
        
        {/* Small accent dots along spiral for dynamic feel */}
        <circle cx="38" cy="22" r="1.5" fill="hsl(85, 70%, 50%)" opacity="0.6" />
        <circle cx="50" cy="24" r="1.5" fill="hsl(155, 70%, 48%)" opacity="0.6" />
        <circle cx="54" cy="40" r="1.5" fill="hsl(165, 65%, 45%)" opacity="0.6" />
        <circle cx="28" cy="28" r="1.5" fill="hsl(175, 60%, 35%)" opacity="0.6" />
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
      <linearGradient id="miniSpiral" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(175, 60%, 35%)" />
        <stop offset="50%" stopColor="hsl(165, 65%, 45%)" />
        <stop offset="100%" stopColor="hsl(85, 70%, 50%)" />
      </linearGradient>
    </defs>
    
    {/* Mini spiral path */}
    <path
      d="M12 12
         C12 10, 13 9, 14 9
         C16 9, 17 10, 17 12
         C17 14, 16 16, 14 16
         C11 16, 8 14, 7 11
         C6 9, 7 6, 9 5
         C11 4, 14 5, 16 7"
      stroke="url(#miniSpiral)"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    
    {/* Center point */}
    <circle
      cx="12"
      cy="12"
      r="1.5"
      fill="hsl(85, 70%, 50%)"
      opacity="0.8"
    />
  </svg>
);
