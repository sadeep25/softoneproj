import { createReducer, on } from '@ngrx/store';
import { Task } from '../../models';
import * as TaskPageActions from './task-page.actions';
import * as TaskApiActions from './task-api.actions';
import { TaskFilters } from './task-page.actions';

// Task feature state
export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedTask: Task | null;
  filters: TaskFilters;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  selectedTask: null,
  filters: {}
};

export const taskReducer = createReducer<TaskState>(
  initialState,
  // Load Tasks
  on(TaskPageActions.loadTasks, (state): TaskState => {
    return {
      ...state,
      loading: true,
      error: null
    };
  }),
  on(TaskApiActions.loadTasksSuccess, (state, action): TaskState => {
    return {
      ...state,
      tasks: action.tasks,
      loading: false,
      error: null
    };
  }),
  on(TaskApiActions.loadTasksFailure, (state, action): TaskState => {
    return {
      ...state,
      tasks: [],
      loading: false,
      error: action.error
    };
  }),

  // Create Task
  on(TaskPageActions.createTask, (state): TaskState => {
    return {
      ...state,
      loading: true,
      error: null
    };
  }),
  on(TaskApiActions.createTaskSuccess, (state, action): TaskState => {
    return {
      ...state,
      tasks: [...state.tasks, action.task],
      loading: false,
      error: null
    };
  }),
  on(TaskApiActions.createTaskFailure, (state, action): TaskState => {
    return {
      ...state,
      loading: false,
      error: action.error
    };
  }),

  // Update Task
  on(TaskPageActions.updateTask, (state): TaskState => {
    return {
      ...state,
      loading: true,
      error: null
    };
  }),
  on(TaskApiActions.updateTaskSuccess, (state, action): TaskState => {
    const updatedTasks = state.tasks.map(task =>
      task.id === action.task.id ? action.task : task
    );
    return {
      ...state,
      tasks: updatedTasks,
      selectedTask: state.selectedTask?.id === action.task.id ? action.task : state.selectedTask,
      loading: false,
      error: null
    };
  }),
  on(TaskApiActions.updateTaskFailure, (state, action): TaskState => {
    return {
      ...state,
      loading: false,
      error: action.error
    };
  }),

  // Delete Task
  on(TaskPageActions.deleteTask, (state): TaskState => {
    return {
      ...state,
      loading: true,
      error: null
    };
  }),
  on(TaskApiActions.deleteTaskSuccess, (state, action): TaskState => {
    return {
      ...state,
      tasks: state.tasks.filter(task => task.id !== action.id),
      selectedTask: state.selectedTask?.id === action.id ? null : state.selectedTask,
      loading: false,
      error: null
    };
  }),
  on(TaskApiActions.deleteTaskFailure, (state, action): TaskState => {
    return {
      ...state,
      loading: false,
      error: action.error
    };
  }),

  // Other Actions
  on(TaskPageActions.selectTask, (state, action): TaskState => {
    return {
      ...state,
      selectedTask: action.task
    };
  }),
  on(TaskPageActions.clearCurrentTask, (state): TaskState => {
    return {
      ...state,
      selectedTask: null
    };
  }),
  on(TaskPageActions.setFilters, (state, action): TaskState => {
    return {
      ...state,
      filters: { ...state.filters, ...action.filters }
    };
  }),
  on(TaskPageActions.clearFilters, (state): TaskState => {
    return {
      ...state,
      filters: {}
    };
  }),
  on(TaskPageActions.clearError, (state): TaskState => {
    return {
      ...state,
      error: null
    };
  })
);
