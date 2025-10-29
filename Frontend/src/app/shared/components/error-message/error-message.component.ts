import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-error-message',
  template: `
    <div class="error-message" [class]="errorClass()">
      <div class="error-icon">
        @switch (type()) {
          @case ('error') { ⚠️ }
          @case ('warning') { ⚠️ }
          @default { ℹ️ }
        }
      </div>
      <div class="error-content">
        <h4 class="error-title">{{ displayTitle() }}</h4>
        @if (message()) {
          <p class="error-text">{{ message() }}</p>
        }
        @if (showRetry()) {
          <button class="retry-btn" (click)="onRetry()">
            Try Again
          </button>
        }
      </div>
      @if (dismissible()) {
        <button class="close-btn" (click)="onDismiss()">×</button>
      }
    </div>
  `,
  styleUrls: ['./error-message.component.scss'],
  standalone: true
})
export class ErrorMessageComponent {
  // Signal-based inputs and outputs
  title = input<string>();
  message = input<string>();
  type = input<'error' | 'warning' | 'info'>('error');
  showRetry = input<boolean>(false);
  dismissible = input<boolean>(false);
  
  retry = output<void>();
  dismiss = output<void>();

  // Computed signals
  errorClass = computed(() => `error-${this.type()}`);
  displayTitle = computed(() => this.title() || this.getDefaultTitle());

  getDefaultTitle(): string {
    switch (this.type()) {
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      case 'info': return 'Information';
      default: return 'Message';
    }
  }

  onRetry(): void {
    this.retry.emit();
  }

  onDismiss(): void {
    this.dismiss.emit();
  }
}