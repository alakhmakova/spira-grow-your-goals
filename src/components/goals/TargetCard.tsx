import { useState } from "react";
import { format } from "date-fns";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Calendar,
  MessageSquare,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { Target, Task } from "@/types/goal";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import { cn } from "@/lib/utils";
import { useGoalsContext } from "@/context/GoalsContext";
import { SpiraSproutIcon } from "@/components/SpiraLogo";

interface TargetCardProps {
  target: Target;
  goalId: string;
  style?: React.CSSProperties;
}

export const TargetCard = ({ target, goalId, style }: TargetCardProps) => {
  const { updateTarget, deleteTarget, addComment } = useGoalsContext();
  
  const [showTasks, setShowTasks] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

  const handleToggleComplete = () => {
    if (target.type === "success") {
      const newProgress = target.isCompleted ? 0 : 100;
      updateTarget(goalId, target.id, { 
        isCompleted: !target.isCompleted,
        progress: newProgress 
      });
    }
  };

  const handleTaskToggle = (taskId: string, isCompleted: boolean) => {
    const tasks = target.tasks?.map(t => 
      t.id === taskId ? { ...t, isCompleted } : t
    );
    const completed = tasks?.filter(t => t.isCompleted).length || 0;
    const total = tasks?.length || 1;
    const progress = Math.round((completed / total) * 100);
    
    updateTarget(goalId, target.id, { tasks, progress });
  };

  const handleAddTask = () => {
    if (!newTaskName.trim()) return;
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      targetId: target.id,
      name: newTaskName.trim(),
      isCompleted: false,
      createdAt: new Date(),
    };
    
    const tasks = [...(target.tasks || []), newTask];
    const completed = tasks.filter(t => t.isCompleted).length;
    const progress = Math.round((completed / tasks.length) * 100);
    
    updateTarget(goalId, target.id, { tasks, progress });
    setNewTaskName("");
  };

  const handleDeleteTask = (taskId: string) => {
    const tasks = target.tasks?.filter(t => t.id !== taskId);
    if (tasks?.length === 0) {
      // If deleting last task, delete the target
      setShowDeleteConfirm(true);
      return;
    }
    const completed = tasks?.filter(t => t.isCompleted).length || 0;
    const total = tasks?.length || 1;
    const progress = Math.round((completed / total) * 100);
    
    updateTarget(goalId, target.id, { tasks, progress });
  };

  const getProgressDisplay = () => {
    if (target.type === "number") {
      const current = target.currentValue || target.startValue || 0;
      const start = target.startValue || 0;
      const end = target.targetValue || 0;
      const range = end - start;
      const progress = range > 0 ? Math.round(((current - start) / range) * 100) : 0;
      return {
        progress: Math.max(0, Math.min(100, progress)),
        display: `${current} / ${end} ${target.unit || ""}`.trim(),
      };
    }
    if (target.type === "tasks") {
      const completed = target.tasks?.filter(t => t.isCompleted).length || 0;
      const total = target.tasks?.length || 0;
      return {
        progress: total > 0 ? Math.round((completed / total) * 100) : 0,
        display: `${completed} / ${total} tasks`,
      };
    }
    return { progress: target.progress, display: target.isCompleted ? "Completed" : "Not done" };
  };

  const { progress, display } = getProgressDisplay();
  const isComplete = progress === 100;

  return (
    <>
      <div 
        className={cn(
          "p-4 rounded-lg border bg-card animate-fade-in transition-all",
          isComplete && "border-success/30 bg-success/5"
        )}
        style={style}
      >
        <div className="flex items-start gap-4">
          {/* Progress indicator */}
          <div className="flex-shrink-0 w-16 text-center">
            {target.type === "success" ? (
              <Switch
                checked={target.isCompleted}
                onCheckedChange={handleToggleComplete}
                className="data-[state=checked]:bg-success"
              />
            ) : (
              <button
                onClick={() => target.type === "number" && setShowProgressModal(true)}
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center font-semibold text-sm transition-all",
                  target.type === "number" && "cursor-pointer hover:scale-105",
                  isComplete 
                    ? "bg-success/20 text-success" 
                    : "bg-muted text-muted-foreground"
                )}
              >
                {progress}%
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {isComplete && <SpiraSproutIcon className="animate-sprout-grow" size={20} />}
                <h4 className={cn(
                  "font-medium",
                  isComplete && "text-success"
                )}>
                  {target.name}
                </h4>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {
                    const newName = prompt("Rename target:", target.name);
                    if (newName) updateTarget(goalId, target.id, { name: newName });
                  }}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    const note = prompt("Add a note:");
                    if (note) addComment(goalId, note, target.id);
                  }}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Note
                  </DropdownMenuItem>
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

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span>Created {format(target.createdAt, "MMM d")}</span>
              {target.deadline && (
                <span className="flex items-center gap-1 text-primary">
                  <Calendar className="h-3 w-3" />
                  Due {format(target.deadline, "MMM d")}
                </span>
              )}
              <Badge variant={target.type === "number" ? "default" : target.type === "success" ? "secondary" : "muted"}>
                {target.type}
              </Badge>
            </div>

            {/* Progress bar for number type */}
            {target.type === "number" && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{display}</span>
                </div>
                <Progress value={progress} variant={isComplete ? "success" : "default"} />
              </div>
            )}

            {/* Tasks list */}
            {target.type === "tasks" && (
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
                    {target.tasks?.map((task) => (
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
                          {task.isCompleted && <SpiraSproutIcon className="inline mr-1" size={14} />}
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
              {target.type === "tasks" && target.tasks?.length === 1
                ? "If you delete the last task, this Target will also be deleted."
                : "This will permanently delete this target."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget(goalId, target.id)}
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
            <DialogTitle className="font-display">{target.name}</DialogTitle>
          </DialogHeader>
          <ProgressUpdateForm 
            target={target} 
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
  const [startValue, setStartValue] = useState(target.startValue || 0);
  const [targetValue, setTargetValue] = useState(target.targetValue || 0);
  const [currentValue, setCurrentValue] = useState(target.currentValue || 0);
  const [unit, setUnit] = useState(target.unit || "");
  const [error, setError] = useState("");

  const range = targetValue - startValue;
  const progress = range > 0 ? Math.round(((currentValue - startValue) / range) * 100) : 0;
  const isComplete = progress >= 100;

  const handleSave = () => {
    // Validation
    if (startValue < 0 || targetValue < 0 || currentValue < 0) {
      setError("Negative numbers are not allowed");
      return;
    }
    if (startValue === targetValue) {
      setError("Start and target values cannot be the same");
      return;
    }
    if (currentValue < startValue || currentValue > targetValue) {
      setError("Current value must be between start and target");
      return;
    }

    const newProgress = range > 0 ? Math.round(((currentValue - startValue) / range) * 100) : 0;
    updateTarget(goalId, target.id, { 
      startValue, 
      targetValue, 
      currentValue, 
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
              setStartValue(parseFloat(e.target.value) || 0);
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
              setCurrentValue(parseFloat(e.target.value) || 0);
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
              setTargetValue(parseFloat(e.target.value) || 0);
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
