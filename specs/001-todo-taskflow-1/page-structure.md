# Page Structure: TaskFlow Application

## Next.js App Router File Structure

```
app/
├── layout.tsx                 # Root layout with navigation
├── page.tsx                   # Homepage (/)
├── tasks/
│   ├── page.tsx              # Tasks list page (/tasks)
│   └── [id]/
│       └── page.tsx          # Task detail page (/tasks/[id])
├── components/               # Shared UI components
├── lib/                     # Services and utilities
├── hooks/                   # Custom React hooks
└── globals.css              # Tailwind CSS 4.0 configuration
```

## Page Definitions

### 1. Homepage (`/`) - App Overview and Navigation

**Purpose**: Application landing page with overview and primary navigation

**Components**:
- **AppHeader**: Main navigation with logo and primary links
- **HeroSection**: Brief app introduction and value proposition  
- **QuickStats**: Overview of user's task statistics (total, completed, overdue)
- **RecentTasks**: Preview of 5 most recent tasks
- **ActionButtons**: Quick access to create task and view all tasks

**Data Requirements**:
- Task count summaries (total, completed, pending, overdue)
- Recent task list (limited to 5 items)
- User preferences for display settings

**Navigation**:
- Primary CTA: "View All Tasks" → `/tasks`
- Secondary CTA: "Create New Task" → `/tasks` with new task modal
- Settings link in header

**Functional Requirements**:
- FR-004: Display task completion statistics
- FR-005: Show recently modified tasks
- FR-009: Highlight overdue task count in quick stats

### 2. Tasks List Page (`/tasks`) - All Tasks Management

**Purpose**: Main task management interface with full CRUD operations

**Components**:
- **TaskListHeader**: Page title, view options, bulk actions
- **FilterPanel**: Search, category, priority, and date filters
- **TaskList**: Main task display with sortable columns
- **TaskItem**: Individual task row/card with quick actions
- **BulkActionBar**: Actions for multiple selected tasks
- **CreateTaskFAB**: Floating action button for new tasks
- **TaskFormModal**: Create/edit task form overlay

**Data Requirements**:
- Complete task list with filtering and sorting
- Category and tag collections for filter options
- Bulk selection state management
- Real-time search results

**URL Parameters & State**:
```typescript
// URL query parameters
/tasks?search=keyword&category=work&priority=high&status=pending&sort=dueDate&order=asc

// Component state
interface TasksPageState {
  tasks: Task[];
  filteredTasks: Task[];
  selectedTaskIds: Set<string>;
  filters: FilterState;
  sortConfig: SortConfig;
  viewMode: 'list' | 'grid';
  showCompleted: boolean;
}
```

**Keyboard Shortcuts**:
- Ctrl+N (Cmd+N): Open new task form
- Ctrl+F (Cmd+F): Focus search input
- Escape: Clear selection/close modals
- Delete: Delete selected tasks
- Enter: Edit selected task

**Functional Requirements**:
- FR-001, FR-002, FR-003: Task CRUD operations
- FR-011: Keyword search functionality  
- FR-012, FR-013, FR-014: All filtering options
- FR-015, FR-020: Bulk operations (max 50)
- FR-016: Keyboard shortcuts
- FR-017: Responsive design

### 3. Task Detail Page (`/tasks/[id]`) - Individual Task Focus

**Purpose**: Detailed view and editing of a single task

**Components**:
- **TaskDetailHeader**: Task title, completion status, quick actions
- **TaskMetadata**: Creation date, last modified, category, priority
- **TaskDescription**: Full description with rich text formatting
- **TaskTags**: Tag management with add/remove functionality
- **TaskDueDate**: Due date setting with calendar picker
- **TaskHistory**: Activity log of changes (future enhancement)
- **RelatedTasks**: Suggested related tasks by category/tags
- **TaskActions**: Edit, duplicate, delete, share options

**Data Requirements**:
- Complete task object with all fields
- Related tasks by category and tags
- Task modification history (optional)
- Navigation context (previous/next task)

**URL Structure**:
```
/tasks/[id]              # Task detail view
/tasks/[id]/edit         # Edit mode (optional - could be modal)
/tasks/new               # New task creation
```

**Page Props & State**:
```typescript
interface TaskDetailProps {
  params: { id: string };
  searchParams: { edit?: 'true' };
}

interface TaskDetailState {
  task: Task | null;
  isEditing: boolean;
  relatedTasks: Task[];
  loading: boolean;
  error: string | null;
}
```

**Navigation Patterns**:
- Breadcrumb: Home > Tasks > [Task Title]
- Back button: Return to tasks list with preserved filters
- Next/Previous: Navigate between tasks in current filter context

**Functional Requirements**:
- FR-002: Task editing capabilities
- FR-006, FR-007, FR-010: Category, tag, priority management
- FR-008: Due date management
- FR-016: Keyboard shortcuts (save, cancel, delete)
- FR-019: Accessibility navigation

## Shared Layout Components

### Root Layout (`app/layout.tsx`)

**Components**:
- **GlobalHeader**: Logo, main navigation, user preferences
- **GlobalFooter**: Copyright, version info, help links
- **ThemeProvider**: Dark/light mode management
- **ToastContainer**: Global notification system
- **KeyboardShortcutProvider**: Global shortcut handling

**Navigation Structure**:
```typescript
interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType;
  badge?: number; // For task counts
}

const navigationItems: NavigationItem[] = [
  { label: 'Home', href: '/', icon: HomeIcon },
  { label: 'Tasks', href: '/tasks', icon: TaskIcon, badge: pendingCount },
  { label: 'Settings', href: '/settings', icon: SettingsIcon },
];
```

## Responsive Design Breakpoints

### Mobile (< 768px)
- **Homepage**: Stack sections vertically, prominent CTAs
- **Tasks List**: Single column cards, collapsible filters
- **Task Detail**: Full-screen view, simplified actions

### Tablet (768px - 1024px)
- **Homepage**: Two-column layout with sidebar stats
- **Tasks List**: Grid view option, side drawer filters
- **Task Detail**: Modal overlay on tasks list

### Desktop (> 1024px)
- **Homepage**: Multi-column dashboard layout
- **Tasks List**: Table view with sidebar filters
- **Task Detail**: Split view or modal overlay

## Data Flow Between Pages

### Homepage → Tasks List
```typescript
// Pass filter context from homepage quick stats
router.push('/tasks?status=overdue'); // From overdue count click
```

### Tasks List → Task Detail
```typescript
// Preserve filter context for navigation
const detailUrl = `/tasks/${taskId}?back=${encodeURIComponent(currentFilters)}`;
```

### Task Detail → Tasks List
```typescript
// Return with preserved filters and position
const backUrl = searchParams.back ? 
  `/tasks?${searchParams.back}` : '/tasks';
```

## SEO and Metadata

### Dynamic Metadata
```typescript
// app/tasks/[id]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const task = await getTask(params.id);
  return {
    title: `${task?.title} | TaskFlow`,
    description: task?.description || 'Task details and management',
  };
}
```

## Error Handling

### Page-Level Error Boundaries
```typescript
// app/tasks/[id]/error.tsx
export default function TaskDetailError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="error-page">
      <h2>Task not found or error loading</h2>
      <button onClick={reset}>Try again</button>
      <Link href="/tasks">Back to Tasks</Link>
    </div>
  );
}
```

### Loading States
```typescript
// app/tasks/[id]/loading.tsx
export default function TaskDetailLoading() {
  return <TaskDetailSkeleton />;
}
```

This page structure provides clear separation of concerns while maintaining cohesive user experience across the TaskFlow application.