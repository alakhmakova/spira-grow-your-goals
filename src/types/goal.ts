export interface Goal {
  id: string;
  name: string;
  reality?: string;
  options?: string;
  will?: string;
  resources?: string;
  achievability: number;
  dueDate?: Date;
  createdAt: Date;
  progress: number;
  targets: Target[];
}

export interface Target {
  id: string;
  goalId: string;
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
  dueDateRange?: { start?: Date; end?: Date };
  createdDateRange?: { start?: Date; end?: Date };
  achievabilityRange?: { min: number; max: number };
}
