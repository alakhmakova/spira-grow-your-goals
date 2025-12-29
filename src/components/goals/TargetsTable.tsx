import { useState } from "react";
import { format } from "date-fns";
import {
  Trash2,
  Calendar,
  Plus,
  ChevronDown,
  ChevronUp,
  MessageSquarePlus,
  ArrowRight,
} from "lucide-react";
import { Target, Task, GoalOption } from "@/types/goal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useGoalsContext } from "@/context/GoalsContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { SkillProgressBar } from "./SkillProgressBar";
import { SuccessToggle } from "./SuccessToggle";
import { TaskCheckbox } from "./TaskCheckbox";

interface TargetsTableProps {
  targets: Target[];
  goalId: string;
  goalOptions?: GoalOption[];
  onAddNote?: (targetId: string) => void;
  onJumpToNotes?: (targetId: string) => void;
}

export const TargetsTable = ({ 
  targets, 
  goalId, 
  goalOptions = [],
  onAddNote,
  onJumpToNotes,
}: TargetsTableProps) => {
  const { updateTarget, deleteTarget, addComment } = useGoalsContext();
  const isMobile = useIsMobile();
  
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<Target | null>(null);
  const [editProgressTarget, setEditProgressTarget] = useState<Target | null>(null);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [newTaskInputs, setNewTaskInputs] = useState<Record<string, string>>({});

  const toggleTaskExpansion = (targetId: string) => {
    setExpandedTasks(prev => ({ ...prev, [targetId]: !prev[targetId] }));
  };

  const handleNameChange = (targetId: string) => {
    if (tempName.trim()) {
      updateTarget(goalId, targetId, { name: tempName.trim() });
    }
    setEditingName(null);
    setTempName("");
  };

  const handleTaskToggle = (target: Target, taskId: string, isCompleted: boolean) => {
    const tasks = target.tasks?.map(t => 
      t.id === taskId ? { ...t, isCompleted } : t
    );
    const completed = tasks?.filter(t => t.isCompleted).length || 0;
    const total = tasks?.length || 1;
    const progress = Math.round((completed / total) * 100);
    
    updateTarget(goalId, target.id, { tasks, progress });
  };

  const handleAddTask = (target: Target) => {
    const taskName = newTaskInputs[target.id]?.trim();
    if (!taskName) return;
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      targetId: target.id,
      name: taskName,
      isCompleted: false,
      createdAt: new Date(),
    };
    
    const tasks = [...(target.tasks || []), newTask];
    const completed = tasks.filter(t => t.isCompleted).length;
    const progress = Math.round((completed / tasks.length) * 100);
    
    updateTarget(goalId, target.id, { tasks, progress });
    setNewTaskInputs(prev => ({ ...prev, [target.id]: "" }));
  };

  const handleDeleteTask = (target: Target, taskId: string) => {
    const tasks = target.tasks?.filter(t => t.id !== taskId);
    if (!tasks || tasks.length === 0) {
      setDeleteConfirmTarget(target);
      return;
    }
    const completed = tasks.filter(t => t.isCompleted).length;
    const progress = Math.round((completed / tasks.length) * 100);
    
    updateTarget(goalId, target.id, { tasks, progress });
  };

  const handleToggleComplete = (target: Target) => {
    const newProgress = target.isCompleted ? 0 : 100;
    updateTarget(goalId, target.id, { 
      isCompleted: !target.isCompleted,
      progress: newProgress 
    });
  };

  const getProgressInfo = (target: Target) => {
    if (target.type === "number") {
      const current = target.currentValue ?? target.startValue ?? 0;
      const start = target.startValue ?? 0;
      const end = target.targetValue ?? 0;
      const range = Math.abs(end - start);
      const progress = range > 0 
        ? Math.round((Math.abs(current - start) / range) * 100) 
        : 0;
      return {
        progress: Math.max(0, Math.min(100, progress)),
        startLabel: `${start}${target.unit ? ` ${target.unit}` : ""}`,
        endLabel: `${end}${target.unit ? ` ${target.unit}` : ""}`,
      };
    }
    if (target.type === "tasks") {
      const completed = target.tasks?.filter(t => t.isCompleted).length || 0;
      const total = target.tasks?.length || 0;
      return {
        progress: total > 0 ? Math.round((completed / total) * 100) : 0,
        completedCount: completed,
        totalCount: total,
      };
    }
    return { progress: target.progress };
  };

  const handleAddNoteClick = (targetId: string) => {
    if (onAddNote) {
      onAddNote(targetId);
    } else {
      const note = prompt("Add a note:");
      if (note) addComment(goalId, note, targetId);
    }
  };

  const handleJumpToNotesClick = (targetId: string) => {
    if (onJumpToNotes) {
      onJumpToNotes(targetId);
    }
  };

  // Delete confirmation component
  const DeleteConfirmContent = () => {
    if (!deleteConfirmTarget) return null;
    
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          {deleteConfirmTarget.type === "tasks" && deleteConfirmTarget.tasks?.length === 1
            ? "If you delete the last task, this Target will also be deleted."
            : "This will permanently delete this target."}
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteConfirmTarget(null)}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              deleteTarget(goalId, deleteConfirmTarget.id);
              setDeleteConfirmTarget(null);
            }}
          >
            Delete permanently
          </Button>
        </div>
      </div>
    );
  };

  // Progress edit form component
  const ProgressEditContent = () => {
    if (!editProgressTarget || editProgressTarget.type !== "number") return null;
    
    return (
      <ProgressUpdateForm 
        target={editProgressTarget} 
        goalId={goalId}
        onClose={() => setEditProgressTarget(null)}
      />
    );
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold min-w-[200px]">Target Name</TableHead>
              <TableHead className="font-semibold w-[100px]">Created</TableHead>
              <TableHead className="font-semibold w-[100px]">Deadline</TableHead>
              <TableHead className="font-semibold min-w-[200px]">Progress</TableHead>
              <TableHead className="font-semibold w-[160px]">Notes</TableHead>
              <TableHead className="font-semibold w-[60px] text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {targets.map((target) => {
              const progressInfo = getProgressInfo(target);
              const isTasksExpanded = expandedTasks[target.id];
              
              return (
                <>
                  <TableRow key={target.id} className="group">
                    {/* Target Name - Editable */}
                    <TableCell>
                      <div className="space-y-1">
                        {editingName === target.id ? (
                          <Input
                            autoFocus
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onBlur={() => handleNameChange(target.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleNameChange(target.id);
                              if (e.key === "Escape") {
                                setEditingName(null);
                                setTempName("");
                              }
                            }}
                            className="h-8 border-0 shadow-none p-0 focus-visible:ring-0 font-medium"
                          />
                        ) : (
                          <button
                            onClick={() => {
                              setEditingName(target.id);
                              setTempName(target.name);
                            }}
                            className="text-left font-medium hover:text-primary transition-colors cursor-text w-full"
                            title="Click to edit"
                          >
                            {target.name}
                          </button>
                        )}
                        
                        {/* Tasks count indicator for tasks type */}
                        {target.type === "tasks" && target.tasks && target.tasks.length > 0 && (
                          <button
                            onClick={() => toggleTaskExpansion(target.id)}
                            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <span className="text-success font-medium">
                              {target.tasks.filter(t => t.isCompleted).length} done
                            </span>
                            <span>•</span>
                            <span className="text-muted-foreground">
                              {target.tasks.filter(t => !t.isCompleted).length} to do
                            </span>
                            {isTasksExpanded ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </TableCell>

                    {/* Created Date */}
                    <TableCell className="text-muted-foreground text-sm">
                      {format(target.createdAt, "MMM d")}
                    </TableCell>

                    {/* Deadline */}
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className={cn(
                            "flex items-center gap-1 text-sm transition-colors",
                            target.deadline ? "text-foreground hover:text-primary" : "text-muted-foreground hover:text-foreground"
                          )}>
                            <Calendar className="h-3.5 w-3.5" />
                            {target.deadline ? format(target.deadline, "MMM d") : "—"}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={target.deadline}
                            onSelect={(date) => updateTarget(goalId, target.id, { deadline: date })}
                            className="pointer-events-auto"
                          />
                          {target.deadline && (
                            <div className="p-2 border-t">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-destructive"
                                onClick={() => updateTarget(goalId, target.id, { deadline: undefined })}
                              >
                                Clear deadline
                              </Button>
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                    </TableCell>

                    {/* Progress - varies by type */}
                    <TableCell>
                      {target.type === "number" && (
                        <button
                          onClick={() => setEditProgressTarget(target)}
                          className="w-full cursor-pointer group/progress"
                          title="Click to edit progress"
                        >
                          <SkillProgressBar
                            progress={progressInfo.progress || 0}
                            startLabel={(progressInfo as { startLabel?: string }).startLabel || "0"}
                            endLabel={(progressInfo as { endLabel?: string }).endLabel || "0"}
                          />
                        </button>
                      )}
                      
                      {target.type === "tasks" && (
                        <button
                          onClick={() => toggleTaskExpansion(target.id)}
                          className="w-full cursor-pointer"
                          title="Click to expand tasks"
                        >
                          <SkillProgressBar
                            progress={progressInfo.progress || 0}
                            startLabel={`${(progressInfo as { completedCount?: number }).completedCount || 0} done`}
                            endLabel={`${(progressInfo as { totalCount?: number }).totalCount || 0} total`}
                          />
                        </button>
                      )}
                      
                      {target.type === "success" && (
                        <SuccessToggle
                          checked={target.isCompleted || false}
                          onCheckedChange={() => handleToggleComplete(target)}
                        />
                      )}
                    </TableCell>

                    {/* Notes */}
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleAddNoteClick(target.id)}
                          className="flex items-center gap-1 text-xs text-primary hover:underline transition-colors"
                        >
                          <MessageSquarePlus className="h-3 w-3" />
                          Add note
                        </button>
                        <button
                          onClick={() => handleJumpToNotesClick(target.id)}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ArrowRight className="h-3 w-3" />
                          Jump to notes
                        </button>
                      </div>
                    </TableCell>

                    {/* Delete */}
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteConfirmTarget(target)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Tasks Row */}
                  {target.type === "tasks" && isTasksExpanded && (
                    <TableRow key={`${target.id}-tasks`} className="bg-muted/30">
                      <TableCell colSpan={6} className="py-3 px-6">
                        <div className="space-y-2">
                          {target.tasks?.map((task) => (
                            <TaskCheckbox
                              key={task.id}
                              task={task}
                              onToggle={(isCompleted) => handleTaskToggle(target, task.id, isCompleted)}
                              onDelete={() => handleDeleteTask(target, task.id)}
                            />
                          ))}
                          
                          {/* Add task input */}
                          <div className="flex gap-2 pt-2">
                            <Input
                              placeholder="Add new task..."
                              value={newTaskInputs[target.id] || ""}
                              onChange={(e) => setNewTaskInputs(prev => ({ 
                                ...prev, 
                                [target.id]: e.target.value 
                              }))}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddTask(target);
                              }}
                              className="h-8 text-sm"
                            />
                            <Button 
                              onClick={() => handleAddTask(target)} 
                              size="icon-sm" 
                              variant="secondary"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation - Responsive */}
      {isMobile ? (
        <Drawer open={!!deleteConfirmTarget} onOpenChange={(open) => !open && setDeleteConfirmTarget(null)}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="font-display">Delete Target?</DrawerTitle>
            </DrawerHeader>
            <div className="px-4">
              <DeleteConfirmContent />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={!!deleteConfirmTarget} onOpenChange={(open) => !open && setDeleteConfirmTarget(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="font-display">Delete Target?</DialogTitle>
            </DialogHeader>
            <DeleteConfirmContent />
          </DialogContent>
        </Dialog>
      )}

      {/* Progress Edit Modal - Responsive */}
      {isMobile ? (
        <Drawer open={!!editProgressTarget} onOpenChange={(open) => !open && setEditProgressTarget(null)}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="font-display">{editProgressTarget?.name}</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <ProgressEditContent />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={!!editProgressTarget} onOpenChange={(open) => !open && setEditProgressTarget(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="font-display">{editProgressTarget?.name}</DialogTitle>
            </DialogHeader>
            <ProgressEditContent />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

// Progress update form for number type targets
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
  const range = Math.abs(targetNum - startNum);
  const progress = range > 0 ? Math.round((Math.abs(currentNum - startNum) / range) * 100) : 0;
  
  const minValue = Math.min(startNum, targetNum);
  const maxValue = Math.max(startNum, targetNum);

  const handleSave = () => {
    if (startNum < 0 || targetNum < 0 || currentNum < 0) {
      setError("Negative numbers are not allowed");
      return;
    }
    if (startNum === targetNum) {
      setError("Start and target values cannot be the same");
      return;
    }
    if (currentNum < minValue || currentNum > maxValue) {
      setError(`Current value must be between ${minValue} and ${maxValue}`);
      return;
    }

    const newProgress = range > 0 ? Math.round((Math.abs(currentNum - startNum) / range) * 100) : 0;
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
      <SkillProgressBar
        progress={Math.max(0, Math.min(100, progress))}
        startLabel={`${startNum}${unit ? ` ${unit}` : ""}`}
        endLabel={`${targetNum}${unit ? ` ${unit}` : ""}`}
        showTooltip
      />
      
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
        <Button variant="default" size="sm" onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};
