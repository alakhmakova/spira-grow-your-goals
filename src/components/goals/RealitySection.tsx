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

// Tree bullet icon from Spira logo (tree only, no person)
const LeafBullet = ({ className }: { className?: string }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="treeBulletGradient" x1="50%" y1="100%" x2="50%" y2="0%">
        <stop offset="0%" stopColor="currentColor" />
        <stop offset="40%" stopColor="currentColor" />
        <stop offset="70%" stopColor="currentColor" />
        <stop offset="100%" stopColor="currentColor" />
      </linearGradient>
    </defs>
    {/* Tree only - circles arranged in tree pattern */}
    <g transform="translate(15, 10) scale(0.6)" fill="url(#treeBulletGradient)">
      {/* Main trunk and branching structure */}
      <path d="M84.5,91c-5.6-2.7-12.5-4.8-20.1-6V53.4c1.4,0.6,2.9,0.9,4.5,0.9c5.5,0,10.1-3.5,11.8-8.4c5.3-1.4,9.2-6.3,9.2-12c0-4.2-2.1-7.9-5.2-10.1c0.1-0.5,0.1-1,0.1-1.5c0-6.9-5.6-12.5-12.5-12.5c-0.2,0-0.4,0-0.6,0c-2-4.3-6.3-7.3-11.3-7.3S51,5.5,49,9.8c-0.2,0-0.4,0-0.6,0C41.6,9.7,36,15.3,36,22.2c0,0.5,0,1,0.1,1.5c-3.2,2.3-5.2,6-5.2,10.1c0,5.8,3.9,10.6,9.2,12c1.7,4.9,6.3,8.4,11.8,8.4c1.6,0,3.1-0.3,4.5-0.9v30.6c-2.7-0.2-5.4-0.3-8.1-0.3c-14,0-26.8,2.8-36.2,7.3c-3.5,1.7-2,6.9,1.9,6.5c10.5-1.2,22.1-1.9,34.3-1.9c12.2,0,23.8,0.7,34.3,1.9C86.4,97.9,87.9,92.7,84.5,91z M74.9,30.7c1.4,0,2.6,1.2,2.6,2.6c0,1.4-1.2,2.6-2.6,2.6c-1.4,0-2.6-1.2-2.6-2.6C72.3,31.8,73.5,30.7,74.9,30.7z M68.3,17.5c1.4,0,2.6,1.2,2.6,2.6c0,1.4-1.2,2.6-2.6,2.6c-1.4,0-2.6-1.2-2.6-2.6C65.7,18.7,66.9,17.5,68.3,17.5z M45.9,37.3c-1.4,0-2.6-1.2-2.6-2.6c0,1.4,1.2-2.6,2.6-2.6c1.4,0,2.6,1.2,2.6,2.6C48.5,36.2,47.4,37.3,45.9,37.3z M51.9,24c-1.4,0-2.6-1.2-2.6-2.6c0-1.4,1.2-2.6,2.6-2.6c1.4,0,2.6,1.2,2.6,2.6C54.5,22.8,53.3,24,51.9,24z M61.4,44c-1.4,0-2.6-1.2-2.6-2.6c0-1.4,1.2-2.6,2.6-2.6S64,40,64,41.4C64,42.8,62.9,44,61.4,44z"/>
    </g>
  </svg>
);

// Crossed bones bullet for obstacles
const CrossedBonesBullet = ({ className }: { className?: string }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Crossed bones */}
    <path
      d="M4 4L20 20M4 20L20 4"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Bone ends */}
    <circle cx="4" cy="4" r="2" fill="currentColor" />
    <circle cx="20" cy="4" r="2" fill="currentColor" />
    <circle cx="4" cy="20" r="2" fill="currentColor" />
    <circle cx="20" cy="20" r="2" fill="currentColor" />
  </svg>
);

