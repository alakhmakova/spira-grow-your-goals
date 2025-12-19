import { useState, useCallback, useMemo } from "react";
import { Goal, Target, Task, Comment, SortOption, GoalFilters } from "@/types/goal";

// Mock data for demonstration
const mockGoals: Goal[] = [
  {
    id: "1",
    name: "I want to improve my public speaking skills by delivering a 10-minute presentation at work",
    reality: "Currently I feel nervous when speaking in front of groups. I've done 2 small presentations this year.",
    options: "Take a public speaking course, practice with friends, join Toastmasters",
    will: "This is important for my career growth and personal confidence",
    resources: "Company training budget, supportive colleagues, YouTube tutorials",
    achievability: 7,
    dueDate: new Date("2024-03-15"),
    createdAt: new Date("2024-01-01"),
    progress: 45,
    targets: [
      {
        id: "t1",
        goalId: "1",
        name: "Complete online presentation course",
        type: "success",
        createdAt: new Date("2024-01-05"),
        deadline: new Date("2024-02-01"),
        progress: 100,
        isCompleted: true,
      },
      {
        id: "t2",
        goalId: "1",
        name: "Practice presentations",
        type: "number",
        createdAt: new Date("2024-01-10"),
        deadline: new Date("2024-03-01"),
        progress: 40,
        unit: "presentations",
        startValue: 0,
        targetValue: 5,
        currentValue: 2,
      },
    ],
  },
  {
    id: "2",
    name: "Learn Swedish to B1 level",
    reality: "I know basic greetings and can count to 100",
    achievability: 5,
    createdAt: new Date("2024-01-15"),
    progress: 20,
    targets: [
      {
        id: "t3",
        goalId: "2",
        name: "Complete Duolingo units",
        type: "tasks",
        createdAt: new Date("2024-01-20"),
        progress: 33,
        tasks: [
          { id: "task1", targetId: "t3", name: "Basics 1", isCompleted: true, createdAt: new Date() },
          { id: "task2", targetId: "t3", name: "Basics 2", isCompleted: false, createdAt: new Date() },
          { id: "task3", targetId: "t3", name: "Phrases", isCompleted: false, createdAt: new Date() },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Run a marathon",
    achievability: 4,
    dueDate: new Date("2024-09-01"),
    createdAt: new Date("2024-02-01"),
    progress: 0,
    targets: [],
  },
];

const mockComments: Comment[] = [
  {
    id: "c1",
    goalId: "1",
    content: "Started feeling more confident after the first practice session!",
    author: "User",
    createdAt: new Date("2024-01-20"),
    isNote: false,
  },
  {
    id: "c2",
    goalId: "1",
    targetId: "t2",
    content: "Completed second presentation - went better than expected",
    author: "Practice presentations",
    createdAt: new Date("2024-02-15"),
    isNote: true,
  },
];

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("createdAt-desc");
  const [filters, setFilters] = useState<GoalFilters>({});

  const createGoal = useCallback((goalData: Omit<Goal, "id" | "createdAt" | "progress" | "targets">) => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date(),
      progress: 0,
      targets: [],
    };
    setGoals(prev => [...prev, newGoal]);
    return newGoal;
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
    setComments(prev => prev.filter(comment => comment.goalId !== id));
  }, []);

  const createTarget = useCallback((goalId: string, targetData: Omit<Target, "id" | "goalId" | "createdAt" | "progress">) => {
    const newTarget: Target = {
      ...targetData,
      id: Date.now().toString(),
      goalId,
      createdAt: new Date(),
      progress: targetData.type === "success" ? (targetData.isCompleted ? 100 : 0) : 0,
    };
    
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const targets = [...goal.targets, newTarget];
        const progress = calculateGoalProgress(targets);
        return { ...goal, targets, progress };
      }
      return goal;
    }));
    
    return newTarget;
  }, []);

  const updateTarget = useCallback((goalId: string, targetId: string, updates: Partial<Target>) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const targets = goal.targets.map(target =>
          target.id === targetId ? { ...target, ...updates } : target
        );
        const progress = calculateGoalProgress(targets);
        return { ...goal, targets, progress };
      }
      return goal;
    }));
  }, []);

  const deleteTarget = useCallback((goalId: string, targetId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const targets = goal.targets.filter(target => target.id !== targetId);
        const progress = calculateGoalProgress(targets);
        return { ...goal, targets, progress };
      }
      return goal;
    }));
  }, []);

  const addComment = useCallback((goalId: string, content: string, targetId?: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      goalId,
      targetId,
      content,
      author: targetId ? goals.find(g => g.id === goalId)?.targets.find(t => t.id === targetId)?.name || "Target" : "User",
      createdAt: new Date(),
      isNote: !!targetId,
    };
    setComments(prev => [...prev, newComment]);
    return newComment;
  }, [goals]);

  const updateComment = useCallback((commentId: string, content: string) => {
    setComments(prev => prev.map(comment =>
      comment.id === commentId ? { ...comment, content } : comment
    ));
  }, []);

  const deleteComment = useCallback((commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  }, []);

  const getGoalComments = useCallback((goalId: string) => {
    return comments.filter(c => c.goalId === goalId);
  }, [comments]);

  const filteredAndSortedGoals = useMemo(() => {
    let result = [...goals];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(goal => goal.name.toLowerCase().includes(query));
    }

    // Apply filters
    if (filters.achieved !== undefined) {
      result = result.filter(goal => 
        filters.achieved ? goal.progress === 100 : goal.progress < 100
      );
    }

    if (filters.dueDateRange) {
      result = result.filter(goal => {
        if (!goal.dueDate) return false;
        const { start, end } = filters.dueDateRange!;
        if (start && goal.dueDate < start) return false;
        if (end && goal.dueDate > end) return false;
        return true;
      });
    }

    if (filters.createdDateRange) {
      result = result.filter(goal => {
        const { start, end } = filters.createdDateRange!;
        if (start && goal.createdAt < start) return false;
        if (end && goal.createdAt > end) return false;
        return true;
      });
    }

    if (filters.achievabilityRange) {
      result = result.filter(goal =>
        goal.achievability >= filters.achievabilityRange!.min &&
        goal.achievability <= filters.achievabilityRange!.max
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "dueDate-asc":
          return (a.dueDate?.getTime() || Infinity) - (b.dueDate?.getTime() || Infinity);
        case "dueDate-desc":
          return (b.dueDate?.getTime() || 0) - (a.dueDate?.getTime() || 0);
        case "progress-asc":
          return a.progress - b.progress;
        case "progress-desc":
          return b.progress - a.progress;
        case "createdAt-asc":
          return a.createdAt.getTime() - b.createdAt.getTime();
        case "createdAt-desc":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "targets-asc":
          return a.targets.length - b.targets.length;
        case "targets-desc":
          return b.targets.length - a.targets.length;
        case "achievability-asc":
          return a.achievability - b.achievability;
        case "achievability-desc":
          return b.achievability - a.achievability;
        default:
          return 0;
      }
    });

    return result;
  }, [goals, searchQuery, sortOption, filters]);

  return {
    goals: filteredAndSortedGoals,
    allGoals: goals,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    filters,
    setFilters,
    createGoal,
    updateGoal,
    deleteGoal,
    createTarget,
    updateTarget,
    deleteTarget,
    comments,
    addComment,
    updateComment,
    deleteComment,
    getGoalComments,
    getGoalById: (id: string) => goals.find(g => g.id === id),
  };
};

function calculateGoalProgress(targets: Target[]): number {
  if (targets.length === 0) return 0;
  const totalProgress = targets.reduce((sum, target) => sum + target.progress, 0);
  return Math.round(totalProgress / targets.length);
}
