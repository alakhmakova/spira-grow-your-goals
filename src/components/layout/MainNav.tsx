import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Target, 
  Info, 
  User, 
  LogOut, 
  Menu, 
  X,
  BookOpen,
  HelpCircle,
  MessageCircle,
  ChevronDown
} from "lucide-react";
import { SpiraLogo } from "@/components/SpiraLogo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/goals", label: "All Goals", icon: Target },
  { href: "/info", label: "Info", icon: Info },
];

const infoSubLinks = [
  { href: "/info#grow-model", label: "GROW Model" },
  { href: "/info#set-goals", label: "How to Set Goals" },
  { href: "/info#reality", label: "Exploring Reality" },
  { href: "/info#options", label: "Exploring Options" },
  { href: "/info#will", label: "Exploring Will" },
  { href: "/info#targets", label: "Setting Targets" },
];

export const MainNav = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <SpiraLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/goals"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === "/goals" || location.pathname.startsWith("/goal/")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              All Goals
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === "/info"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  Info
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/info" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Overview
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {infoSubLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link to={link.href}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/info#contacts" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Contacts
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* Desktop User Menu */}
        <div className="hidden md:flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/info" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Help & Info
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border animate-fade-in">
          <nav className="container py-4 flex flex-col gap-2">
            <Link
              to="/goals"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                location.pathname === "/goals"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <Target className="h-5 w-5" />
              All Goals
            </Link>
            <Link
              to="/info"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                location.pathname === "/info"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <Info className="h-5 w-5" />
              Info
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              <User className="h-5 w-5" />
              Profile
            </Link>
            <div className="border-t border-border my-2" />
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut className="h-5 w-5" />
              Log out
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
