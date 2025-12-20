import { useState } from "react";
import { Plus, X, Pencil, Check, Zap, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RealityItem } from "@/types/goal";
import { cn } from "@/lib/utils";

interface RealityInputProps {
  actions: RealityItem[];
  obstacles: RealityItem[];
  onActionsChange: (actions: RealityItem[]) => void;
  onObstaclesChange: (obstacles: RealityItem[]) => void;
}

// Mini leaf bullet icon matching the Spira logo style
const LeafBullet = ({ className }: { className?: string }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="leafBulletGradientInput" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(175, 60%, 35%)" />
        <stop offset="50%" stopColor="hsl(165, 60%, 50%)" />
        <stop offset="100%" stopColor="hsl(85, 70%, 50%)" />
      </linearGradient>
    </defs>
    {/* Left leaf */}
    <path
      d="M12 20 C8 16, 2 10, 0 4 C4 2, 8 4, 10 8 C11 12, 12 16, 12 20"
      fill="url(#leafBulletGradientInput)"
    />
    {/* Right leaf */}
    <path
      d="M13 18 C17 14, 22 8, 24 2 C20 0, 16 2, 14 6 C13 10, 13 14, 13 18"
      fill="url(#leafBulletGradientInput)"
    />
  </svg>
);

// Crossed bones bullet for obstacles
const CrossedBonesBullet = ({ className }: { className?: string }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Crossed bones */}
    <path
      d="M4 4L20 20M4 20L20 4"
      stroke="hsl(0, 70%, 55%)"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Bone ends */}
    <circle cx="4" cy="4" r="2" fill="hsl(0, 70%, 55%)" />
    <circle cx="20" cy="4" r="2" fill="hsl(0, 70%, 55%)" />
    <circle cx="4" cy="20" r="2" fill="hsl(0, 70%, 55%)" />
    <circle cx="20" cy="20" r="2" fill="hsl(0, 70%, 55%)" />
  </svg>
);

export const RealityInput = ({
  actions,
  obstacles,
  onActionsChange,
  onObstaclesChange,
}: RealityInputProps) => {
  return (
    <div className="space-y-4">
      <RealityItemList
        title="Actions"
        icon={<Zap className="h-4 w-4" />}
        items={actions}
        onChange={onActionsChange}
        colorScheme="actions"
        placeholder="What action have you taken?"
        BulletIcon={LeafBullet}
      />
      <RealityItemList
        title="Obstacles"
        icon={<Skull className="h-4 w-4" />}
        items={obstacles}
        onChange={onObstaclesChange}
        colorScheme="obstacles"
        placeholder="What's stopping you?"
        BulletIcon={CrossedBonesBullet}
      />
    </div>
  );
};

interface RealityItemListProps {
  title: string;
  icon: React.ReactNode;
  items: RealityItem[];
  onChange: (items: RealityItem[]) => void;
  colorScheme: "actions" | "obstacles";
  placeholder: string;
  BulletIcon: React.ComponentType<{ className?: string }>;
}

const RealityItemList = ({
  title,
  icon,
  items,
  onChange,
  colorScheme,
  placeholder,
  BulletIcon,
}: RealityItemListProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const colors = {
    actions: {
      chip: "bg-primary/10 border-primary/30 text-primary",
      button: "text-primary hover:bg-primary/10",
    },
    obstacles: {
      chip: "bg-destructive/10 border-destructive/30 text-destructive",
      button: "text-destructive hover:bg-destructive/10",
    },
  };

  const scheme = colors[colorScheme];

  const handleAdd = () => {
    if (!newName.trim()) return;

    const newItem: RealityItem = {
      id: Date.now().toString(),
      name: newName.trim(),
    };

    onChange([...items, newItem]);
    setNewName("");
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const handleEdit = (item: RealityItem) => {
    setEditingId(item.id);
    setEditName(item.name);
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) return;

    onChange(
      items.map((item) =>
        item.id === editingId ? { ...item, name: editName.trim() } : item
      )
    );
    setEditingId(null);
    setEditName("");
  };

  return (
    <div className="space-y-2">
      <div className={cn("flex items-center gap-2 text-sm font-medium", scheme.button)}>
        {icon}
        <span>{title}</span>
      </div>

      {/* Items with styled bullets */}
      {items.length > 0 && (
        <div className="space-y-1.5 pl-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex items-start gap-2 py-1 transition-all"
            >
              {editingId === item.id ? (
                <div className="flex items-center gap-1 flex-1">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit();
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="h-6 text-xs flex-1"
                    autoFocus
                  />
                  <button onClick={handleSaveEdit} className="p-0.5">
                    <Check className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <>
                  {/* Styled bullet icon */}
                  <div className="flex-shrink-0 mt-1">
                    <BulletIcon />
                  </div>
                  <span className="text-sm flex-1">{item.name}</span>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="p-0.5 hover:bg-background/50 rounded"
                    >
                      <Pencil className="h-3 w-3 text-muted-foreground" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-0.5 hover:bg-background/50 rounded"
                    >
                      <X className="h-3 w-3 text-muted-foreground" />
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
        <div className="flex items-center gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
              if (e.key === "Escape") {
                setShowAddForm(false);
                setNewName("");
              }
            }}
            placeholder={placeholder}
            className="h-8 text-sm"
            autoFocus
          />
          <Button type="button" size="sm" onClick={handleAdd}>
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
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn("gap-2", scheme.button)}
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-4 w-4" />
          Add {title.slice(0, -1)}
        </Button>
      )}
    </div>
  );
};
