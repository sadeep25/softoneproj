import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messagesSubject = new BehaviorSubject<NotificationMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  show(notification: Omit<NotificationMessage, 'id'>): string {
    const id = this.generateId();
    const message: NotificationMessage = {
      ...notification,
      id,
      duration: notification.duration ?? 5000
    };

    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);

    if (!message.persistent && message.duration && message.duration > 0) {
      setTimeout(() => this.remove(id), message.duration);
    }

    return id;
  }

  success(title: string, message?: string, duration?: number): string {
    return this.show({ type: 'success', title, message, duration });
  }

  error(title: string, message?: string, persistent = true): string {
    return this.show({ type: 'error', title, message, persistent });
  }

  warning(title: string, message?: string, duration?: number): string {
    return this.show({ type: 'warning', title, message, duration });
  }

  info(title: string, message?: string, duration?: number): string {
    return this.show({ type: 'info', title, message, duration });
  }

  remove(id: string): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next(currentMessages.filter(m => m.id !== id));
  }

  clear(): void {
    this.messagesSubject.next([]);
  }
}