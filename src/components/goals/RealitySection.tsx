import { useState } from "react";
import { Plus, X, Pencil, Check, Zap, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RealityItem } from "@/types/goal";
import { cn } from "@/lib/utils";

interface RealitySectionProps {
  actions: RealityItem[];
  obstacles: RealityItem[];
  onUpdateActions: (actions: RealityItem[]) => void;
  onUpdateObstacles: (obstacles: RealityItem[]) => void;
}

export const RealitySection = ({
  actions,
  obstacles,
  onUpdateActions,
  onUpdateObstacles,
}: RealitySectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Actions - Primary/Teal theme */}
      <RealityList
        title="Actions"
        icon={<Zap className="h-4 w-4" />}
        items={actions}
        onUpdate={onUpdateActions}
        colorScheme="actions"
        placeholder="Add an action you've taken or will take..."
        emptyText="What actions have you taken so far?"
      />

      {/* Obstacles - Warning/Amber theme */}
      <RealityList
        title="Obstacles"
        icon={<Mountain className="h-4 w-4" />}
        items={obstacles}
        onUpdate={onUpdateObstacles}
        colorScheme="obstacles"
        placeholder="Add an obstacle to overcome..."
        emptyText="What's stopping you from achieving more?"
      />
    </div>
  );
};

interface RealityListProps {
  title: string;
  icon: React.ReactNode;
  items: RealityItem[];
  onUpdate: (items: RealityItem[]) => void;
  colorScheme: "actions" | "obstacles";
  placeholder: string;
  emptyText: string;
}

const RealityList = ({
  title,
  icon,
  items,
  onUpdate,
  colorScheme,
  placeholder,
  emptyText,
}: RealityListProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const colors = {
    actions: {
      bg: "bg-primary/10",
      border: "border-primary/30",
      text: "text-primary",
      hoverBg: "hover:bg-primary/15",
      buttonBg: "bg-primary/20 hover:bg-primary/30",
      bulletBg: "bg-primary",
    },
    obstacles: {
      bg: "bg-warning/10",
      border: "border-warning/30",
      text: "text-warning-foreground",
      hoverBg: "hover:bg-warning/15",
      buttonBg: "bg-warning/20 hover:bg-warning/30 text-warning-foreground",
      bulletBg: "bg-warning",
    },
  };

  const scheme = colors[colorScheme];

  const handleAdd = () => {
    if (!newName.trim()) return;

    const newItem: RealityItem = {
      id: Date.now().toString(),
      name: newName.trim(),
    };

    onUpdate([...items, newItem]);
    setNewName("");
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    onUpdate(items.filter((item) => item.id !== id));
  };

  const handleEdit = (item: RealityItem) => {
    setEditingId(item.id);
    setEditName(item.name);
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) return;

    onUpdate(
      items.map((item) =>
        item.id === editingId ? { ...item, name: editName.trim() } : item
      )
    );
    setEditingId(null);
    setEditName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
    if (e.key === "Escape") {
      setShowAddForm(false);
      setEditingId(null);
      setNewName("");
      setEditName("");
    }
  };

  return (
    <div className={cn("rounded-xl border-2 p-4", scheme.bg, scheme.border)}>
      {/* Header */}
      <div className={cn("flex items-center gap-2 mb-3 font-semibold", scheme.text)}>
        {icon}
        <span>{title}</span>
        <span className="text-xs font-normal opacity-70">({items.length})</span>
      </div>

      {/* Items List */}
      <div className="space-y-2 mb-3">
        {items.length === 0 && !showAddForm && (
          <p className="text-sm text-muted-foreground italic">{emptyText}</p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "group flex items-start gap-3 p-2 rounded-lg transition-colors",
              scheme.hoverBg
            )}
          >
            {editingId === item.id ? (
              <div className="flex-1 flex items-center gap-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleSaveEdit)}
                  className="h-8 text-sm flex-1"
                  autoFocus
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={handleSaveEdit}
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => setEditingId(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <>
                {/* Styled bullet */}
                <div className={cn(
                  "flex-shrink-0 w-2 h-2 rounded-full mt-1.5",
                  scheme.bulletBg
                )} />
                <span className="flex-1 text-sm text-foreground">{item.name}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1 hover:bg-background/50 rounded"
                  >
                    <Pencil className="h-3 w-3 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 hover:bg-background/50 rounded"
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add Form */}
      {showAddForm ? (
        <div className="flex items-center gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleAdd)}
            placeholder={placeholder}
            className="h-8 text-sm flex-1"
            autoFocus
          />
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className={scheme.buttonBg}
            onClick={handleAdd}
          >
            Add
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              setShowAddForm(false);
              setNewName("");
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn("w-full gap-2", scheme.buttonBg, scheme.text)}
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-4 w-4" />
          Add {title.slice(0, -1)}
        </Button>
      )}
    </div>
  );
};
