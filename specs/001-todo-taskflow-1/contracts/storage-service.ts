/**
 * Storage Service Contract
 * LocalStorage persistence layer contract (FR-018)
 */

import { Task, Category, UserPreferences } from "../data-model";

export interface StorageService {
  // Task Storage
  saveTasks(tasks: Task[]): Promise<void>;
  loadTasks(): Promise<Task[]>;

  // Category Storage
  saveCategories(categories: Category[]): Promise<void>;
  loadCategories(): Promise<Category[]>;

  // User Preferences Storage
  savePreferences(preferences: UserPreferences): Promise<void>;
  loadPreferences(): Promise<UserPreferences>;

  // Storage Management
  clearAllData(): Promise<void>;
  getStorageSize(): Promise<number>; // Returns size in bytes
  isStorageAvailable(): boolean;

  // Data Migration
  getDataVersion(): Promise<string>;
  setDataVersion(version: string): Promise<void>;
  migrateData(fromVersion: string, toVersion: string): Promise<void>;
}

export interface StorageServiceEvents {
  onStorageQuotaExceeded: (requiredSize: number, availableSize: number) => void;
  onStorageError: (error: Error) => void;
  onDataMigrated: (fromVersion: string, toVersion: string) => void;
}

export interface StorageError extends Error {
  code:
    | "QUOTA_EXCEEDED"
    | "STORAGE_UNAVAILABLE"
    | "PARSE_ERROR"
    | "MIGRATION_FAILED";
  details?: any;
}
