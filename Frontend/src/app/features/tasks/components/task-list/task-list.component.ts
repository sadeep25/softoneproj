import { Component, input, output, ChangeDetectionStrategy, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Task, TaskStatus } from '../../../../core/models';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: true,
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent {
  // Signal-based inputs and outputs
  tasks = input<Task[]>([]);
  taskSelect = output<Task>();
  // separate event for edit button clicks so row click doesn't trigger edit
  taskEdit = output<Task>();
  taskUpdate = output<{ id: string; updates: any }>();
  taskDelete = output<string>();

  // Computed signal for tasks with additional metadata
  tasksWithMetadata = computed(() => {
    return this.tasks().map(task => ({
      ...task,
      statusLabel: this.getStatusLabel(task.status),
      isOverdue: task.dueDate
        ? new Date(task.dueDate) < new Date() && task.status !== TaskStatus.Done
        : false
    }));
  });

  private getStatusLabel(status: TaskStatus): string {
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

  onTaskSelect(task: Task): void {
    this.taskSelect.emit(task);
  }

  onEdit(task: Task) {
    // Emit edit event — parent can open edit form when this is emitted
    this.taskEdit.emit(task);
  }

  onDelete(taskId: string) {
    this.taskDelete.emit(taskId);
  }
}