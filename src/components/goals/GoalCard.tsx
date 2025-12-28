import { Link } from "react-router-dom";
import { format } from "date-fns";
import { 
  MoreVertical, 
  Calendar, 
  Target as TargetIcon, 
  Trash2,
  Pencil,
  Gauge,
  AlertTriangle
} from "lucide-react";
import { Goal } from "@/types/goal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getGoalTypeStyles } from "@/lib/goalTypeUtils";
import { getOverdueStatus, getOverdueStyles } from "@/lib/dateUtils";
import { goalTypeIcons } from "@/components/icons/GoalTypeIcons";

interface GoalCardProps {
  goal: Goal;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onChangeDueDate: (id: string, date: Date | undefined) => void;
  onChangeAchievability: (id: string, value: number) => void;
  onDragStart?: (e: React.DragEvent, goal: Goal) => void;
}

export const GoalCard = ({
  goal,
  onDelete,
  onRename,
  onChangeDueDate,
  onChangeAchievability,
  onDragStart,
}: GoalCardProps) => {
  const getAchievabilityColor = (value: number) => {
    if (value <= 3) return "text-destructive";
    if (value <= 6) return "text-warning";
    return "text-success";
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    onDragStart?.(e, goal);
  };

  const typeStyles = goal.goalType ? getGoalTypeStyles(goal.goalType) : null;
  
  // Check overdue status for goal and its targets
  const goalOverdueStatus = getOverdueStatus(goal.dueDate);
  const goalOverdueStyles = getOverdueStyles(goalOverdueStatus);
  const hasOverdueTargets = goal.targets.some(t => 
    t.deadline && getOverdueStatus(t.deadline) === "overdue" && t.progress < 100
  );

  // Get header color based on goal type or status
  const getHeaderColor = () => {
    if (goal.progress === 100) return "bg-success/20";
    if (goalOverdueStatus === "overdue" && goal.progress < 100) return "bg-destructive/20";
    if (goal.goalType === "north-star") return "bg-amber-100 dark:bg-amber-900/30";
    if (goal.goalType === "dream") return "bg-purple-100 dark:bg-purple-900/30";
    if (goal.goalType === "long-term") return "bg-blue-100 dark:bg-blue-900/30";
    if (goal.goalType === "short-term") return "bg-emerald-100 dark:bg-emerald-900/30";
    return "bg-primary/10";
  };

  // Match overlay color to header but darker
  const getOverlayColorClass = () => {
    if (goal.progress === 100) return "bg-success/70";
    if (goalOverdueStatus === "overdue" && goal.progress < 100) return "bg-destructive/60";
    switch (goal.goalType) {
      case "north-star":
        return "bg-amber-300 dark:bg-amber-700/70";
      case "dream":
        return "bg-purple-300 dark:bg-purple-700/70";
      case "long-term":
        return "bg-blue-300 dark:bg-blue-700/70";
      case "short-term":
        return "bg-emerald-300 dark:bg-emerald-700/70";
      default:
        return "bg-primary/40";
    }
  };

  const cardContent = (
    <div 
      className={cn(
        "relative h-full min-h-[200px] bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-grab active:cursor-grabbing border border-border/50",
        goal.progress === 100 && "border-success/30",
        goal.goalType === "north-star" && "ring-1 ring-amber-400/50",
        goalOverdueStatus === "overdue" && goal.progress < 100 && "border-destructive/40"
      )}
    >
      {/* Rounded Header Section with Progress Bar */}
      <div 
        className={cn(
          "relative transition-all duration-500 ease-out overflow-hidden",
          getHeaderColor(),
          "group-hover:pb-2"
        )}
        style={{
          borderBottomLeftRadius: "50% 20px",
          borderBottomRightRadius: "50% 20px",
        }}
      >
        {/* Header-wide progress fill overlay */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 pointer-events-none transition-all duration-500",
            getOverlayColorClass()
          )}
          style={{ width: `${goal.progress}%` }}
        />
        {/* Header Content */}
        <div className="relative z-10 px-3 pt-3 pb-8">
          {/* Top Row: Goal Type Badge and Menu */}
          <div className="flex items-start justify-between mb-3">
            {/* Goal Type Badge - text only, no icon */}
            {goal.goalType && typeStyles && (
              <Badge 
                variant="outline"
                className={cn(
                  "text-[10px] font-medium border-transparent bg-card/80 backdrop-blur-sm shadow-sm",
                  goal.goalType === "north-star" && "animate-pulse"
                )}
              >
                {typeStyles.label}
              </Badge>
            )}
            
            {/* Menu Button - always visible */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                  <Button variant="ghost" size="icon-sm" className="h-7 w-7 bg-card/80 backdrop-blur-sm shadow-sm">
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.preventDefault()}>
                  <DropdownMenuItem onClick={() => {
                    const newName = prompt("Enter new goal name:", goal.name);
                    if (newName) onRename(goal.id, newName);
                  }}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    const dateStr = prompt("Enter due date (YYYY-MM-DD):", goal.dueDate ? format(goal.dueDate, "yyyy-MM-dd") : "");
                    if (dateStr) {
                      const date = new Date(dateStr);
                      if (!isNaN(date.getTime())) {
                        onChangeDueDate(goal.id, date);
                      }
                    }
                  }}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Change Due Date
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    const value = prompt("Enter achievability (1-10):", goal.achievability.toString());
                    const num = parseInt(value || "");
                    if (num >= 1 && num <= 10) {
                      onChangeAchievability(goal.id, num);
                    }
                  }}>
                    <Gauge className="h-4 w-4 mr-2" />
                    Change Achievability
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete(goal.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Progress Percentage in Center */}
          <div className="flex justify-center mb-2 transition-transform duration-500 group-hover:scale-110">
            <div className="text-4xl font-extrabold">{goal.progress}%</div>
          </div>
        </div>

        {/* Progress bar removed in favor of header-wide overlay */}

        {/* Overdue indicator */}
        {goalOverdueStatus === "overdue" && goal.progress < 100 && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2">
            <Badge variant="destructive" className="text-[9px] gap-1 px-1.5 py-0.5">
              <AlertTriangle className="h-2.5 w-2.5" />
              Overdue
            </Badge>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 pt-3 flex flex-col flex-1">
        {/* Goal Name */}
        <h3 className="font-display text-sm font-semibold leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {goal.name}
        </h3>
        {/* Bottom stats row: Goal Type, Target, Achievability */}
        {(() => {
          const achievabilityValue = goal.achievability ?? 0;
          const totalTargets = goal.targets.length;
          const doneTargets = goal.targets.filter(t => (t.progress ?? 0) >= 100 || t.isCompleted === true).length;
          const pendingTargets = Math.max(totalTargets - doneTargets, 0);
          return (
            <div className="mt-auto">
              <div className="grid grid-cols-3 items-start gap-3 rounded-xl border border-border/40 bg-card/70 p-3 shadow-sm">
                {/* Goal Type */}
                <div>
                  <div className="text-[10px] text-muted-foreground mb-1">
                    {goal.goalType && typeStyles ? typeStyles.label : "Type"}
                  </div>
                  {goal.goalType && (
                    <div className="flex items-center justify-center">
                      {(() => {
                        const Icon = goalTypeIcons[goal.goalType];
                        return <Icon size={24} className="text-foreground" />;
                      })()}
                    </div>
                  )}
                </div>
                {/* Target */}
                <div className="border-l border-border/40 pl-3">
                  <div className="text-[10px] text-muted-foreground mb-1">Targets</div>
                  <div className="text-sm font-semibold leading-tight">
                    {doneTargets} done
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {pendingTargets} not done
                  </div>
                </div>
                {/* Achievability */}
                <div className="border-l border-border/40 pl-3">
                  <div className="text-[10px] text-muted-foreground mb-1">Achievability</div>
                  <div className={cn("text-xl font-extrabold", getAchievabilityColor(goal.achievability))}>
                    {achievabilityValue}/10
                  </div>
                </div>
              </div>
              {/* Overdue targets inline indicator */}
              {hasOverdueTargets && (
                <div className="flex items-center gap-1 mt-2 text-[9px] text-destructive">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  <span>Has overdue targets</span>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );

  return (
    <div
      className="group"
      draggable
      onDragStart={handleDragStart}
    >
      <Link to={`/goal/${goal.id}`} draggable={false}>
        {cardContent}
      </Link>
    </div>
  );
};
