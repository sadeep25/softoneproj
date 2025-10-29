import { Component, input, output, computed } from '@angular/core';
import { Task, TaskStatus, TaskPriority } from '../../../../core/models';

@Component({
  selector: 'app-task-list',
  template: `
    <div class="task-list">
      <div class="list-header">
        <div class="header-cell">Task</div>
        <div class="header-cell">Priority</div>
        <div class="header-cell">Status</div>
        <div class="header-cell">Assignee</div>
        <div class="header-cell">Due Date</div>
        <div class="header-cell">Actions</div>
      </div>
      
      @if (isEmpty()) {
        <div class="empty-list">
          <p>No tasks found matching your criteria.</p>
        </div>
      }
      
      @for (task of tasks(); track task.id) {
        <div class="task-row" (click)="taskSelect.emit(task)">
          <div class="task-cell task-info">
            <h4 class="task-title">{{ task.title }}</h4>
            @if (task.description) {
              <p class="task-description">{{ task.description }}</p>
            }
          </div>
          
          <div class="task-cell">
            <span class="priority-badge" [class]="'priority-' + task.priority.toLowerCase()">
              {{ task.priority }}
            </span>
          </div>
          
          <div class="task-cell">
            <span class="status-badge" [class]="'status-' + task.status.toLowerCase()">
              {{ getStatusLabel(task.status) }}
            </span>
          </div>
          
          <div class="task-cell">
            {{ task.assignedTo || '-' }}
          </div>
          
          <div class="task-cell">
            @if (task.dueDate) {
              <span [class.overdue]="isOverdue(task)">
                {{ formatDate(task.dueDate) }}
              </span>
            } @else {
              <span>-</span>
            }
          </div>
          
          <div class="task-cell actions-cell" (click)="$event.stopPropagation()">
            <button 
              class="btn btn-sm"
              (click)="onEdit(task)">
              ✏️
            </button>
            <button 
              class="btn btn-sm btn-danger"
              (click)="onDelete(task.id)">
              🗑️
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./task-list.component.scss'],
  standalone: true
})
export class TaskListComponent {
  // Signal-based inputs and outputs
  tasks = input<Task[]>([]);
  taskSelect = output<Task>();
  taskUpdate = output<{ id: string; updates: any }>();
  taskDelete = output<string>();

  // Computed signals
  isEmpty = computed(() => this.tasks().length === 0);

  getStatusLabel(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.ToDo:
        return 'To Do';
      case TaskStatus.InProgress:
        return 'In Progress';
      case TaskStatus.Done:
        return 'Done';
      case TaskStatus.Cancelled:
        return 'Cancelled';
      default:
        return status;
    }
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date() && task.status !== TaskStatus.Done;
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString();
  }

  onEdit(task: Task) {
    // Emit task update event - for now just select the task
    this.taskSelect.emit(task);
  }

  onDelete(taskId: string) {
    this.taskDelete.emit(taskId);
  }
}