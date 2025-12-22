import { useState, useCallback, useMemo } from "react";
import { Goal, Target, Task, Comment, SortOption, GoalFilters } from "@/types/goal";

// Demo goals for exploring Spira application
const mockGoals: Goal[] = [
  {
    id: "1",
    name: "Evaluate the Spira application by exploring predefined goals to gain insight into the application's core functionalities, implementation quality, and the developer's technical competence",
    goalType: "north-star",
    reality: "",
    actions: [
      { id: "a1", name: "Reviewing a job/internship application from Anastasiya Lakhmakova" },
      { id: "a2", name: "Discovered the Spira application — a goal-setting and tracking tool built on the GROW coaching model" },
      { id: "a3", name: "Learned that Spira was created by Jensen yrkeshögskola student Anastasiya Lakhmakova as a personal portfolio project" },
    ],
    obstacles: [
      { id: "o1", name: "Unfamiliar with how to navigate and use the Spira application" },
      { id: "o2", name: "No prior knowledge of the GROW coaching methodology" },
      { id: "o3", name: "Limited visibility into the technical implementation and code quality" },
    ],
    options: "",
    goalOptions: [
      { 
        id: "opt1", 
        name: "Follow guided exploration", 
        description: "Complete the structured tasks within this goal to systematically explore Spira's features and capabilities" 
      },
      { 
        id: "opt2", 
        name: "Self-directed exploration", 
        description: "Explore Spira independently, creating your own goals and discovering features at your own pace" 
      },
      { 
        id: "opt3", 
        name: "Schedule a demo session", 
        description: "Book a live demonstration or interview with Anastasiya Lakhmakova to discuss the project in depth" 
      },
    ],
    activeOptionId: "opt1",
    will: "This evaluation is essential for assessing the developer's ability to create intuitive user experiences and deliver quality technical implementation — key factors in determining whether Anastasiya Lakhmakova is a strong candidate worth advancing in the recruitment process.",
    resources: [
      { id: "r1", type: "email", name: "Developer Contact", email: "anastasiya.lakhmakova@gmail.com" },
      { id: "r2", type: "link", name: "GitHub Repository", url: "https://github.com/alakhmakova/spira-grow-your-goals" },
      { id: "r3", type: "text", name: "Developer Background", content: "Anastasiya Lakhmakova is a Frontend Developer student at Jensen yrkeshögskola (2023-2025), specializing in React, TypeScript, and modern web development practices." },
      { id: "r4", type: "picture", name: "Academic Transcript", url: "/grades-transcript.png" },
      { id: "r5", type: "document", name: "CV - Anastasiya Lakhmakova", url: "/cv-anastasiya-lakhmakova.pdf" },
    ],
    achievability: 10,
    achievabilityHistory: [
      { id: "ah1", value: 10, timestamp: new Date() }
    ],
    createdAt: new Date("2024-01-01"),
    progress: 0,
    targets: [
      {
        id: "t1",
        goalId: "1",
        optionId: "opt1",
        name: "Review code repositories to evaluate implementation quality",
        type: "number",
        createdAt: new Date("2024-01-05"),
        progress: 0,
        unit: "repositories",
        startValue: 0,
        targetValue: 2,
        currentValue: 0,
      },
      {
        id: "t2",
        goalId: "1",
        optionId: "opt1",
        name: "Schedule an interview with Anastasiya Lakhmakova",
        type: "success",
        createdAt: new Date("2024-01-05"),
        progress: 0,
        isCompleted: false,
      },
      {
        id: "t3",
        goalId: "1",
        optionId: "opt1",
        name: "Complete guided exploration of Spira",
        type: "tasks",
        createdAt: new Date("2024-01-05"),
        progress: 0,
        tasks: [
          { id: "task1", targetId: "t3", name: "Create a demo goal following the 'Quick Start Guide' goal instructions", isCompleted: false, createdAt: new Date() },
          { id: "task2", targetId: "t3", name: "Explore advanced features using the 'Master Advanced Features' goal", isCompleted: false, createdAt: new Date() },
          { id: "task3", targetId: "t3", name: "Study the GROW model theory via the 'Understand GROW Model' goal", isCompleted: false, createdAt: new Date() },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Quick Start Guide: Create a demo short-term goal using required fields, add 3 target types, update progress, then delete to experience the complete workflow",
    goalType: "short-term",
    reality: "",
    actions: [
      { id: "a4", name: "Ready to learn Spira's basic functionality through hands-on practice" },
      { id: "a5", name: "Have access to the New Goal form and understand the minimum required fields" },
    ],
    obstacles: [
      { id: "o4", name: "First time using the application's goal creation workflow" },
      { id: "o5", name: "Uncertain which fields are mandatory vs optional" },
    ],
    options: "",
    will: "Completing this hands-on tutorial will provide practical understanding of Spira's core features, demonstrating how the GROW model translates into an actionable goal-tracking system.",
    resources: [
      { id: "r6", type: "link", name: "GROW Model Overview", url: "/info#grow-model" },
    ],
    achievability: 9,
    createdAt: new Date("2024-01-02"),
    progress: 0,
    targets: [
      {
        id: "t4",
        goalId: "2",
        name: "Create a new goal with required fields only",
        type: "success",
        createdAt: new Date("2024-01-06"),
        progress: 0,
        isCompleted: false,
      },
      {
        id: "t5",
        goalId: "2",
        name: "Add targets of each type to your demo goal",
        type: "number",
        createdAt: new Date("2024-01-06"),
        progress: 0,
        unit: "target types",
        startValue: 0,
        targetValue: 3,
        currentValue: 0,
      },
      {
        id: "t6",
        goalId: "2",
        name: "Practice updating progress on targets",
        type: "tasks",
        createdAt: new Date("2024-01-06"),
        progress: 0,
        tasks: [
          { id: "task4", targetId: "t6", name: "Update a Number target's current value", isCompleted: false, createdAt: new Date() },
          { id: "task5", targetId: "t6", name: "Mark a Success target as complete", isCompleted: false, createdAt: new Date() },
          { id: "task6", targetId: "t6", name: "Check off tasks in a Tasks target", isCompleted: false, createdAt: new Date() },
          { id: "task7", targetId: "t6", name: "Delete the demo goal to complete the workflow", isCompleted: false, createdAt: new Date() },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Master Spira's advanced goal-setting features by creating 5 different goal configurations using all GROW model components",
    goalType: "long-term",
    reality: "",
    actions: [
      { id: "a6", name: "Completed the Quick Start Guide and understand basic goal creation" },
      { id: "a7", name: "Familiar with the three target types: Number, Success, and Tasks" },
    ],
    obstacles: [
      { id: "o6", name: "Need to understand the relationship between Options and Targets" },
      { id: "o7", name: "Must learn how to effectively use all GROW components together" },
    ],
    options: "",
    will: "Mastering these advanced features will demonstrate Spira's flexibility in handling complex goal structures and showcase how the application supports various planning strategies.",
    resources: [
      { id: "r7", type: "link", name: "Options Documentation", url: "/info#options" },
      { id: "r8", type: "link", name: "Reality Section Guide", url: "/info#reality" },
      { id: "r9", type: "text", name: "Resource Types", content: "Spira supports 5 resource types: Text notes, Links/URLs, Email contacts, Images, and Documents. Each helps capture different aspects of your goal's support system." },
    ],
    achievability: 7,
    createdAt: new Date("2024-01-03"),
    progress: 0,
    targets: [
      {
        id: "t7",
        goalId: "3",
        name: "Create and configure different goal structures",
        type: "tasks",
        createdAt: new Date("2024-01-07"),
        progress: 0,
        tasks: [
          { id: "task8", targetId: "t7", name: "Goal 1: Create a goal without options, then add targets directly", isCompleted: false, createdAt: new Date() },
          { id: "task9", targetId: "t7", name: "Goal 2: Create a goal without options, add an option from the goal page, then create targets bound to that option", isCompleted: false, createdAt: new Date() },
          { id: "task10", targetId: "t7", name: "Goal 3: Create a goal without options, add targets first, then create an option and observe target binding behavior", isCompleted: false, createdAt: new Date() },
          { id: "task11", targetId: "t7", name: "Goal 4: Create a goal with one option from the New Goal form, then add targets", isCompleted: false, createdAt: new Date() },
          { id: "task12", targetId: "t7", name: "Goal 5: Create a goal with two options from the New Goal form, set one as active, then create targets for each option", isCompleted: false, createdAt: new Date() },
        ],
      },
      {
        id: "t8",
        goalId: "3",
        name: "Use all GROW components in a single goal",
        type: "tasks",
        createdAt: new Date("2024-01-07"),
        progress: 0,
        tasks: [
          { id: "task13", targetId: "t8", name: "Fill in Reality section with Actions (what you have) and Obstacles (what blocks you)", isCompleted: false, createdAt: new Date() },
          { id: "task14", targetId: "t8", name: "Set Achievability score (1-10) and update it to see history tracking", isCompleted: false, createdAt: new Date() },
          { id: "task15", targetId: "t8", name: "Add multiple Options with descriptions and set one as active", isCompleted: false, createdAt: new Date() },
          { id: "task16", targetId: "t8", name: "Write a meaningful Will statement explaining your motivation", isCompleted: false, createdAt: new Date() },
          { id: "task17", targetId: "t8", name: "Add resources of all 5 types: Text, Link, Email, Image, Document", isCompleted: false, createdAt: new Date() },
        ],
      },
    ],
  },
  {
    id: "4",
    name: "Develop a comprehensive understanding of the GROW coaching model by exploring theoretical foundations and practical applications",
    goalType: "dream",
    reality: "",
    actions: [
      { id: "a8", name: "Curious about the methodology behind Spira's goal-setting approach" },
      { id: "a9", name: "Have practical experience using GROW principles through the Spira application" },
    ],
    obstacles: [
      { id: "o8", name: "Need structured learning resources about GROW model theory" },
      { id: "o9", name: "Want to understand how to apply GROW beyond this application" },
    ],
    options: "",
    goalOptions: [
      { 
        id: "opt4", 
        name: "Academic approach", 
        description: "Study GROW through research papers, books, and formal coaching literature" 
      },
      { 
        id: "opt5", 
        name: "Practical learning", 
        description: "Learn by applying GROW principles to real personal and professional goals" 
      },
    ],
    will: "Understanding the GROW model deeply will enhance the ability to set and achieve meaningful goals, while also providing context for evaluating how well Spira implements these coaching principles.",
    resources: [
      { id: "r10", type: "link", name: "GROW Model - Wikipedia", url: "https://en.wikipedia.org/wiki/GROW_model" },
      { id: "r11", type: "text", name: "GROW Origin", content: "The GROW model was developed in the United Kingdom in the late 1980s, primarily by Sir John Whitmore, along with colleagues Graham Alexander and Alan Fine." },
      { id: "r12", type: "link", name: "In-app GROW Guide", url: "/info#grow-model" },
      { id: "r13", type: "text", name: "Recommended Reading", content: "'Coaching for Performance' by Sir John Whitmore — the definitive guide to the GROW model and its applications in coaching and leadership." },
    ],
    achievability: 8,
    createdAt: new Date("2024-01-04"),
    progress: 0,
    targets: [
      {
        id: "t9",
        goalId: "4",
        name: "Study GROW model fundamentals",
        type: "tasks",
        createdAt: new Date("2024-01-08"),
        progress: 0,
        tasks: [
          { id: "task18", targetId: "t9", name: "Read the in-app GROW model explanation on the Info page", isCompleted: false, createdAt: new Date() },
          { id: "task19", targetId: "t9", name: "Research the history and origins of the GROW coaching framework", isCompleted: false, createdAt: new Date() },
          { id: "task20", targetId: "t9", name: "Understand each component: Goal, Reality, Options, Will (Way Forward)", isCompleted: false, createdAt: new Date() },
          { id: "task21", targetId: "t9", name: "Explore how Spira implements each GROW component in its interface", isCompleted: false, createdAt: new Date() },
        ],
      },
      {
        id: "t10",
        goalId: "4",
        name: "Explore additional learning resources",
        type: "number",
        createdAt: new Date("2024-01-08"),
        progress: 0,
        unit: "resources",
        startValue: 0,
        targetValue: 5,
        currentValue: 0,
      },
    ],
  },
];

const mockComments: Comment[] = [
  {
    id: "c1",
    goalId: "1",
    content: "Welcome to Spira! This goal will guide you through evaluating the application. Start by exploring the targets section below.",
    author: "System",
    createdAt: new Date("2024-01-01"),
    isNote: false,
  },
  {
    id: "c2",
    goalId: "2",
    content: "Tip: The minimum required fields for creating a goal are just the Goal Name and Achievability score. Everything else is optional!",
    author: "System",
    createdAt: new Date("2024-01-02"),
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
