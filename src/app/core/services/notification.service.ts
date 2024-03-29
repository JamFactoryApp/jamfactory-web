import {Injectable, TemplateRef} from '@angular/core';

export class Notification {

  message: string | TemplateRef<any>;
  id: number;
  level: number;

  constructor(
    message: string | TemplateRef<any>,
  ) {
    this.message = message;
    this.level = 0;
    this.id = 0;
  }

  setLevel(level: number): Notification {
    this.level = level;
    return this;
  }

  setId(id: number): Notification {
    this.id = id;
    return this;
  }
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications: Notification[] = [];

  show(n: Notification): void {
    this.notifications.push(n);
  }

  remove(n: Notification): void {
    setTimeout(() => {
      this.notifications = this.notifications.filter(t => t !== n);
    }, 20);
  }

  clearAll(): void {
    this.notifications = [];
  }

  clearId(id: number): void {
    this.notifications = this.notifications.filter(t => t.id !== id);
  }

  isTemplate(n: Notification): boolean {
    return n.message instanceof TemplateRef;
  }

  getClasses(level: number): string {
    switch (level) {
      case 0:
        return 'notification-info';
      case 1:
        return 'notification-success';
      case 2:
        return 'notification-failure';
    }
  }

  getIcons(level: number): string {
    switch (level) {
      case 0:
        return 'info';
      case 1:
        return 'check_circle';
      case 2:
        return 'warning';
    }
  }
}
