# Data Model: TaskFlow TODO Management Application

## Entity Definitions

### Task Entity
```typescript
interface Task {
  id: string;                    // UUID for unique identification
  title: string;                 // Required: Task title (1-200 characters)
  description?: string;          // Optional: Detailed description (max 1000 characters)
  completed: boolean;            // Completion status (default: false)
  priority: Priority;            // Priority level (default: 'medium')
  category?: string;             // Optional: Category name (max 50 characters)
  tags: string[];               // Array of tag names (max 10 tags, 30 chars each)
  dueDate?: Date;               // Optional: Due date and time
  createdAt: Date;              // Auto-generated creation timestamp
  updatedAt: Date;              // Auto-updated modification timestamp
}
```

### Priority Enum
```typescript
type Priority = 'high' | 'medium' | 'low';
```

### Category Entity
```typescript
interface Category {
  name: string;                 // Category name (max 50 characters, unique)
  color?: string;               // Optional: Hex color code for visual distinction
  taskCount: number;            // Computed: Number of tasks in this category
}
```

### Filter State
```typescript
interface FilterState {
  searchQuery: string;          // Text search across title and description
  completionFilter: 'all' | 'completed' | 'pending';
  categoryFilter?: string;      // Filter by specific category
  tagFilter: string[];          // Filter by multiple tags (AND logic)
  priorityFilter: Priority[];   // Filter by multiple priorities
  dueDateFilter: 'all' | 'today' | 'week' | 'overdue';
}
```

### Bulk Selection State
```typescript
interface BulkSelection {
  selectedTaskIds: Set<string>; // Set of selected task IDs (max 50)
  isAllSelected: boolean;       // Whether all visible tasks are selected
  availableActions: BulkAction[]; // Available actions for current selection
}

type BulkAction = 'delete' | 'complete' | 'incomplete' | 'setPriority' | 'setCategory';
```

### Application State
```typescript
interface AppState {
  tasks: Task[];                // All tasks in the application
  categories: Category[];       // All available categories
  filters: FilterState;         // Current filter configuration
  bulkSelection: BulkSelection; // Current bulk selection state
  preferences: UserPreferences; // User preferences and settings
  navigation: NavigationState;  // Page navigation context
}
```

### Navigation State
```typescript
interface NavigationState {
  currentPage: 'home' | 'tasks' | 'task-detail';
  taskDetailId?: string;        // Current task being viewed in detail
  returnFilters?: string;       // Encoded filter state for navigation back
  breadcrumbs: BreadcrumbItem[];
}

interface BreadcrumbItem {
  label: string;
  href: string;
}
```

### Page-Specific States

#### Homepage State
```typescript
interface HomepageState {
  quickStats: TaskStatistics;
  recentTasks: Task[];          // Limited to 5 most recent
  loading: boolean;
}

interface TaskStatistics {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  todayDue: number;
}
```

#### Tasks List Page State
```typescript
interface TasksPageState {
  tasks: Task[];
  filteredTasks: Task[];
  selectedTaskIds: Set<string>;
  filters: FilterState;
  sortConfig: SortConfiguration;
  viewMode: 'list' | 'grid';
  showCompleted: boolean;
  loading: boolean;
  error: string | null;
}

interface SortConfiguration {
  field: 'title' | 'dueDate' | 'priority' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}
```

#### Task Detail Page State
```typescript
interface TaskDetailState {
  task: Task | null;
  isEditing: boolean;
  relatedTasks: Task[];         // Tasks with same category or tags
  navigationContext: TaskNavigationContext;
  loading: boolean;
  error: string | null;
}

interface TaskNavigationContext {
  previousTaskId?: string;
  nextTaskId?: string;
  returnUrl: string;            // URL to return to tasks list
}
```

### User Preferences
```typescript
interface UserPreferences {
  defaultView: 'list' | 'grid';           // Default task display mode
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'title';
  sortOrder: 'asc' | 'desc';              // Sort direction
  showCompletedTasks: boolean;            // Whether to show completed tasks by default
  keyboardShortcutsEnabled: boolean;      // Enable/disable keyboard shortcuts
  theme: 'light' | 'dark' | 'system';    // Theme preference (future enhancement)
}
```

## Validation Rules

### Task Validation
- **title**: Required, 1-200 characters, non-empty after trim
- **description**: Optional, max 1000 characters
- **category**: Optional, max 50 characters, must exist in categories list
- **tags**: Max 10 tags, each tag max 30 characters, no duplicates
- **dueDate**: Must be a valid Date object, can be in the past
- **id**: Must be unique UUID string
- **priority**: Must be one of: 'high', 'medium', 'low'

### Category Validation
- **name**: Required, unique, max 50 characters, no special chars except spaces/hyphens
- **color**: Optional, valid hex color code (e.g., #FF5733)

### Bulk Operations Validation
- **selectedTaskIds**: Maximum 50 items (FR-020 requirement)
- **bulkActions**: Only available actions based on selection state

## State Transitions

### Task Lifecycle
```
Created (completed: false) 
    ↓
[User marks complete]
    ↓  
Completed (completed: true)
    ↓
[User marks incomplete] 
    ↓
Created (completed: false)
```

### Due Date States
```
No Due Date → Set Due Date → Due Date Set
Due Date Set → Remove Due Date → No Due Date
Due Date Set → [Time passes] → Overdue (computed)
```

### Bulk Selection States
```
None Selected → Select One → Single Selected
Single Selected → Select More → Multiple Selected (≤50)
Multiple Selected → Select All Visible → All Selected
All Selected → Deselect One → Multiple Selected
Multiple Selected → Clear Selection → None Selected
```

## Data Relationships

### Task-Category Relationship
- **Type**: Many-to-One (optional)
- **Constraint**: Category must exist in categories array
- **Cascade**: If category is deleted, tasks keep category name as string

### Task-Tags Relationship  
- **Type**: Many-to-Many
- **Constraint**: Tags are simple strings, no formal tag entity
- **Auto-cleanup**: Unused tags are removed from tag suggestions

### LocalStorage Structure
```typescript
interface StorageSchema {
  'taskflow-tasks': Task[];           // Array of all tasks
  'taskflow-categories': Category[];   // Array of all categories  
  'taskflow-preferences': UserPreferences; // User preferences
  'taskflow-version': string;         // Data schema version
}
```

## Computed Properties

### Category.taskCount
```typescript
taskCount = tasks.filter(task => task.category === category.name).length
```

### Overdue Status
```typescript
isOverdue = task.dueDate && task.dueDate < new Date() && !task.completed
```

### Filtered Tasks
```typescript
// Applied in order: search → completion → category → tags → priority → due date
filteredTasks = tasks
  .filter(matchesSearch)
  .filter(matchesCompletion) 
  .filter(matchesCategory)
  .filter(matchesTags)
  .filter(matchesPriority)
  .filter(matchesDueDate)
```

This data model supports all functional requirements (FR-001 through FR-020) and provides the foundation for the TaskFlow implementation.