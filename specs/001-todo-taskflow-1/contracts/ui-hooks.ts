/**
 * UI Hooks Contract
 * React hooks interface for components (FR-016, FR-017)
 */

import {
  Task,
  FilterState,
  BulkSelection,
  UserPreferences,
  Priority,
  TaskStatistics,
  HomepageState,
  TasksPageState,
  TaskDetailState,
  TaskNavigationContext,
} from "../data-model";

export interface UseTasksHook {
  tasks: Task[];
  loading: boolean;
  error: string | null;

  // Task operations
  createTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleCompletion: (id: string) => Promise<void>;

  // Filtering and search
  filteredTasks: Task[];
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  filters: FilterState;
}

export interface UseBulkSelectionHook {
  selection: BulkSelection;

  // Selection operations
  selectTask: (id: string) => void;
  deselectTask: (id: string) => void;
  selectAll: (taskIds: string[]) => void; // Max 50 items (FR-020)
  clearSelection: () => void;
  toggleTaskSelection: (id: string) => void;

  // Bulk operations
  bulkDelete: () => Promise<void>;
  bulkToggleCompletion: (completed: boolean) => Promise<void>;
  bulkSetCategory: (category: string | null) => Promise<void>;
  bulkSetPriority: (priority: Priority) => Promise<void>;
}

export interface UseKeyboardShortcutsHook {
  // Keyboard shortcut handlers (FR-016)
  shortcuts: {
    "Ctrl+N": () => void; // New task (Cmd+N on Mac)
    "Ctrl+S": () => void; // Save task (Cmd+S on Mac)
    Escape: () => void; // Cancel edit
    "Ctrl+D": () => void; // Toggle completion (Cmd+D on Mac)
    "Ctrl+Delete": () => void; // Delete task (Cmd+Delete on Mac)
  };

  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

export interface UseResponsiveHook {
  // Responsive design utilities (FR-017)
  isMobile: boolean; // < 768px
  isTablet: boolean; // 768px - 1024px
  isDesktop: boolean; // > 1024px
  screenSize: "mobile" | "tablet" | "desktop";
}

export interface UseAccessibilityHook {
  // WCAG 2.1 AA compliance utilities (FR-019)
  announceToScreenReader: (message: string) => void;
  focusManagement: {
    trapFocus: (element: HTMLElement) => () => void;
    restoreFocus: () => void;
    setFocusToFirst: (container: HTMLElement) => void;
  };

  // High contrast and reduced motion detection
  prefersHighContrast: boolean;
  prefersReducedMotion: boolean;

  // Keyboard navigation
  handleKeyboardNavigation: (
    event: KeyboardEvent,
    items: HTMLElement[],
  ) => void;
}

// Page-Specific Hooks

export interface UseHomepageHook {
  // Homepage data and state
  state: HomepageState;

  // Quick actions from homepage
  navigateToTasks: (filters?: Partial<FilterState>) => void;
  createNewTask: () => void;

  // Data refresh
  refreshStats: () => Promise<void>;
}

export interface UseTasksPageHook {
  // Tasks page state management
  state: TasksPageState;

  // Filter and search operations
  updateFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  setSearchQuery: (query: string) => void;

  // Sorting and view options
  updateSort: (field: string, direction: "asc" | "desc") => void;
  setViewMode: (mode: "list" | "grid") => void;
  toggleShowCompleted: () => void;

  // URL state synchronization
  syncWithUrl: () => void;
  updateUrl: (state: Partial<TasksPageState>) => void;
}

export interface UseTaskDetailHook {
  // Task detail state
  state: TaskDetailState;

  // Task operations
  updateTask: (updates: Partial<Task>) => Promise<void>;
  deleteTask: () => Promise<void>;
  toggleCompletion: () => Promise<void>;

  // Edit mode management
  enterEditMode: () => void;
  exitEditMode: () => void;
  saveChanges: () => Promise<void>;
  cancelChanges: () => void;

  // Navigation
  goToPrevious: () => void;
  goToNext: () => void;
  goBack: () => void;
}
