import { Component, input, output, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Task, TaskPriority, CreateTaskDto, UpdateTaskDto } from '../../../../core/models';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskFormComponent implements OnInit {
  // Signal-based inputs and outputs
  mode = input<'create' | 'edit'>('create');
  task = input<Task | undefined>(undefined);
  save = output<CreateTaskDto | UpdateTaskDto>();
  cancel = output<void>();

  // State as signal
  isSubmitting = signal(false);

  // Computed signals for derived values
  formTitle = computed(() =>
    this.mode() === 'create' ? 'Create New Task' : 'Edit Task'
  );

  submitButtonText = computed(() => {
    if (this.isSubmitting()) return 'Saving...';
    return this.mode() === 'create' ? 'Create Task' : 'Update Task';
  });

  taskForm!: FormGroup;

  priorityOptions = [
    { value: TaskPriority.Low, label: 'Low' },
    { value: TaskPriority.Medium, label: 'Medium' },
    { value: TaskPriority.High, label: 'High' },
    { value: TaskPriority.Critical, label: 'Critical' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm(): void {
    const currentTask = this.task();
    this.taskForm = this.fb.group({
      title: [currentTask?.title || '', [Validators.required, Validators.minLength(2)]],
      description: [currentTask?.description || ''],
      priority: [currentTask?.priority || TaskPriority.Medium, [Validators.required]],
      dueDate: [currentTask?.dueDate ? this.formatDateForInput(currentTask.dueDate) : ''],
      tags: [currentTask?.tags || '']
    });
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.taskForm.value;

    const taskData = {
      title: formValue.title,
      description: formValue.description || undefined,
      priority: formValue.priority,
      dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined,
      tags: formValue.tags || undefined
    };

    this.save.emit(taskData);

    // Reset submitting state after a delay (in case parent doesn't handle it)
    setTimeout(() => {
      this.isSubmitting.set(false);
    }, 2000);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}