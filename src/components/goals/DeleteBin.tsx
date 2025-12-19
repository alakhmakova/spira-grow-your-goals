import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
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

interface DeleteBinProps {
  onDrop: (goalId: string) => void;
  className?: string;
}

export const DeleteBin = ({ onDrop, className }: DeleteBinProps) => {
  const [isOver, setIsOver] = useState(false);
  const [draggedGoalId, setDraggedGoalId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const goalId = e.dataTransfer.getData("goalId");
    if (goalId) {
      setDraggedGoalId(goalId);
      setShowConfirm(true);
    }
    setIsOver(false);
  };

  const handleConfirmDelete = () => {
    if (draggedGoalId) {
      onDrop(draggedGoalId);
    }
    setShowConfirm(false);
    setDraggedGoalId(null);
  };

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed transition-all duration-300",
          isOver
            ? "border-destructive bg-destructive/10 scale-105 shadow-lg"
            : "border-muted-foreground/30 bg-muted/30 hover:border-muted-foreground/50",
          className
        )}
      >
        <Trash2 className={cn(
          "h-6 w-6 transition-all duration-300",
          isOver ? "text-destructive scale-125 animate-wiggle" : "text-muted-foreground"
        )} />
        <span className={cn(
          "text-sm font-medium transition-colors",
          isOver ? "text-destructive" : "text-muted-foreground"
        )}>
          {isOver ? "Release to delete" : "Drag goal here to delete"}
        </span>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Goal Permanently?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              This action cannot be undone. The goal and all its targets will be 
              <span className="font-semibold text-destructive"> permanently deleted</span> and 
              it will be impossible to restore it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
