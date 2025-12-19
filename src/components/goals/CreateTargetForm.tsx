import { useState } from "react";
import { X, HelpCircle, ExternalLink, Plus, Trash2 } from "lucide-react";
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
import { Link } from "react-router-dom";

interface CreateTargetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalId: string;
}

export const CreateTargetForm = ({ open, onOpenChange, goalId }: CreateTargetFormProps) => {
  const { createTarget } = useGoalsContext();
  
  const [name, setName] = useState("");
  const [type, setType] = useState<"number" | "success" | "tasks">("number");
  const [unit, setUnit] = useState("");
  const [startValue, setStartValue] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [deadline, setDeadline] = useState<Date>();
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState("");
  
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
            <div className="flex items-center gap-2">
              <Label htmlFor="target-name" className="text-base font-medium">
                How would you break this goal down into smaller pieces? <span className="text-destructive">*</span>
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Accountability set-up – define actions, timeframe, and measures of accomplishment. 
                  Targets are measurable steps towards your goal.
                </TooltipContent>
              </Tooltip>
              <Link to="/info#targets" className="text-xs text-primary hover:underline flex items-center gap-1">
                Learn more <ExternalLink className="h-3 w-3" />
              </Link>
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
              <div>
                <RadioGroupItem value="number" id="type-number" className="peer sr-only" />
                <Label
                  htmlFor="type-number"
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all",
                    type === "number" 
                      ? "border-primary bg-primary/5" 
                      : "border-muted hover:border-primary/50"
                  )}
                >
                  <span className="text-2xl mb-1">123</span>
                  <span className="text-sm font-medium">Number</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="success" id="type-success" className="peer sr-only" />
                <Label
                  htmlFor="type-success"
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all",
                    type === "success" 
                      ? "border-primary bg-primary/5" 
                      : "border-muted hover:border-primary/50"
                  )}
                >
                  <span className="text-2xl mb-1">✓</span>
                  <span className="text-sm font-medium">Done/Not Done</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="tasks" id="type-tasks" className="peer sr-only" />
                <Label
                  htmlFor="type-tasks"
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all",
                    type === "tasks" 
                      ? "border-primary bg-primary/5" 
                      : "border-muted hover:border-primary/50"
                  )}
                >
                  <span className="text-2xl mb-1">☐</span>
                  <span className="text-sm font-medium">Tasks</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Number Type Fields */}
          {type === "number" && (
            <div className="space-y-4 p-4 rounded-lg bg-muted/50">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="start-value">
                    Start <span className="text-destructive">*</span>
                  </Label>
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
                  <Label htmlFor="target-value">
                    Target <span className="text-destructive">*</span>
                  </Label>
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
                  <div className="flex items-center gap-1">
                    <Label htmlFor="unit">Unit</Label>
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
                  placeholder="Task name"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTask();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTask} variant="secondary">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tasks.length > 0 && (
                <ul className="space-y-2">
                  {tasks.map((task, index) => (
                    <li 
                      key={index} 
                      className="flex items-center gap-2 p-2 rounded bg-background"
                    >
                      <span className="flex-1 text-sm">{task}</span>
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
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP") : "Pick a deadline"}
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
