import { useState } from "react";
import { Lightbulb, Check, Plus, Pencil, X, Sparkles, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { GoalOption } from "@/types/goal";
import { cn } from "@/lib/utils";
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

interface OptionsSectionProps {
  options: GoalOption[];
  activeOptionId?: string;
  onUpdate: (options: GoalOption[]) => void;
  onSetActiveOption: (optionId: string | undefined) => void;
  existingTargetsCount?: number;
  onBindTargetsToOption?: (optionId: string) => void;
}

export const OptionsSection = ({
  options,
  activeOptionId,
  onUpdate,
  onSetActiveOption,
  existingTargetsCount = 0,
  onBindTargetsToOption,
}: OptionsSectionProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [error, setError] = useState("");
  const [showBindConfirm, setShowBindConfirm] = useState(false);
  const [pendingOption, setPendingOption] = useState<GoalOption | null>(null);

  const handleAdd = () => {
    if (!newName.trim()) {
      setError("Option name is required");
      return;
    }

    const newOption: GoalOption = {
      id: Date.now().toString(),
      name: newName.trim(),
      description: newDescription.trim() || undefined,
    };

    // If this is the first option and there are existing targets, ask for confirmation
    if (options.length === 0 && existingTargetsCount > 0) {
      setPendingOption(newOption);
      setShowBindConfirm(true);
      return;
    }

    // Otherwise, just add the option
    completeAddOption(newOption, false);
  };

  const completeAddOption = (option: GoalOption, bindTargets: boolean) => {
    onUpdate([...options, option]);
    
    // If this is the first option, set it as active by default
    if (options.length === 0) {
      onSetActiveOption(option.id);
    }
    
    // If user confirmed to bind existing targets
    if (bindTargets && onBindTargetsToOption) {
      onBindTargetsToOption(option.id);
    }
    
    setNewName("");
    setNewDescription("");
    setError("");
    setShowAddForm(false);
    setPendingOption(null);
  };

  const handleConfirmBind = () => {
    if (pendingOption) {
      completeAddOption(pendingOption, true);
    }
    setShowBindConfirm(false);
  };

  const handleCancelBind = () => {
    if (pendingOption) {
      completeAddOption(pendingOption, false);
    }
    setShowBindConfirm(false);
  };

  const handleDelete = (id: string) => {
    onUpdate(options.filter((o) => o.id !== id));
    if (activeOptionId === id) {
      onSetActiveOption(undefined);
    }
  };

  const handleEdit = (option: GoalOption) => {
    setEditingId(option.id);
    setEditName(option.name);
    setEditDescription(option.description || "");
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) return;

    onUpdate(
      options.map((o) =>
        o.id === editingId
          ? { ...o, name: editName.trim(), description: editDescription.trim() || undefined }
          : o
      )
    );
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  // Consistent color scheme using primary/secondary
  const optionColors = [
    { bg: "bg-primary/10", border: "border-primary/40", text: "text-primary", glow: "shadow-primary/20" },
    { bg: "bg-primary/10", border: "border-primary/40", text: "text-primary", glow: "shadow-primary/20" },
    { bg: "bg-primary/10", border: "border-primary/40", text: "text-primary", glow: "shadow-primary/20" },
    { bg: "bg-primary/10", border: "border-primary/40", text: "text-primary", glow: "shadow-primary/20" },
    { bg: "bg-primary/10", border: "border-primary/40", text: "text-primary", glow: "shadow-primary/20" },
  ];

  if (options.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-6 text-muted-foreground">
          <Lightbulb className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm mb-3">No options defined yet.</p>
          <p className="text-xs mb-4 max-w-md mx-auto">
            Add different strategies or approaches to achieve your goal. You can then select an active option to focus on.
          </p>
        </div>
        
        {showAddForm ? (
          <div className="p-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 space-y-3">
            <Input
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setError("");
              }}
              placeholder="Option name *"
              className={cn(error && "border-destructive")}
              autoFocus
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
              className="resize-none"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd}>
                Add Option
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowAddForm(false);
                  setNewName("");
                  setNewDescription("");
                  setError("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add First Option
            </Button>
          </div>
        )}

        {/* Confirmation Dialog for binding existing targets - must be here too! */}
        <AlertDialog open={showBindConfirm} onOpenChange={setShowBindConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Bind Existing Targets?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You have <strong>{existingTargetsCount} target{existingTargetsCount !== 1 ? 's' : ''}</strong> that are not linked to any option.
                <br /><br />
                Would you like to bind all existing targets to this new option? The option will become active by default.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelBind}>
                No, don't bind
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmBind}>
                Yes, bind targets
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Encouragement message if no active option */}
      {!activeOptionId && options.length > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
          <p className="text-sm">
            <strong>Choose an active option</strong> to focus on. Your targets and progress will be tracked for the selected option.
          </p>
        </div>
      )}

      {/* Mind Map Visualization */}
      <div className="relative py-4">
        {/* Central goal node */}
        <div className="flex justify-center mb-6">
          <div className="px-4 py-2 rounded-full bg-foreground text-background font-semibold text-sm shadow-lg">
            Your Goal
          </div>
        </div>

        {/* Connection lines - simplified for visual effect */}
        <div className="absolute top-[52px] left-1/2 w-px h-4 bg-border -translate-x-1/2" />

        {/* Options grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {options.map((option, index) => {
            const colors = optionColors[index % optionColors.length];
            const isActive = activeOptionId === option.id;
            const isEditing = editingId === option.id;

            return (
              <div
                key={option.id}
                className={cn(
                  "relative group p-4 rounded-xl border-2 transition-all cursor-pointer",
                  colors.bg,
                  isActive
                    ? cn(colors.border, "ring-2 ring-offset-2", colors.glow, "shadow-lg")
                    : "border-transparent hover:border-border"
                )}
                onClick={() => !isEditing && onSetActiveOption(isActive ? undefined : option.id)}
              >
                {/* Active indicator */}
                {isActive && (
                  <Badge className="absolute -top-2 -right-2 bg-success text-success-foreground">
                    <Check className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}

                {isEditing ? (
                  <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Option name"
                      autoFocus
                    />
                    <Textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description (optional)"
                      rows={2}
                      className="resize-none"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEdit}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-2 mb-2">
                      <Lightbulb className={cn("h-5 w-5 flex-shrink-0 mt-0.5", colors.text)} />
                      <h4 className="font-semibold">{option.name}</h4>
                    </div>
                    {option.description && (
                      <p className="text-sm text-muted-foreground pl-7">
                        {option.description}
                      </p>
                    )}

                    {/* Action buttons */}
                    <div
                      className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleEdit(option)}
                        className="p-1.5 hover:bg-background/50 rounded"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(option.id)}
                        className="p-1.5 hover:bg-destructive/20 rounded text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Click to select hint */}
                    {!isActive && (
                      <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="h-3 w-3" />
                        Click to select
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}

          {/* Add new option card */}
          {showAddForm ? (
            <div
              className="p-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <Input
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setError("");
                }}
                placeholder="Option name *"
                className={cn(error && "border-destructive")}
                autoFocus
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={2}
                className="resize-none"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAdd}>
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewName("");
                    setNewDescription("");
                    setError("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="p-4 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 min-h-[120px]"
            >
              <Plus className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Add Option</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Dialog for binding existing targets */}
      <AlertDialog open={showBindConfirm} onOpenChange={setShowBindConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Bind Existing Targets?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have <strong>{existingTargetsCount} target{existingTargetsCount !== 1 ? 's' : ''}</strong> that are not linked to any option.
              <br /><br />
              Would you like to bind all existing targets to this new option? The option will become active by default.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelBind}>
              No, don't bind
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmBind}>
              Yes, bind targets
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
