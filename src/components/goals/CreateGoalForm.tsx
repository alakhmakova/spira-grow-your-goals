import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, HelpCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
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
import { Resource, GoalOption, RealityItem } from "@/types/goal";
import { ResourceInput } from "./ResourceInput";
import { OptionInput } from "./OptionInput";
import { RealityInput } from "./RealityInput";

interface CreateGoalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateGoalForm = ({ open, onOpenChange }: CreateGoalFormProps) => {
  const navigate = useNavigate();
  const { createGoal } = useGoalsContext();
  
  const [name, setName] = useState("");
  const [reality, setReality] = useState("");
  const [actions, setActions] = useState<RealityItem[]>([]);
  const [obstacles, setObstacles] = useState<RealityItem[]>([]);
  const [achievability, setAchievability] = useState<number | null>(null);
  const [optionsText, setOptionsText] = useState("");
  const [goalOptions, setGoalOptions] = useState<GoalOption[]>([]);
  const [will, setWill] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [dueDate, setDueDate] = useState<Date>();
  
  const [errors, setErrors] = useState<{ name?: string; achievability?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: typeof errors = {};
    if (!name.trim()) {
      newErrors.name = "Goal name is required";
    }
    if (achievability === null) {
      newErrors.achievability = "Please select an achievability rating";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newGoal = createGoal({
      name: name.trim(),
      reality: reality.trim() || undefined,
      actions: actions.length > 0 ? actions : undefined,
      obstacles: obstacles.length > 0 ? obstacles : undefined,
      options: optionsText.trim() || undefined,
      goalOptions: goalOptions.length > 0 ? goalOptions : undefined,
      will: will.trim() || undefined,
      resources: resources.length > 0 ? resources : undefined,
      achievability: achievability!,
      dueDate,
    });

    // Reset form
    setName("");
    setReality("");
    setActions([]);
    setObstacles([]);
    setAchievability(null);
    setOptionsText("");
    setGoalOptions([]);
    setWill("");
    setResources([]);
    setDueDate(undefined);
    setErrors({});
    setErrors({});
    
    onOpenChange(false);
    navigate(`/goal/${newGoal.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Create New Goal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Goal Name */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="goal-name" className="text-base font-medium">
                What would you like to achieve? <span className="text-destructive">*</span>
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Goals can be broken down into smaller Targets when your goal is created. 
                  Goal should be SMART, PURE and CLEAR.
                </TooltipContent>
              </Tooltip>
              <Link to="/info#set-goals" className="text-xs text-primary hover:underline flex items-center gap-1">
                Learn more <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
            <Input
              id="goal-name"
              placeholder="What's the Dream? What do you want?"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
              }}
              className={cn(errors.name && "border-destructive")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Reality */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="reality" className="text-base font-medium">
                What is your current situation? How do you feel about this?
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Assess the current situation in terms of the action taken so far. 
                  Clarify the results and effects of previously taken actions.
                </TooltipContent>
              </Tooltip>
              <Link to="/info#reality" className="text-xs text-primary hover:underline flex items-center gap-1">
                Learn more <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
            <Textarea
              id="reality"
              placeholder="Describe your current situation..."
              value={reality}
              onChange={(e) => setReality(e.target.value)}
              rows={2}
            />
            
            {/* Actions & Obstacles */}
            <div className="mt-4">
              <RealityInput
                actions={actions}
                obstacles={obstacles}
                onActionsChange={setActions}
                onObstaclesChange={setObstacles}
              />
            </div>
          </div>

          {/* Achievability */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-base font-medium">
                On a scale of 1–10, how confident are you that this goal is achievable right now? <span className="text-destructive">*</span>
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  On a scale of 1–10, if an ideal situation to achieve this goal is 10, 
                  what number are you at now?
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setAchievability(num);
                    if (errors.achievability) setErrors(prev => ({ ...prev, achievability: undefined }));
                  }}
                  className={cn(
                    "w-10 h-10 rounded-lg font-semibold transition-all duration-200",
                    achievability === num
                      ? "bg-primary text-primary-foreground shadow-lg scale-110"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground",
                    num <= 3 && achievability === num && "bg-destructive",
                    num > 3 && num <= 6 && achievability === num && "bg-warning text-warning-foreground",
                    num > 6 && achievability === num && "bg-success"
                  )}
                >
                  {num}
                </button>
              ))}
            </div>
            {errors.achievability && (
              <p className="text-sm text-destructive">{errors.achievability}</p>
            )}
          </div>

          {/* Options - Structured */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-base font-medium">
                What options or strategies could you use?
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Add different strategies or approaches to achieve your goal. You can select one as your active focus later.
                </TooltipContent>
              </Tooltip>
              <Link to="/info#options" className="text-xs text-primary hover:underline flex items-center gap-1">
                Learn more <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
            <OptionInput
              options={goalOptions}
              onChange={setGoalOptions}
            />
          </div>

          {/* Options - Legacy text (collapsible for backwards compatibility) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="options" className="text-base font-medium">
                Additional notes about your options
              </Label>
            </div>
            <Textarea
              id="options"
              placeholder="Any additional thoughts about your options..."
              value={optionsText}
              onChange={(e) => setOptionsText(e.target.value)}
              rows={2}
            />
          </div>

          {/* Will */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="will" className="text-base font-medium">
                How committed are you to this goal?
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Why is this goal important?
                </TooltipContent>
              </Tooltip>
              <Link to="/info#will" className="text-xs text-primary hover:underline flex items-center gap-1">
                Learn more <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
            <Textarea
              id="will"
              placeholder="What would it mean to you to achieve this? How much are you willing to invest in the process?"
              value={will}
              onChange={(e) => setWill(e.target.value)}
              rows={3}
            />
          </div>

          {/* Resources */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-base font-medium">
                What resources or support do you need?
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  What resources do you already have (skill, time, enthusiasm, support, money, etc.)? 
                  What other resources are needed? Add links, emails, text notes, pictures, or documents.
                </TooltipContent>
              </Tooltip>
            </div>
            <ResourceInput 
              resources={resources} 
              onChange={setResources} 
            />
          </div>

          {/* Timeframe */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-base font-medium">
                What time will this goal be finished by?
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Think about how soon you can act on the steps towards your goal? 
                  What stretch will you need to achieve this goal?
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
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="pointer-events-auto"
                  disabled={(date) => date < new Date()}
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
              Create Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
