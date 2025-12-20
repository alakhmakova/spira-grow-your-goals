import { useState } from "react";
import { Plus, Link2, Mail, FileText, Image, File, X, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Resource, ResourceType } from "@/types/goal";

interface ResourceInputProps {
  resources: Resource[];
  onChange: (resources: Resource[]) => void;
  className?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const resourceTypeIcons: Record<ResourceType, React.ElementType> = {
  link: Link2,
  email: Mail,
  text: FileText,
  picture: Image,
  document: File,
};

const resourceTypeLabels: Record<ResourceType, string> = {
  link: "Link",
  email: "Email",
  text: "Text",
  picture: "Picture",
  document: "Document",
};

const resourceTypeColors: Record<ResourceType, string> = {
  link: "bg-blue-500/10 text-blue-600 border-blue-500/30 hover:bg-blue-500/20",
  email: "bg-purple-500/10 text-purple-600 border-purple-500/30 hover:bg-purple-500/20",
  text: "bg-amber-500/10 text-amber-600 border-amber-500/30 hover:bg-amber-500/20",
  picture: "bg-pink-500/10 text-pink-600 border-pink-500/30 hover:bg-pink-500/20",
  document: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20",
};

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const ResourceInput = ({ resources, onChange, className }: ResourceInputProps) => {
  const [showForm, setShowForm] = useState(false);
  const [resourceType, setResourceType] = useState<ResourceType>("link");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editContent, setEditContent] = useState("");

