import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { Task, TaskStatus } from '../../../../core/models';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCardComponent {
  task = input.required<Task>();
  statusChange = output<TaskStatus>();
  select = output<Task>();

  priorityClass = computed(() => `priority-${this.task().priority.toLowerCase()}`);

  statusClass = computed(() => `status-${this.task().status.toLowerCase()}`);

  cardClasses = computed(() => `${this.priorityClass()} ${this.statusClass()}`);

  priorityBadgeClass = computed(() => `priority-${this.task().priority.toLowerCase()}`);

  formattedDueDate = computed(() => {
    const dueDate = this.task().dueDate;
    return dueDate ? new Date(dueDate).toLocaleDateString() : '';
  });

  isOverdue = computed(() => {
    const currentTask = this.task();
    if (!currentTask || !currentTask.dueDate) return false;
    return new Date(currentTask.dueDate) < new Date() && currentTask.status !== TaskStatus.Done;
  });

  statusOptions = [
    { value: TaskStatus.ToDo, label: 'To Do' },
    { value: TaskStatus.InProgress, label: 'In Progress' },
    { value: TaskStatus.Done, label: 'Done' },
    { value: TaskStatus.Cancelled, label: 'Cancelled' }
  ];

  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.statusChange.emit(target.value as TaskStatus);
  }

  onSelect(): void {
    this.select.emit(this.task());
  }
}