import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FontIconProps extends HTMLAttributes<HTMLElement> {
  size?: number;
}

// Short-term: Bomb icon from icofont
export const ShortTermIcon = ({ size = 16, className, ...props }: FontIconProps) => (
  <i 
    className={cn("icofont-bomb", className)}
    style={{ fontSize: `${size}px`, lineHeight: 1 }}
    {...props}
  />
);

// Long-term: Zigzag icon from icofont
export const LongTermIcon = ({ size = 16, className, ...props }: FontIconProps) => (
  <i 
    className={cn("icofont-zigzag", className)}
    style={{ fontSize: `${size}px`, lineHeight: 1 }}
    {...props}
  />
);

// North Star: Star alt-1 icon from icofont
export const NorthStarIcon = ({ size = 16, className, ...props }: FontIconProps) => (
  <i 
    className={cn("icofont-star-alt-1", className)}
    style={{ fontSize: `${size}px`, lineHeight: 1 }}
    {...props}
  />
);

// Dream: Full night icon from icofont
export const DreamIcon = ({ size = 16, className, ...props }: FontIconProps) => (
  <i 
    className={cn("icofont-full-night", className)}
    style={{ fontSize: `${size}px`, lineHeight: 1 }}
    {...props}
  />
);

export const goalTypeIcons = {
  "short-term": ShortTermIcon,
  "long-term": LongTermIcon,
  "north-star": NorthStarIcon,
  "dream": DreamIcon,
};
