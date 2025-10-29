import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { TaskStore } from '../../../../core/stores/task.store';
import { Task, TaskStatus } from '../../../../core/models';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';
import { TaskBoardComponent } from '../../components/task-board/task-board.component';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { TaskFiltersComponent } from '../../components/task-filters/task-filters.component';
import { TaskFormComponent } from '../../components/task-form/task-form.component';

@Component({
  selector: 'app-tasks-container',
  template: `
    <div class="tasks-container">
      <header class="tasks-header">
        <div class="header-content">
          <h1>Task Management</h1>
          <div class="task-stats">
            <div class="stat">
              <span class="stat-value">{{ taskStats().total }}</span>
              <span class="stat-label">Total</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ taskStats().inProgress }}</span>
              <span class="stat-label">In Progress</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ taskStats().completed }}</span>
              <span class="stat-label">Completed</span>
            </div>
            @if (taskStats().overdue > 0) {
              <div class="stat stat-warning">
                <span class="stat-value">{{ taskStats().overdue }}</span>
                <span class="stat-label">Overdue</span>
              </div>
            }
          </div>
        </div>
        
        <div class="header-actions">
          <app-task-filters
            [filters]="taskStore.filters()"
            (filtersChange)="onFiltersChange($event)">
          </app-task-filters>
          
          <div class="view-toggle">
            <button 
              class="btn"
              [class.active]="viewMode() === 'list'"
              (click)="viewMode.set('list')">
              📋 List
            </button>
            <button 
              class="btn"
              [class.active]="viewMode() === 'board'"
              (click)="viewMode.set('board')">
              📊 Board
            </button>
          </div>
          
          <button 
            class="btn btn-primary"
            (click)="onCreateTask()"
            [disabled]="taskStore.isLoading()">
            ➕ Create Task
          </button>
        </div>
      </header>

      <main class="tasks-main">
        @if (isLoading()) {
          <app-loading-spinner message="Loading tasks..."></app-loading-spinner>
        }

        @if (hasError()) {
          <app-error-message 
            [message]="taskStore.error()!"
            [showRetry]="true"
            (retry)="onRetry()">
          </app-error-message>
        }

        @if (!isLoading() && !hasError()) {
          <div class="tasks-content">
            @if (viewMode() === 'list') {
              <app-task-list
                [tasks]="filteredTasks()"
                (taskSelect)="onTaskSelect($event)"
                (taskUpdate)="onTaskUpdate($event)"
                (taskDelete)="onTaskDelete($event)">
              </app-task-list>
            }

            @if (viewMode() === 'board') {
              <app-task-board
                [tasksByStatus]="taskStore.tasksByStatus()"
                (taskMove)="onTaskMove($event)"
                (taskSelect)="onTaskSelect($event)">
              </app-task-board>
            }

            @if (taskStore.isEmpty() && !isLoading()) {
              <div class="empty-state">
                <div class="empty-icon">📋</div>
                <h3>No tasks yet</h3>
                <p>Create your first task to get started with task management.</p>
                <button class="btn btn-primary" (click)="onCreateTask()">
                  Create Your First Task
                </button>
              </div>
            }
          </div>
        }
      </main>

      @if (showCreateForm()) {
        <app-task-form
          mode="create"
          (save)="onSaveTask($event)"
          (cancel)="onCancelCreate()">
        </app-task-form>
      }
    </div>
  `,
  styleUrls: ['./tasks-container.component.scss'],
  standalone: true,
  imports: [
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    TaskBoardComponent,
    TaskListComponent,
    TaskFiltersComponent,
    TaskFormComponent
  ]
})
export class TasksContainerComponent implements OnInit {
  // Injected services
  taskStore = inject(TaskStore);
  
  // Component state signals
  viewMode = signal<'list' | 'board'>('board');
  showCreateForm = signal(false);

  // Computed signals for better performance
  isLoading = computed(() => this.taskStore.isLoading());
  hasError = computed(() => this.taskStore.hasError());
  errorMessage = computed(() => this.taskStore.error());
  taskStats = computed(() => this.taskStore.taskStats());
  filteredTasks = computed(() => this.taskStore.filteredTasks());
  tasksByStatus = computed(() => this.taskStore.tasksByStatus());
  filters = computed(() => this.taskStore.filters());
  isEmpty = computed(() => this.taskStore.isEmpty());

  ngOnInit() {
    this.taskStore.loadTasks().subscribe({
      next: () => {},
      error: () => {
        // store handles notification; nothing else to do here
      }
    });
  }

  onFiltersChange(filters: any) {
    this.taskStore.setFilters(filters);
  }

  onCreateTask() {
    this.showCreateForm.set(true);
  }

  onTaskSelect(task: Task) {
    this.taskStore.selectTask(task);
  }

  onTaskUpdate(update: { id: string; updates: any }) {
    this.taskStore.updateTask(update.id, update.updates).subscribe({
      next: () => {},
      error: () => {}
    });
  }

  onTaskDelete(taskId: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskStore.deleteTask(taskId).subscribe({ next: () => {}, error: () => {} });
    }
  }

  onTaskMove(event: { taskId: string; newStatus: TaskStatus }) {
    this.taskStore.updateTask(event.taskId, { status: event.newStatus }).subscribe({ next: () => {}, error: () => {} });
  }

  onSaveTask(taskData: any) {
    this.taskStore.createTask(taskData).subscribe({
      next: () => {
        this.showCreateForm.set(false);
      },
      error: () => {
        // Error handled by store
      }
    });
  }

  onCancelCreate() {
    this.showCreateForm.set(false);
  }

  onRetry() {
    this.taskStore.clearError();
    this.taskStore.loadTasks();
  }
}