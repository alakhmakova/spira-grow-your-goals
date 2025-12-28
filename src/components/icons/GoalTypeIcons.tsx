import { SVGProps, HTMLAttributes } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

interface FontIconProps extends HTMLAttributes<HTMLElement> {
  size?: number;
  className?: string;
}

// Short-term: Lightning bolt - quick action
export const ShortTermIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
  </svg>
);

// Long-term: Milestone flag - journey marker
export const LongTermIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M4 21V4" />
    <path d="M4 4l12 3-12 6" />
  </svg>
);

// North Star: Star icon from icofont
export const NorthStarIcon = ({ size = 16, className, ...props }: FontIconProps) => (
  <i 
    className={`icofont-star-alt-1 ${className || ''}`}
    style={{ fontSize: `${size}px`, lineHeight: 1 }}
    {...props}
  />
);

// Dream: Full night icon from icofont
export const DreamIcon = ({ size = 16, className, ...props }: FontIconProps) => (
  <i 
    className={`icofont-full-night ${className || ''}`}
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
