import { Component, input, output, OnInit, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Task, TaskPriority, CreateTaskDto, UpdateTaskDto } from '../../../../core/models';

@Component({
  selector: 'app-task-form',
  template: `
    <div class="task-form-overlay" (click)="onCancel()">
      <div class="task-form-modal" (click)="$event.stopPropagation()">
        <div class="form-header">
          <h3>{{ formTitle() }}</h3>
          <button class="close-btn" (click)="onCancel()">×</button>
        </div>
        
        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="task-form">
          <div class="form-group">
            <label for="title">Title *</label>
            <input 
              id="title"
              type="text" 
              formControlName="title"
              class="form-control"
              [class.invalid]="taskForm.get('title')?.invalid && taskForm.get('title')?.touched">
            @if (taskForm.get('title')?.invalid && taskForm.get('title')?.touched) {
              <div class="error-message">Title is required</div>
            }
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description"
              formControlName="description"
              class="form-control"
              rows="3"
              placeholder="Enter task description...">
            </textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="priority">Priority *</label>
              <select 
                id="priority"
                formControlName="priority"
                class="form-control"
                [class.invalid]="taskForm.get('priority')?.invalid && taskForm.get('priority')?.touched">
                @for (priority of priorityOptions; track priority.value) {
                  <option [value]="priority.value">{{ priority.label }}</option>
                }
              </select>
            </div>
            
            <div class="form-group">
              <label for="assignedTo">Assignee</label>
              <input 
                id="assignedTo"
                type="text" 
                formControlName="assignedTo"
                class="form-control"
                placeholder="Enter assignee name">
            </div>
          </div>
          
          <div class="form-group">
            <label for="dueDate">Due Date</label>
            <input 
              id="dueDate"
              type="date" 
              formControlName="dueDate"
              class="form-control">
          </div>
          
          <div class="form-actions">
            <button 
              type="button" 
              class="btn btn-secondary"
              (click)="onCancel()">
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              [disabled]="taskForm.invalid || isSubmitting()">
              {{ submitButtonText() }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./task-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class TaskFormComponent implements OnInit {
  // Signal-based inputs and outputs
  mode = input<'create' | 'edit'>('create');
  task = input<Task | undefined>(undefined);
  save = output<CreateTaskDto | UpdateTaskDto>();
  cancel = output<void>();

  // State signals
  isSubmitting = signal(false);

  // Computed signals
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

  private initializeForm() {
    const currentTask = this.task();
    this.taskForm = this.fb.group({
      title: [currentTask?.title || '', [Validators.required, Validators.minLength(2)]],
      description: [currentTask?.description || ''],
      priority: [currentTask?.priority || TaskPriority.Medium, [Validators.required]],
      assignedTo: [currentTask?.assignedTo || ''],
      dueDate: [currentTask?.dueDate ? this.formatDateForInput(currentTask.dueDate) : '']
    });
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  onSubmit() {
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
      assignedTo: formValue.assignedTo || undefined,
      dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined
    };

    this.save.emit(taskData);
    
    // Reset submitting state after a delay (in case parent doesn't handle it)
    setTimeout(() => {
      this.isSubmitting.set(false);
    }, 2000);
  }

  onCancel() {
    this.cancel.emit();
  }
}