import { Component, computed, signal, effect, ChangeDetectionStrategy, viewChild, ElementRef, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  filters = input<TaskFilters>({});

  filtersChange = output<TaskFilters>();
  clearFilters = output<void>();

  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  statusSelect = viewChild<ElementRef<HTMLSelectElement>>('statusSelect');
  prioritySelect = viewChild<ElementRef<HTMLSelectElement>>('prioritySelect');

  currentSearchTerm = computed(() => this.filters().searchTerm || '');

  currentStatus = computed(() => this.filters().status || '');

  currentPriority = computed(() => this.filters().priority || '');

  hasActiveFilters = computed(() => {
    const currentFilters = this.filters();
    return [currentFilters.searchTerm, currentFilters.status, currentFilters.priority].some(value => value !== undefined && value !== '');
  });

  statusOptions = [
    { value: TaskStatus.ToDo, label: 'To Do' },
    { value: TaskStatus.InProgress, label: 'In Progress' },
    { value: TaskStatus.Done, label: 'Done' },
    { value: TaskStatus.Cancelled, label: 'Cancelled' }
  ];

  priorityOptions = [
    { value: TaskPriority.Low, label: 'Low' },
    { value: TaskPriority.Medium, label: 'Medium' },
    { value: TaskPriority.High, label: 'High' },
    { value: TaskPriority.Critical, label: 'Critical' }
  ];

  private searchTerm = signal<string>('');
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const term = this.searchTerm();

      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      this.debounceTimer = setTimeout(() => {
        this.emitFilters({ searchTerm: term || undefined });
      }, 500);
    });
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value || '');
  }

  onStatusChange(value: string) {
    this.emitFilters({ status: (value as TaskStatus) || undefined });
  }

  onPriorityChange(value: string) {
    this.emitFilters({ priority: (value as TaskPriority) || undefined });
  }

  onClearFilters(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    this.searchTerm.set('');

    const searchInputEl = this.searchInput();
    if (searchInputEl) {
      searchInputEl.nativeElement.value = '';
    }
    const statusSelectEl = this.statusSelect();
    if (statusSelectEl) {
      statusSelectEl.nativeElement.value = '';
    }
    const prioritySelectEl = this.prioritySelect();
    if (prioritySelectEl) {
      prioritySelectEl.nativeElement.value = '';
    }

    this.clearFilters.emit();
  }

  private emitFilters(updates: Partial<TaskFilters>): void {
    const currentFilters = this.filters();
    const updatedFilters = { ...currentFilters, ...updates };
    this.filtersChange.emit(updatedFilters);
  }
}