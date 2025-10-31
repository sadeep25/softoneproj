import { Component, input, output, computed, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TaskStatus, TaskPriority } from '../../../../core/models';

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  searchTerm?: string;
}

@Component({
  selector: 'app-task-filters',
  templateUrl: './task-filters.component.html',
  styleUrls: ['./task-filters.component.scss'],
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskFiltersComponent {
  // Signal-based inputs and outputs
  filters = input<TaskFilters>({});
  filtersChange = output<TaskFilters>();

  // Computed signals for current filter values
  currentSearchTerm = computed(() => this.filters().searchTerm || '');

  currentStatus = computed(() => this.filters().status || '');

  currentPriority = computed(() => this.filters().priority || '');

  hasActiveFilters = computed(() => {
    const currentFilters = this.filters();
    // ignore assignedTo (removed)
    return [currentFilters.searchTerm, currentFilters.status, currentFilters.priority].some(value => value !== undefined && value !== '');
  });

  statusOptions = [
    { value: TaskStatus.ToDo, label: 'To Do' },
    { value: TaskStatus.InProgress, label: 'In Progress' },
    { value: TaskStatus.Done, label: 'Done' },
    { value: TaskStatus.Cancelled, label: 'Cancelled' }
  ];

  // RxJS subject to debounce search input
  private search$ = new Subject<string>();
  private searchSub: Subscription | null = null;

  constructor() {
    // Subscribe to search subject with debounce and emit filter updates
    this.searchSub = this.search$
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => this.updateFilters({ searchTerm: value || undefined }));
  }

  priorityOptions = [
    { value: TaskPriority.Low, label: 'Low' },
    { value: TaskPriority.Medium, label: 'Medium' },
    { value: TaskPriority.High, label: 'High' },
    { value: TaskPriority.Critical, label: 'Critical' }
  ];

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    // Push the raw input value to the subject — subscription will debounce
    this.search$.next(target.value || '');
  }

  onStatusChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.updateFilters({ status: (target.value as TaskStatus) || undefined });
  }

  onPriorityChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.updateFilters({ priority: (target.value as TaskPriority) || undefined });
  }

  // Assignee filter removed

  onClearFilters(): void {
    this.filtersChange.emit({});
  }

  private updateFilters(updates: Partial<TaskFilters>): void {
    const newFilters = { ...this.filters(), ...updates };
    this.filtersChange.emit(newFilters);
  }

  ngOnDestroy(): void {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
      this.searchSub = null;
    }
    this.search$.complete();
  }
}