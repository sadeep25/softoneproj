import { Component, input, output, computed } from '@angular/core';
import { Task, TaskStatus, TaskPriority } from '../../../../core/models';

@Component({
  selector: 'app-task-card',
  template: `
    <div class="task-card" [class]="priorityClass()">
      <div class="task-header">
        <h4 class="task-title">{{ task().title }}</h4>
        <div class="task-priority">
          <span class="priority-badge" [class]="priorityBadgeClass()">
            {{ task().priority }}
          </span>
        </div>
      </div>
      
      @if (task().description) {
        <p class="task-description">{{ task().description }}</p>
      }
      
      <div class="task-footer">
        <div class="task-meta">
          @if (task().assignedTo) {
            <span class="assignee">👤 {{ task().assignedTo }}</span>
          }
          @if (task().dueDate) {
            <span class="due-date" [class.overdue]="isOverdue()">
              📅 {{ formattedDueDate() }}
            </span>
          }
        </div>
        
        <div class="task-actions">
          <select 
            class="status-select"
            [value]="task().status"
            (change)="onStatusChange($event)"
            (click)="$event.stopPropagation()">
            @for (status of statusOptions; track status.value) {
              <option [value]="status.value">{{ status.label }}</option>
            }
          </select>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./task-card.component.scss'],
  standalone: true
})
export class TaskCardComponent {
  // Signal-based inputs and outputs
  task = input.required<Task>();
  statusChange = output<TaskStatus>();

  // Computed signals for derived values
  priorityClass = computed(() => `priority-${this.task().priority.toLowerCase()}`);
  priorityBadgeClass = computed(() => `priority-${this.task().priority.toLowerCase()}`);
  formattedDueDate = computed(() => {
    const dueDate = this.task().dueDate;
    return dueDate ? new Date(dueDate).toLocaleDateString() : '';
  });

  statusOptions = [
    { value: TaskStatus.ToDo, label: 'To Do' },
    { value: TaskStatus.InProgress, label: 'In Progress' },
    { value: TaskStatus.Done, label: 'Done' },
    { value: TaskStatus.Cancelled, label: 'Cancelled' }
  ];

  onStatusChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.statusChange.emit(target.value as TaskStatus);
  }

  isOverdue(): boolean {
    const task = this.task();
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date() && task.status !== TaskStatus.Done;
  }
}