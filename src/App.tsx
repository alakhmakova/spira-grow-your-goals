import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoalsProvider } from "@/context/GoalsContext";
import Index from "./pages/Index";
import GoalsPage from "./pages/Goals";
import GoalPage from "./pages/Goal";
import InfoPage from "./pages/Info";
import ProfilePage from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GoalsProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/goal/:id" element={<GoalPage />} />
            <Route path="/info" element={<InfoPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GoalsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
