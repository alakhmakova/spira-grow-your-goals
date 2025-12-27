import { useState, useRef, useCallback, useEffect } from "react";
import { Lightbulb, Check, Plus, Sparkles, AlertTriangle, Trash2, Star } from "lucide-react";
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
  Dialog,
  DialogContent,
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
  const [error, setError] = useState("");
  const [showBindConfirm, setShowBindConfirm] = useState(false);
  const [pendingOption, setPendingOption] = useState<GoalOption | null>(null);
  
  // Modal states
  const [selectedOption, setSelectedOption] = useState<GoalOption | null>(null);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [modalEditName, setModalEditName] = useState("");
  const [modalEditDescription, setModalEditDescription] = useState("");
  const [showGoalNameModal, setShowGoalNameModal] = useState(false);
  const [editingGoalName, setEditingGoalName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Drag state
  const [positions, setPositions] = useState<Record<string, DragPosition>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragStart = useRef<{ x: number; y: number; initialPos: DragPosition } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasDragged = useRef(false);
  
  // Textarea refs for auto-resize
  const modalDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const addDescriptionRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea helper
  const autoResizeTextarea = (textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  // Auto-resize modal textarea when content changes
  useEffect(() => {
    autoResizeTextarea(modalDescriptionRef.current);
  }, [modalEditDescription]);

  // Auto-resize add form textarea when content changes
  useEffect(() => {
    autoResizeTextarea(addDescriptionRef.current);
  }, [newDescription]);

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
    e.preventDefault();
    setDraggingId(optionId);
    hasDragged.current = false;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      initialPos: currentPos,
    };
  }, []);

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
    const touch = e.touches[0];
    setDraggingId(optionId);
    hasDragged.current = false;
    dragStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      initialPos: currentPos,
    };
  }, []);

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
        <div className="text-center py-6">
          <Lightbulb className="h-10 w-10 mx-auto mb-3 text-white" />
          <p className="text-sm mb-3 text-white">No options defined yet.</p>
          <p className="text-xs mb-4 max-w-md mx-auto text-white">
            Add different strategies or approaches to achieve your goal. You can then select an active option to focus on.
          </p>
        </div>
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="gap-2 text-[rgb(103,232,249)] border-[rgb(103,232,249)] hover:bg-[rgb(103,232,249)] hover:text-black"
          >
            <Plus className="h-4 w-4" />
            Add First Option
          </Button>
        </div>

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

        {/* Add Option Modal when empty */}
        <Dialog
          open={showAddForm}
          onOpenChange={(open) => {
            if (!open && newName.trim()) {
              // Auto-save when closing with content
              handleAdd();
            } else {
              setShowAddForm(open);
              if (!open) {
                setNewName("");
                setNewDescription("");
                setError("");
              }
            }
          }}
        >
          <DialogContent className="sm:max-w-xl max-w-[95vw] flex flex-col h-full sm:h-auto">
            <div className="flex-1 flex flex-col gap-1">
              <Input
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setError("");
                }}
                placeholder="Option name *"
                className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-semibold px-0 shadow-none"
                autoFocus
              />
              {error && <p className="text-sm text-destructive px-0">{error}</p>}
              
              <Textarea
                value={newDescription}
                ref={addDescriptionRef}
                onChange={(e) => {
                  setNewDescription(e.target.value);
                  autoResizeTextarea(e.target);
                }}
                placeholder="Description (optional)"
                className="resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none min-h-[100px]"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Encouragement message if no active option */}
      {!activeOptionId && options.length > 0 && (
        <div
          className="flex items-center gap-3 p-5 rounded-lg mb-6 text-sm"
          style={{
            backgroundColor: "rgba(245, 245, 245, 0.9)",
            border: "2px solid rgb(215, 253, 245)",
            color: "rgb(29, 41, 86)",
            boxShadow: "rgb(93,47,193) 4px -4px 12px",
          }}
        >
          <Sparkles className="h-5 w-5 flex-shrink-0" />
          <p>
            <strong>Choose an active option</strong> to focus on. Your targets and progress will be tracked for the selected option.
          </p>
        </div>
      )}

      {/* Options Grid Layout */}
      <div 
        ref={containerRef}
        className="relative select-none touch-none overflow-x-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Options arranged in grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch max-w-full">
          {options.map((option, index) => {
            const colors = optionColors[index % optionColors.length];
            const isActive = activeOptionId === option.id;
            const isDragging = draggingId === option.id;

            return (
              <div
                key={option.id}
                className={cn(
                  "z-20 h-full",
                  isDragging && "z-30"
                )}
              >
                <div
                  className={cn(
                    "relative group p-3 rounded-xl border-2 transition-all h-full",
                    isActive
                      ? "ring-2 ring-primary/20"
                      : "hover:border-gray-300",
                    isDragging && "scale-105 shadow-lg"
                  )}
                  onClick={(e) => handleOptionClick(option, e)}
                  style={{ 
                    color: isActive ? "white" : "rgb(29, 41, 86)", 
                    borderColor: isActive ? "hsl(95, 75%, 45%)" : "rgb(93,47,193)", 
                    backgroundColor: isActive ? "hsl(95, 75%, 45%)" : "#fff" 
                  }}
                >
                  <div className="flex flex-col h-full">
                    {/* Content at top left */}
                    <div className="flex-1 mb-2">
                      <div className="flex items-start gap-1.5 mb-0.5">
                        <Lightbulb className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: isActive ? "white" : "rgb(93,47,193)" }} />
                        <h4 className="font-semibold text-sm line-clamp-2" style={{ color: isActive ? "white" : "rgb(29, 41, 86)" }}>{option.name}</h4>
                      </div>
                      {option.description && (
                        <p className="text-xs pl-5 line-clamp-2" style={{ color: isActive ? "white" : "rgb(75, 80, 87)" }}>
                          {option.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Bottom row: Active badge on left, icons on right */}
                    <div className="flex items-center justify-between gap-2 mt-auto">
                      {/* Active badge at bottom left */}
                      {isActive && (
                        <Badge style={{ backgroundColor: "hsl(95, 75%, 45%)", color: "white" }} className="text-xs px-2 py-0.5 flex-shrink-0">
                          <Check className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      )}
                      
                      {/* Icons at bottom right */}
                      <div className="flex items-center gap-1 ml-auto">
                        <button
                          className="p-1 hover:bg-background/20 rounded transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetActiveOption(isActive ? undefined : option.id);
                          }}
                          title={isActive ? "Unset Active" : "Make Active"}
                        >
                          <Star 
                            className={cn("h-4 w-4", isActive && "fill-current")} 
                            style={{ color: isActive ? "white" : "rgb(93,47,193)" }} 
                          />
                        </button>
                        <button
                          className="p-1 hover:bg-background/20 rounded transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOption(option);
                            setShowDeleteConfirm(true);
                          }}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" style={{ color: isActive ? "white" : "rgb(244,77,97)" }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add new option card */}
          <div className="z-20 h-full">
            <button
              onClick={() => setShowAddForm(true)}
              className="group p-3 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-1 w-full h-full hover:!border-white"
              style={{ borderColor: "rgb(100, 201, 29)" }}
            >
              <Plus className="h-5 w-5 group-hover:!text-white" style={{ color: "rgb(100, 201, 29)" }} />
              <span className="text-xs group-hover:!text-white" style={{ color: "rgb(100, 201, 29)" }}>Add Option</span>
            </button>
          </div>
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
          if (!open && newName.trim()) {
            // Auto-save when closing with content
            handleAdd();
          } else {
            setShowAddForm(open);
            if (!open) {
              setNewName("");
              setNewDescription("");
              setError("");
            }
          }
        }}
      >
        <DialogContent className="sm:max-w-xl max-w-[95vw] flex flex-col h-full sm:h-auto">
          <div className="flex-1 flex flex-col gap-1">
            <Input
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setError("");
              }}
              placeholder="Option name *"
              className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-semibold px-0 shadow-none"
              autoFocus
            />
            {error && <p className="text-sm text-destructive px-0">{error}</p>}
            
            <Textarea
              value={newDescription}
              ref={addDescriptionRef}
              onChange={(e) => {
                setNewDescription(e.target.value);
                autoResizeTextarea(e.target);
              }}
              placeholder="Description (optional)"
              className="resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none min-h-[100px]"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Option Details Modal */}
      <Dialog open={showOptionModal} onOpenChange={(open) => {
        setShowOptionModal(open);
        if (!open) {
          setIsEditingInModal(false);
          // Auto-save on close
          if (selectedOption && (modalEditName.trim() !== selectedOption.name || modalEditDescription.trim() !== (selectedOption.description || ""))) {
            if (modalEditName.trim()) {
              onUpdate(
                options.map((o) =>
                  o.id === selectedOption.id
                    ? { ...o, name: modalEditName.trim(), description: modalEditDescription.trim() || undefined }
                    : o
                )
              );
            }
          }
        } else if (selectedOption) {
          // Initialize edit state when opening
          setModalEditName(selectedOption.name);
          setModalEditDescription(selectedOption.description || "");
        }
      }}>
        <DialogContent className="sm:max-w-xl max-w-[95vw] flex flex-col h-full sm:h-auto">
          {/* Content - Name and Description at top left */}
          <div className="flex-1 flex flex-col gap-1">
            <Input
              value={modalEditName}
              onChange={(e) => setModalEditName(e.target.value)}
              placeholder="Option name"
              className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-semibold px-0 shadow-none"
              autoFocus
            />
            <Textarea
              value={modalEditDescription}
              ref={modalDescriptionRef}
              onChange={(e) => {
                setModalEditDescription(e.target.value);
                autoResizeTextarea(e.target);
              }}
              placeholder="Description (optional)"
              className="resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none min-h-[100px]"
            />
          </div>

          {/* Fixed positioning for icons and badge */}
          <div className="flex justify-between items-end mt-auto pt-4">
            {/* Active badge at bottom left */}
            {activeOptionId === selectedOption?.id && (
              <Badge style={{ backgroundColor: "hsl(95, 75%, 45%)", color: "white" }} className="flex-shrink-0">
                <Check className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
            
            {/* Action icons at bottom right */}
            <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
              <button
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => {
                  if (selectedOption) {
                    onSetActiveOption(activeOptionId === selectedOption.id ? undefined : selectedOption.id);
                  }
                }}
                title={activeOptionId === selectedOption?.id ? "Unset Active" : "Make Active"}
              >
                <Star 
                  className={cn("h-5 w-5", activeOptionId === selectedOption?.id && "fill-current")} 
                  style={{ color: activeOptionId === selectedOption?.id ? 'hsl(95, 75%, 45%)' : 'rgb(93,47,193)' }} 
                />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                onClick={() => setShowDeleteConfirm(true)}
                title="Delete"
              >
                <Trash2 className="h-5 w-5 text-destructive" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Option
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedOption?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={() => {
                if (selectedOption) {
                  handleDelete(selectedOption.id);
                  setShowDeleteConfirm(false);
                  setShowOptionModal(false);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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