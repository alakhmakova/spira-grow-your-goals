import { format } from "date-fns";
import { History, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AchievabilityEntry } from "@/types/goal";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AchievabilityHistoryProps {
  history: AchievabilityEntry[];
  currentValue: number;
}

export const AchievabilityHistory = ({ history, currentValue }: AchievabilityHistoryProps) => {
  const getValueColor = (value: number) => {
    if (value <= 3) return "text-destructive";
    if (value <= 6) return "text-warning";
    return "text-success";
  };

  const getTrend = (index: number) => {
    if (index === 0) return null;
    const current = history[index].value;
    const previous = history[index - 1].value;
    if (current > previous) return "up";
    if (current < previous) return "down";
    return "same";
  };

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (history.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        No history yet. History will be recorded when you change the achievability rating.
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <History className="h-4 w-4" />
          View History ({history.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Achievability History
          </DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 p-3 rounded-lg bg-muted/50">
          <div className="text-sm text-muted-foreground mb-1">Current Rating</div>
          <div className={cn("text-3xl font-bold", getValueColor(currentValue))}>
            {currentValue}/10
          </div>
        </div>

        <ScrollArea className="max-h-[300px] pr-4">
          <div className="space-y-2">
            {sortedHistory.map((entry, index) => {
              const reversedIndex = sortedHistory.length - 1 - index;
              const trend = getTrend(reversedIndex);
              
              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Trend indicator */}
                    <div className="w-6 h-6 flex items-center justify-center">
                      {trend === "up" && (
                        <TrendingUp className="h-4 w-4 text-success" />
                      )}
                      {trend === "down" && (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                      {trend === "same" && (
                        <Minus className="h-4 w-4 text-muted-foreground" />
                      )}
                      {trend === null && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    
                    {/* Value */}
                    <div className={cn("text-xl font-bold", getValueColor(entry.value))}>
                      {entry.value}
                    </div>
                  </div>
                  
                  {/* Date & Time */}
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {format(new Date(entry.timestamp), "MMM d, yyyy")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(entry.timestamp), "h:mm a")}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {history.length > 0 && (
          <div className="pt-4 border-t text-xs text-muted-foreground text-center">
            {history.length} entries recorded
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
