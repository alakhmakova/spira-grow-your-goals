import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import {
  ChevronRight,
  Calendar,
  MoreVertical,
  Pencil,
  Trash2,
  Gauge,
  Plus,
  Target as TargetIcon,
  MessageSquare,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Lightbulb,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useGoalsContext } from "@/context/GoalsContext";
import { Button } from "@/components/ui/button";
import { CircularProgress, Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CreateTargetForm } from "@/components/goals/CreateTargetForm";
import { TargetCard } from "@/components/goals/TargetCard";
import { CommentsSection } from "@/components/goals/CommentsSection";
import { ResourcesSection } from "@/components/goals/ResourcesSection";
import { OptionsSection } from "@/components/goals/OptionsSection";
import { RealitySection } from "@/components/goals/RealitySection";
import { AchievabilityHistory } from "@/components/goals/AchievabilityHistory";
import { Confetti } from "@/components/Confetti";
import { Resource, GoalOption, RealityItem, GoalType } from "@/types/goal";
import { goalTypeConfig, getGoalTypeStyles } from "@/lib/goalTypeUtils";
import { goalTypeIcons } from "@/components/icons/GoalTypeIcons";

const GoalPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { goals, getGoalById, updateGoal, deleteGoal, getGoalComments } = useGoalsContext();

  const goal = getGoalById(id || "");
  const comments = getGoalComments(id || "");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCreateTarget, setShowCreateTarget] = useState(false);
  const [showAchievabilityReminder, setShowAchievabilityReminder] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(["reality", "goalOptions", "options", "will", "resources"]);

  // Filter targets by active option
  const filteredTargets = useMemo(() => {
    if (!goal) return [];
    // If no options exist, show all targets
    if (!goal.goalOptions || goal.goalOptions.length === 0) {
      return goal.targets;
    }
    // If options exist but none is active, show only targets without optionId
    if (!goal.activeOptionId) {
      return goal.targets.filter(t => !t.optionId);
    }
    // Show targets for active option
    return goal.targets.filter(t => t.optionId === goal.activeOptionId);
  }, [goal]);

  // Get active option name
  const activeOption = useMemo(() => {
    if (!goal?.goalOptions || !goal.activeOptionId) return null;
    return goal.goalOptions.find(o => o.id === goal.activeOptionId);
  }, [goal]);

  useEffect(() => {
    if (goal?.progress === 100) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [goal?.progress]);

  if (!goal) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="font-display text-2xl font-semibold mb-4">Goal not found</h1>
          <Button onClick={() => navigate("/goals")} variant="outline">
            Back to Goals
          </Button>
        </div>
      </Layout>
    );
  }

  const handleNameChange = () => {
    if (tempName.trim() && tempName !== goal.name) {
      updateGoal(goal.id, { name: tempName.trim() });
    }
    setEditingName(false);
  };

  const handleDelete = () => {
    deleteGoal(goal.id);
    navigate("/goals");
  };

  const getAchievabilityColor = (value: number) => {
    if (value <= 3) return "text-destructive bg-destructive/10";
    if (value <= 6) return "text-warning bg-warning/10";
    return "text-success bg-success/10";
  };

  const hasEmptyGrowFields = !goal.reality || (!goal.goalOptions || goal.goalOptions.length === 0) || !goal.will || !goal.resources;

  // Check if another goal has north-star type
  const hasExistingNorthStar = goals.some(g => g.goalType === "north-star" && g.id !== goal.id);

  const handleGoalTypeChange = (newType: GoalType | "none") => {
    if (newType === "none") {
      updateGoal(goal.id, { goalType: undefined });
    } else {
      updateGoal(goal.id, { goalType: newType });
    }
  };

  const typeStyles = goal.goalType ? getGoalTypeStyles(goal.goalType) : null;

  return (
    <Layout>
      {showConfetti && <Confetti />}
      
      <div className="container py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/goals" className="hover:text-foreground transition-colors">
            All Goals
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium truncate max-w-[200px]">
            {goal.name}
          </span>
        </nav>

        {/* Goal Header Section */}
        <section className="mb-8 pb-8 border-b">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Progress Circle */}
            <div className="flex-shrink-0">
              <CircularProgress
                value={goal.progress}
                size={120}
                strokeWidth={10}
                labelClassName="text-2xl"
                className={goal.progress === 100 ? "animate-pulse-soft [&_circle:last-child]:stroke-success" : "[&_circle:last-child]:stroke-foreground"}
              />
            </div>

            {/* Goal Info */}
            <div className="flex-1 min-w-0">
              {/* Name */}
              <div className="flex items-start gap-2 mb-4">
                {editingName ? (
                  <Input
                    autoFocus
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={handleNameChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleNameChange();
                      if (e.key === "Escape") setEditingName(false);
                    }}
                    className="font-display text-2xl lg:text-3xl font-bold"
                  />
                ) : (
                  <h1
                    onClick={() => {
                      setTempName(goal.name);
                      setEditingName(true);
                    }}
                    className="font-display text-2xl lg:text-3xl font-bold cursor-pointer hover:text-primary transition-colors leading-tight"
                  >
                    {goal.name}
                  </h1>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      setTempName(goal.name);
                      setEditingName(true);
                    }}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      const value = prompt("Enter achievability (1-10):", goal.achievability.toString());
                      const num = parseInt(value || "");
                      if (num >= 1 && num <= 10) {
                        updateGoal(goal.id, { achievability: num });
                      }
                    }}>
                      <Gauge className="h-4 w-4 mr-2" />
                      Change Achievability
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Goal
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {/* Goal Type Selector */}
                <Select
                  value={goal.goalType || "none"}
                  onValueChange={(value) => handleGoalTypeChange(value as GoalType | "none")}
                >
                  <SelectTrigger className={cn(
                    "w-auto min-w-[140px] h-9",
                    goal.goalType && "border-primary/30 text-primary"
                  )}>
                    <SelectValue placeholder="Set type">
                      {goal.goalType ? (
                        <span className="flex items-center gap-2">
                          {(() => {
                            const Icon = goalTypeIcons[goal.goalType];
                            return <Icon size={14} />;
                          })()}
                          {goalTypeConfig[goal.goalType].label}
                        </span>
                      ) : (
                        "Set type"
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="none">
                      <span className="text-muted-foreground">No type</span>
                    </SelectItem>
                    {(Object.keys(goalTypeConfig) as GoalType[]).map((type) => {
                      const config = goalTypeConfig[type];
                      const Icon = goalTypeIcons[type];
                      const isDisabled = type === "north-star" && hasExistingNorthStar;
                      return (
                        <SelectItem 
                          key={type} 
                          value={type}
                          disabled={isDisabled}
                          className={cn(isDisabled && "opacity-50")}
                        >
                          <div className="flex items-center gap-2">
                            <Icon size={14} />
                            <span>{config.label}</span>
                            {isDisabled && <span className="text-xs text-muted-foreground">(already exists)</span>}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {/* Achievability - Clickable to edit */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all",
                        getAchievabilityColor(goal.achievability)
                      )}
                      title="Click to change achievability"
                    >
                      <Gauge className="h-4 w-4" />
                      <span className="font-semibold">{goal.achievability}/10</span>
                      <span className="text-sm opacity-80">Achievability</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Update Achievability</p>
                      <p className="text-xs text-muted-foreground">On a scale of 1–10, how confident are you that this goal is achievable right now?</p>
                      <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <Button
                            key={num}
                            variant={goal.achievability === num ? "default" : "outline"}
                            size="sm"
                            className="w-full"
                            onClick={() => updateGoal(goal.id, { achievability: num })}
                          >
                            {num}
                          </Button>
                        ))}
                      </div>
                      
                      {/* History button */}
                      <div className="pt-2 border-t">
                        <AchievabilityHistory 
                          history={goal.achievabilityHistory || []} 
                          currentValue={goal.achievability} 
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Dates */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Created {format(goal.createdAt, "MMM d, yyyy")}</span>
                </div>
                
                {/* Due Date - Clickable to change */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="flex items-center gap-2 text-sm text-primary hover:underline cursor-pointer"
                      title="Click to change due date"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>{goal.dueDate ? `Due ${format(goal.dueDate, "MMM d, yyyy")}` : "Set due date"}</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarUI
                      mode="single"
                      selected={goal.dueDate}
                      onSelect={(date) => updateGoal(goal.id, { dueDate: date })}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Achievability reminder */}
              {showAchievabilityReminder && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20 mb-4">
                  <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-sm">
                    Has anything changed about this goal? Consider updating your achievability rating.
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowAchievabilityReminder(false)}
                  >
                    Dismiss
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* GROW Description Section */}
        <section className="mb-8 pb-8 border-b">
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            Goal Details
            {hasEmptyGrowFields && (
              <Badge variant="warning" className="text-xs">Incomplete</Badge>
            )}
          </h2>

          {hasEmptyGrowFields && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20 mb-4 text-sm">
              <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />
              <p>
                Working with all stages of the GROW model helps achieve your goal more effectively.
                <Link to="/info#grow-model" className="text-primary hover:underline ml-1">
                  Learn more
                </Link>
              </p>
            </div>
          )}

          <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
            <AccordionItem value="reality">
              <AccordionTrigger className="font-medium">
                Reality: Actions & Obstacles
                {(!goal.actions || goal.actions.length === 0) && (!goal.obstacles || goal.obstacles.length === 0) && (
                  <Badge variant="muted" className="ml-2 text-xs">Empty</Badge>
                )}
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {/* Actions & Obstacles */}
                <RealitySection
                  actions={goal.actions || []}
                  obstacles={goal.obstacles || []}
                  onUpdateActions={(actions) => updateGoal(goal.id, { actions })}
                  onUpdateObstacles={(obstacles) => updateGoal(goal.id, { obstacles })}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="goalOptions">
              <AccordionTrigger className="font-medium">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Options: What strategies could you use?
                </div>
                {(!goal.goalOptions || goal.goalOptions.length === 0) && <Badge variant="muted" className="ml-2 text-xs">Empty</Badge>}
                {activeOption && <Badge variant="success" className="ml-2 text-xs">Active: {activeOption.name}</Badge>}
              </AccordionTrigger>
              <AccordionContent>
                <OptionsSection
                  options={goal.goalOptions || []}
                  activeOptionId={goal.activeOptionId}
                  goalName={goal.name}
                  onUpdate={(options) => updateGoal(goal.id, { goalOptions: options })}
                  onSetActiveOption={(optionId) => updateGoal(goal.id, { activeOptionId: optionId })}
                  existingTargetsCount={goal.targets.filter(t => !t.optionId).length}
                  onBindTargetsToOption={(optionId) => {
                    // Bind all unbound targets to this option
                    const updatedTargets = goal.targets.map(t => 
                      !t.optionId ? { ...t, optionId } : t
                    );
                    updateGoal(goal.id, { targets: updatedTargets });
                  }}
                  onDeleteUnboundTargets={() => {
                    // Delete all unbound targets
                    const updatedTargets = goal.targets.filter(t => t.optionId);
                    updateGoal(goal.id, { targets: updatedTargets });
                  }}
                  onGoalNameChange={(name) => updateGoal(goal.id, { name })}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="options">
              <AccordionTrigger className="font-medium">
                Additional Notes
              </AccordionTrigger>
              <AccordionContent>
                <Textarea
                  value={goal.options || ""}
                  onChange={(e) => updateGoal(goal.id, { options: e.target.value })}
                  placeholder="Any additional notes about your options..."
                  className="min-h-[80px] resize-y"
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="will">
              <AccordionTrigger className="font-medium">
                Will: How committed are you?
                {!goal.will && <Badge variant="muted" className="ml-2 text-xs">Empty</Badge>}
              </AccordionTrigger>
              <AccordionContent>
                <Textarea
                  value={goal.will || ""}
                  onChange={(e) => updateGoal(goal.id, { will: e.target.value })}
                  placeholder="Describe your commitment and motivation..."
                  className="min-h-[100px] resize-y"
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="resources">
              <AccordionTrigger className="font-medium">
                Resources: What support do you need?
                {(!goal.resources || goal.resources.length === 0) && <Badge variant="muted" className="ml-2 text-xs">Empty</Badge>}
              </AccordionTrigger>
              <AccordionContent>
                <ResourcesSection
                  resources={goal.resources || []}
                  onUpdate={(resources) => updateGoal(goal.id, { resources })}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Targets Section */}
        <section className="mb-8 pb-8 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold flex items-center gap-2">
              <TargetIcon className="h-5 w-5 text-primary" />
              Targets
              <Badge variant="muted">{filteredTargets.length}</Badge>
              {activeOption && <Badge variant="outline" className="text-xs">{activeOption.name}</Badge>}
            </h2>
            <Button onClick={() => setShowCreateTarget(true)} variant="nature" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Target
            </Button>
          </div>

          {filteredTargets.length === 0 ? (
            <Card variant="nature" className="text-center py-8">
              <CardContent>
                <TargetIcon className="h-12 w-12 text-primary/40 mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold mb-2">No targets yet</h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  Break down your goal into measurable targets. Without targets, 
                  your goal lacks the "Will" part of the GROW model.
                </p>
                <Button onClick={() => setShowCreateTarget(true)} variant="nature" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create your first target
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-3">
                {filteredTargets.map((target, index) => (
                  <TargetCard 
                    key={target.id} 
                    target={target} 
                    goalId={goal.id}
                    goalOptions={goal.goalOptions || []}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  />
                ))}
              </div>
              
              {filteredTargets.length > 3 && (
                <div className="mt-4 flex justify-center">
                  <Button onClick={() => setShowCreateTarget(true)} variant="soft" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add another target
                  </Button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Comments Section */}
        <section>
          <h2 className="font-display text-xl font-semibold flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-primary" />
            Comments & Notes
            <Badge variant="muted">{comments.length}</Badge>
          </h2>
          <CommentsSection goalId={goal.id} comments={comments} targets={goal.targets} />
        </section>
      </div>

      {/* Create Target Dialog */}
      <CreateTargetForm 
        open={showCreateTarget} 
        onOpenChange={setShowCreateTarget}
        goalId={goal.id}
        optionId={goal.activeOptionId}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Goal Permanently?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              This action cannot be undone. The goal and all its targets will be 
              <span className="font-semibold text-destructive"> permanently deleted</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default GoalPage;
