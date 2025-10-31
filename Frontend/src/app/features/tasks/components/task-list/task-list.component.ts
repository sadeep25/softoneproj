import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { Task, TaskStatus } from '../../../../core/models';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent {
  // Signal-based inputs and outputs
  tasks = input<Task[]>([]);
  taskSelect = output<Task>();
  taskUpdate = output<{ id: string; updates: any }>();
  taskDelete = output<string>();

  onTaskSelect(task: Task): void {
    this.taskSelect.emit(task);
  }

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