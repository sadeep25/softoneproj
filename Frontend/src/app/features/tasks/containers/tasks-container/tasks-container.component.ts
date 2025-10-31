import { Component, OnInit, signal, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Task, TaskStatus, CreateTaskDto, UpdateTaskDto } from '../../../../core/models';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';
import { TaskBoardComponent } from '../../components/task-board/task-board.component';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { TaskFiltersComponent, TaskFilters } from '../../components/task-filters/task-filters.component';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import * as TaskPageActions from '../../../../core/store/task/task-page.actions';
import * as fromTask from '../../../../core/store/task';

@Component({
  selector: 'app-tasks-container',
  templateUrl: './tasks-container.component.html',
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
  // Inject store
  private readonly store = inject(Store);

  // Signals from store using selectSignal
  tasks = this.store.selectSignal(fromTask.getTasks);
  filteredTasks = this.store.selectSignal(fromTask.getFilteredTasks);
  tasksByStatus = this.store.selectSignal(fromTask.getTasksByStatus);
  taskStats = this.store.selectSignal(fromTask.getTaskStats);
  isLoading = this.store.selectSignal(fromTask.getIsLoading);
  hasError = this.store.selectSignal(fromTask.getHasError);
  error = this.store.selectSignal(fromTask.getError);
  isEmpty = this.store.selectSignal(fromTask.getIsEmpty);
  filters = this.store.selectSignal(fromTask.getFilters);

  // Local component state as signals
  viewMode = signal<'list' | 'board'>('board');
  showCreateForm = signal(false);

  ngOnInit(): void {
    // Dispatch load tasks action
    this.store.dispatch(TaskPageActions.loadTasks());
  }

  onFiltersChange(filters: TaskFilters): void {
    this.store.dispatch(TaskPageActions.setFilters({ filters }));
  }

  setViewMode(mode: 'list' | 'board'): void {
    this.viewMode.set(mode);
  }

  onCreateTask(): void {
    this.showCreateForm.set(true);
  }

  onTaskSelect(task: Task): void {
    this.store.dispatch(TaskPageActions.selectTask({ task }));
  }

  onTaskUpdate(update: { id: string; updates: UpdateTaskDto }): void {
    this.store.dispatch(TaskPageActions.updateTask({ id: update.id, updates: update.updates }));
  }

  onTaskDelete(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.store.dispatch(TaskPageActions.deleteTask({ id: taskId }));
    }
  }

  onTaskMove(event: { taskId: string; newStatus: TaskStatus }): void {
    this.store.dispatch(
      TaskPageActions.updateTask({
        id: event.taskId,
        updates: { status: event.newStatus }
      })
    );
  }

  onSaveTask(taskData: CreateTaskDto | UpdateTaskDto): void {
    this.store.dispatch(TaskPageActions.createTask({ task: taskData as CreateTaskDto }));
    this.showCreateForm.set(false);
  }

  onCancelCreate(): void {
    this.showCreateForm.set(false);
  }

  onRetry(): void {
    this.store.dispatch(TaskPageActions.clearError());
    this.store.dispatch(TaskPageActions.loadTasks());
  }
}
