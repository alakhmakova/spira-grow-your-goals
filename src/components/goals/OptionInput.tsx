import { useState } from "react";
import { X, Plus, Pencil, Check, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GoalOption } from "@/types/goal";
import { cn } from "@/lib/utils";

interface OptionInputProps {
  options: GoalOption[];
  onChange: (options: GoalOption[]) => void;
}

export const OptionInput = ({ options, onChange }: OptionInputProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [error, setError] = useState("");

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

    onChange([...options, newOption]);
    setNewName("");
    setNewDescription("");
    setError("");
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    onChange(options.filter((o) => o.id !== id));
  };

  const handleEdit = (option: GoalOption) => {
    setEditingId(option.id);
    setEditName(option.name);
    setEditDescription(option.description || "");
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) return;

    onChange(
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
    "bg-primary/10 border-primary/30 text-primary",
    "bg-accent/10 border-accent/30 text-accent-foreground",
    "bg-warning/10 border-warning/30 text-warning",
    "bg-success/10 border-success/30 text-success",
    "bg-secondary/50 border-secondary text-secondary-foreground",
  ];

  return (
    <div className="space-y-3">
      {/* Existing options */}
      {options.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {options.map((option, index) => (
            <div
              key={option.id}
              className={cn(
                "group relative flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
                optionColors[index % optionColors.length]
              )}
            >
              {editingId === option.id ? (
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Option name"
                    className="h-8 text-sm"
                    autoFocus
                  />
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description (optional)"
                    rows={2}
                    className="text-sm resize-none"
                  />
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={handleSaveEdit}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{option.name}</span>
                    {option.description && (
                      <span className="text-xs opacity-70 line-clamp-1">
                        {option.description}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleEdit(option)}
                      className="p-1 hover:bg-background/50 rounded"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(option.id)}
                      className="p-1 hover:bg-destructive/20 rounded text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add form */}
      {showAddForm ? (
        <div className="p-3 rounded-lg border border-dashed border-primary/30 bg-primary/5 space-y-3">
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
            <Button type="button" size="sm" onClick={handleAdd}>
              Add Option
            </Button>
            <Button
              type="button"
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(true)}
          className={cn(
            "gap-2",
            options.length === 0 &&
              "text-[rgb(103,232,249)] border-[rgb(103,232,249)] hover:bg-[rgb(103,232,249)] hover:text-black"
          )}
        >
          <Plus className="h-4 w-4" />
          Add Option
        </Button>
      )}

      {options.length === 0 && !showAddForm && (
        <p className="text-xs text-muted-foreground">
          Options help you explore different strategies to achieve your goal.
        </p>
      )}
    </div>
  );
};
