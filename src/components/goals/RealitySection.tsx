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
    width="24"
    height="24"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M50.8973514,89.911873 L50.8973514,70.2743515 L57.4299246,70.2743515 C70.0594214,70.2743515 80.3340945,59.9996784 80.3340945,47.3701816 L80.3340945,43.4638084 L68.7018156,43.4638084 C61.2928775,43.4638084 54.7508965,47.2413682 50.8973514,52.9706672 L50.8973514,48.8768635 L50.8973514,48.4911471 L50.8879437,48.4911471 C50.6802502,36.8458421 41.1487866,27.4337842 29.4542721,27.4337842 L24.0868083,27.4337842 L24.0868083,31.3401573 C24.0868083,43.5803194 33.7391248,53.6089446 45.8316582,54.2146567 L45.8316582,89.716482 C25.7635527,87.6250744 10.0656932,70.6123056 10.0656932,50 C10.0656932,27.9801553 27.9801553,10.0656932 50,10.0656932 C72.0198447,10.0656932 89.9343068,27.9801553 89.9343068,50 C89.9343068,71.7195214 72.5032565,89.4313558 50.8973514,89.911873 M50,5 C25.1867874,5 5,25.1867874 5,50 C5,74.8132126 25.1867874,95 50,95 C74.8132126,95 95,74.8132126 95,50 C95,25.1867874 74.8132126,5 50,5" fill="currentColor" stroke="none"/>
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
          <svg width="54" height="54" viewBox="0 0 80 45" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
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
        icon={<Skull className="h-6 w-6" />}
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
      customButton: "rgb(103, 232, 249)",
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
      <div className="flex items-center gap-2 mb-3 font-semibold" style={colorScheme === "actions" ? { color: "rgb(19, 56, 68)" } : { color: "rgb(244, 77, 97)" }}>
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
                <div className="flex-shrink-0 mt-0.5" style={colorScheme === "actions" ? { color: "rgb(19, 56, 68)" } : {}}>
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
