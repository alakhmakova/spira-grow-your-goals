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
          {/* Main gradient - matching app theme: teal to emerald to lime */}
          <linearGradient id="spiraGreen" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="hsl(170, 50%, 22%)" />
            <stop offset="40%" stopColor="hsl(175, 60%, 35%)" />
            <stop offset="70%" stopColor="hsl(155, 70%, 45%)" />
            <stop offset="100%" stopColor="hsl(85, 70%, 50%)" />
          </linearGradient>
          
          {/* Left leaf gradient */}
          <linearGradient id="leftLeafGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(175, 60%, 35%)" />
            <stop offset="50%" stopColor="hsl(165, 60%, 50%)" />
            <stop offset="100%" stopColor="hsl(155, 70%, 45%)" />
          </linearGradient>

          {/* Right leaf gradient */}
          <linearGradient id="rightLeafGradient" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="hsl(175, 55%, 45%)" />
            <stop offset="50%" stopColor="hsl(155, 60%, 50%)" />
            <stop offset="100%" stopColor="hsl(85, 70%, 50%)" />
          </linearGradient>
        </defs>

        {/* Curved soil/stem base line */}
        <path
          d="M12 50 Q32 44, 52 50"
          stroke="url(#spiraGreen)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Main stem - growing up from center */}
        <path
          d="M32 48 C32 42, 32 36, 32 30"
          stroke="url(#spiraGreen)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Left leaf - larger, flowing curve */}
        <path
          d="M32 32
             C28 28, 18 22, 10 14
             C16 12, 22 14, 26 18
             C30 22, 31 28, 32 32"
          fill="url(#leftLeafGradient)"
        />
        
        {/* Left leaf center vein */}
        <path
          d="M31 30 C26 24, 18 18, 13 14"
          stroke="hsl(170, 50%, 22%)"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        />

        {/* Right leaf - smaller, angled */}
        <path
          d="M33 28
             C37 24, 46 18, 54 12
             C50 10, 44 12, 40 16
             C36 20, 34 25, 33 28"
          fill="url(#rightLeafGradient)"
        />

        {/* Right leaf center vein */}
        <path
          d="M34 26 C40 20, 48 14, 52 12"
          stroke="hsl(175, 60%, 35%)"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />
      </svg>
      
      {showText && (
        <span className={cn(
          "font-display font-semibold uppercase bg-clip-text text-transparent",
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
      <linearGradient id="miniSpira" x1="50%" y1="100%" x2="50%" y2="0%">
        <stop offset="0%" stopColor="hsl(170, 50%, 22%)" />
        <stop offset="50%" stopColor="hsl(165, 60%, 50%)" />
        <stop offset="100%" stopColor="hsl(85, 70%, 50%)" />
      </linearGradient>
      <linearGradient id="miniLeafLeft" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(175, 60%, 35%)" />
        <stop offset="100%" stopColor="hsl(155, 70%, 45%)" />
      </linearGradient>
      <linearGradient id="miniLeafRight" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="hsl(175, 55%, 45%)" />
        <stop offset="100%" stopColor="hsl(85, 70%, 50%)" />
      </linearGradient>
    </defs>
    
    {/* Curved base */}
    <path
      d="M5 19 Q12 17, 19 19"
      stroke="url(#miniSpira)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    
    {/* Stem */}
    <path
      d="M12 18 C12 15, 12 12, 12 10"
      stroke="url(#miniSpira)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    
    {/* Left leaf */}
    <path
      d="M12 11 C10 9, 6 6, 4 4 C6 3, 8 4, 10 6 C11 8, 12 10, 12 11"
      fill="url(#miniLeafLeft)"
    />
    
    {/* Right leaf */}
    <path
      d="M12 9 C14 7, 17 5, 20 3 C18 2, 16 3, 14 5 C13 7, 12 8, 12 9"
      fill="url(#miniLeafRight)"
    />
  </svg>
);
