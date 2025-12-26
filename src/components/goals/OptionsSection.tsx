import { useState, useRef, useCallback } from "react";
import { Lightbulb, Check, Plus, Pencil, X, Sparkles, AlertTriangle, MoreVertical, Trash2, Star } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface OptionsSectionProps {
  options: GoalOption[];
  activeOptionId?: string;
  goalName: string;
  onUpdate: (options: GoalOption[]) => void;
  onSetActiveOption: (optionId: string | undefined) => void;
  existingTargetsCount?: number;
  onBindTargetsToOption?: (optionId: string) => void;
  onDeleteUnboundTargets?: () => void;
  onGoalNameChange?: (name: string) => void;
}

interface DragPosition {
  x: number;
  y: number;
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
  onGoalNameChange,
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
  
  // Modal states
  const [selectedOption, setSelectedOption] = useState<GoalOption | null>(null);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [isEditingInModal, setIsEditingInModal] = useState(false);
  const [modalEditName, setModalEditName] = useState("");
  const [modalEditDescription, setModalEditDescription] = useState("");
  const [showGoalNameModal, setShowGoalNameModal] = useState(false);
  const [editingGoalName, setEditingGoalName] = useState("");
  
  // Drag state
  const [positions, setPositions] = useState<Record<string, DragPosition>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragStart = useRef<{ x: number; y: number; initialPos: DragPosition } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasDragged = useRef(false);

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
    { bg: "bg-warning/10", border: "border-warning/40", text: "text-white" },
    { bg: "bg-warning/10", border: "border-warning/40", text: "text-white" },
    { bg: "bg-warning/10", border: "border-warning/40", text: "text-white" },
    { bg: "bg-warning/10", border: "border-warning/40", text: "text-white" },
    { bg: "bg-warning/10", border: "border-warning/40", text: "text-white" },
  ];

  // Calculate positions for radial layout
  const getOptionPosition = (index: number, total: number): DragPosition => {
    const angleStep = (2 * Math.PI) / total;
    const startAngle = -Math.PI / 2; // Start from top
    const angle = startAngle + index * angleStep;
    const radius = 160; // Distance from center
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  // Get actual position (custom or default radial)
  const getActualPosition = (optionId: string, index: number, total: number): DragPosition => {
    if (positions[optionId]) {
      return positions[optionId];
    }
    return getOptionPosition(index, total);
  };

  // Trim a line so it ends near the edge of a card instead of its center
  const trimLineToCardEdge = (point: DragPosition, trim: number): DragPosition => {
    const len = Math.hypot(point.x, point.y);
    if (len <= trim) return point;
    const factor = (len - trim) / len;
    return { x: point.x * factor, y: point.y * factor };
  };

  // Drag handlers - mouse
  const handleMouseDown = useCallback((e: React.MouseEvent, optionId: string, currentPos: DragPosition) => {
    if (editingId) return;
    e.preventDefault();
    setDraggingId(optionId);
    hasDragged.current = false;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      initialPos: currentPos,
    };
  }, [editingId]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggingId || !dragStart.current || !containerRef.current) return;
    
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;
    
    // Consider it a drag if moved more than 5px
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      hasDragged.current = true;
    }
    
    // Get container bounds
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    // Option card dimensions (approximate)
    const optionWidth = 140;
    const optionHeight = 120;
    
    // Calculate new position
    let newX = dragStart.current.initialPos.x + deltaX;
    let newY = dragStart.current.initialPos.y + deltaY;
    
    // Apply boundary constraints (positions are relative to center)
    const maxX = containerWidth / 2 - optionWidth / 2;
    const maxY = containerHeight / 2 - optionHeight / 2;
    
    newX = Math.max(-maxX, Math.min(maxX, newX));
    newY = Math.max(-maxY, Math.min(maxY, newY));
    
    setPositions(prev => ({
      ...prev,
      [draggingId]: {
        x: newX,
        y: newY,
      },
    }));
  }, [draggingId]);

  const handleMouseUp = useCallback(() => {
    setDraggingId(null);
    dragStart.current = null;
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent, optionId: string, currentPos: DragPosition) => {
    if (editingId) return;
    const touch = e.touches[0];
    setDraggingId(optionId);
    hasDragged.current = false;
    dragStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      initialPos: currentPos,
    };
  }, [editingId]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!draggingId || !dragStart.current || !containerRef.current) return;
    
    const touch = e.touches[0];
    const startRef = dragStart.current;
    const deltaX = touch.clientX - startRef.x;
    const deltaY = touch.clientY - startRef.y;
    
    // Consider it a drag if moved more than 10px (higher threshold for touch)
    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
      hasDragged.current = true;
    }
    
    // Get container bounds
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    // Option card dimensions (approximate)
    const optionWidth = 140;
    const optionHeight = 120;
    
    // Calculate new position
    let newX = startRef.initialPos.x + deltaX;
    let newY = startRef.initialPos.y + deltaY;
    
    // Apply boundary constraints (positions are relative to center)
    const maxX = containerWidth / 2 - optionWidth / 2;
    const maxY = containerHeight / 2 - optionHeight / 2;
    
    newX = Math.max(-maxX, Math.min(maxX, newX));
    newY = Math.max(-maxY, Math.min(maxY, newY));
    
    setPositions(prev => ({
      ...prev,
      [draggingId]: { x: newX, y: newY },
    }));
  }, [draggingId]);

  const handleTouchEnd = useCallback(() => {
    setDraggingId(null);
    dragStart.current = null;
  }, []);

  const handleOptionClick = useCallback((option: GoalOption, e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    if (!hasDragged.current) {
      setSelectedOption(option);
      setShowOptionModal(true);
    }
  }, []);

  const handleGoalNameClick = useCallback(() => {
    setEditingGoalName(goalName);
    setShowGoalNameModal(true);
  }, [goalName]);

  const handleSaveGoalName = useCallback(() => {
    if (editingGoalName.trim() && onGoalNameChange) {
      onGoalNameChange(editingGoalName.trim());
    }
    setShowGoalNameModal(false);
  }, [editingGoalName, onGoalNameChange]);

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
      <div 
        ref={containerRef}
        className="relative min-h-[420px] flex items-center justify-center select-none touch-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Central goal node - clickable to edit */}
        <div 
          className="absolute z-10 px-6 py-3 rounded-full bg-white text-[#4D3300] font-semibold text-sm shadow-lg max-w-[160px] text-center cursor-pointer hover:ring-2 hover:ring-primary/50 hover:ring-offset-2 transition-all"
          onClick={handleGoalNameClick}
        >
          <span className="line-clamp-2">{goalName}</span>
        </div>

        {/* SVG for connection lines - full size overlay */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-0" 
          style={{ overflow: 'visible' }}
        >
          <g style={{ transform: 'translate(50%, 50%)' }}>
            {options.map((option, index) => {
              const pos = getActualPosition(option.id, index, totalItems);
              const end = trimLineToCardEdge(pos, 70); // approx half card width
              return (
                <line
                  key={`line-${index}`}
                  x1="0"
                  y1="0"
                  x2={end.x}
                  y2={end.y}
                  stroke="currentColor"
                  className="text-white"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              );
            })}
            {/* Line to add button */}
            {(() => {
              const pos = getActualPosition('add-button', options.length, totalItems);
              const end = trimLineToCardEdge(pos, 50); // add button ~100px wide
              return (
                <line
                  x1="0"
                  y1="0"
                  x2={end.x}
                  y2={end.y}
                  stroke="currentColor"
                  className="text-white/80"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              );
            })()}
          </g>
        </svg>

        {/* Options arranged radially */}
        <div className="relative w-full h-full" style={{ minWidth: '400px', minHeight: '400px' }}>
          {options.map((option, index) => {
            const colors = optionColors[index % optionColors.length];
            const isActive = activeOptionId === option.id;
            const isEditing = editingId === option.id;
            const isDragging = draggingId === option.id;
            const pos = getActualPosition(option.id, index, totalItems);

            return (
              <div
                key={option.id}
                className={cn(
                  "absolute z-20",
                  isDragging && "z-30"
                )}
                style={{
                  left: `calc(50% + ${pos.x}px)`,
                  top: `calc(50% + ${pos.y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div
                  className={cn(
                    "relative group p-3 rounded-xl border-2 transition-all w-[140px]",
                    colors.bg,
                    isActive
                      ? cn(colors.border, "ring-2 ring-offset-2")
                      : "border-transparent hover:border-border",
                    isDragging && "scale-105",
                    !isEditing && "cursor-grab active:cursor-grabbing"
                  )}
                  onMouseDown={(e) => !isEditing && handleMouseDown(e, option.id, pos)}
                  onTouchStart={(e) => !isEditing && handleTouchStart(e, option.id, pos)}
                  onClick={(e) => !isEditing && handleOptionClick(option, e)}
                  style={{ backgroundColor: "rgb(236,168,5)" }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <Badge className="absolute -top-2 -right-2 bg-success text-success-foreground text-xs px-1.5">
                      <Check className="h-3 w-3" />
                    </Badge>
                  )}

                  {isEditing ? (
                    <div className="space-y-2" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
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
                    <div>
                      <div className="flex items-start gap-1.5 mb-1">
                        <Lightbulb className={cn("h-4 w-4 flex-shrink-0 mt-0.5", colors.text)} />
                        <h4 className="font-semibold text-sm line-clamp-2">{option.name}</h4>
                      </div>
                      {option.description && (
                        <p className="text-xs text-muted-foreground pl-5 line-clamp-2">
                          {option.description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Dropdown menu for actions */}
                  {!isEditing && (
                    <div
                      className="absolute top-1 right-1"
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 hover:bg-background/50 rounded">
                            <MoreVertical className="h-3 w-3" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => handleEdit(option)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onSetActiveOption(isActive ? undefined : option.id)}
                          >
                            <Star className={cn("h-4 w-4 mr-2", isActive && "fill-current")} />
                            {isActive ? "Unset Active" : "Make Active"}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(option.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add new option card */}
          {(() => {
            const addButtonId = 'add-button';
            const pos = getActualPosition(addButtonId, options.length, totalItems);
            const isDragging = draggingId === addButtonId;
            
            return (
              <div
                className={cn(
                  "absolute z-20",
                  isDragging && "z-30"
                )}
                style={{
                  left: `calc(50% + ${pos.x}px)`,
                  top: `calc(50% + ${pos.y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className={cn(
                  "relative group",
                  isDragging && "shadow-xl scale-105",
                  !showAddForm && "cursor-grab active:cursor-grabbing"
                )}
                onMouseDown={(e) => !showAddForm && handleMouseDown(e, addButtonId, pos)}
                onTouchStart={(e) => !showAddForm && handleTouchStart(e, addButtonId, pos)}
                >

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (hasDragged.current) return;
                        setShowAddForm(true);
                      }}
                      className="group p-3 rounded-xl border-2 border-dashed border-primary/50 hover:border-white hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1 w-[100px] h-[80px] opacity-50 hover:opacity-80"
                    >
                      <Plus className="h-5 w-5 text-primary group-hover:text-white" />
                      <span className="text-xs text-primary group-hover:text-white">Add Option</span>
                    </button>
                </div>
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

      {/* Add Option Modal (full-width similar to create target form) */}
      <Dialog
        open={showAddForm}
        onOpenChange={(open) => {
          setShowAddForm(open);
          if (!open) {
            setNewName("");
            setNewDescription("");
            setError("");
          }
        }}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl sm:text-2xl">Create New Option</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2 sm:py-4">
            <div className="space-y-2">
              <Input
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setError("");
                }}
                placeholder="Option name *"
                className={cn("focus-visible:ring-[rgb(19,56,68)] focus-visible:ring-2", error && "border-destructive")}
                autoFocus
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <Textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={4}
              className="resize-none focus-visible:ring-[rgb(19,56,68)] focus-visible:ring-2"
            />

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                className="border-[rgb(244,77,97)] text-[rgb(244,77,97)] hover:bg-[rgb(244,77,97)] hover:text-white"
                onClick={() => {
                  setShowAddForm(false);
                  setNewName("");
                  setNewDescription("");
                  setError("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                className="bg-[rgb(19,56,68)] hover:bg-[hsl(95,75%,45%)] text-white"
              >
                Add Option
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Option Details Modal */}
      <Dialog open={showOptionModal} onOpenChange={(open) => {
        setShowOptionModal(open);
        if (!open) {
          setIsEditingInModal(false);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              {isEditingInModal ? "Edit Option" : selectedOption?.name}
            </DialogTitle>
          </DialogHeader>
          
          {isEditingInModal ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={modalEditName}
                  onChange={(e) => setModalEditName(e.target.value)}
                  placeholder="Option name"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={modalEditDescription}
                  onChange={(e) => setModalEditDescription(e.target.value)}
                  placeholder="Description (optional)"
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {selectedOption?.description ? (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                  <p className="text-sm">{selectedOption.description}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No description provided.</p>
              )}
              {activeOptionId === selectedOption?.id && (
                <Badge className="bg-success text-success-foreground">
                  <Check className="h-3 w-3 mr-1" />
                  Active Option
                </Badge>
              )}
            </div>
          )}
          
          <DialogFooter className="flex-row gap-2 sm:justify-start flex-wrap">
            {isEditingInModal ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingInModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    if (selectedOption && modalEditName.trim()) {
                      onUpdate(
                        options.map((o) =>
                          o.id === selectedOption.id
                            ? { ...o, name: modalEditName.trim(), description: modalEditDescription.trim() || undefined }
                            : o
                        )
                      );
                      setSelectedOption({
                        ...selectedOption,
                        name: modalEditName.trim(),
                        description: modalEditDescription.trim() || undefined,
                      });
                      setIsEditingInModal(false);
                    }
                  }}
                  disabled={!modalEditName.trim()}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedOption) {
                      setModalEditName(selectedOption.name);
                      setModalEditDescription(selectedOption.description || "");
                      setIsEditingInModal(true);
                    }
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedOption) {
                      onSetActiveOption(activeOptionId === selectedOption.id ? undefined : selectedOption.id);
                    }
                  }}
                >
                  <Star className={cn("h-4 w-4 mr-2", activeOptionId === selectedOption?.id && "fill-current")} />
                  {activeOptionId === selectedOption?.id ? "Unset Active" : "Make Active"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (selectedOption) {
                      handleDelete(selectedOption.id);
                      setShowOptionModal(false);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Goal Name Edit Modal */}
      <Dialog open={showGoalNameModal} onOpenChange={setShowGoalNameModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Goal Name</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editingGoalName}
              onChange={(e) => setEditingGoalName(e.target.value)}
              placeholder="Goal name"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGoalNameModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGoalName} disabled={!onGoalNameChange}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};