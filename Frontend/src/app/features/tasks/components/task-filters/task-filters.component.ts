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
  // Inputs
  filters = input<TaskFilters>({});

  // Outputs
  filtersChange = output<TaskFilters>();
  clearFilters = output<void>();

  // Signal-based ViewChild references to form elements
  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  statusSelect = viewChild<ElementRef<HTMLSelectElement>>('statusSelect');
  prioritySelect = viewChild<ElementRef<HTMLSelectElement>>('prioritySelect');

  // Computed signals for current filter values
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

  // Signal-based debounce implementation
  private searchTerm = signal<string>('');
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Use effect to watch searchTerm signal and emit debounced updates
    effect(() => {
      const term = this.searchTerm();

      // Clear previous timer
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      // Set new timer
      this.debounceTimer = setTimeout(() => {
        this.emitFilters({ searchTerm: term || undefined });
      }, 500);
    });
  }

  onSearchChange(value: string) {
    // Update the signal — effect will handle debouncing
    this.searchTerm.set(value || '');
  }

  onStatusChange(value: string) {
    // Emit filter change with strongly-typed value
    this.emitFilters({ status: (value as TaskStatus) || undefined });
  }

  onPriorityChange(value: string) {
    // Emit filter change with strongly-typed value
    this.emitFilters({ priority: (value as TaskPriority) || undefined });
  }

  onClearFilters(): void {
    // Clear any pending debounce timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    // Reset the internal searchTerm signal
    this.searchTerm.set('');

    // Reset form element values directly
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

    // Emit clear filters event
    this.clearFilters.emit();
  }

  private emitFilters(updates: Partial<TaskFilters>): void {
    // Merge current filters with updates and emit
    const currentFilters = this.filters();
    const updatedFilters = { ...currentFilters, ...updates };
    this.filtersChange.emit(updatedFilters);
  }
}