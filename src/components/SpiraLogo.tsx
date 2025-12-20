import { cn } from "@/lib/utils";

interface SpiraLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  animated?: boolean;
}

const sizes = {
  sm: { icon: 28, text: "text-lg" },
  md: { icon: 36, text: "text-xl" },
  lg: { icon: 52, text: "text-3xl" },
  xl: { icon: 72, text: "text-4xl" },
};

export const SpiraLogo = ({ 
  size = "md", 
  showText = true, 
  className,
  animated = false 
}: SpiraLogoProps) => {
  const { icon, text } = sizes[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(animated && "animate-float")}
      >
        <defs>
          {/* Nordic green gradient */}
          <linearGradient id="nordicGreen" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(160, 55%, 25%)" />
            <stop offset="50%" stopColor="hsl(152, 68%, 42%)" />
            <stop offset="100%" stopColor="hsl(168, 75%, 38%)" />
          </linearGradient>
          
          {/* Leaf gradient */}
          <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(152, 68%, 42%)" />
            <stop offset="100%" stopColor="hsl(158, 55%, 65%)" />
          </linearGradient>

          {/* Accent gradient for small leaf */}
          <linearGradient id="leafAccent" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(168, 75%, 38%)" />
            <stop offset="100%" stopColor="hsl(152, 68%, 50%)" />
          </linearGradient>

          {/* Soil/root gradient */}
          <linearGradient id="soilGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(152, 35%, 28%)" />
            <stop offset="100%" stopColor="hsl(160, 45%, 18%)" />
          </linearGradient>

          {/* Soft glow filter */}
          <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Drop shadow for depth */}
          <filter id="leafShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="hsl(160, 40%, 20%)" floodOpacity="0.2"/>
          </filter>
        </defs>

        {/* Abstract soil/ground base - organic Nordic shape */}
        <ellipse
          cx="32"
          cy="56"
          rx="14"
          ry="4"
          fill="url(#soilGradient)"
          opacity="0.4"
        />

        {/* Main stem - slightly curved, organic */}
        <path
          d="M32 54 C32 48, 31 40, 32 32 C33 28, 32 24, 32 20"
          stroke="url(#nordicGreen)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#softGlow)"
        />

        {/* Main leaf - large, flowing Nordic design */}
        <path
          d="M32 28 
             C28 26, 18 22, 12 12
             C14 10, 18 8, 24 10
             C28 12, 30 18, 32 24"
          fill="url(#leafGradient)"
          filter="url(#leafShadow)"
        />
        
        {/* Main leaf vein */}
        <path
          d="M32 26 C28 22, 22 18, 16 12"
          stroke="hsl(160, 55%, 30%)"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        />

        {/* Secondary leaf - opposite side, smaller */}
        <path
          d="M33 34
             C36 32, 44 28, 50 20
             C48 18, 45 17, 40 19
             C36 21, 34 28, 33 32"
          fill="url(#leafAccent)"
          filter="url(#leafShadow)"
        />

        {/* Secondary leaf vein */}
        <path
          d="M34 32 C38 28, 43 24, 47 20"
          stroke="hsl(168, 60%, 28%)"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />

        {/* Small emerging leaf/bud at top */}
        <path
          d="M32 20
             C30 18, 28 14, 30 10
             C32 8, 34 8, 34 10
             C36 14, 34 18, 32 20"
          fill="url(#nordicGreen)"
          filter="url(#softGlow)"
        />

        {/* Tiny dewdrop accent */}
        <circle
          cx="22"
          cy="16"
          r="1.5"
          fill="hsl(168, 75%, 65%)"
          opacity="0.7"
        />
        
        {/* Second dewdrop */}
        <circle
          cx="42"
          cy="24"
          r="1"
          fill="hsl(158, 55%, 70%)"
          opacity="0.6"
        />
      </svg>
      
      {showText && (
        <span className={cn(
          "font-display font-semibold tracking-tight bg-clip-text text-transparent",
          "bg-gradient-to-r from-forest via-primary to-accent",
          text
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
      <linearGradient id="miniSprout" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(160, 55%, 28%)" />
        <stop offset="100%" stopColor="hsl(152, 68%, 45%)" />
      </linearGradient>
      <linearGradient id="miniLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(152, 68%, 45%)" />
        <stop offset="100%" stopColor="hsl(168, 75%, 42%)" />
      </linearGradient>
    </defs>
    
    {/* Stem */}
    <path
      d="M12 20 C12 16, 12 13, 12 10"
      stroke="url(#miniSprout)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    
    {/* Left leaf */}
    <path
      d="M12 12 C10 10, 6 8, 5 4 C7 4, 9 5, 10 7 C11 9, 12 11, 12 12"
      fill="url(#miniLeaf)"
    />
    
    {/* Right leaf */}
    <path
      d="M12 8 C14 7, 17 5, 19 3 C19 5, 17 7, 15 8 C13 9, 12 8, 12 8"
      fill="url(#miniSprout)"
    />
    
    {/* Top bud */}
    <ellipse
      cx="12"
      cy="6"
      rx="1.5"
      ry="2"
      fill="url(#miniLeaf)"
    />
  </svg>
);
