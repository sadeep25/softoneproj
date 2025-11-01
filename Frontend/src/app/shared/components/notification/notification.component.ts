import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { Store } from '@ngrx/store';
import * as NotificationSelectors from '../../../core/store/notification/notification.selectors';
import * as NotificationActions from '../../../core/store/notification/notification.actions';

@Component({
  selector: 'app-notification',
  template: `
    <div class="notification-container">
      @for (notification of notifications(); track notification.id) {
        <div
          class="notification"
          [ngClass]="'notification-' + notification.type">
          <div class="notification-content">
            <h4 class="notification-title">{{ notification.title }}</h4>
            @if (notification.message) {
              <p class="notification-message">{{ notification.message }}</p>
            }
          </div>
          <button
            class="notification-close"
            (click)="dismiss(notification.id)">
            ×
          </button>
        </div>
      }
    </div>
  `,
  styleUrls: ['./notification.component.scss'],
  standalone: true,
  imports: [NgClass]
})
export class NotificationComponent {
  private store = inject(Store);

  notifications = this.store.selectSignal(NotificationSelectors.selectAllNotifications);

  dismiss(id: string): void {
    this.store.dispatch(NotificationActions.removeNotification({ id }));
  }
}
