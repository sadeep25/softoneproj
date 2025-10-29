import { Component, input, output, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskStatus, TaskPriority } from '../../../../core/models';

interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  searchTerm?: string;
}

@Component({
  selector: 'app-task-filters',
  template: `
    <div class="task-filters">
      <div class="filter-group">
        <input 
          type="text"
          placeholder="Search tasks..."
          class="search-input"
          [value]="currentSearchTerm()"
          (input)="onSearchChange($event)">
      </div>
      
      <div class="filter-group">
        <select 
          class="filter-select"
          [value]="currentStatus()"
          (change)="onStatusChange($event)">
          <option value="">All Status</option>
          @for (status of statusOptions; track status.value) {
            <option [value]="status.value">{{ status.label }}</option>
          }
        </select>
      </div>
      
      <div class="filter-group">
        <select 
          class="filter-select"
          [value]="currentPriority()"
          (change)="onPriorityChange($event)">
          <option value="">All Priority</option>
          @for (priority of priorityOptions; track priority.value) {
            <option [value]="priority.value">{{ priority.label }}</option>
          }
        </select>
      </div>
      
      <div class="filter-group">
        <input 
          type="text"
          placeholder="Assignee..."
          class="filter-input"
          [value]="currentAssignee()"
          (input)="onAssigneeChange($event)">
      </div>
      
      <button 
        class="clear-filters-btn"
        (click)="onClearFilters()"
        [disabled]="!hasActiveFilters()">
        Clear
      </button>
    </div>
  `,
  styleUrls: ['./task-filters.component.scss'],
  standalone: true,
  imports: [FormsModule]
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

  onClearFilters() {
    this.filtersChange.emit({});
  }

  hasActiveFilters(): boolean {
    const currentFilters = this.filters();
    return Object.values(currentFilters).some(value => value !== undefined && value !== '');
  }

  private updateFilters(updates: Partial<TaskFilters>) {
    const newFilters = { ...this.filters(), ...updates };
    this.filtersChange.emit(newFilters);
  }
}