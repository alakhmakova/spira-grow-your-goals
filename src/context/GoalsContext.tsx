import { createContext, useContext, ReactNode } from "react";
import { useGoals } from "@/hooks/useGoals";

type GoalsContextType = ReturnType<typeof useGoals>;

const GoalsContext = createContext<GoalsContextType | null>(null);

export const GoalsProvider = ({ children }: { children: ReactNode }) => {
  const goalsState = useGoals();

  return (
    <GoalsContext.Provider value={goalsState}>
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoalsContext = () => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error("useGoalsContext must be used within a GoalsProvider");
  }
  return context;
};
