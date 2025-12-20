export type ResourceType = "link" | "email" | "text" | "picture" | "document";

export type GoalType = "short-term" | "long-term" | "north-star" | "dream";

export interface GoalOption {
  id: string;
  name: string;
  description?: string;
}

export interface RealityItem {
  id: string;
  name: string;
}

export interface AchievabilityEntry {
  id: string;
  value: number;
  timestamp: Date;
}

export interface Resource {
  id: string;
  type: ResourceType;
  name: string;
  // For links
  url?: string;
  // For email
  email?: string;
  // For text
  content?: string;
  // For picture/document - base64 or URL (frontend only, backend will handle file storage)
  fileData?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
}

export interface Goal {
  id: string;
  name: string;
  goalType?: GoalType;
  reality?: string;
  actions?: RealityItem[]; // Actions taken or to take
  obstacles?: RealityItem[]; // Obstacles to overcome
  options?: string; // Legacy text field
  goalOptions?: GoalOption[]; // New structured options
  activeOptionId?: string; // Currently selected option
  will?: string;
  resources?: Resource[];
  achievability: number;
  achievabilityHistory?: AchievabilityEntry[];
  dueDate?: Date;
  createdAt: Date;
  progress: number;
  targets: Target[];
}

export interface Target {
  id: string;
  goalId: string;
  optionId?: string; // Link target to an option
  name: string;
  type: "number" | "success" | "tasks";
  createdAt: Date;
  deadline?: Date;
  progress: number;
  // For number type
  unit?: string;
  startValue?: number;
  targetValue?: number;
  currentValue?: number;
  // For success type
  isCompleted?: boolean;
  // For tasks type
  tasks?: Task[];
}

export interface Task {
  id: string;
  targetId: string;
  name: string;
  isCompleted: boolean;
  createdAt: Date;
}

export interface Comment {
  id: string;
  goalId: string;
  targetId?: string; // If it's a note for a specific target
  parentId?: string; // For threading - if this is a reply to another comment
  content: string;
  author: string;
  createdAt: Date;
  isNote: boolean;
}

export type SortOption = 
  | "name-asc" 
  | "name-desc" 
  | "dueDate-asc" 
  | "dueDate-desc" 
  | "progress-asc" 
  | "progress-desc" 
  | "createdAt-asc" 
  | "createdAt-desc"
  | "targets-asc"
  | "targets-desc"
  | "achievability-asc"
  | "achievability-desc";

export interface GoalFilters {
  achieved?: boolean;
  goalType?: GoalType;
  dueDateRange?: { start?: Date; end?: Date };
  createdDateRange?: { start?: Date; end?: Date };
  achievabilityRange?: { min: number; max: number };
}
