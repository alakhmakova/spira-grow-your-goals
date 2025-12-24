# Goal Page - Professional Audit & Documentation

## Table of Contents
1. [Overview](#overview)
2. [Page Layout & Structure](#page-layout--structure)
3. [Color Scheme & Design System](#color-scheme--design-system)
4. [Typography & Fonts](#typography--fonts)
5. [Page Elements & Functions](#page-elements--functions)
6. [Forms & Dialogs](#forms--dialogs)
7. [Warnings, Errors & Notifications](#warnings-errors--notifications)
8. [Menus & Dropdowns](#menus--dropdowns)
9. [Navigation & Links](#navigation--links)
10. [Responsive Behavior](#responsive-behavior)

---

## Overview

The Goal page (`/goal/:id`) is the detailed view for a single goal in the Spira goal management application. It implements the GROW model (Goal, Reality, Options, Will) and provides comprehensive tools for goal tracking, target management, and progress monitoring.

**Route**: `/goal/:id` where `:id` is the unique goal identifier  
**Component**: `src/pages/Goal.tsx`  
**Primary Purpose**: Display and manage individual goal details, targets, and progress

---

## Page Layout & Structure

The Goal page uses a three-section vertical layout with visual separators:

### Section 1: Goal Header & Details
**Background**: `--background` (off-white: `40 20% 98%`)  
**Position**: Top of page  
**Padding**: `py-4 sm:py-8 px-4 sm:px-6` (responsive)

**Contains**:
- Breadcrumb navigation
- Circular progress indicator (100px diameter)
- Goal name (editable inline)
- Goal type selector dropdown
- Achievability rating display/editor
- Creation date
- Due date picker
- Achievability reminder banner (dismissible)
- Three-dot menu (more actions)

### Visual Separator (Wave)
**Type**: SVG wave separator  
**Color**: `#133844` (deep teal)  
**Purpose**: Smooth transition between sections  
**Height**: 320px viewBox, responsive width

### Section 2: GROW Details & Targets
**Background**: `#133844` (deep teal)  
**Text Color**: `--primary-foreground` (white)  
**Padding**: `pb-8 sm:pb-12`  
**Top Margin**: `-mt-[50px]` (overlaps with wave)

**Contains**:
- GROW model sections (collapsible accordions):
  - Reality: Actions & Obstacles
  - Options: Strategy selection with mind map visualization
  - Will: Motivation textarea
- Resources section (collapsible)
- Targets section with light green background (`#d7fdf5`)

### Visual Separator (Rounded)
**Type**: SVG curved separator  
**Purpose**: Smooth transition back to background color  
**Effect**: Creates depth through layering

### Section 3: Comments & Notes
**Background**: `--background` (returns to off-white)  
**Padding**: `pt-4 pb-8 sm:pt-6 sm:pb-12 px-4 sm:px-6`

**Contains**:
- Comment submission form
- Comments list with search/filter/sort
- Threaded replies support

---

## Color Scheme & Design System

### Primary Colors

| Color Variable | HSL Value (Light) | Hex Approximation | Usage |
|---------------|------------------|-------------------|-------|
| `--background` | `40 20% 98%` | `#FDFCFB` | Main page background |
| `--foreground` | `220 25% 15%` | `#1F2937` | Primary text color |
| `--primary` | `175 60% 35%` | `#23877A` | Deep teal - primary actions |
| `--primary-foreground` | `0 0% 100%` | `#FFFFFF` | Text on primary background |
| `--primary-light` | `175 55% 50%` | `#40B5A6` | Lighter teal variant |
| `--primary-dark` | `175 65% 25%` | `#167067` | Darker teal variant |

### Semantic Colors

| Color Variable | HSL Value | Purpose |
|---------------|-----------|---------|
| `--success` | `95 75% 45%` `#95D239` | Completed states, positive feedback |
| `--warning` | `40 95% 55%` `#F59E0B` | Due soon, caution states |
| `--destructive` | `0 70% 55%` `#E53E3E` | Delete actions, errors, overdue |
| `--muted` | `40 10% 92%` `#F3F4F4` | Subtle backgrounds |
| `--muted-foreground` | `220 10% 50%` `#6B7280` | Secondary text |

### Section-Specific Colors
- **GROW Section Background**: `#133844` (deep teal)
- **Targets Section Background**: `#d7fdf5` (light mint green)
- **Card Background**: Pure white

### Gradients
- `--gradient-primary`: Teal to emerald (135deg)
- `--gradient-success`: Teal to lime (135deg)
- `--gradient-progress`: Horizontal teal to lime

---

## Typography & Fonts

### Font Families
- **Body**: `'Inter', sans-serif` (weights: 400, 500, 600, 700)
- **Display/Headings**: `'Raleway', sans-serif` (weights: 300-800, letter-spacing: 0.02em)

### Text Hierarchy

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Goal Name | Raleway | 24-30px (responsive) | 700 | foreground |
| Section Headings | Raleway | 20px | 600 | Context-dependent |
| Progress % | Inter | 24px | 700 | foreground |
| Body Text | Inter | 14px | 400 | foreground |
| Meta Info | Inter | 12px | 400 | muted-foreground |
| Labels | Inter | 14-16px | 500 | foreground |

---

## Page Elements & Functions

### 1. Breadcrumb Navigation
- **Location**: Top of page
- **Format**: `All Goals > {Goal Name}`
- **Colors**: Muted with hover transition
- **Function**: Context and quick navigation to `/goals`

### 2. Circular Progress Indicator
- **Size**: 100px diameter, 8px stroke
- **States**:
  - 0-99%: Standard foreground color
  - 100%: Success color with pulse animation + confetti
- **Function**: Visual goal progress representation

### 3. Goal Name Editor
- **Type**: Inline editing
- **Triggers**: Click to edit, Enter to save, Escape to cancel
- **Font**: Raleway bold, 24-30px responsive
- **Hover**: Primary color
- **Validation**: Non-empty name required

### 4. Goal Type Selector
- **Component**: Dropdown select
- **Options**:
  1. No type
  2. Short-term (Calendar icon)
  3. Long-term (TrendingUp icon)
  4. North Star (Star icon) - Only one allowed globally
  5. Dream (Sparkles icon)
- **Styling**: Primary border when selected
- **Function**: Categorize goals by timeframe/purpose

### 5. Achievability Rating
- **Display**: Pill button with gauge icon
- **Range**: 1-10 scale
- **Colors**:
  - Low (1-3): Destructive/Red
  - Medium (4-6): Warning/Amber
  - High (7-10): Success/Green
- **Popover**: Grid of 10 buttons for selection
- **History**: Shows achievability changes over time
- **Function**: Track confidence in goal achievability

### 6. Date Controls
- **Creation Date**: Display only, clock icon, format: "Created {MMM d, yyyy}"
- **Due Date**: Popover calendar, "Set due date" or "Due {date}"
- **Function**: Track goal timeline

### 7. Achievability Reminder Banner
- **Style**: Primary background with sparkles icon
- **Message**: "Has anything changed about this goal? Consider updating your achievability rating."
- **Dismissible**: Yes, hidden after dismiss

### 8. Three-Dot Menu (Goal Actions)
**Menu Items**:
1. Rename - Opens inline editor
2. Change Achievability - Prompt for 1-10 value
3. Delete Goal - Opens confirmation dialog

### 9. GROW Model Sections (Accordions)

#### Reality: Actions & Obstacles
- **Layout**: Two-column grid
- **Actions** (left):
  - Icon: Zap (lightning)
  - Theme: Primary/teal
  - Bullet: Gradient leaf icon
  - Function: Track actions taken/planned
- **Obstacles** (right):
  - Icon: Skull
  - Theme: Destructive/red
  - Bullet: Crossed bones
  - Function: Identify blockers
- **Management**: Inline edit, delete, add form

#### Options: Strategic Mind Map
- **Visualization**: Radial layout around central goal node
- **Central Node**: Goal name (clickable to edit)
- **Option Nodes**:
  - Draggable positions (mouse + touch)
  - Distance: 160px from center
  - Size: 140px width
  - Active indicator: Success badge with check
  - Actions dropdown: Edit, Make Active, Delete
- **Connection Lines**: Dashed lines to center
- **Add Node**: Expands to inline form
- **Special Behaviors**:
  - First option auto-active
  - Custom positioning saved
  - Warns about target binding
- **Function**: Define and visualize strategy options

#### Will: Motivation
- **Type**: Textarea field
- **Placeholder**: "Describe your commitment and motivation..."
- **Min Height**: 100px, resizable vertically
- **Function**: Document personal motivation

### 10. Resources Section (Collapsible)
**Resource Types**:
1. **Link**: Opens in new tab, external link icon
2. **Email**: Opens mailto, validated email format
3. **Text**: Viewable in modal, optional content
4. **Picture**: Upload max 5MB, preview with download
5. **Document**: Upload max 5MB, download only

**Features**:
- Type-specific color coding
- Pill-shaped display buttons
- Copy/Edit/Delete actions
- Add form with validation
- File upload support

### 11. Targets Section
- **Background**: Light mint green (#d7fdf5)
- **Header**: Target icon, count badge, active option badge
- **Empty State**: Explains GROW importance
- **Target Cards**: 
  - Three types: Number, Done/Not Done, Tasks
  - Progress indicator
  - Deadline management
  - Overdue warnings
  - Dropdown actions menu
  - Staggered fade-in animation

---

## Forms & Dialogs

### 1. Create Target Form
**Fields**:
- **Name** (required): "How would you break this goal down?"
- **Option Selector** (conditional): Bind to strategy option
- **Type Selection** (required): Radio cards for Number/Done/Tasks
- **Type-Specific Fields**:
  - Number: Start value, Target value, Unit (optional)
  - Tasks: Task list with add/edit/delete
- **Deadline** (optional): Calendar popover

**Validation**:
- Name required
- Number: Non-negative, start ≠ target
- Tasks: At least one task required

### 2. Delete Goal Dialog
- **Icon**: Alert triangle (destructive)
- **Title**: "Delete Goal Permanently?"
- **Message**: Warns about permanent deletion of goal and all targets
- **Actions**: Cancel / "Yes, delete permanently"

### 3. Option Binding Dialog
- **Trigger**: Adding first option with existing unbound targets
- **Title**: "What to do with existing targets?"
- **Options**:
  1. Bind targets - Assign all to new option
  2. Delete targets - Permanently remove
- **Function**: Manage target-option relationships

### 4. Target Delete Dialog
- **Title**: "Delete Target?"
- **Message**: Conditional based on task count
- **Actions**: Cancel / Delete

### 5. Progress Update Modal (Number Targets)
- **Layout**: 3-column grid (Start/Current/Target)
- **Progress Bar**: Real-time calculation
- **Validation**:
  - No negatives
  - Start ≠ Target
  - Current between min and max
- **Unit Field**: Optional text input
- **Function**: Edit all numerical parameters

### 6. Resource View Modals
**Email**: Shows email link with mailto
**Text**: Pre-wrapped content display
**Picture**: Image preview with download
**Document**: File info with download button

### 7. Resource Edit Modal
- **Fields**: Name (required), type-specific fields
- **Validation**: Format checking for URLs/emails
- **Actions**: Cancel / Save with check icon

### 8. Option Details Modal
**View Mode**:
- Description display
- Active badge if current
- Actions: Edit / Make Active / Delete

**Edit Mode**:
- Name input (auto-focus)
- Description textarea
- Actions: Cancel / Save

### 9. Goal Name Edit Modal
- **Single Input**: Current goal name
- **Context**: From options mind map central node
- **Actions**: Cancel / Save

---

## Warnings, Errors & Notifications

### Warnings

#### 1. Incomplete GROW Model
- **Location**: Above accordion sections
- **Trigger**: Missing reality/options/will/resources
- **Style**: Primary background, alert triangle icon
- **Message**: "Working with all stages of the GROW model helps achieve your goal more effectively."
- **Link**: "Learn more" → `/info#grow-model`
- **Badge**: "Incomplete" on section header

#### 2. No Active Option
- **Location**: Top of Options section
- **Style**: Primary background, sparkles icon
- **Message**: "Choose an active option to focus on. Your targets and progress will be tracked for the selected option."

#### 3. Overdue Targets
**States**:
- **Overdue**: Destructive border, alert icon, "Overdue: {date}"
- **Due Today**: Warning border, "Due today: {date}"
- **Due Soon** (3 days): Amber border, "Due soon: {date}"
- **Note**: 100% complete targets don't show overdue styling

### Errors

#### Form Validation

**Create Target Form**:
| Field | Condition | Message |
|-------|-----------|---------|
| Name | Empty | "Target name is required" |
| Start Value | Empty | "Start value is required" |
| Start Value | Negative | "Negative numbers are not allowed" |
| Target Value | Empty | "Target value is required" |
| Target Value | Negative | "Negative numbers are not allowed" |
| Target Value | Same as start | "Start and target values cannot be the same" |
| Tasks | None added | "Add at least one task to your target" |

**Resource Form**:
| Field | Condition | Message |
|-------|-----------|---------|
| Name | Empty | "Name is required" |
| URL | Empty/Invalid | "URL is required" / "Invalid URL format" |
| Email | Empty/Invalid | "Email is required" / "Invalid email format" |
| File | Not selected | "Please select a file" |
| File | >5MB | "File size must be less than 5MB" |

**Progress Update**:
| Condition | Message |
|-----------|---------|
| Negative values | "Negative numbers are not allowed" |
| Start = Target | "Start and target values cannot be the same" |
| Current out of range | "Current value must be between {min} and {max}" |

**Error Display**:
- Color: Destructive red
- Size: Small/extra-small
- Position: Below field
- Border: Red on invalid field
- Clearing: Real-time when field modified

### Success Notifications

#### Goal Completion (100%)
- Full-screen confetti animation (5 seconds)
- Progress circle: Success color with pulse
- Stroke changes to success color

#### Target Created/Updated
- Immediate UI update
- Fade-in animation
- Staggered display (50ms delay per item)

### Information Messages

**Empty States**:
- **No Targets**: Explains GROW model importance
- **No Resources**: Simple add prompt
- **No Options**: Explains purpose
- **No Comments**: "No comments yet. Add your first comment above!"
- **No Actions/Obstacles**: Contextual prompting questions

**Type Information**:
- **Success Type**: "This target will be marked as either 'Done' or 'Not Done' with a simple toggle switch."

---

## Menus & Dropdowns

### 1. Goal Actions Menu (Three-Dot)
**Items**:
1. Rename - Inline editor
2. Change Achievability - Prompt (1-10)
3. (Separator)
4. Delete Goal - Confirmation dialog (destructive)

### 2. Target Actions Menu
**Items**:
1. Update Progress (Number only) - Modal
2. Rename - Prompt
3. Set Deadline - Calendar popover
4. Add Note - Prompt → creates linked comment
5. Move to Option (if options exist) - Submenu
   - No option (unbound)
   - (Separator)
   - List of options with current indicator
6. (Separator)
7. Delete - Confirmation dialog (destructive)

### 3. Option Node Menu
**Items**:
1. Edit - Inline edit mode
2. Make Active / Unset Active - Toggle (star icon filled when active)
3. Delete - Removes option (destructive)

### 4. Info Navigation Dropdown
**Items**:
1. Overview (BookOpen icon)
2. (Separator)
3. GROW Model
4. How to Set Goals
5. Exploring Reality
6. Exploring Options
7. Exploring Will
8. Setting Targets
9. (Separator)
10. Contacts (MessageCircle icon)

### 5. User Menu Dropdown
**Items**:
1. Profile (User icon)
2. Help & Info (HelpCircle icon)
3. (Separator)
4. Log out (LogOut icon, destructive)

### 6. Goal Type Selector
**Options** with icons:
1. No type (gray)
2. Short-term (Calendar, 14px)
3. Long-term (TrendingUp, 14px)
4. North Star (Star, 14px) - Disabled if exists elsewhere
5. Dream (Sparkles, 14px)

### 7. Comments Filter
**Options**:
1. All
2. Comments only
3. Notes only
4. {Target names} - One per target (truncated at 20 chars)

### 8. Comments Sort
**Options**:
1. Newest first (default)
2. Oldest first

### 9. Resource Type Selector
**Options** with icons:
1. Link (Link2)
2. Email (Mail)
3. Text (FileText)
4. Picture (Image)
5. Document (File)

---

## Navigation & Links

### Breadcrumb
- **Path**: `All Goals > {Goal Name}`
- **All Goals**: Link to `/goals`, muted → foreground on hover
- **Separator**: ChevronRight icon (4x4)
- **Current**: Foreground color, medium weight, truncated at 200px

### Internal Links
| Link Text | Destination | Icon | Location |
|-----------|-------------|------|----------|
| "Learn more" | `/info#grow-model` | ExternalLink | GROW warning |
| "Learn more" | `/info#targets` | ExternalLink | Create Target form |
| "Back to Goals" | `/goals` | None | Not found state |

### Main Navigation (Header)
**Desktop**:
1. Logo/Home (`/`) - SpiraLogo, scale on hover
2. All Goals (`/goals`) - Active with primary bg/text
3. Info (dropdown) - See Info Dropdown section
4. User Menu (dropdown) - See User Menu section

**Mobile** (< md):
- Hamburger menu icon
- Animated panel with fade-in
- Items: All Goals, Info, Profile, (Separator), Log out

### Comment Threading
- **Reply Button**: Reply icon (3x3), top right of comment
- **Behavior**: Opens inline reply input
- **Display**: Indented (ml-6), border-left indicator
- **Expand/Collapse**: ChevronDown/Up, shows reply count

---

## Responsive Behavior

### Breakpoints
| Size | Width | Usage |
|------|-------|-------|
| sm | 640px | Small devices |
| md | 768px | Medium devices / menu toggle |
| lg | 1024px | Large devices |
| xl | 1280px | Extra large |
| 2xl | 1400px | Container max |

### Layout Adaptations

**Goal Header**:
- Mobile: Centered progress, 24px name, flex-wrap meta, py-4 px-4
- Desktop: Left progress, 30px name, horizontal meta, py-8 px-6

**GROW Section**:
- Mobile: Single column, pb-8 pt-8, Reality 1-col grid
- Desktop: Two columns where applicable, pb-12 pt-12, Reality 2-col grid

**Options Mind Map**:
- Mobile: 120px radius, 10px touch threshold, 400x400 min
- Desktop: 160px radius, 5px mouse threshold, better spacing

**Comments**:
- Mobile: Single column filters, stacked search/dropdowns
- Desktop: Horizontal filter row, search expands (flex-1)

**Navigation**:
- Mobile: Hamburger, full-screen dropdown, stacked items
- Desktop: Horizontal nav, inline dropdowns, icon user menu

### Typography Scaling
| Element | Mobile | Desktop |
|---------|--------|---------|
| Goal Name | 24px | 30px (lg:) |
| Section Titles | 20px | 20px |
| Progress Label | 20px | 24px (sm:) |

### Touch Optimization
- **Drag**: 10px threshold (vs 5px mouse)
- **Targets**: Min 44x44px touch areas, increased padding
- **Forms**: No auto-focus on mobile, larger radio cards, touch calendar

### Performance
- **Lazy Rendering**: Collapsed accordions don't render until expanded
- **Comments**: Show 5 initially, "Show more" button
- **Resources**: Collapsed by default
- **Animation Stagger**: 50ms delay per target card

---

## Technical Notes

### State Management
- **Global**: React Context (`GoalsContext`)
- **Local**: Component-level for UI
- **Route**: Goal ID from URL params

### Key Libraries
- UI: Radix UI primitives
- Styling: Tailwind CSS
- Forms: React Hook Form
- Dates: date-fns
- Icons: lucide-react
- Routing: react-router-dom

### Accessibility
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management in modals
- Screen reader friendly labels
- WCAG AA color contrast

### Data Persistence
- Context-based state
- Real-time updates
- Optimistic UI updates
- Auto-save pattern (no explicit save button)

---

## Summary

The Goal page is a comprehensive interface implementing the GROW coaching model for personal goal management, featuring:

- **Rich Visual Design**: Multi-section layout with organic wave separators and carefully selected color palette
- **Interactive Elements**: Draggable mind maps, inline editing, collapsible sections
- **Comprehensive Forms**: 9 different dialogs for various management tasks
- **Real-time Feedback**: Progress indicators, validation messages, success states
- **Responsive Design**: Fully adaptive from mobile to desktop
- **Accessibility**: WCAG compliant with keyboard and screen reader support

The page successfully balances powerful functionality with an intuitive, visually appealing interface that guides users through the goal-setting and achievement process.

