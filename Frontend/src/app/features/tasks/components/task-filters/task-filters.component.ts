import { Component, input, output, computed, signal, effect, ChangeDetectionStrategy, viewChild, ElementRef } from '@angular/core';
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
  // Signal-based ViewChild references to form elements
  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  statusSelect = viewChild<ElementRef<HTMLSelectElement>>('statusSelect');
  prioritySelect = viewChild<ElementRef<HTMLSelectElement>>('prioritySelect');

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
        this.updateFilters({ searchTerm: term || undefined });
      }, 500);
    });
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    // Update the signal — effect will handle debouncing
    this.searchTerm.set(target.value || '');
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

    this.filtersChange.emit({});
  }

  private updateFilters(updates: Partial<TaskFilters>): void {
    const newFilters = { ...this.filters(), ...updates };
    this.filtersChange.emit(newFilters);
  }
}