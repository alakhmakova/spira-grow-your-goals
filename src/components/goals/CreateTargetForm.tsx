import { useState } from "react";
import { HelpCircle, ExternalLink, Trash2, Pencil, ToggleLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useGoalsContext } from "@/context/GoalsContext";

// Leaf icon for Tasks type (like the logo)
const LeafIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="leafIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(142, 70%, 45%)" />
        <stop offset="100%" stopColor="hsl(168, 80%, 45%)" />
      </linearGradient>
    </defs>
    <path
      d="M12 3C7.5 3 4 6.5 4 11C4 14.5 6 17.5 9 19L12 21L15 19C18 17.5 20 14.5 20 11C20 6.5 16.5 3 12 3Z"
      fill="url(#leafIconGradient)"
    />
    <path
      d="M12 7V15M9 10L12 7L15 10"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface CreateTargetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalId: string;
  /** If provided, the new target will be linked to the currently active option on the Goal page */
  optionId?: string;
}

export const CreateTargetForm = ({ open, onOpenChange, goalId, optionId }: CreateTargetFormProps) => {
  const { createTarget } = useGoalsContext();
  
  const [name, setName] = useState("");
  const [type, setType] = useState<"number" | "success" | "tasks">("number");
  const [unit, setUnit] = useState("");
  const [startValue, setStartValue] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [deadline, setDeadline] = useState<Date>();
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null);
  const [editingTaskValue, setEditingTaskValue] = useState("");
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask.trim()]);
      setNewTask("");
      if (errors.tasks) {
        setErrors(prev => ({ ...prev, tasks: "" }));
      }
    }
  };

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleEditTask = (index: number) => {
    setEditingTaskIndex(index);
    setEditingTaskValue(tasks[index]);
  };

  const handleSaveTaskEdit = (index: number) => {
    if (editingTaskValue.trim()) {
      const newTasks = [...tasks];
      newTasks[index] = editingTaskValue.trim();
      setTasks(newTasks);
    }
    setEditingTaskIndex(null);
    setEditingTaskValue("");
  };


  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = "Target name is required";
    }

    if (type === "number") {
      const start = parseFloat(startValue);
      const target = parseFloat(targetValue);
      
      if (isNaN(start)) {
        newErrors.startValue = "Start value is required";
      } else if (start < 0) {
        newErrors.startValue = "Negative numbers are not allowed";
      }
      
      if (isNaN(target)) {
        newErrors.targetValue = "Target value is required";
      } else if (target < 0) {
        newErrors.targetValue = "Negative numbers are not allowed";
      }
      
      if (!isNaN(start) && !isNaN(target) && start === target) {
        newErrors.targetValue = "Start and target values cannot be the same";
      }
    }

    if (type === "tasks" && tasks.length === 0) {
      newErrors.tasks = "Add at least one task to your target";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const targetData: any = {
      name: name.trim(),
      type,
      deadline,
      optionId: optionId || undefined,
    };

    if (type === "number") {
      targetData.unit = unit.trim() || undefined;
      targetData.startValue = parseFloat(startValue);
      targetData.targetValue = parseFloat(targetValue);
      targetData.currentValue = parseFloat(startValue);
    }

    if (type === "success") {
      targetData.isCompleted = false;
    }

    if (type === "tasks") {
      targetData.tasks = tasks.map((t, i) => ({
        id: `task-${Date.now()}-${i}`,
        targetId: "",
        name: t,
        isCompleted: false,
        createdAt: new Date(),
      }));
    }

    createTarget(goalId, targetData);

    // Reset form
    setName("");
    setType("number");
    setUnit("");
    setStartValue("");
    setTargetValue("");
    setDeadline(undefined);
    setTasks([]);
    setErrors({});
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Create New Target</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Target Name */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="target-name" className="text-base font-medium leading-none">
                  How would you break this goal down into smaller pieces? <span className="text-destructive">*</span>
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help flex-shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    Accountability set-up – define actions, timeframe, and measures of accomplishment. 
                    Targets are measurable steps towards your goal.
                  </TooltipContent>
                </Tooltip>
              </div>
              <a 
                href="/info#targets" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1 whitespace-nowrap flex-shrink-0"
              >
                Learn more <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <Input
              id="target-name"
              placeholder="What step towards your goal will you act on?"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
              }}
              className={cn(errors.name && "border-destructive")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Target Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Measure your success <span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={type}
              onValueChange={(v) => setType(v as typeof type)}
              className="grid grid-cols-3 gap-3"
            >
              <div className="flex-1">
                <RadioGroupItem value="number" id="type-number" className="peer sr-only" />
                <Label
                  htmlFor="type-number"
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all h-full min-h-[88px]",
                    type === "number" 
                      ? "border-primary bg-primary/5" 
                      : "border-muted hover:border-primary/50"
                  )}
                >
                  <span className="text-2xl mb-1">123</span>
                  <span className="text-sm font-medium text-center">Number</span>
                </Label>
              </div>
              <div className="flex-1">
                <RadioGroupItem value="success" id="type-success" className="peer sr-only" />
                <Label
                  htmlFor="type-success"
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all h-full min-h-[88px]",
                    type === "success" 
                      ? "border-primary bg-primary/5" 
                      : "border-muted hover:border-primary/50"
                  )}
                >
                  <ToggleLeft className="h-6 w-6 mb-1 text-primary" />
                  <span className="text-sm font-medium text-center">Done/Not Done</span>
                </Label>
              </div>
              <div className="flex-1">
                <RadioGroupItem value="tasks" id="type-tasks" className="peer sr-only" />
                <Label
                  htmlFor="type-tasks"
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all h-full min-h-[88px]",
                    type === "tasks" 
                      ? "border-primary bg-primary/5" 
                      : "border-muted hover:border-primary/50"
                  )}
                >
                  <LeafIcon className="h-6 w-6 mb-1" />
                  <span className="text-sm font-medium text-center">Tasks</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Number Type Fields */}
          {type === "number" && (
            <div className="space-y-4 p-4 rounded-lg bg-muted/50">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 h-5">
                    <Label htmlFor="start-value" className="leading-none">
                      Start <span className="text-destructive">*</span>
                    </Label>
                  </div>
                  <Input
                    id="start-value"
                    type="number"
                    value={startValue}
                    onChange={(e) => {
                      setStartValue(e.target.value);
                      if (errors.startValue) setErrors(prev => ({ ...prev, startValue: "" }));
                    }}
                    className={cn(errors.startValue && "border-destructive")}
                  />
                  {errors.startValue && (
                    <p className="text-xs text-destructive">{errors.startValue}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1 h-5">
                    <Label htmlFor="target-value" className="leading-none">
                      Target <span className="text-destructive">*</span>
                    </Label>
                  </div>
                  <Input
                    id="target-value"
                    type="number"
                    value={targetValue}
                    onChange={(e) => {
                      setTargetValue(e.target.value);
                      if (errors.targetValue) setErrors(prev => ({ ...prev, targetValue: "" }));
                    }}
                    className={cn(errors.targetValue && "border-destructive")}
                  />
                  {errors.targetValue && (
                    <p className="text-xs text-destructive">{errors.targetValue}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1 h-5">
                    <Label htmlFor="unit" className="leading-none">Unit</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        What will measure your success?
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="unit"
                    placeholder="USD, kg, etc."
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Success Type Info */}
          {type === "success" && (
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">
                This target will be marked as either "Done" or "Not Done" with a simple toggle switch.
              </p>
            </div>
          )}

          {/* Tasks Type */}
          {type === "tasks" && (
            <div className="space-y-3 p-4 rounded-lg bg-muted/50">
              <Label>Add tasks to your target</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter task name"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddTask();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddTask();
                  }} 
                  variant="secondary"
                >
                  Add
                </Button>
              </div>
              {tasks.length > 0 && (
                <ul className="space-y-2">
                  {tasks.map((task, index) => (
                    <li 
                      key={index} 
                      className="flex items-center gap-2 p-2 rounded bg-background"
                    >
                      {editingTaskIndex === index ? (
                        <Input
                          autoFocus
                          value={editingTaskValue}
                          onChange={(e) => setEditingTaskValue(e.target.value)}
                          onBlur={() => handleSaveTaskEdit(index)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveTaskEdit(index);
                            if (e.key === "Escape") setEditingTaskIndex(null);
                          }}
                          className="flex-1 h-8"
                        />
                      ) : (
                        <>
                          <span className="flex-1 text-sm">{task}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleEditTask(index)}
                          >
                            <Pencil className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleRemoveTask(index)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
              {errors.tasks && (
                <p className="text-sm text-destructive">{errors.tasks}</p>
              )}
            </div>
          )}

          {/* Deadline */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-base font-medium">Deadline (optional)</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  When precisely are you going to finish?
                </TooltipContent>
              </Tooltip>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant={deadline ? "nature" : "outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deadline && "text-muted-foreground",
                    deadline && "text-white"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "MMMM do, yyyy") : "Pick a deadline"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="nature">
              Create Target
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
