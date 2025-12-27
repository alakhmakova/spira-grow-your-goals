import { useState } from "react";
import { Plus, X, Pencil, Check, Zap, AlertTriangle } from "lucide-react";
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-max md:auto-rows-fr">
      {/* Actions - Primary/Teal theme */}
      <RealityList
        title="Actions"
        icon={<Zap className="h-5 w-5" />}
        items={actions}
        onUpdate={onUpdateActions}
        colorScheme="actions"
        placeholder="Add an action you've taken or will take..."
        emptyText="What actions have you taken so far?"
      />

      {/* Obstacles - Destructive/Red theme */}
      <RealityList
        title="Obstacles"
        icon={<AlertTriangle className="h-5 w-5" />}
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
      bg: "",
      border: "",
      text: "text-primary",
      hoverBg: "",
      buttonBg: "",
      customBorder: "rgb(215, 253, 245)",
      customBg: "rgb(215, 253, 245)",
      customHover: "rgba(103, 232, 249, 0.15)",
      customButton: "hsl(187, 92%, 63%)",
    },
    obstacles: {
      bg: "",
      border: "",
      text: "text-destructive",
      hoverBg: "",
      buttonBg: "",
      customBorder: "#fccfd7",
      customBg: "#fccfd7",
      customHover: "rgba(244, 77, 97, 0.15)",
      customButton: "rgb(244, 77, 97)",
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
    <div 
      className="flex flex-col h-full rounded-xl border-2 p-4"
      style={colorScheme === "actions" ? { borderColor: "rgb(215, 253, 245)", backgroundColor: "rgb(215, 253, 245)" } : { borderColor: "#fccfd7", backgroundColor: "#fccfd7" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 font-semibold" style={colorScheme === "actions" ? { color: "rgb(19, 56, 68)" } : { color: "rgb(127, 9, 29)" }}>
        {icon}
        <span>{title}</span>
        <span className="text-xs font-normal opacity-70">({items.length})</span>
      </div>

      {/* Items List */}
      <div className="space-y-2 mb-3 flex-1">
        {items.length === 0 && !showAddForm && (
          <p className="text-sm text-muted-foreground italic">{emptyText}</p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="group flex items-start gap-3 p-2 rounded-lg transition-colors"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colorScheme === "actions" ? "rgba(103, 232, 249, 0.15)" : "rgba(244, 77, 97, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
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
                {/* Bullet point */}
                <div 
                  className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full" 
                  style={{ backgroundColor: colorScheme === "actions" ? "rgb(19, 56, 68)" : "rgb(127, 9, 29)" }}
                />
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
            onClick={handleAdd}
            style={{ backgroundColor: colorScheme === "actions" ? "rgb(103, 232, 249)" : "rgb(244, 77, 97)", color: "white" }}
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
          className="w-full gap-2 mt-auto"
          style={{ backgroundColor: colorScheme === "actions" ? "rgb(103, 232, 249)" : "rgb(244, 77, 97)", color: "white" }}
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-4 w-4" />
          Add {title.slice(0, -1)}
        </Button>
      )}
    </div>
  );
};
