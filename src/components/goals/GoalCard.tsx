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
  Star,
  AlertTriangle
} from "lucide-react";
import { Goal } from "@/types/goal";
import { Card, CardContent } from "@/components/ui/card";
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
  const [isFlipped, setIsFlipped] = useState(false);
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

  const cardContent = (
    <Card 
      variant="interactive"
      className={cn(
        "relative h-full min-h-[280px] transition-all duration-500 cursor-grab active:cursor-grabbing",
        goal.progress === 100 && "border-success/30 shadow-success-glow",
        goal.goalType === "north-star" && "ring-2 ring-amber-400/50",
        goalOverdueStatus === "overdue" && goal.progress < 100 && "border-destructive/50 shadow-[0_0_20px_-5px_hsl(var(--destructive)/0.3)]",
        goalOverdueStatus === "due-today" && goal.progress < 100 && "border-warning/50",
        goalOverdueStatus === "due-soon" && goal.progress < 100 && "border-amber-500/30"
      )}
    >
      {/* Menu overlay on hover */}
      <div className={cn(
        "absolute top-3 right-3 z-10 transition-opacity duration-200",
        showMenu ? "opacity-100" : "opacity-0"
      )}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
            <Button variant="ghost" size="icon-sm" className="h-8 w-8 bg-card/80 backdrop-blur-sm">
              <MoreVertical className="h-4 w-4" />
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

      <CardContent className="p-5 flex flex-col h-full">
        {/* Goal Type Badge */}
        {goal.goalType && typeStyles && (
          <div className="mb-3">
            <Badge 
              className={cn(
                "text-xs font-medium",
                typeStyles.bgColor,
                typeStyles.color,
                goal.goalType === "north-star" && "animate-pulse"
              )}
            >
              {goal.goalType === "north-star" && <Star className="h-3 w-3 mr-1 fill-current" />}
              {typeStyles.icon} {typeStyles.label}
            </Badge>
          </div>
        )}

        {/* Progress Circle */}
        <div className="flex items-start gap-4 mb-4">
          <CircularProgress 
            value={goal.progress} 
            size={64} 
            strokeWidth={6}
            labelClassName="text-sm"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-semibold leading-tight line-clamp-3 group-hover:text-primary transition-colors">
              {goal.name}
            </h3>
          </div>
        </div>

        {/* Achievability */}
        <div className={cn(
          "flex items-center gap-2 mb-3 transition-all duration-300",
          showMenu ? "translate-x-0 opacity-100" : "translate-x-2 opacity-70"
        )}>
          <span className="text-xs text-muted-foreground">Achievability:</span>
          <span className={cn(
            "font-bold text-lg",
            getAchievabilityColor(goal.achievability)
          )}>
            {goal.achievability}/10
          </span>
        </div>

        {/* Dates */}
        <div className="flex flex-col gap-1 mb-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>Created: {format(goal.createdAt, "MMM d, yyyy")}</span>
          </div>
          {goal.dueDate && (
            <div className={cn(
              "flex items-center gap-2",
              goalOverdueStyles?.textColor || "text-primary"
            )}>
              {goalOverdueStatus === "overdue" && goal.progress < 100 ? (
                <AlertTriangle className="h-3 w-3" />
              ) : (
                <Calendar className="h-3 w-3" />
              )}
              <span className="font-medium">
                {goalOverdueStyles && goal.progress < 100 
                  ? `${goalOverdueStyles.label}: ${format(goal.dueDate, "MMM d, yyyy")}`
                  : `Due: ${format(goal.dueDate, "MMM d, yyyy")}`
                }
              </span>
            </div>
          )}
          {hasOverdueTargets && (
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-3 w-3" />
              <span className="font-medium">Has overdue targets</span>
            </div>
          )}
        </div>

        {/* Targets badges */}
        <div className="mt-auto flex flex-wrap gap-2">
          {notStartedCount > 0 && (
            <Badge variant="notStarted" className="text-[10px]">
              <TargetIcon className="h-3 w-3 mr-1" />
              {notStartedCount} not started
            </Badge>
          )}
          {inProgressCount > 0 && (
            <Badge variant="inProgress" className="text-[10px]">
              <TargetIcon className="h-3 w-3 mr-1" />
              {inProgressCount} in progress
            </Badge>
          )}
          {completedCount > 0 && (
            <Badge variant="completed" className="text-[10px]">
              <TargetIcon className="h-3 w-3 mr-1" />
              {completedCount} completed
            </Badge>
          )}
          {goal.targets.length === 0 && (
            <Badge variant="muted" className="text-[10px]">
              No targets yet
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div
      className="group perspective-1000"
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
