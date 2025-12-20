import { useState } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { SortOption, GoalFilters, GoalType } from "@/types/goal";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { goalTypeConfig } from "@/lib/goalTypeUtils";

interface GoalsToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  filters: GoalFilters;
  onFiltersChange: (filters: GoalFilters) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "createdAt-desc", label: "Newest first" },
  { value: "createdAt-asc", label: "Oldest first" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
  { value: "dueDate-asc", label: "Due date (soonest)" },
  { value: "dueDate-desc", label: "Due date (latest)" },
  { value: "progress-desc", label: "Progress (highest)" },
  { value: "progress-asc", label: "Progress (lowest)" },
  { value: "targets-desc", label: "Most targets" },
  { value: "targets-asc", label: "Least targets" },
  { value: "achievability-desc", label: "Achievability (highest)" },
  { value: "achievability-asc", label: "Achievability (lowest)" },
];

export const GoalsToolbar = ({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  filters,
  onFiltersChange,
}: GoalsToolbarProps) => {
  const [achievabilityRange, setAchievabilityRange] = useState([1, 10]);
  
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const clearFilters = () => {
    onFiltersChange({});
    setAchievabilityRange([1, 10]);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search goals by name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
            onClick={() => onSearchChange("")}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Sort */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <span className="hidden sm:inline">Sort</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className="flex items-center justify-between"
            >
              {option.label}
              {sortOption === option.value && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Filters */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 relative">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center absolute -top-2 -right-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filters</h4>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              )}
            </div>

            {/* Achievement status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex gap-2">
                <Button
                  variant={filters.achieved === true ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFiltersChange({ 
                    ...filters, 
                    achieved: filters.achieved === true ? undefined : true 
                  })}
                >
                  Achieved
                </Button>
                <Button
                  variant={filters.achieved === false ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFiltersChange({ 
                    ...filters, 
                    achieved: filters.achieved === false ? undefined : false 
                  })}
                >
                  In progress
                </Button>
              </div>
            </div>

            {/* Goal Type Filter */}
            <div className="space-y-2">
              <Label>Goal Type</Label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(goalTypeConfig) as GoalType[]).map((type) => {
                  const config = goalTypeConfig[type];
                  return (
                    <Button
                      key={type}
                      variant={filters.goalType === type ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "text-xs",
                        filters.goalType === type && config.bgColor
                      )}
                      onClick={() => onFiltersChange({ 
                        ...filters, 
                        goalType: filters.goalType === type ? undefined : type 
                      })}
                    >
                      {config.icon} {config.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Due date range */}
            <div className="space-y-2">
              <Label>Due date</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                      {filters.dueDateRange?.start 
                        ? format(filters.dueDateRange.start, "MMM d")
                        : "From"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dueDateRange?.start}
                      onSelect={(date) => onFiltersChange({
                        ...filters,
                        dueDateRange: { ...filters.dueDateRange, start: date }
                      })}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                      {filters.dueDateRange?.end 
                        ? format(filters.dueDateRange.end, "MMM d")
                        : "To"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={filters.dueDateRange?.end}
                      onSelect={(date) => onFiltersChange({
                        ...filters,
                        dueDateRange: { ...filters.dueDateRange, end: date }
                      })}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Created date range */}
            <div className="space-y-2">
              <Label>Created date</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                      {filters.createdDateRange?.start 
                        ? format(filters.createdDateRange.start, "MMM d")
                        : "From"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.createdDateRange?.start}
                      onSelect={(date) => onFiltersChange({
                        ...filters,
                        createdDateRange: { ...filters.createdDateRange, start: date }
                      })}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                      {filters.createdDateRange?.end 
                        ? format(filters.createdDateRange.end, "MMM d")
                        : "To"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={filters.createdDateRange?.end}
                      onSelect={(date) => onFiltersChange({
                        ...filters,
                        createdDateRange: { ...filters.createdDateRange, end: date }
                      })}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Achievability range */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Achievability</Label>
                <span className="text-sm text-muted-foreground">
                  {achievabilityRange[0]} - {achievabilityRange[1]}
                </span>
              </div>
              <Slider
                value={achievabilityRange}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => {
                  setAchievabilityRange(value);
                  onFiltersChange({
                    ...filters,
                    achievabilityRange: { min: value[0], max: value[1] }
                  });
                }}
                className="w-full"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
