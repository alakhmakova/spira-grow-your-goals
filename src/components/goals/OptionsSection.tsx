import { useState } from "react";
import { Lightbulb, Check, Plus, Pencil, X, Sparkles, AlertTriangle } from "lucide-react";
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
  goalName: string;
  onUpdate: (options: GoalOption[]) => void;
  onSetActiveOption: (optionId: string | undefined) => void;
  existingTargetsCount?: number;
  onBindTargetsToOption?: (optionId: string) => void;
  onDeleteUnboundTargets?: () => void;
}

export const OptionsSection = ({
  options,
  activeOptionId,
  goalName,
  onUpdate,
  onSetActiveOption,
  existingTargetsCount = 0,
  onBindTargetsToOption,
  onDeleteUnboundTargets,
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

    if (options.length === 0 && existingTargetsCount > 0) {
      setPendingOption(newOption);
      setShowBindConfirm(true);
      return;
    }

    completeAddOption(newOption, false);
  };

  const completeAddOption = (option: GoalOption, bindTargets: boolean) => {
    onUpdate([...options, option]);
    
    if (options.length === 0) {
      onSetActiveOption(option.id);
    }
    
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
      if (onDeleteUnboundTargets) {
        onDeleteUnboundTargets();
      }
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

  const optionColors = [
    { bg: "bg-primary/10", border: "border-primary/40", text: "text-primary", glow: "shadow-primary/20" },
    { bg: "bg-primary/10", border: "border-primary/40", text: "text-primary", glow: "shadow-primary/20" },
    { bg: "bg-primary/10", border: "border-primary/40", text: "text-primary", glow: "shadow-primary/20" },
    { bg: "bg-primary/10", border: "border-primary/40", text: "text-primary", glow: "shadow-primary/20" },
    { bg: "bg-primary/10", border: "border-primary/40", text: "text-primary", glow: "shadow-primary/20" },
  ];

  // Calculate positions for radial layout
  const getOptionPosition = (index: number, total: number) => {
    const angleStep = (2 * Math.PI) / total;
    const startAngle = -Math.PI / 2; // Start from top
    const angle = startAngle + index * angleStep;
    const radius = 160; // Distance from center
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const totalItems = options.length + 1; // +1 for add button

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

        <AlertDialog open={showBindConfirm} onOpenChange={setShowBindConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                What to do with existing targets?
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                <p>
                  You have <strong>{existingTargetsCount} target{existingTargetsCount !== 1 ? 's' : ''}</strong> that are not linked to any option.
                </p>
                <p>
                  <strong>Bind targets:</strong> Move all existing targets to this new option.
                </p>
                <p className="text-destructive">
                  <strong>Delete targets:</strong> All existing targets will be permanently deleted.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelBind} className="text-destructive border-destructive hover:bg-destructive/10">
                Delete targets
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmBind}>
                Bind targets
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

      {/* Mind Map Visualization - Radial Layout */}
      <div className="relative min-h-[420px] flex items-center justify-center">
        {/* Central goal node */}
        <div className="absolute z-10 px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm shadow-lg max-w-[160px] text-center">
          <span className="line-clamp-2">{goalName}</span>
        </div>

        {/* SVG for connection lines */}
        <svg 
          className="absolute pointer-events-none" 
          width="400" 
          height="400"
          style={{ left: 'calc(50% - 200px)', top: 'calc(50% - 200px)' }}
        >
          <g transform="translate(200, 200)">
            {options.map((_, index) => {
              const pos = getOptionPosition(index, totalItems);
              return (
                <line
                  key={`line-${index}`}
                  x1="0"
                  y1="0"
                  x2={pos.x}
                  y2={pos.y}
                  stroke="currentColor"
                  className="text-border"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              );
            })}
            {/* Line to add button */}
            {(() => {
              const pos = getOptionPosition(options.length, totalItems);
              return (
                <line
                  x1="0"
                  y1="0"
                  x2={pos.x}
                  y2={pos.y}
                  stroke="currentColor"
                  className="text-border/50"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              );
            })()}
          </g>
        </svg>

        {/* Options arranged radially */}
        <div className="relative w-[400px] h-[400px]">
          {options.map((option, index) => {
            const colors = optionColors[index % optionColors.length];
            const isActive = activeOptionId === option.id;
            const isEditing = editingId === option.id;
            const pos = getOptionPosition(index, totalItems);

            return (
              <div
                key={option.id}
                className="absolute"
                style={{
                  left: `calc(50% + ${pos.x}px)`,
                  top: `calc(50% + ${pos.y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div
                  className={cn(
                    "relative group p-3 rounded-xl border-2 transition-all cursor-pointer w-[140px]",
                    colors.bg,
                    isActive
                      ? cn(colors.border, "ring-2 ring-offset-2", colors.glow, "shadow-lg")
                      : "border-transparent hover:border-border"
                  )}
                  onClick={() => !isEditing && onSetActiveOption(isActive ? undefined : option.id)}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <Badge className="absolute -top-2 -right-2 bg-success text-success-foreground text-xs px-1.5">
                      <Check className="h-3 w-3" />
                    </Badge>
                  )}

                  {isEditing ? (
                    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Name"
                        autoFocus
                        className="text-xs h-7"
                      />
                      <Textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Description"
                        rows={2}
                        className="resize-none text-xs"
                      />
                      <div className="flex gap-1">
                        <Button size="sm" onClick={handleSaveEdit} className="h-6 text-xs px-2">
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                          className="h-6 text-xs px-2"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-1.5 mb-1">
                        <Lightbulb className={cn("h-4 w-4 flex-shrink-0 mt-0.5", colors.text)} />
                        <h4 className="font-semibold text-sm line-clamp-2">{option.name}</h4>
                      </div>
                      {option.description && (
                        <p className="text-xs text-muted-foreground pl-5 line-clamp-2">
                          {option.description}
                        </p>
                      )}

                      {/* Action buttons */}
                      <div
                        className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleEdit(option)}
                          className="p-1 hover:bg-background/50 rounded"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(option.id)}
                          className="p-1 hover:bg-destructive/20 rounded text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add new option card */}
          {(() => {
            const pos = getOptionPosition(options.length, totalItems);
            return (
              <div
                className="absolute"
                style={{
                  left: `calc(50% + ${pos.x}px)`,
                  top: `calc(50% + ${pos.y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {showAddForm ? (
                  <div
                    className="p-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 space-y-2 w-[140px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Input
                      value={newName}
                      onChange={(e) => {
                        setNewName(e.target.value);
                        setError("");
                      }}
                      placeholder="Name *"
                      className={cn("text-xs h-7", error && "border-destructive")}
                      autoFocus
                    />
                    {error && <p className="text-xs text-destructive">{error}</p>}
                    <Textarea
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Description"
                      rows={2}
                      className="resize-none text-xs"
                    />
                    <div className="flex gap-1">
                      <Button size="sm" onClick={handleAdd} className="h-6 text-xs px-2">
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
                        className="h-6 text-xs px-2"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="p-3 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1 w-[100px] h-[80px]"
                  >
                    <Plus className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add Option</span>
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Confirmation Dialog for binding existing targets */}
      <AlertDialog open={showBindConfirm} onOpenChange={setShowBindConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              What to do with existing targets?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                You have <strong>{existingTargetsCount} target{existingTargetsCount !== 1 ? 's' : ''}</strong> that are not linked to any option.
              </p>
              <p>
                <strong>Bind targets:</strong> Move all existing targets to this new option.
              </p>
              <p className="text-destructive">
                <strong>Delete targets:</strong> All existing targets will be permanently deleted.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelBind} className="text-destructive border-destructive hover:bg-destructive/10">
              Delete targets
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmBind}>
              Bind targets
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};