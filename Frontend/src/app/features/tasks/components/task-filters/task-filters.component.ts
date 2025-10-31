import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskStatus, TaskPriority } from '../../../../core/models';

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
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

  currentAssignee = computed(() => this.filters().assignedTo || '');

  hasActiveFilters = computed(() => {
    const currentFilters = this.filters();
    return Object.values(currentFilters).some(value => value !== undefined && value !== '');
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

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.updateFilters({ searchTerm: target.value || undefined });
  }

  onStatusChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.updateFilters({ status: (target.value as TaskStatus) || undefined });
  }

  onPriorityChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.updateFilters({ priority: (target.value as TaskPriority) || undefined });
  }

  onAssigneeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.updateFilters({ assignedTo: target.value || undefined });
  }

  onClearFilters(): void {
    this.filtersChange.emit({});
  }

  private updateFilters(updates: Partial<TaskFilters>): void {
    const newFilters = { ...this.filters(), ...updates };
    this.filtersChange.emit(newFilters);
  }
}