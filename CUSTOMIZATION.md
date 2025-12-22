# Customization Guide

This guide explains how to customize the predefined goals in your Spira Grow Your Goals application.

## Changing Predefined Goals

### Location

The 3 predefined goals are located in:
```
src/hooks/useGoals.ts
```

Look for the section with this header comment:
```typescript
// ============================================================================
// PREDEFINED GOALS (MOCK DATA)
// ============================================================================
```

### The Three Predefined Goals

1. **Goal 1: Public Speaking** (Lines ~20-60)
   - Default name: "I want to improve my public speaking skills by delivering a 10-minute presentation at work"
   
2. **Goal 2: Learn Swedish** (Lines ~62-84)
   - Default name: "Learn Swedish to B1 level"
   
3. **Goal 3: Run a Marathon** (Lines ~86-94)
   - Default name: "Run a marathon"

### How to Modify

#### To Change Goal Names:

Find the goal you want to modify and change the `name` field:

```typescript
{
  id: "1",
  name: "Your new goal name here",  // <-- Edit this line
  reality: "...",
  // ... other fields
}
```

#### To Change Goal Details:

You can modify any of these fields for each goal:
- `name` - The goal title
- `reality` - Current situation description
- `options` - Available options/strategies (for Goal 1)
- `will` - Commitment and motivation statement (for Goal 1)
- `resources` - Array of helpful resources (links, contacts, emails)
- `achievability` - Number from 1-10 indicating how achievable the goal is
- `dueDate` - Target completion date
- `targets` - Array of sub-targets/milestones

#### Example: Renaming All Three Goals

```typescript
const mockGoals: Goal[] = [
  // Goal 1: Fitness
  {
    id: "1",
    name: "Get fit and healthy",  // Changed from "Public Speaking"
    // ... rest of the fields
  },
  // Goal 2: Career
  {
    id: "2",
    name: "Get promoted to senior developer",  // Changed from "Learn Swedish"
    // ... rest of the fields
  },
  // Goal 3: Personal
  {
    id: "3",
    name: "Read 24 books this year",  // Changed from "Run a marathon"
    // ... rest of the fields
  },
];
```

### Important Notes

1. **Keep the `id` field unchanged** - The IDs ("1", "2", "3") should remain the same to maintain data consistency.

2. **Restart the development server** - After making changes, restart your dev server:
   ```bash
   npm run dev
   ```

3. **Clear browser storage** - If you don't see changes, clear your browser's local storage:
   - Open Developer Tools (F12)
   - Go to Application/Storage tab
   - Clear Local Storage for your application

4. **Date format** - When changing dates, use this format:
   ```typescript
   dueDate: new Date("2024-12-31"),
   ```

### Need More Help?

- See the full file: `src/hooks/useGoals.ts`
- The file has detailed inline comments to guide you
- Each goal structure is clearly marked with comments

---

## Related Files

If you want to understand the goal data structure better:
- Goal type definitions: `src/types/goal.ts`
- Goal display: `src/pages/Goals.tsx`
- Individual goal page: `src/pages/Goal.tsx`