  const resetForm = () => {
    setResourceType("link");
    setName("");
    setUrl("");
    setEmail("");
    setContent("");
    setFile(null);
    setErrors({});
    setShowForm(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setErrors({ file: "File size must be less than 5MB" });
        return;
      }
      setFile(selectedFile);
      if (!name) {
        setName(selectedFile.name.split(".")[0]);
      }
      setErrors({});
    }
  };

  const handleAdd = async () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (resourceType === "link") {
      if (!url.trim()) {
        newErrors.url = "URL is required";
      } else if (!validateUrl(url)) {
        newErrors.url = "Invalid URL format";
      }
    }

    if (resourceType === "email") {
      if (!email.trim()) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(email)) {
        newErrors.email = "Invalid email format";
      }
    }

    if (resourceType === "text") {
      if (!content.trim()) {
        newErrors.content = "Text content is required";
      }
    }

    if ((resourceType === "picture" || resourceType === "document") && !file) {
      newErrors.file = "Please select a file";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let fileData: string | undefined;
    let mimeType: string | undefined;

    if (file) {
      fileData = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      mimeType = file.type;
    }

    const newResource: Resource = {
      id: Date.now().toString(),
      type: resourceType,
      name: name.trim(),
      url: resourceType === "link" ? url.trim() : undefined,
      email: resourceType === "email" ? email.trim() : undefined,
      content: resourceType === "text" ? content.trim() : undefined,
      fileData: file ? fileData : undefined,
      fileName: file ? file.name : undefined,
      fileSize: file ? file.size : undefined,
      mimeType,
    };

    onChange([...resources, newResource]);
    resetForm();
  };

  const handleDelete = (id: string) => {
    onChange(resources.filter((r) => r.id !== id));
  };

  const startEdit = (resource: Resource) => {
    setEditingId(resource.id);
    setEditName(resource.name);
    setEditUrl(resource.url || "");
    setEditEmail(resource.email || "");
    setEditContent(resource.content || "");
  };

  const saveEdit = (resource: Resource) => {
    const newErrors: Record<string, string> = {};

    if (!editName.trim()) {
      newErrors.editName = "Name is required";
      setErrors(newErrors);
      return;
    }

    if (resource.type === "link" && !validateUrl(editUrl)) {
      newErrors.editUrl = "Invalid URL format";
      setErrors(newErrors);
      return;
    }

    if (resource.type === "email" && !validateEmail(editEmail)) {
      newErrors.editEmail = "Invalid email format";
      setErrors(newErrors);
      return;
    }

    onChange(
      resources.map((r) =>
        r.id === resource.id
          ? {
              ...r,
              name: editName.trim(),
              url: r.type === "link" ? editUrl.trim() : r.url,
              email: r.type === "email" ? editEmail.trim() : r.email,
              content: r.type === "text" ? editContent.trim() : r.content,
            }
          : r
      )
    );
    setEditingId(null);
    setErrors({});
  };

  const Icon = resourceTypeIcons[resourceType];

  return (
    <div className={cn("space-y-3", className)}>
      {/* Resource chips */}
      {resources.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {resources.map((resource) => {
            const ResourceIcon = resourceTypeIcons[resource.type];
            const isEditing = editingId === resource.id;

            return (
              <div
                key={resource.id}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all",
                  resourceTypeColors[resource.type]
                )}
              >
                <ResourceIcon className="h-3.5 w-3.5 flex-shrink-0" />
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-6 w-24 text-xs px-1"
                      autoFocus
                    />
                    {resource.type === "link" && (
                      <Input
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        placeholder="URL"
                        className="h-6 w-32 text-xs px-1"
                      />
                    )}
                    {resource.type === "email" && (
                      <Input
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="Email"
                        className="h-6 w-32 text-xs px-1"
                      />
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="h-5 w-5"
                      onClick={() => saveEdit(resource)}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-medium truncate max-w-[120px]">
                      {resource.name}
                    </span>
                    {(resource.type === "text" || resource.type === "link" || resource.type === "email") && (
                      <button
                        type="button"
                        onClick={() => startEdit(resource)}
                        className="hover:bg-background/50 rounded p-0.5"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(resource.id)}
                      className="hover:bg-background/50 rounded p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add resource form */}
      {showForm ? (
        <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Add Resource</Label>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={resetForm}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Select
            value={resourceType}
            onValueChange={(v) => {
              setResourceType(v as ResourceType);
              setErrors({});
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(resourceTypeLabels).map(([type, label]) => {
                const TypeIcon = resourceTypeIcons[type as ResourceType];
                return (
                  <SelectItem key={type} value={type}>
                    <span className="flex items-center gap-2">
                      <TypeIcon className="h-4 w-4" />
                      {label}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <div className="space-y-2">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={cn(errors.name && "border-destructive")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          {resourceType === "link" && (
            <div className="space-y-2">
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (errors.url) setErrors((prev) => ({ ...prev, url: "" }));
                }}
                className={cn(errors.url && "border-destructive")}
              />
              {errors.url && (
                <p className="text-xs text-destructive">{errors.url}</p>
              )}
            </div>
          )}

          {resourceType === "email" && (
            <div className="space-y-2">
              <Input
                placeholder="email@example.com"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                }}
                className={cn(errors.email && "border-destructive")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>
          )}

          {resourceType === "text" && (
            <div className="space-y-2">
              <Textarea
                placeholder="Enter text content..."
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (errors.content)
                    setErrors((prev) => ({ ...prev, content: "" }));
                }}
                rows={3}
                className={cn(errors.content && "border-destructive")}
              />
              {errors.content && (
                <p className="text-xs text-destructive">{errors.content}</p>
              )}
            </div>
          )}

          {(resourceType === "picture" || resourceType === "document") && (
            <div className="space-y-2">
              <Input
                type="file"
                accept={
                  resourceType === "picture"
                    ? "image/*"
                    : ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                }
                onChange={handleFileChange}
                className={cn(errors.file && "border-destructive")}
              />
              {file && (
                <p className="text-xs text-muted-foreground">
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
              {errors.file && (
                <p className="text-xs text-destructive">{errors.file}</p>
              )}
              <p className="text-xs text-muted-foreground">Max file size: 5MB</p>
            </div>
          )}

          <Button
            type="button"
            variant="nature"
            size="sm"
            onClick={handleAdd}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowForm(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Resource
        </Button>
      )}
    </div>
  );
};
