import { ReactNode } from "react";
import { MainNav } from "./MainNav";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};
