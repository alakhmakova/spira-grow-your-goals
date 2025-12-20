import { GoalType } from "@/types/goal";

export const goalTypeConfig: Record<GoalType, {
  label: string;
  description: string;
}> = {
  "short-term": {
    label: "Short-term",
    description: "Goals achievable within weeks or months",
  },
  "long-term": {
    label: "Long-term",
    description: "Goals spanning months to years",
  },
  "north-star": {
    label: "North Star",
    description: "Your guiding principle goal (only one allowed)",
  },
  "dream": {
    label: "Dream",
    description: "Aspirational, visionary goals",
  },
};

export const getGoalTypeLabel = (type: GoalType): string => {
  return goalTypeConfig[type]?.label || type;
};

export const getGoalTypeStyles = (type: GoalType) => {
  return goalTypeConfig[type] || goalTypeConfig["short-term"];
};
