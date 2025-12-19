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
        {/* Pot/Base */}
        <ellipse
          cx="32"
          cy="56"
          rx="14"
          ry="4"
          className="fill-earth"
        />
        <path
          d="M20 52C20 52 22 60 32 60C42 60 44 52 44 52"
          className="stroke-earth"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Main Stem */}
        <path
          d="M32 52C32 52 32 40 32 28"
          className="stroke-primary"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            strokeDasharray: animated ? "30" : "none",
            strokeDashoffset: animated ? "0" : "none",
          }}
        />
        
        {/* Left Leaf */}
        <path
          d="M32 38C32 38 22 36 18 28C14 20 20 14 28 18C28 18 24 30 32 38Z"
          className="fill-primary"
          opacity="0.9"
        />
        
        {/* Right Leaf */}
        <path
          d="M32 28C32 28 40 24 46 16C52 8 48 4 40 8C40 8 36 20 32 28Z"
          className="fill-accent"
          opacity="0.85"
        />
        
        {/* Sprout Top */}
        <path
          d="M32 28C32 28 30 20 32 12C34 20 32 28 32 28Z"
          className="fill-primary"
        />
        
        {/* Small Curl */}
        <path
          d="M32 12C32 12 36 8 38 10"
          className="stroke-accent"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Highlight dots */}
        <circle cx="24" cy="28" r="1.5" className="fill-primary-foreground" opacity="0.5" />
        <circle cx="40" cy="14" r="1.5" className="fill-primary-foreground" opacity="0.5" />
      </svg>
      
      {showText && (
        <span className={cn(
          "font-display font-semibold tracking-tight text-foreground",
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
    <path
      d="M12 22V12"
      className="stroke-primary"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 12C12 12 8 10 6 6C4 2 7 0 10 2C10 2 9 8 12 12Z"
      className="fill-primary"
    />
    <path
      d="M12 8C12 8 16 6 18 2C20 -2 17 -3 14 -1C14 -1 15 5 12 8Z"
      className="fill-accent"
    />
  </svg>
);
