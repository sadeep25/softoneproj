import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="loading-spinner" [class.loading-overlay]="overlay()">
      <div class="spinner">
        <div class="spinner-circle"></div>
      </div>
      @if (message()) {
        <div class="spinner-message">{{ message() }}</div>
      }
    </div>
  `,
  styleUrls: ['./loading-spinner.component.scss'],
  standalone: true
})
export class LoadingSpinnerComponent {
  // Signal-based inputs
  message = input<string>();
  overlay = input<boolean>(false);
}