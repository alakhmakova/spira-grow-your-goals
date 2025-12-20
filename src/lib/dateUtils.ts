import { isPast, isToday, differenceInDays } from "date-fns";

export type OverdueStatus = "overdue" | "due-today" | "due-soon" | "on-track" | null;

export const getOverdueStatus = (deadline: Date | undefined): OverdueStatus => {
  if (!deadline) return null;
  
  const now = new Date();
  const daysUntilDue = differenceInDays(deadline, now);
  
  if (isPast(deadline) && !isToday(deadline)) {
    return "overdue";
  }
  if (isToday(deadline)) {
    return "due-today";
  }
  if (daysUntilDue <= 3) {
    return "due-soon";
  }
  return "on-track";
};

export const getOverdueStyles = (status: OverdueStatus) => {
  switch (status) {
    case "overdue":
      return {
        textColor: "text-destructive",
        bgColor: "bg-destructive/10",
        borderColor: "border-destructive/30",
        icon: "🔴",
        label: "Overdue"
      };
    case "due-today":
      return {
        textColor: "text-warning",
        bgColor: "bg-warning/10",
        borderColor: "border-warning/30",
        icon: "🟠",
        label: "Due today"
      };
    case "due-soon":
      return {
        textColor: "text-amber-500",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/30",
        icon: "🟡",
        label: "Due soon"
      };
    default:
      return null;
  }
};
