import { GoalType } from "@/types/goal";

export const goalTypeConfig: Record<GoalType, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  description: string;
}> = {
  "short-term": {
    label: "Short-term",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    borderColor: "border-blue-300 dark:border-blue-700",
    icon: "⚡",
    description: "Goals achievable within weeks or months",
  },
  "long-term": {
    label: "Long-term",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    borderColor: "border-purple-300 dark:border-purple-700",
    icon: "🎯",
    description: "Goals spanning months to years",
  },
  "north-star": {
    label: "North Star",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    borderColor: "border-amber-300 dark:border-amber-700",
    icon: "⭐",
    description: "Your guiding principle goal (only one allowed)",
  },
  "dream": {
    label: "Dream",
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
    borderColor: "border-pink-300 dark:border-pink-700",
    icon: "✨",
    description: "Aspirational, visionary goals",
  },
};

export const getGoalTypeLabel = (type: GoalType): string => {
  return goalTypeConfig[type]?.label || type;
};

export const getGoalTypeStyles = (type: GoalType) => {
  return goalTypeConfig[type] || goalTypeConfig["short-term"];
};
