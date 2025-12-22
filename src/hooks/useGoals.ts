import { useState, useCallback, useMemo } from "react";
import { Goal, Target, Task, Comment, SortOption, GoalFilters } from "@/types/goal";

// Mock data for demonstration
const mockGoals: Goal[] = [
  {
    id: "1",
    name: "Evaluate the Spira application by exploring predefined goals to gain insight into application's core functionalities, how they are implemented, and the developer's technical competence and potential.",
    goalType: "north-star",
    actions: [
      { id: "a1", name: "I am reviewing a job/internship application from Anastasiya Lakhmakova" },
      { id: "a2", name: "I have learned that the Spira application to set, track and achieve goals using GROW coaching model exists" },
      { id: "a3", name: "I know that Spira was created by Jensen yrkeshögskola student Anastasiya Lakhmakova as a pet project" },
    ],
    obstacles: [
      { id: "o1", name: "I do not know how to use Spira" },
      { id: "o2", name: "I know nothing about GROW coaching model" },
      { id: "o3", name: "I do not know about technical implementation of this app" },
    ],
    goalOptions: [
      { id: "opt1", name: "Follow tasks from this goal to explore Spira", description: "Active option - structured exploration through predefined tasks" },
      { id: "opt2", name: "Explore Spira on my own", description: "Self-guided exploration of the application" },
      { id: "opt3", name: "Book demo/interview with Anastasiya Lakhmakova - Spira developer", description: "Direct conversation with the developer" },
    ],
    activeOptionId: "opt1",
    will: "This goal is important to evaluate the developer's ability to create a good user experience and deliver quality technical implementation — critical factors in deciding whether she (Anastasiya Lakhmakova) is a strong candidate worth advancing in the recruitment process.",
    resources: [
      { id: "r1", type: "email", name: "Developer Email", email: "anastasiya.lakhmakova@gmail.com" },
      { id: "r2", type: "link", name: "GitHub Repository", url: "https://github.com/alakhmakova/spira-grow-your-goals" },
      { id: "r3", type: "text", name: "About Developer", content: "The developer of this application is Jensen yrkeshögskola student Anastasiya Lakhmakova" },
      { id: "r4", type: "picture", name: "Grades during education at Jensen", fileData: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdyYWRlczogRXhjZWxsZW50PC90ZXh0Pjwvc3ZnPg==", fileName: "grades.svg" },
      { id: "r5", type: "document", name: "CV Anastasiya Lakhmakova", fileData: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMFAw0DMwslAwtTTVMzIxV7AwMdSzMDNUKErlCtdSyOMyVAgpSlXIyU9P5QIAcKkKqgplbmRzdHJlYW0KZW5kb2JqCgozIDAgb2JqCjU3CmVuZG9iagoKNSAwIG9iago8PAovQ29udGVudHMgMiAwIFIKL01lZGlhQm94WzAgMCA1OTUgODQyXQovUGFyZW50IDEgMCBSCi9SZXNvdXJjZXM8PAovRm9udDw8Cj4+Cj4+Ci9UeXBlL1BhZ2UKPj4KZW5kb2JqCgoxIDAgb2JqCjw8L0NvdW50IDEvS2lkc1s1IDAgUl0vVHlwZS9QYWdlcz4+CmVuZG9iagoKNCAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMSAwIFI+PgplbmRvYmoKCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDMxOCAwMDAwMCBuIAowMDAwMDAwMDE5IDAwMDAwIG4gCjAwMDAwMDAxNDQgMDAwMDAgbiAKMDAwMDAwMDM2NyAwMDAwMCBuIAowMDAwMDAwMTYzIDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA2L1Jvb3QgNCAwIFI+PgpzdGFydHhyZWYKNDE2CiUlRU9G", fileName: "CV_Anastasiya_Lakhmakova.pdf" },
    ],
    achievability: 10,
    createdAt: new Date("2024-01-01"),
    progress: 17,
    targets: [
      {
        id: "t1",
        goalId: "1",
        optionId: "opt1",
        name: "Check backend and frontend repositories to evaluate code",
        type: "number",
        createdAt: new Date("2024-01-05"),
        progress: 0,
        unit: "repo",
        startValue: 0,
        targetValue: 2,
        currentValue: 0,
      },
      {
        id: "t2",
        goalId: "1",
        optionId: "opt1",
        name: "Set interview date with Anastasiya Lakhmakova (Spira application developer, Jensen yrkeshögskola student)",
        type: "success",
        createdAt: new Date("2024-01-06"),
        progress: 0,
        isCompleted: false,
      },
      {
        id: "t3",
        goalId: "1",
        optionId: "opt1",
        name: "Complete exploration tasks",
        type: "tasks",
        createdAt: new Date("2024-01-07"),
        progress: 33,
        tasks: [
          { id: "task1", targetId: "t3", name: 'Create a goal following instructions in the "Explore GROW model" goal', isCompleted: true, createdAt: new Date("2024-01-08") },
          { id: "task2", targetId: "t3", name: 'Explore functions in depth following instructions in "Explore GROW model" goal', isCompleted: false, createdAt: new Date("2024-01-09") },
          { id: "task3", targetId: "t3", name: 'Read about GROW coaching model to understand why the Spira application has particular functions', isCompleted: false, createdAt: new Date("2024-01-10") },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Explore GROW model by setting up 1 demo short-term goal using only required fields, adding 3 different target types, and updating progress. In the end, you will delete the goal to experience the full workflow",
    goalType: "short-term",
    achievability: 8,
    createdAt: new Date("2024-01-15"),
    progress: 0,
    targets: [],
  },
  {
    id: "3",
    name: "Master Spira's advanced goal-setting features by creating and refining 5 goals using all GROW model components (Achievability, Reality, Options, Will - motivation, Resources - all types)",
    goalType: "long-term",
    reality: "You need to create: 1) goal without option but with targets, 2) goal without option and you create an option from the goal page and then create targets, 3) goal without option and you create targets and then create an option, 4) goal with one option from the new goal form and then you create targets, 5) goal with 2 options from the goal form and then you create targets",
    achievability: 6,
    createdAt: new Date("2024-01-20"),
    progress: 0,
    targets: [],
  },
  {
    id: "4",
    name: "To gain a solid understanding of the GROW coaching model by exploring and applying insights from various reliable learning resources such as articles, books, and practical examples",
    goalType: "dream",
    reality: "Currently have basic awareness of GROW model but lack deep understanding of its practical applications",
    will: "Understanding GROW model is essential for effectively using Spira and applying structured coaching techniques to personal and professional goal achievement",
    resources: [
      { id: "r6", type: "link", name: "What is the GROW Model?", url: "https://www.performanceconsultants.com/grow-model" },
      { id: "r7", type: "link", name: "GROW Coaching Model Guide", url: "https://www.mindtools.com/ahlkcj8/the-grow-model" },
      { id: "r8", type: "text", name: "Key Principles", content: "GROW stands for: Goal, Reality, Options (or Obstacles), Will (or Way Forward)" },
    ],
    achievability: 7,
    createdAt: new Date("2024-01-25"),
    progress: 0,
    targets: [],
  },
];

const mockComments: Comment[] = [
  {
    id: "c1",
    goalId: "1",
    content: "This is an excellent way to evaluate both the technical implementation and user experience design of the Spira application.",
    author: "User",
    createdAt: new Date("2024-01-08"),
    isNote: false,
  },
  {
    id: "c2",
    goalId: "1",
    targetId: "t3",
    content: "Completed the first task - successfully created a demo goal and understood the basic workflow",
    author: "Complete exploration tasks",
    createdAt: new Date("2024-01-11"),
    isNote: true,
  },
  {
    id: "c3",
    goalId: "4",
    content: "The GROW model provides a structured framework that makes goal-setting more effective and actionable.",
    author: "User",
    createdAt: new Date("2024-01-26"),
    isNote: false,
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
    setGoals(prev => prev.map(goal => {
      if (goal.id !== id) return goal;
      
      // Track achievability history if achievability is being updated
      if (updates.achievability !== undefined && updates.achievability !== goal.achievability) {
        const newEntry = {
          id: Date.now().toString(),
          value: updates.achievability,
          timestamp: new Date(),
        };
        const history = [...(goal.achievabilityHistory || []), newEntry];
        return { ...goal, ...updates, achievabilityHistory: history };
      }
      
      return { ...goal, ...updates };
    }));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
    setComments(prev => prev.filter(comment => comment.goalId !== id));
  }, []);

  const createTarget = useCallback((
    goalId: string,
    targetData: Omit<Target, "id" | "goalId" | "createdAt" | "progress">
  ) => {
    const baseTarget: Target = {
      ...targetData,
      id: Date.now().toString(),
      goalId,
      createdAt: new Date(),
      progress: targetData.type === "success" ? (targetData.isCompleted ? 100 : 0) : 0,
    };

    // Ensure task items reference the correct targetId
    const newTarget: Target =
      baseTarget.type === "tasks" && baseTarget.tasks
        ? { ...baseTarget, tasks: baseTarget.tasks.map((t) => ({ ...t, targetId: baseTarget.id })) }
        : baseTarget;

    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          const targets = [...goal.targets, newTarget];
          const progress = calculateGoalProgress(targets);
          return { ...goal, targets, progress };
        }
        return goal;
      })
    );

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

  const addComment = useCallback((goalId: string, content: string, targetId?: string, parentId?: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      goalId,
      targetId,
      parentId,
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

    // Goal type filter
    if (filters.goalType) {
      result = result.filter(goal => goal.goalType === filters.goalType);
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

    // Pin North Star to the top
    const northStarGoals = result.filter(g => g.goalType === "north-star");
    const otherGoals = result.filter(g => g.goalType !== "north-star");
    result = [...northStarGoals, ...otherGoals];

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
