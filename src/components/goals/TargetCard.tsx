import { useState } from "react";
import { format } from "date-fns";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Calendar,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Plus,
  AlertTriangle,
  ArrowRightLeft,
} from "lucide-react";
import { Target, Task, GoalOption } from "@/types/goal";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useGoalsContext } from "@/context/GoalsContext";
import { getOverdueStatus, getOverdueStyles } from "@/lib/dateUtils";

interface TargetCardProps {
  target: Target;
  goalId: string;
  style?: React.CSSProperties;
  goalOptions?: GoalOption[];
}

export const TargetCard = ({ target: targetData, goalId, style, goalOptions = [] }: TargetCardProps) => {
  const { updateTarget, deleteTarget, addComment } = useGoalsContext();
  
  const [showTasks, setShowTasks] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

  const handleToggleComplete = () => {
    if (targetData.type === "success") {
      const newProgress = targetData.isCompleted ? 0 : 100;
      updateTarget(goalId, targetData.id, { 
        isCompleted: !targetData.isCompleted,
        progress: newProgress 
      });
    }
  };

  const handleTaskToggle = (taskId: string, isCompleted: boolean) => {
    const tasks = targetData.tasks?.map(t => 
      t.id === taskId ? { ...t, isCompleted } : t
    );
    const completed = tasks?.filter(t => t.isCompleted).length || 0;
    const total = tasks?.length || 1;
    const progress = Math.round((completed / total) * 100);
    
    updateTarget(goalId, targetData.id, { tasks, progress });
  };

  const handleAddTask = () => {
    if (!newTaskName.trim()) return;
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      targetId: targetData.id,
      name: newTaskName.trim(),
      isCompleted: false,
      createdAt: new Date(),
    };
    
    const tasks = [...(targetData.tasks || []), newTask];
    const completed = tasks.filter(t => t.isCompleted).length;
    const progress = Math.round((completed / tasks.length) * 100);
    
    updateTarget(goalId, targetData.id, { tasks, progress });
    setNewTaskName("");
  };

  const handleDeleteTask = (taskId: string) => {
    const tasks = targetData.tasks?.filter(t => t.id !== taskId);
    if (tasks?.length === 0) {
      // If deleting last task, delete the target
      setShowDeleteConfirm(true);
      return;
    }
    const completed = tasks?.filter(t => t.isCompleted).length || 0;
    const total = tasks?.length || 1;
    const progress = Math.round((completed / total) * 100);
    
    updateTarget(goalId, targetData.id, { tasks, progress });
  };

  const getProgressDisplay = () => {
    if (targetData.type === "number") {
      const current = targetData.currentValue || targetData.startValue || 0;
      const start = targetData.startValue || 0;
      const end = targetData.targetValue || 0;
      const range = end - start;
      const progress = range > 0 ? Math.round(((current - start) / range) * 100) : 0;
      return {
        progress: Math.max(0, Math.min(100, progress)),
        display: `${current} / ${end} ${targetData.unit || ""}`.trim(),
      };
    }
    if (targetData.type === "tasks") {
      const completed = targetData.tasks?.filter(t => t.isCompleted).length || 0;
      const total = targetData.tasks?.length || 0;
      return {
        progress: total > 0 ? Math.round((completed / total) * 100) : 0,
        display: `${completed} / ${total} tasks`,
      };
    }
    return { progress: targetData.progress, display: targetData.isCompleted ? "Completed" : "Not done" };
  };

  const { progress, display } = getProgressDisplay();
  const isComplete = progress === 100;
  
  // Overdue status
  const overdueStatus = getOverdueStatus(targetData.deadline);
  const overdueStyles = getOverdueStyles(overdueStatus);

  return (
    <>
      <div 
        className={cn(
          "relative overflow-hidden p-4 rounded-lg border bg-card animate-fade-in transition-all cursor-pointer",
          isComplete && "border-success/30",
          !isComplete && overdueStatus === "overdue" && "border-destructive/50",
          !isComplete && overdueStatus === "due-today" && "border-warning/50",
          !isComplete && overdueStatus === "due-soon" && "border-amber-500/30"
        )}
        style={style}
        onClick={(e) => {
          // Don't open modal if clicking on interactive elements
          const target = e.target as HTMLElement;
          if (target.closest('button') || target.closest('[role="checkbox"]') || target.closest('input') || target.closest('[data-radix-collection-item]')) {
            return;
          }
          if (targetData.type === "number") {
            setShowProgressModal(true);
          }
        }}
      >
        {/* Progress fill background */}
        <div 
          className="absolute inset-0 transition-all duration-500 gradient-progress opacity-30"
          style={{ 
            width: `${progress}%`,
            borderRadius: 'inherit'
          }}
        />
        
        {/* Content overlay */}
        <div className="relative z-10 flex items-start gap-4">
          {/* Toggle for success type only */}
          {targetData.type === "success" && (
            <div className="flex-shrink-0">
              <Switch
                checked={targetData.isCompleted}
                onCheckedChange={handleToggleComplete}
                className="data-[state=checked]:bg-success"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <h4 className={cn(
                  "font-medium text-foreground"
                )}>
                  {targetData.name}
                </h4>
              </div>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span>Created {format(targetData.createdAt, "MMM d")}</span>
              
              {/* Clickable deadline with overdue indicator */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "flex items-center gap-1 hover:underline cursor-pointer transition-colors font-medium",
                      !targetData.deadline && "text-muted-foreground hover:text-foreground",
                      targetData.deadline && !overdueStyles && !isComplete && "text-primary",
                      targetData.deadline && overdueStyles && !isComplete && overdueStyles.textColor,
                      isComplete && "text-muted-foreground"
                    )}
                  >
                    {overdueStatus === "overdue" && !isComplete ? (
                      <AlertTriangle className="h-3 w-3" />
                    ) : (
                      <Calendar className="h-3 w-3" />
                    )}
                    {targetData.deadline 
                      ? overdueStyles && !isComplete
                        ? `${overdueStyles.label}: ${format(targetData.deadline, "MMM d")}`
                        : `Due ${format(targetData.deadline, "MMM d")}`
                      : "Set deadline"
                    }
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={targetData.deadline}
                    onSelect={(date) => updateTarget(goalId, targetData.id, { deadline: date })}
                    className="pointer-events-auto"
                  />
                  {targetData.deadline && (
                    <div className="p-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-destructive"
                        onClick={() => updateTarget(goalId, targetData.id, { deadline: undefined })}
                      >
                        Clear deadline
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>

            {/* Progress display for number type */}
            {targetData.type === "number" && (
              <div className="mt-2 text-sm text-foreground font-medium">
                {display}
              </div>
            )}

            {/* Tasks list */}
            {targetData.type === "tasks" && (
              <div className="mt-3">
                <button
                  onClick={() => setShowTasks(!showTasks)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showTasks ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {display}
                </button>
                
                {showTasks && (
                  <div className="mt-3 space-y-2">
                    {targetData.tasks?.map((task) => (
                      <div 
                        key={task.id} 
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-lg bg-muted/50",
                          task.isCompleted && "bg-success/10"
                        )}
                      >
                        <Checkbox
                          checked={task.isCompleted}
                          onCheckedChange={(checked) => handleTaskToggle(task.id, checked as boolean)}
                        />
                        <span className={cn(
                          "flex-1 text-sm",
                          task.isCompleted && "line-through text-muted-foreground"
                        )}>
                          {task.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDeleteTask(task.id)}
                          className="h-6 w-6"
                        >
                          <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    ))}
                    
                    {/* Add task */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add new task"
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddTask();
                        }}
                        className="h-8 text-sm"
                      />
                      <Button onClick={handleAddTask} size="icon-sm" variant="secondary">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Progress percentage and menu on the right */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">
              {progress}%
            </span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {targetData.type === "number" && (
                  <>
                    <DropdownMenuItem onClick={() => setShowProgressModal(true)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Update Progress
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => {
                  const newName = prompt("Rename target:", targetData.name);
                  if (newName) updateTarget(goalId, targetData.id, { name: newName });
                }}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  // Will use popover for this
                }}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Set Deadline
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  const note = prompt("Add a note:");
                  if (note) addComment(goalId, note, targetData.id);
                }}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Note
                </DropdownMenuItem>
                
                {/* Move to option submenu - only show if there are options */}
                {goalOptions.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <ArrowRightLeft className="h-4 w-4 mr-2" />
                        Move to Option
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {/* Option to remove from any option */}
                          <DropdownMenuItem
                            onClick={() => updateTarget(goalId, targetData.id, { optionId: undefined })}
                            disabled={!targetData.optionId}
                            className={!targetData.optionId ? "opacity-50" : ""}
                          >
                            <span className="text-muted-foreground">No option (unbound)</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {goalOptions.map((option) => (
                            <DropdownMenuItem
                              key={option.id}
                              onClick={() => updateTarget(goalId, targetData.id, { optionId: option.id })}
                              disabled={targetData.optionId === option.id}
                              className={targetData.optionId === option.id ? "opacity-50" : ""}
                            >
                              {option.name}
                              {targetData.optionId === option.id && (
                                <span className="ml-2 text-xs text-muted-foreground">(current)</span>
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Target?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {targetData.type === "tasks" && targetData.tasks?.length === 1
                ? "If you delete the last task, this Target will also be deleted."
                : "This will permanently delete this target."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget(goalId, targetData.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Progress Update Modal (Number type) */}
      <Dialog open={showProgressModal} onOpenChange={setShowProgressModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">{targetData.name}</DialogTitle>
          </DialogHeader>
          <ProgressUpdateForm 
            target={targetData} 
            goalId={goalId}
            onClose={() => setShowProgressModal(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

// Separated form for editing target progress with all fields editable
const ProgressUpdateForm = ({ 
  target, 
  goalId, 
  onClose 
}: { 
  target: Target; 
  goalId: string;
  onClose: () => void;
}) => {
  const { updateTarget } = useGoalsContext();
  const [startValue, setStartValue] = useState(String(target.startValue ?? 0));
  const [targetValue, setTargetValue] = useState(String(target.targetValue ?? 0));
  const [currentValue, setCurrentValue] = useState(String(target.currentValue ?? 0));
  const [unit, setUnit] = useState(target.unit || "");
  const [error, setError] = useState("");

  const startNum = parseFloat(startValue) || 0;
  const targetNum = parseFloat(targetValue) || 0;
  const currentNum = parseFloat(currentValue) || 0;
  const range = targetNum - startNum;
  const progress = range > 0 ? Math.round(((currentNum - startNum) / range) * 100) : 0;
  const isComplete = progress >= 100;

  const handleSave = () => {
    // Validation
    if (startNum < 0 || targetNum < 0 || currentNum < 0) {
      setError("Negative numbers are not allowed");
      return;
    }
    if (startNum === targetNum) {
      setError("Start and target values cannot be the same");
      return;
    }
    if (currentNum < startNum || currentNum > targetNum) {
      setError("Current value must be between start and target");
      return;
    }

    const newProgress = range > 0 ? Math.round(((currentNum - startNum) / range) * 100) : 0;
    updateTarget(goalId, target.id, { 
      startValue: startNum, 
      targetValue: targetNum, 
      currentValue: currentNum, 
      unit: unit.trim() || undefined,
      progress: Math.max(0, Math.min(100, newProgress))
    });
    onClose();
  };

  return (
    <div className="space-y-4 py-4">
      <Progress value={Math.max(0, Math.min(100, progress))} variant={isComplete ? "success" : "nature"} className="h-4" />
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-2 rounded-lg bg-muted space-y-1">
          <div className="text-xs text-muted-foreground">Start</div>
          <Input
            type="number"
            value={startValue}
            onChange={(e) => {
              setStartValue(e.target.value);
              setError("");
            }}
            className="h-8 text-center font-semibold"
          />
        </div>
        <div className="p-2 rounded-lg bg-primary/10 space-y-1">
          <div className="text-xs text-muted-foreground">Current</div>
          <Input
            type="number"
            value={currentValue}
            onChange={(e) => {
              setCurrentValue(e.target.value);
              setError("");
            }}
            className="h-8 text-center font-semibold"
          />
        </div>
        <div className="p-2 rounded-lg bg-muted space-y-1">
          <div className="text-xs text-muted-foreground">Target</div>
          <Input
            type="number"
            value={targetValue}
            onChange={(e) => {
              setTargetValue(e.target.value);
              setError("");
            }}
            className="h-8 text-center font-semibold"
          />
        </div>
      </div>
      
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Unit (optional)</label>
        <Input
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="e.g., USD, kg, hours"
          className="h-8"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        <Button variant="nature" size="sm" onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};
