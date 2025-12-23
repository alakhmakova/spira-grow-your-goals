import { cn } from "@/lib/utils";

interface WaveSeparatorProps {
  className?: string;
  variant?: "primary" | "forest" | "accent" | "muted" | "mint" | "background";
  flip?: boolean;
  shape?: "wave" | "curve" | "slant" | "zigzag" | "arch";
}

export const WaveSeparator = ({ 
  className, 
  variant = "primary",
  flip = false,
  shape = "wave"
}: WaveSeparatorProps) => {
  const variants = {
    primary: "fill-primary",
    forest: "fill-forest",
    accent: "fill-accent",
    muted: "fill-muted",
    mint: "fill-mint",
    background: "fill-background",
  };

  // Different shape paths for variety
  const shapes = {
    // Gentle smooth curve
    curve: "M0,80 Q360,20 720,80 T1440,80 L1440,120 L0,120 Z",
    // Simple diagonal slant
    slant: "M0,40 L1440,80 L1440,120 L0,120 Z",
    // Subtle zigzag
    zigzag: "M0,60 L360,80 L720,60 L1080,80 L1440,60 L1440,120 L0,120 Z",
    // Rounded arch
    arch: "M0,120 Q360,40 720,60 T1440,120 L1440,120 L0,120 Z",
    // Original wave (kept for backward compatibility)
    wave: "M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z",
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
          d={shapes[shape]}
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
  topShape = "wave",
  bottomShape = "wave",
}: { 
  children: React.ReactNode; 
  className?: string;
  variant?: "primary" | "forest" | "accent" | "muted" | "mint" | "background";
  showTopWave?: boolean;
  showBottomWave?: boolean;
  topShape?: "wave" | "curve" | "slant" | "zigzag" | "arch";
  bottomShape?: "wave" | "curve" | "slant" | "zigzag" | "arch";
}) => {
  const bgVariants = {
    primary: "bg-primary text-primary-foreground",
    forest: "bg-forest text-forest-foreground",
    accent: "bg-accent text-accent-foreground",
    muted: "bg-muted text-muted-foreground",
    mint: "bg-mint text-mint-foreground",
    background: "bg-background text-foreground",
  };

  return (
    <div className="relative">
      {showTopWave && <WaveSeparator variant={variant} shape={topShape} />}
      <div className={cn(bgVariants[variant], "py-8 sm:py-12", className)}>
        {children}
      </div>
      {showBottomWave && <WaveSeparator variant={variant} shape={bottomShape} flip />}
    </div>
  );
};
