import { useState } from "react";
import { Plus, Sprout, AlertTriangle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { GoalCard } from "@/components/goals/GoalCard";
import { GoalsToolbar } from "@/components/goals/GoalsToolbar";
import { DeleteBin } from "@/components/goals/DeleteBin";
import { CreateGoalForm } from "@/components/goals/CreateGoalForm";
import { Button } from "@/components/ui/button";
import { useGoalsContext } from "@/context/GoalsContext";
import { Goal } from "@/types/goal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const GoalsPage = () => {
  const {
    goals,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    filters,
    setFilters,
    updateGoal,
    deleteGoal,
  } = useGoalsContext();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; goalId: string | null }>({
    show: false,
    goalId: null,
  });

  const handleDragStart = (e: React.DragEvent, goal: Goal) => {
    e.dataTransfer.setData("goalId", goal.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDelete = (goalId: string) => {
    setDeleteConfirm({ show: true, goalId });
  };

  const confirmDelete = () => {
    if (deleteConfirm.goalId) {
      deleteGoal(deleteConfirm.goalId);
    }
    setDeleteConfirm({ show: false, goalId: null });
  };

  const handleRename = (id: string, name: string) => {
    updateGoal(id, { name });
  };

  const handleChangeDueDate = (id: string, dueDate: Date | undefined) => {
    updateGoal(id, { dueDate });
  };

  const handleChangeAchievability = (id: string, achievability: number) => {
    updateGoal(id, { achievability });
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Your Goals
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and achieve your personal goals using the GROW model
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} variant="nature" size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            New Goal
          </Button>
        </div>

        {/* Toolbar */}
        <GoalsToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOption={sortOption}
          onSortChange={setSortOption}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Goals Grid */}
        {goals.length > 0 ? (
          <>
            {/* Create button at top if many goals */}
            {goals.length > 6 && (
              <div className="mb-6">
                <Button 
                  onClick={() => setShowCreateForm(true)} 
                  variant="soft" 
                  className="w-full sm:w-auto gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add another goal
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {goals.map((goal, index) => (
                <div 
                  key={goal.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <GoalCard
                    goal={goal}
                    onDelete={handleDelete}
                    onRename={handleRename}
                    onChangeDueDate={handleChangeDueDate}
                    onChangeAchievability={handleChangeAchievability}
                    onDragStart={handleDragStart}
                  />
                </div>
              ))}
            </div>

            {/* Delete Bin */}
            <div className="mt-8">
              <DeleteBin onDrop={(id) => deleteGoal(id)} />
            </div>

            {/* Create button at bottom */}
            {goals.length > 3 && (
              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={() => setShowCreateForm(true)} 
                  variant="outline" 
                  size="lg"
                  className="gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Create new goal
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-bounce-subtle">
              <Sprout className="h-12 w-12 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              Plant your first goal
            </h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Start your growth journey by setting your first goal. 
              Use the GROW model to break it down into achievable steps.
            </p>
            <Button onClick={() => setShowCreateForm(true)} variant="nature" size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Create your first goal
            </Button>
          </div>
        )}
      </div>

      {/* Create Goal Dialog */}
      <CreateGoalForm open={showCreateForm} onOpenChange={setShowCreateForm} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirm.show} onOpenChange={(open) => !open && setDeleteConfirm({ show: false, goalId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Goal Permanently?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              This action cannot be undone. The goal and all its targets will be 
              <span className="font-semibold text-destructive"> permanently deleted</span> and 
              it will be impossible to restore it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default GoalsPage;