const ObstaclesBurstIcon = ({ className }: { className?: string }) => (
  <svg
    width="34"
    height="34"
    viewBox="0 5 100 100"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    className={className}
  >
    <g transform="matrix(1.3586955394997358,0,0,1.3586955394997358,-17.934780862245905,-9.934780862245905)" fill="currentColor">
      <g>
        <path d="M50,68.4c10.1,0,18.4-8.2,18.4-18.4S60.1,31.6,50,31.6S31.6,39.9,31.6,50S39.9,68.4,50,68.4z M50,34.6   c8.5,0,15.4,6.9,15.4,15.4S58.5,65.4,50,65.4S34.6,58.5,34.6,50S41.5,34.6,50,34.6z" />
        <path d="M50,60c5.5,0,10-4.5,10-10c0-5.5-4.5-10-10-10s-10,4.5-10,10C40,55.5,44.5,60,50,60z M50,43c3.9,0,7,3.2,7,7s-3.2,7-7,7   s-7-3.2-7-7S46.1,43,50,43z" />
        <path d="M50,26c0.8,0,1.5-0.7,1.5-1.5v-9.8c0-0.8-0.7-1.5-1.5-1.5s-1.5,0.7-1.5,1.5v9.8C48.5,25.3,49.2,26,50,26z" />
        <path d="M51.5,85.3v-9.8c0-0.8-0.7-1.5-1.5-1.5s-1.5,0.7-1.5,1.5v9.8c0,0.8,0.7,1.5,1.5,1.5S51.5,86.1,51.5,85.3z" />
        <path d="M74,50c0,0.8,0.7,1.5,1.5,1.5h9.8c0.8,0,1.5-0.7,1.5-1.5s-0.7-1.5-1.5-1.5h-9.8C74.7,48.5,74,49.2,74,50z" />
        <path d="M14.7,51.5h9.8c0.8,0,1.5-0.7,1.5-1.5s-0.7-1.5-1.5-1.5h-9.8c-0.8,0-1.5,0.7-1.5,1.5S13.9,51.5,14.7,51.5z" />
        <path d="M75,76.5c0.4,0,0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L69.1,67c-0.6-0.6-1.5-0.6-2.1,0s-0.6,1.5,0,2.1l6.9,6.9   C74.2,76.3,74.6,76.5,75,76.5z" />
        <path d="M30.9,33c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L26.1,24c-0.6-0.6-1.5-0.6-2.1,0s-0.6,1.5,0,2.1   L30.9,33z" />
        <path d="M68.1,33.4c0.4,0,0.8-0.1,1.1-0.4l6.9-6.9c0.6-0.6,0.6-1.5,0-2.1c-0.6-0.6-1.5-0.6-2.1,0L67,30.9c-0.6,0.6-0.6,1.5,0,2.1   C67.3,33.3,67.7,33.4,68.1,33.4z" />
        <path d="M26.1,76l6.9-6.9c0.6-0.6,0.6-1.5,0-2.1s-1.5-0.6-2.1,0L24,73.9c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4   S25.8,76.3,26.1,76z" />
      </g>
    </g>
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
        icon={
          <svg width="51" height="51" viewBox="5 6 65 30" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-[51px] w-[51px]">
            <defs id="SvgjsDefs1001"></defs>
            <g id="SvgjsG1007" featurekey="symbolFeature-0" transform="matrix(1,0,0,1,0,0)" fill="currentColor">
              <title xmlns="http://www.w3.org/2000/svg">glyph finish</title>
              <g xmlns="http://www.w3.org/2000/svg" data-name="Layer 25">
                <path d="M32.62,27.92l15.84,6.54A3.37505,3.37505,0,0,0,51.58,36.57a3.41927,3.41927,0,0,0,1.8-.52l13.35-8.43a3.38365,3.38365,0,0,0,1.56-2.66c0-.06.01-.12.01-.18a3.39617,3.39617,0,0,0-1.27-2.64l-4.69-3.75-.00531-.00421a9.01861,9.01861,0,1,0-14.27027-2.18664L48.05,16.21l-1.62,1.22a3.01042,3.01042,0,0,0-1.13,3.05l1.09,4.87L33.17,23.02a.94787.94787,0,0,0-.81.21A.99254.99254,0,0,0,32,24v3A.9873.9873,0,0,0,32.62,27.92ZM56,5a6.99967,6.99967,0,0,1,4.76117,12.13092L60.76,17.13l-4.93-3.94a2.98751,2.98751,0,0,0-3.67-.06l-2.48425,1.86573A6.996,6.996,0,0,1,56,5Z"></path>
                <path d="M30,29a.99974.99974,0,0,0,1-1V22a1,1,0,0,0-2,0v6A.99974.99974,0,0,0,30,29Z"></path>
                <path d="M11.001,25a.99631.99631,0,0,0,.51367-.14258c4.64648-2.78906,13.28808-1.87353,13.375-1.86328a1,1,0,1,0,.2207-1.98779c-.38183-.043-9.39551-1.00147-14.625,2.13623A1,1,0,0,0,11.001,25Z"></path>
                <path d="M9.50391,35.86816a.99964.99964,0,0,0,1.36425-.37207c3.69532-6.4663,9.07325-7.4707,9.29981-7.51025a1,1,0,0,0-.332-1.97217c-.26465.04395-6.5166,1.16211-10.7041,8.49024A.99948.99948,0,0,0,9.50391,35.86816Z"></path>
                <path d="M20.293,31.293a19.74042,19.74042,0,0,0-4.24121,6.39062.99964.99964,0,1,0,1.89648.63282A18.031,18.031,0,0,1,21.707,32.70654.99972.99972,0,0,0,20.293,31.293Z"></path>
              </g>
            </g>
          </svg>
        }
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
        icon={<ObstaclesBurstIcon className="h-[34px] w-[34px]" />}
        items={obstacles}
        onUpdate={onUpdateObstacles}
        colorScheme="obstacles"
        placeholder="Add an obstacle to overcome..."
        emptyText="What's stopping you from achieving more?"
        BulletIcon={CrossedBonesBullet}
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
