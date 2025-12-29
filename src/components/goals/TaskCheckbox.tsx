import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Task } from "@/types/goal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TaskCheckboxProps {
  task: Task;
  onToggle: (isCompleted: boolean) => void;
  onDelete: () => void;
}

export const TaskCheckbox = ({ task, onToggle, onDelete }: TaskCheckboxProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleChange = () => {
    setIsAnimating(true);
    onToggle(!task.isCompleted);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-2 rounded-lg transition-colors",
        task.isCompleted ? "bg-success/10" : "bg-background hover:bg-muted/50"
      )}
    >
      <div className="checkbox-wrapper-11">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={handleChange}
          id={`task-${task.id}`}
          className={cn(isAnimating && task.isCompleted && "animate-check")}
        />
        <label 
          htmlFor={`task-${task.id}`}
          className={cn(
            "transition-colors duration-300",
            task.isCompleted && "text-muted-foreground line-through"
          )}
        >
          {task.name}
        </label>
      </div>
      
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onDelete}
        className="ml-auto h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100 transition-opacity"
      >
        <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
      </Button>
      
      <style>{`
        .checkbox-wrapper-11 {
          --text: hsl(var(--foreground));
          --check: hsl(var(--primary));
          --disabled: hsl(var(--muted-foreground));
          --border-radius: 10px;
          border-radius: var(--border-radius);
          position: relative;
          display: grid;
          grid-template-columns: 24px auto;
          align-items: center;
          gap: 8px;
        }

        .checkbox-wrapper-11 label {
          color: var(--text);
          position: relative;
          cursor: pointer;
          display: grid;
          align-items: center;
          width: fit-content;
          transition: color 0.3s ease;
          font-size: 14px;
        }

        .checkbox-wrapper-11 label::before {
          content: "";
          position: absolute;
          height: 2px;
          width: 0;
          left: 0;
          background: var(--disabled);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .checkbox-wrapper-11 input[type=checkbox] {
          appearance: none;
          position: relative;
          height: 16px;
          width: 16px;
          outline: none;
          border: 0;
          margin: 0;
          cursor: pointer;
          background: transparent;
          display: grid;
          align-items: center;
        }

        .checkbox-wrapper-11 input[type=checkbox]::before,
        .checkbox-wrapper-11 input[type=checkbox]::after {
          content: "";
          position: absolute;
          height: 2px;
          top: auto;
          background: var(--check);
          border-radius: 2px;
        }

        .checkbox-wrapper-11 input[type=checkbox]::before {
          width: 0px;
          right: 60%;
          transform-origin: right bottom;
        }

        .checkbox-wrapper-11 input[type=checkbox]::after {
          width: 0px;
          left: 40%;
          transform-origin: left bottom;
        }

        .checkbox-wrapper-11 input[type=checkbox]:checked::before {
          animation: check-01-11 0.4s ease forwards;
        }

        .checkbox-wrapper-11 input[type=checkbox]:checked::after {
          animation: check-02-11 0.4s ease forwards;
        }

        .checkbox-wrapper-11 input[type=checkbox]:checked + label::before {
          width: 100%;
          animation: slice-11 0.4s ease forwards;
        }

        @keyframes check-01-11 {
          0% { width: 4px; top: auto; transform: rotate(0); }
          50% { width: 0px; top: auto; transform: rotate(0); }
          51% { width: 0px; top: 8px; transform: rotate(45deg); }
          100% { width: 5px; top: 8px; transform: rotate(45deg); }
        }

        @keyframes check-02-11 {
          0% { width: 4px; top: auto; transform: rotate(0); }
          50% { width: 0px; top: auto; transform: rotate(0); }
          51% { width: 0px; top: 8px; transform: rotate(-45deg); }
          100% { width: 10px; top: 8px; transform: rotate(-45deg); }
        }

        @keyframes slice-11 {
          60% { width: 100%; left: 4px; }
          100% { width: 100%; left: 0; }
        }
      `}</style>
    </div>
  );
};
