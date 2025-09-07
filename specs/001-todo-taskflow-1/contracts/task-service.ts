/**
 * Task Service Contract
 * Internal API for task management operations
 */

import {
  Task,
  Priority,
  FilterState,
  TaskStatistics,
  TaskNavigationContext,
} from "../data-model";

export interface TaskService {
  // Task CRUD Operations (FR-001, FR-002, FR-003)
  createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  deleteMultipleTasks(ids: string[]): Promise<void>; // Max 50 items (FR-020)

  // Task Queries
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | null>;
  searchTasks(query: string): Promise<Task[]>; // FR-011
  filterTasks(filters: FilterState): Promise<Task[]>; // FR-012, FR-013, FR-014

  // Task State Operations (FR-004)
  toggleTaskCompletion(id: string): Promise<Task>;
  bulkToggleCompletion(ids: string[], completed: boolean): Promise<Task[]>;

  // Task Organization (FR-006, FR-007, FR-010)
  setTaskCategory(id: string, category: string | null): Promise<Task>;
  addTaskTag(id: string, tag: string): Promise<Task>;
  removeTaskTag(id: string, tag: string): Promise<Task>;
  setTaskPriority(id: string, priority: Priority): Promise<Task>;
  setTaskDueDate(id: string, dueDate: Date | null): Promise<Task>;

  // Bulk Operations (FR-015, FR-020)
  bulkUpdateTasks(ids: string[], updates: Partial<Task>): Promise<Task[]>;
  bulkSetCategory(ids: string[], category: string | null): Promise<Task[]>;
  bulkSetPriority(ids: string[], priority: Priority): Promise<Task[]>;

  // Page-Specific Operations
  getTaskStatistics(): Promise<TaskStatistics>;
  getRecentTasks(limit?: number): Promise<Task[]>; // Default limit: 5
  getRelatedTasks(taskId: string): Promise<Task[]>; // By category and tags
  getTaskNavigationContext(
    taskId: string,
    filters?: FilterState,
  ): Promise<TaskNavigationContext>;
}

export interface TaskServiceEvents {
  onTaskCreated: (task: Task) => void;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (id: string) => void;
  onBulkOperation: (operation: string, affectedIds: string[]) => void;
}
