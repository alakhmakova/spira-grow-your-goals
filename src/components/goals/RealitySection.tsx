import { useState } from "react";
import { Plus, X, Pencil, Check, Zap } from "lucide-react";
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

// Fresh sprout bullet for actions - healthy growing plant
const FreshSproutBullet = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Stem */}
    <path
      d="M12 22V12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Left leaf - fresh and full */}
    <path
      d="M12 12C12 12 8 10 6 6C6 6 10 8 12 12"
      fill="currentColor"
      opacity="0.8"
    />
    <path
      d="M12 12C12 12 8 10 6 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Right leaf - fresh and full */}
    <path
      d="M12 8C12 8 16 6 18 2C18 2 14 4 12 8"
      fill="currentColor"
      opacity="0.8"
    />
    <path
      d="M12 8C12 8 16 6 18 2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Small new leaf bud */}
    <circle cx="12" cy="10" r="1" fill="currentColor" />
  </svg>
);

// Withered sprout bullet for obstacles - dying/damaged plant
const WitheredSproutBullet = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Bent/weak stem */}
    <path
      d="M12 22C12 22 11 18 13 14C13 14 12 12 12 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="2 1"
    />
    {/* Left leaf - wilted and drooping */}
    <path
      d="M12 12C12 12 9 13 7 11C6 10 5 8 5 8C5 8 8 9 10 11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.7"
    />
    {/* Right leaf - withered and curled */}
    <path
      d="M12 10C12 10 15 12 16 10C17 8 17 5 17 5C17 5 15 7 13 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.6"
    />
    {/* Damage marks / holes */}
    <circle cx="8" cy="10" r="0.5" fill="currentColor" opacity="0.5" />
    <circle cx="15" cy="7" r="0.5" fill="currentColor" opacity="0.5" />
  </svg>
);

// Actions header icon - thriving plant with sun
const ActionsHeaderIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Ground */}
    <path
      d="M3 20C3 20 8 19 12 19C16 19 21 20 21 20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Stem */}
    <path
      d="M12 19V10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Left leaf */}
    <path
      d="M12 12C12 12 7 10 5 5C5 5 10 7 12 12"
      fill="currentColor"
      opacity="0.8"
    />
    {/* Right leaf */}
    <path
      d="M12 9C12 9 17 7 19 2C19 2 14 4 12 9"
      fill="currentColor"
      opacity="0.8"
    />
    {/* Sun rays */}
    <circle cx="19" cy="5" r="1" fill="currentColor" opacity="0.6" />
    <path d="M19 2V3M19 7V8M16 5H17M21 5H22M17 3L17.5 3.5M20.5 6.5L21 7M17 7L17.5 6.5M20.5 3.5L21 3" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" opacity="0.4" />
  </svg>
);

// Obstacles header icon - sun with heat rays damaging plant
const ObstaclesHeaderIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Hot sun */}
    <circle cx="18" cy="5" r="3" fill="currentColor" opacity="0.8" />
    {/* Heat rays */}
    <path d="M18 0V1M18 9V10M13 5H14M22 5H23M14 1L15 2M21 8L22 9M14 9L15 8M21 2L22 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    {/* Cracked ground */}
    <path
      d="M3 20C3 20 8 19 12 19C16 19 21 20 21 20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="3 2"
    />
    {/* Wilted stem */}
    <path
      d="M12 19C12 19 11 16 13 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Drooping leaves */}
    <path
      d="M13 12C13 12 9 14 7 12C7 12 9 10 13 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.6"
    />
    <path
      d="M13 10C13 10 16 13 17 11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

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
        icon={<ActionsHeaderIcon className="h-6 w-6" />}
        items={actions}
        onUpdate={onUpdateActions}
        colorScheme="actions"
        placeholder="Add an action you've taken or will take..."
        emptyText="What actions have you taken so far?"
        BulletIcon={FreshSproutBullet}
      />

      {/* Obstacles - Destructive/Red theme */}
      <RealityList
        title="Obstacles"
        icon={<ObstaclesHeaderIcon className="h-6 w-6" />}
        items={obstacles}
        onUpdate={onUpdateObstacles}
        colorScheme="obstacles"
        placeholder="Add an obstacle to overcome..."
        emptyText="What's stopping you from achieving more?"
        BulletIcon={WitheredSproutBullet}
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
                {/* Styled bullet icon */}
                <div className="flex-shrink-0 mt-0.5" style={colorScheme === "actions" ? { color: "rgb(19, 56, 68)" } : { color: "rgb(127, 9, 29)" }}>
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
