import { Component, input, output, ChangeDetectionStrategy, computed } from '@angular/core';
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

  readonly columns = computed(() => {
    const s = this.tasksByStatus ? this.tasksByStatus() : { toDo: [], inProgress: [], done: [], cancelled: [] };
    return [
      { status: TaskStatus.ToDo, title: 'To Do', tasks: s.toDo || [] as Task[] },
      { status: TaskStatus.InProgress, title: 'In Progress', tasks: s.inProgress || [] as Task[] },
      { status: TaskStatus.Done, title: 'Done', tasks: s.done || [] as Task[] },
      { status: TaskStatus.Cancelled, title: 'Cancelled', tasks: s.cancelled || [] as Task[] }
    ];
  });

  onStatusChange(taskId: string, newStatus: TaskStatus) {
    this.taskMove.emit({ taskId, newStatus });
  }
}