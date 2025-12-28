import { useState } from "react";
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
import { CircularProgress } from "@/components/ui/progress";
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
  const [showMenu, setShowMenu] = useState(false);
  
  const notStartedCount = goal.targets.filter(t => t.progress === 0).length;
  const inProgressCount = goal.targets.filter(t => t.progress > 0 && t.progress < 100).length;
  const completedCount = goal.targets.filter(t => t.progress === 100).length;

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

  const cardContent = (
    <div 
      className={cn(
        "relative h-full min-h-[200px] bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-grab active:cursor-grabbing border border-border/50",
        goal.progress === 100 && "border-success/30",
        goal.goalType === "north-star" && "ring-1 ring-amber-400/50",
        goalOverdueStatus === "overdue" && goal.progress < 100 && "border-destructive/40"
      )}
    >
      {/* Rounded Header Section */}
      <div 
        className={cn(
          "relative h-24 transition-all duration-500 ease-out",
          getHeaderColor(),
          "group-hover:h-28"
        )}
        style={{
          borderBottomLeftRadius: "50% 30px",
          borderBottomRightRadius: "50% 30px",
        }}
      >
        {/* Progress Circle in Header */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 transition-transform duration-500 group-hover:scale-110">
          <CircularProgress 
            value={goal.progress} 
            size={56} 
            strokeWidth={5}
            labelClassName="text-xs font-bold"
            className={cn(
              "bg-card rounded-full shadow-lg",
              goal.progress === 100 ? "[&_circle:last-child]:stroke-success" : "[&_circle:last-child]:stroke-primary"
            )}
          />
        </div>

        {/* Goal Type Badge */}
        {goal.goalType && typeStyles && (
          <div className="absolute top-2 left-2">
            {(() => {
              const Icon = goalTypeIcons[goal.goalType];
              return (
                <Badge 
                  variant="outline"
                  className={cn(
                    "text-[10px] font-medium gap-1 border-transparent bg-card/80 backdrop-blur-sm shadow-sm",
                    goal.goalType === "north-star" && "animate-pulse"
                  )}
                >
                  <Icon size={10} />
                  {typeStyles.label}
                </Badge>
              );
            })()}
          </div>
        )}

        {/* Menu Button */}
        <div className={cn(
          "absolute top-2 right-2 z-10 transition-opacity duration-200",
          showMenu ? "opacity-100" : "opacity-0"
        )}>
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

        {/* Overdue indicator */}
        {goalOverdueStatus === "overdue" && goal.progress < 100 && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2">
            <Badge variant="destructive" className="text-[9px] gap-1 px-1.5 py-0.5">
              <AlertTriangle className="h-2.5 w-2.5" />
              Overdue
            </Badge>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 pt-4 flex flex-col">
        {/* Goal Name */}
        <h3 className="font-display text-sm font-semibold leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {goal.name}
        </h3>

        {/* Achievability & Due Date Row */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <span>Achievability:</span>
            <span className={cn("font-bold", getAchievabilityColor(goal.achievability))}>
              {goal.achievability}/10
            </span>
          </div>
          {goal.dueDate && (
            <div className={cn(
              "flex items-center gap-1",
              goalOverdueStyles?.textColor || ""
            )}>
              <Calendar className="h-2.5 w-2.5" />
              <span>{format(goal.dueDate, "MMM d")}</span>
            </div>
          )}
        </div>

        {/* Targets badges */}
        <div className="flex flex-wrap gap-1 mt-auto">
          {notStartedCount > 0 && (
            <Badge variant="notStarted" className="text-[8px] px-1.5 py-0">
              <TargetIcon className="h-2 w-2 mr-0.5" />
              {notStartedCount}
            </Badge>
          )}
          {inProgressCount > 0 && (
            <Badge variant="inProgress" className="text-[8px] px-1.5 py-0">
              <TargetIcon className="h-2 w-2 mr-0.5" />
              {inProgressCount}
            </Badge>
          )}
          {completedCount > 0 && (
            <Badge variant="completed" className="text-[8px] px-1.5 py-0">
              <TargetIcon className="h-2 w-2 mr-0.5" />
              {completedCount}
            </Badge>
          )}
          {goal.targets.length === 0 && (
            <Badge variant="muted" className="text-[8px] px-1.5 py-0">
              No targets
            </Badge>
          )}
        </div>

        {/* Has overdue targets indicator */}
        {hasOverdueTargets && (
          <div className="flex items-center gap-1 mt-2 text-[9px] text-destructive">
            <AlertTriangle className="h-2.5 w-2.5" />
            <span>Has overdue targets</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="group"
      draggable
      onDragStart={handleDragStart}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      <Link to={`/goal/${goal.id}`} draggable={false}>
        {cardContent}
      </Link>
    </div>
  );
};
