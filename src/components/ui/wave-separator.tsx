import { cn } from "@/lib/utils";

interface WaveSeparatorProps {
  className?: string;
  variant?: "primary" | "forest" | "accent" | "muted";
  flip?: boolean;
}

export const WaveSeparator = ({ 
  className, 
  variant = "primary",
  flip = false 
}: WaveSeparatorProps) => {
  const variants = {
    primary: "fill-primary",
    forest: "fill-forest",
    accent: "fill-accent",
    muted: "fill-muted",
  };

  return (
    <div className={cn("w-full overflow-hidden", flip && "rotate-180", className)}>
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
          className={cn(variants[variant])}
        />
      </svg>
    </div>
  );
};

export const WaveSectionWrapper = ({ 
  children, 
  className,
  variant = "primary",
  showTopWave = true,
  showBottomWave = true,
}: { 
  children: React.ReactNode; 
  className?: string;
  variant?: "primary" | "forest" | "accent" | "muted";
  showTopWave?: boolean;
  showBottomWave?: boolean;
}) => {
  const bgVariants = {
    primary: "bg-primary text-primary-foreground",
    forest: "bg-forest text-forest-foreground",
    accent: "bg-accent text-accent-foreground",
    muted: "bg-muted text-muted-foreground",
  };

  return (
    <div className="relative">
      {showTopWave && <WaveSeparator variant={variant} />}
      <div className={cn(bgVariants[variant], "py-8 sm:py-12", className)}>
        {children}
      </div>
      {showBottomWave && <WaveSeparator variant={variant} flip />}
    </div>
  );
};
