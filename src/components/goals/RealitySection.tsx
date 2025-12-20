import { useState } from "react";
import { Plus, X, Pencil, Check, Zap, Skull } from "lucide-react";
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

// Mini leaf bullet icon matching the Spira logo style
const LeafBullet = ({ className }: { className?: string }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="leafBulletGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(175, 60%, 35%)" />
        <stop offset="50%" stopColor="hsl(165, 60%, 50%)" />
        <stop offset="100%" stopColor="hsl(85, 70%, 50%)" />
      </linearGradient>
    </defs>
    {/* Left leaf */}
    <path
      d="M12 20 C8 16, 2 10, 0 4 C4 2, 8 4, 10 8 C11 12, 12 16, 12 20"
      fill="url(#leafBulletGradient)"
    />
    {/* Right leaf */}
    <path
      d="M13 18 C17 14, 22 8, 24 2 C20 0, 16 2, 14 6 C13 10, 13 14, 13 18"
      fill="url(#leafBulletGradient)"
    />
  </svg>
);

// Skull bullet for obstacles
const SkullBullet = ({ className }: { className?: string }) => (
  <Skull className={cn("h-3 w-3 text-destructive", className)} />
);

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
        BulletIcon={LeafBullet}
      />

      {/* Obstacles - Destructive/Red theme */}
      <RealityList
        title="Obstacles"
        icon={<Skull className="h-4 w-4" />}
        items={obstacles}
        onUpdate={onUpdateObstacles}
        colorScheme="obstacles"
        placeholder="Add an obstacle to overcome..."
        emptyText="What's stopping you from achieving more?"
        BulletIcon={SkullBullet}
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
  BulletIcon: React.ComponentType<{ className?: string }>;
}

const RealityList = ({
  title,
  icon,
  items,
  onUpdate,
  colorScheme,
  placeholder,
  emptyText,
  BulletIcon,
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
    },
    obstacles: {
      bg: "bg-destructive/10",
      border: "border-destructive/30",
      text: "text-destructive",
      hoverBg: "hover:bg-destructive/15",
      buttonBg: "bg-destructive/20 hover:bg-destructive/30",
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
                {/* Styled bullet icon */}
                <div className="flex-shrink-0 mt-0.5">
                  <BulletIcon />
                </div>
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
