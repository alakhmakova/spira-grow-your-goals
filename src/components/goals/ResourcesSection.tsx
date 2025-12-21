import { useState } from "react";
import {
  Link2,
  Mail,
  FileText,
  Image,
  File,
  X,
  Pencil,
  Check,
  ExternalLink,
  Download,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Resource, ResourceType } from "@/types/goal";

interface ResourcesSectionProps {
  resources: Resource[];
  onUpdate: (resources: Resource[]) => void;
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
  link: "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20",
  email: "bg-accent/10 text-accent-foreground border-accent/30 hover:bg-accent/20",
  text: "bg-secondary/50 text-secondary-foreground border-secondary hover:bg-secondary/70",
  picture: "bg-nature/10 text-nature border-nature/30 hover:bg-nature/20",
  document: "bg-muted text-muted-foreground border-border hover:bg-muted/80",
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

export const ResourcesSection = ({ resources, onUpdate }: ResourcesSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editContent, setEditContent] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Add form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [resourceType, setResourceType] = useState<ResourceType>("link");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const resetAddForm = () => {
    setResourceType("link");
    setName("");
    setUrl("");
    setEmail("");
    setContent("");
    setFile(null);
    setErrors({});
    setShowAddForm(false);
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

    // Name is required for all types except email
    if (resourceType !== "email" && !name.trim()) {
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

    // For email type, use the email as the name
    const resourceName = resourceType === "email" ? email.trim() : name.trim();

    const newResource: Resource = {
      id: Date.now().toString(),
      type: resourceType,
      name: resourceName,
      url: resourceType === "link" ? url.trim() : undefined,
      email: resourceType === "email" ? email.trim() : undefined,
      content: resourceType === "text" ? content.trim() : undefined,
      fileData: file ? fileData : undefined,
      fileName: file ? file.name : undefined,
      fileSize: file ? file.size : undefined,
      mimeType,
    };

    onUpdate([...resources, newResource]);
    resetAddForm();
  };

  const handleResourceClick = (resource: Resource) => {
    if (resource.type === "link" && resource.url) {
      window.open(resource.url, "_blank", "noopener,noreferrer");
    } else {
      setViewingResource(resource);
    }
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onUpdate(resources.filter((r) => r.id !== id));
  };

  const startEdit = (resource: Resource, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingResource(resource);
    setEditName(resource.name);
    setEditUrl(resource.url || "");
    setEditEmail(resource.email || "");
    setEditContent(resource.content || "");
    setErrors({});
  };

  const saveEdit = () => {
    if (!editingResource) return;

    const newErrors: Record<string, string> = {};

    if (!editName.trim()) {
      newErrors.editName = "Name is required";
      setErrors(newErrors);
      return;
    }

    if (editingResource.type === "link" && !validateUrl(editUrl)) {
      newErrors.editUrl = "Invalid URL format";
      setErrors(newErrors);
      return;
    }

    if (editingResource.type === "email" && !validateEmail(editEmail)) {
      newErrors.editEmail = "Invalid email format";
      setErrors(newErrors);
      return;
    }

    onUpdate(
      resources.map((r) =>
        r.id === editingResource.id
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
    setEditingResource(null);
    setErrors({});
  };

  const downloadFile = (resource: Resource) => {
    if (resource.fileData) {
      const link = document.createElement("a");
      link.href = resource.fileData;
      link.download = resource.fileName || resource.name;
      link.click();
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full py-3 text-left font-medium hover:text-primary transition-colors">
          <span className="flex items-center gap-2">
            Resources
            {resources.length > 0 && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {resources.length}
              </span>
            )}
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="pt-2 pb-4">
        {resources.length === 0 && !showAddForm ? (
          <div className="text-center py-6 text-muted-foreground">
            <File className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm mb-3">No resources added yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Resource
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-3">
              {resources.map((resource) => {
                const Icon = resourceTypeIcons[resource.type];

                return (
                  <button
                    key={resource.id}
                    onClick={() => handleResourceClick(resource)}
                    className={cn(
                      "group flex items-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer",
                      resourceTypeColors[resource.type]
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm font-medium truncate max-w-[150px]">
                      {resource.name}
                    </span>
                    {resource.type === "link" && (
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    )}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {(resource.type === "text" ||
                        resource.type === "link" ||
                        resource.type === "email") && (
                        <button
                          onClick={(e) => startEdit(resource, e)}
                          className="p-1 hover:bg-background/50 rounded"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                      )}
                      {(resource.type === "picture" || resource.type === "document") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(resource, e);
                          }}
                          className="p-1 hover:bg-background/50 rounded"
                          title="Edit name"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(resource.id, e)}
                        className="p-1 hover:bg-background/50 rounded"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Add form */}
            {showAddForm ? (
              <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Add Resource</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={resetAddForm}
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

                {resourceType !== "email" && (
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
                )}

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
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Resource
              </Button>
            )}
          </>
        )}
      </CollapsibleContent>

      {/* View Resource Modal */}
      <Dialog open={!!viewingResource} onOpenChange={() => setViewingResource(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {viewingResource && (
                <>
                  {(() => {
                    const Icon = resourceTypeIcons[viewingResource.type];
                    return <Icon className="h-5 w-5" />;
                  })()}
                  {viewingResource.name}
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {viewingResource && (
            <div className="space-y-4">
              {viewingResource.type === "email" && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <a
                    href={`mailto:${viewingResource.email}`}
                    className="text-primary hover:underline block"
                  >
                    {viewingResource.email}
                  </a>
                </div>
              )}

              {viewingResource.type === "text" && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Content</Label>
                  <div className="p-3 bg-muted rounded-lg whitespace-pre-wrap text-sm">
                    {viewingResource.content}
                  </div>
                </div>
              )}

              {viewingResource.type === "picture" && viewingResource.fileData && (
                <div className="space-y-3">
                  <img
                    src={viewingResource.fileData}
                    alt={viewingResource.name}
                    className="w-full rounded-lg"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile(viewingResource)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              )}

              {viewingResource.type === "document" && (
                <div className="space-y-3 text-center py-4">
                  <File className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {viewingResource.fileName}
                  </p>
                  {viewingResource.fileSize && (
                    <p className="text-xs text-muted-foreground">
                      {(viewingResource.fileSize / 1024).toFixed(1)} KB
                    </p>
                  )}
                  <Button
                    variant="nature"
                    onClick={() => downloadFile(viewingResource)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Document
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Resource Modal */}
      <Dialog open={!!editingResource} onOpenChange={() => setEditingResource(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
          </DialogHeader>

          {editingResource && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={cn(errors.editName && "border-destructive")}
                />
                {errors.editName && (
                  <p className="text-xs text-destructive">{errors.editName}</p>
                )}
              </div>

              {editingResource.type === "link" && (
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    className={cn(errors.editUrl && "border-destructive")}
                  />
                  {errors.editUrl && (
                    <p className="text-xs text-destructive">{errors.editUrl}</p>
                  )}
                </div>
              )}

              {editingResource.type === "email" && (
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className={cn(errors.editEmail && "border-destructive")}
                  />
                  {errors.editEmail && (
                    <p className="text-xs text-destructive">{errors.editEmail}</p>
                  )}
                </div>
              )}

              {editingResource.type === "text" && (
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={4}
                  />
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setEditingResource(null)}>
                  Cancel
                </Button>
                <Button variant="nature" onClick={saveEdit}>
                  <Check className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Collapsible>
  );
};
