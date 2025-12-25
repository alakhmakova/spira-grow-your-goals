import { Link } from "react-router-dom";
import { ArrowRight, Target, Sprout, TrendingUp } from "lucide-react";
import { SpiraLogo } from "@/components/SpiraLogo";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 nature-gradient opacity-10" />
        <div className="container relative py-8">
          <nav className="flex items-center justify-between mb-16">
            <SpiraLogo size="lg" animated />
            <div className="hidden sm:flex items-center gap-4">
              <Link to="/info">
                <Button variant="ghost">Learn More</Button>
              </Link>
              <Link to="/goals">
                <Button variant="nature">Get Started</Button>
              </Link>
            </div>
          </nav>

          <div className="max-w-3xl mx-auto text-center py-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sprout className="h-4 w-4" />
              Grow your potential
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Transform your dreams into{" "}
              <span className="text-primary">achievable goals</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Spira helps you create, track, and achieve personal goals using the proven GROW coaching model. 
              Plant your goals, nurture them with targets, and watch them flourish.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/goals">
                <Button variant="nature" size="xl" className="gap-2">
                  Start Growing
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/info">
                <Button variant="outline" size="lg">
                  Learn about GROW
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Set SMART Goals</h3>
              <p className="text-muted-foreground">
                Define clear, achievable goals using the GROW coaching framework.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <Sprout className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Break goals into measurable targets and watch your progress grow.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Achieve Success</h3>
              <p className="text-muted-foreground">
                Celebrate milestones and build momentum towards your dreams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t" id="contacts">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <SpiraLogo size="sm" />
          <p className="text-sm text-muted-foreground">
            © 2024 Spira. Grow your potential.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
