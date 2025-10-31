import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { Task, TaskStatus } from '../../../../core/models';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss'],
  standalone: true,
  imports: [TaskCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskBoardComponent {
  // Signal-based inputs and outputs
  tasksByStatus = input.required<{
    toDo: Task[];
    inProgress: Task[];
    done: Task[];
    cancelled: Task[];
  }>();

  taskMove = output<{ taskId: string; newStatus: TaskStatus }>();
  taskSelect = output<Task>();

  onTaskSelect(task: Task): void {
    this.taskSelect.emit(task);
  }

  columns = [
    { status: TaskStatus.ToDo, title: 'To Do' },
    { status: TaskStatus.InProgress, title: 'In Progress' },
    { status: TaskStatus.Done, title: 'Done' },
    { status: TaskStatus.Cancelled, title: 'Cancelled' }
  ];

  getTasksForStatus(status: TaskStatus): Task[] {
    const tasks = this.tasksByStatus();
    switch (status) {
      case TaskStatus.ToDo:
        return tasks.toDo || [];
      case TaskStatus.InProgress:
        return tasks.inProgress || [];
      case TaskStatus.Done:
        return tasks.done || [];
      case TaskStatus.Cancelled:
        return tasks.cancelled || [];
      default:
        return [];
    }
  }

  onStatusChange(taskId: string, newStatus: TaskStatus) {
    this.taskMove.emit({ taskId, newStatus });
  }
}