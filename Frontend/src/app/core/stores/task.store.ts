import { Injectable } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { TaskService } from '../services/task.service';
import { NotificationService } from '../services/notification.service';
import { Task, TaskStatus, TaskPriority, CreateTaskDto, UpdateTaskDto, ApiResponse } from '../models';

interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  searchTerm?: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedTask: Task | null;
  filters: TaskFilters;
}

@Injectable({ providedIn: 'root' })
export class TaskStore extends signalStore(
  withState<TaskState>({
    tasks: [],
    loading: false,
    error: null,
    selectedTask: null,
    filters: {}
  }),
  withComputed(store => ({
    filteredTasks: () => {
      const tasks = store.tasks();
      const filters = store.filters();

      return tasks.filter(task => {
        if (filters.status && task.status !== filters.status) return false;
        if (filters.priority && task.priority !== filters.priority) return false;
        if (filters.assignedTo && task.assignedTo !== filters.assignedTo) return false;
        if (filters.searchTerm) {
          const searchTerm = filters.searchTerm.toLowerCase();
          return task.title.toLowerCase().includes(searchTerm) ||
            (task.description && task.description.toLowerCase().includes(searchTerm));
        }
        return true;
      });
    },

    tasksByStatus: () => {
      const tasks = store.tasks().filter((task: Task) => {
        const filters = store.filters();
        if (filters.status && task.status !== filters.status) return false;
        if (filters.priority && task.priority !== filters.priority) return false;
        if (filters.assignedTo && task.assignedTo !== filters.assignedTo) return false;
        if (filters.searchTerm) {
          const searchTerm = filters.searchTerm.toLowerCase();
          return task.title.toLowerCase().includes(searchTerm) ||
            (task.description && task.description.toLowerCase().includes(searchTerm));
        }
        return true;
      });

      return {
        toDo: tasks.filter((t: Task) => t.status === TaskStatus.ToDo),
        inProgress: tasks.filter((t: Task) => t.status === TaskStatus.InProgress),
        done: tasks.filter((t: Task) => t.status === TaskStatus.Done),
        cancelled: tasks.filter((t: Task) => t.status === TaskStatus.Cancelled)
      };
    },

    tasksByPriority: () => {
      const tasks = store.tasks().filter((task: Task) => {
        const filters = store.filters();
        if (filters.status && task.status !== filters.status) return false;
        if (filters.priority && task.priority !== filters.priority) return false;
        if (filters.assignedTo && task.assignedTo !== filters.assignedTo) return false;
        if (filters.searchTerm) {
          const searchTerm = filters.searchTerm.toLowerCase();
          return task.title.toLowerCase().includes(searchTerm) ||
            (task.description && task.description.toLowerCase().includes(searchTerm));
        }
        return true;
      });

      return {
        low: tasks.filter((t: Task) => t.priority === TaskPriority.Low),
        medium: tasks.filter((t: Task) => t.priority === TaskPriority.Medium),
        high: tasks.filter((t: Task) => t.priority === TaskPriority.High),
        critical: tasks.filter((t: Task) => t.priority === TaskPriority.Critical)
      };
    },

    taskStats: () => {
      const tasks = store.tasks();
      return {
        total: tasks.length,
        completed: tasks.filter(t => t.status === TaskStatus.Done).length,
        inProgress: tasks.filter(t => t.status === TaskStatus.InProgress).length,
        overdue: tasks.filter(t =>
          t.dueDate && new Date(t.dueDate) < new Date() && t.status !== TaskStatus.Done
        ).length
      };
    },

    isLoading: () => store.loading(),
    hasError: () => !!store.error(),
    isEmpty: () => store.tasks().length === 0
  })),
  withMethods(store => ({
    loadTasks(this: any) {
      patchState(store, { loading: true, error: null });
      return this.taskService.getTasks().pipe(
        tap((response) => {
          const res = response as ApiResponse<Task[]>;
          if (res.success) {
            patchState(store, { tasks: res.data });
          } else {
            patchState(store, { error: res.message || 'Failed to load tasks' });
          }
        }),
        catchError(error => {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          patchState(store, { error: errorMessage });
          this.notificationService.error('Load Failed', errorMessage);
          return throwError(() => error);
        }),
        finalize(() => patchState(store, { loading: false }))
      );
    },

    createTask(this: any, taskDto: CreateTaskDto) {
      patchState(store, { loading: true, error: null });
      return this.taskService.createTask(taskDto).pipe(
        map((response) => {
          const res = response as ApiResponse<Task>;
          if (res.success) {
            patchState(store, { tasks: [...store.tasks(), res.data] });
            this.notificationService.success('Success', 'Task created successfully');
            return res.data;
          }
          throw new Error(res.message || 'Failed to create task');
        }),
        catchError(error => {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
          patchState(store, { error: errorMessage });
          this.notificationService.error('Creation Failed', errorMessage);
          return throwError(() => error);
        }),
        finalize(() => patchState(store, { loading: false }))
      );
    },

    updateTask(this: any, id: string, updates: UpdateTaskDto) {
      patchState(store, { loading: true, error: null });
      return this.taskService.updateTask(id, updates).pipe(
        map((response) => {
          const res = response as ApiResponse<Task>;
          if (res.success) {
            patchState(store, { tasks: store.tasks().map((task: Task) => task.id === id ? res.data : task) });
            if (store.selectedTask()?.id === id) {
              patchState(store, { selectedTask: res.data });
            }
            this.notificationService.success('Success', 'Task updated successfully');
            return res.data;
          }
          throw new Error(res.message || 'Failed to update task');
        }),
        catchError(error => {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update task';
          patchState(store, { error: errorMessage });
          this.notificationService.error('Update Failed', errorMessage);
          return throwError(() => error);
        }),
        finalize(() => patchState(store, { loading: false }))
      );
    },

    deleteTask(this: any, id: string) {
      patchState(store, { loading: true, error: null });
      return this.taskService.deleteTask(id).pipe(
        map((response) => {
          const res = response as ApiResponse<void>;
          if (res.success) {
            patchState(store, { tasks: store.tasks().filter((task: Task) => task.id !== id) });
            if (store.selectedTask()?.id === id) {
              patchState(store, { selectedTask: null });
            }
            this.notificationService.success('Success', 'Task deleted successfully');
            return undefined;
          }
          throw new Error(res.message || 'Failed to delete task');
        }),
        catchError(error => {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete task';
          patchState(store, { error: errorMessage });
          this.notificationService.error('Deletion Failed', errorMessage);
          return throwError(() => error);
        }),
        finalize(() => patchState(store, { loading: false }))
      );
    },

    selectTask(this: any, task: Task | null): void {
      patchState(store, { selectedTask: task });
    },

    setFilters(this: any, filters: Partial<TaskFilters>): void {
      patchState(store, { filters: { ...store.filters(), ...filters } });
    },

    clearFilters(): void {
      patchState(store, { filters: {} });
    },

    clearError(): void {
      patchState(store, { error: null });
    },

    reset(): void {
      patchState(store, { tasks: [], loading: false, error: null, selectedTask: null, filters: {} });
    }
  }))
) {
  constructor(private taskService: TaskService, private notificationService: NotificationService) {
    super();
  }
}