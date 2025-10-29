import { Component, input, output, computed } from '@angular/core';
import { Task, TaskStatus } from '../../../../core/models';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-task-board',
  template: `
    <div class="task-board">
      <div class="board-columns">
        @for (column of columns; track column.status) {
          <div class="board-column" [attr.data-status]="column.status">
            <header class="column-header">
              <h3>{{ column.title }}</h3>
              <span class="task-count">{{ getTasksForStatus(column.status).length }}</span>
            </header>
            
            <div class="task-list">
              @for (task of getTasksForStatus(column.status); track task.id) {
                <app-task-card
                  [task]="task"
                  (click)="taskSelect.emit(task)"
                  (statusChange)="onStatusChange(task.id, $event)"
                  class="task-item">
                </app-task-card>
              }
              
              @if (getTasksForStatus(column.status).length === 0) {
                <div class="empty-column">
                  <p>No {{ column.title.toLowerCase() }} tasks</p>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./task-board.component.scss'],
  standalone: true,
  imports: [TaskCardComponent]
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