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
import { WaveSeparator, WaveSectionWrapper } from "@/components/ui/wave-separator";
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
  const [expandedSections, setExpandedSections] = useState<string[]>([]); // collapsed by default
  const [growWarningDismissed, setGrowWarningDismissed] = useState(false);

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
      
      {/* Section 1: Goal Header & Details - on background */}
      <div className="bg-background">
        <div className="container py-4 sm:py-8 px-4 sm:px-6">
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

          {/* Goal Header */}
          <div className="flex flex-col gap-4 sm:gap-6 mb-6">
            {/* Progress Circle */}
            <div className="flex justify-center lg:justify-start">
              <CircularProgress
                value={goal.progress}
                size={100}
                strokeWidth={8}
                labelClassName="text-xl sm:text-2xl"
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
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
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

                {/* Achievability */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all",
                        getAchievabilityColor(goal.achievability)
                      )}
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
                
                {/* Due Date */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 text-sm text-primary hover:underline cursor-pointer">
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
        </div>
      </div>

      {/* Wave separator between Header and GROW Details/Targets */}
      <WaveSeparator variant="forest" />

      {/* Section 2: GROW Details & Targets - on mint/forest background */}
      <div className="bg-forest text-forest-foreground py-8 sm:py-12">
        <div className="container px-4 sm:px-6">
          {/* GROW Description Section */}
          <div className="mb-8">
            <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
              Goal Details
              {hasEmptyGrowFields && (
                <Badge variant="warning" className="text-xs">Incomplete</Badge>
              )}
            </h2>

            {hasEmptyGrowFields && !growWarningDismissed && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-forest-foreground/10 border border-forest-foreground/20 mb-4 text-sm">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <p className="flex-1">
                  Working with all stages of the GROW model helps achieve your goal more effectively.
                  <Link to="/info#grow-model" className="text-forest-foreground/80 hover:text-forest-foreground underline ml-1">
                    Learn more
                  </Link>
                </p>
                <Button variant="ghost" size="sm" className="text-forest-foreground hover:bg-forest-foreground/10" onClick={() => setGrowWarningDismissed(true)}>
                  Dismiss
                </Button>
              </div>
            )}

            <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections} className="space-y-2">
              <AccordionItem value="reality" className="bg-forest-foreground/10 border-forest-foreground/20 rounded-lg px-4">
                <AccordionTrigger className="font-medium text-forest-foreground">
                  Reality: Actions & Obstacles
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-forest-foreground">
                  <RealitySection
                    actions={goal.actions || []}
                    obstacles={goal.obstacles || []}
                    onUpdateActions={(actions) => updateGoal(goal.id, { actions })}
                    onUpdateObstacles={(obstacles) => updateGoal(goal.id, { obstacles })}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="goalOptions" className="bg-forest-foreground/10 border-forest-foreground/20 rounded-lg px-4">
                <AccordionTrigger className="font-medium text-forest-foreground">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Options: What strategies could you use?
                    {activeOption && <Badge variant="success" className="text-xs">Active option: {activeOption.name}</Badge>}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-forest-foreground">
                  <OptionsSection
                    options={goal.goalOptions || []}
                    activeOptionId={goal.activeOptionId}
                    goalName={goal.name}
                    onUpdate={(options) => updateGoal(goal.id, { goalOptions: options })}
                    onSetActiveOption={(optionId) => updateGoal(goal.id, { activeOptionId: optionId })}
                    existingTargetsCount={goal.targets.filter(t => !t.optionId).length}
                    onBindTargetsToOption={(optionId) => {
                      const updatedTargets = goal.targets.map(t => 
                        !t.optionId ? { ...t, optionId } : t
                      );
                      updateGoal(goal.id, { targets: updatedTargets });
                    }}
                    onDeleteUnboundTargets={() => {
                      const updatedTargets = goal.targets.filter(t => t.optionId);
                      updateGoal(goal.id, { targets: updatedTargets });
                    }}
                    onGoalNameChange={(name) => updateGoal(goal.id, { name })}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="will" className="bg-forest-foreground/10 border-forest-foreground/20 rounded-lg px-4">
                <AccordionTrigger className="font-medium text-forest-foreground">
                  Why is this goal important?
                </AccordionTrigger>
                <AccordionContent className="text-forest-foreground">
                  <Textarea
                    value={goal.will || ""}
                    onChange={(e) => updateGoal(goal.id, { will: e.target.value })}
                    placeholder="Describe your commitment and motivation..."
                    className="min-h-[100px] resize-y bg-forest-foreground/10 border-forest-foreground/20 text-forest-foreground placeholder:text-forest-foreground/50"
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Resources Section */}
            <div className="mt-6">
              <ResourcesSection
                resources={goal.resources || []}
                onUpdate={(resources) => updateGoal(goal.id, { resources })}
              />
            </div>
          </div>

          {/* Targets */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                <TargetIcon className="h-5 w-5" />
                Targets
                <Badge variant="secondary" className="bg-forest-foreground/20 text-forest-foreground">{filteredTargets.length}</Badge>
                {activeOption && <Badge variant="outline" className="text-xs border-forest-foreground/30">{activeOption.name}</Badge>}
              </h2>
              <Button onClick={() => setShowCreateTarget(true)} variant="secondary" size="sm" className="gap-2 bg-forest-foreground text-forest hover:bg-forest-foreground/90">
                <Plus className="h-4 w-4" />
                New Target
              </Button>
            </div>

            {filteredTargets.length === 0 ? (
              <Card className="text-center py-8 bg-forest-foreground/10 border-forest-foreground/20">
                <CardContent>
                  <TargetIcon className="h-12 w-12 opacity-40 mx-auto mb-4" />
                  <h3 className="font-display text-lg font-semibold mb-2">No targets yet</h3>
                  <p className="opacity-80 mb-4 max-w-md mx-auto">
                    Break down your goal into measurable targets. Without targets, 
                    your goal lacks the "Will" part of the GROW model.
                  </p>
                  <Button onClick={() => setShowCreateTarget(true)} variant="secondary" className="gap-2 bg-forest-foreground text-forest hover:bg-forest-foreground/90">
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
                    <Button onClick={() => setShowCreateTarget(true)} variant="secondary" size="sm" className="gap-2 bg-forest-foreground/20 hover:bg-forest-foreground/30">
                      <Plus className="h-4 w-4" />
                      Add another target
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Wave separator between Targets and Comments - PostNord footer style */}
      <WaveSeparator variant="forest" flip />

      {/* Section 3: Comments Section - back to background */}
      <div className="bg-background">
        <div className="container py-8 sm:py-12 px-4 sm:px-6">
          <h2 className="font-display text-xl font-semibold flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-primary" />
            Comments & Notes
            <Badge variant="muted">{comments.length}</Badge>
          </h2>
          <CommentsSection goalId={goal.id} comments={comments} targets={goal.targets} />
        </div>
      </div>

      {/* Create Target Dialog */}
      <CreateTargetForm 
        open={showCreateTarget} 
        onOpenChange={setShowCreateTarget}
        goalId={goal.id}
        optionId={goal.activeOptionId}
        goalOptions={goal.goalOptions}
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
