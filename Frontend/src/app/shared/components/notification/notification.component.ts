import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService, NotificationMessage } from '../../../core/services/notification.service';

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
export class NotificationComponent implements OnInit, OnDestroy {
  private notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();

  notifications = signal<NotificationMessage[]>([]);

  ngOnInit(): void {
    this.notificationService.messages$
      .pipe(takeUntil(this.destroy$))
      .subscribe(messages => this.notifications.set(messages));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  dismiss(id: string): void {
    this.notificationService.remove(id);
  }
}