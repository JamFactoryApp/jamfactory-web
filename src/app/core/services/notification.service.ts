import {Injectable, TemplateRef} from '@angular/core';

export class Notification {

  message: string | TemplateRef<any>;
  autohide: boolean;
  delay: number;
  id: number;
  level: number;
  header: string;
  headerIcon: string;
  closeFunction: () => void;

  constructor(
    message: string | TemplateRef<any>,
  ) {
    this.message = message;
    this.autohide = false;
    this.delay = 0;
    this.level = 0;
    this.id = 0;
    this.header = undefined;
    this.headerIcon = undefined;
    this.closeFunction = () => {
    };
  }

  setLevel(level: number): Notification {
    this.level = level;
    return this;
  }

  addCloseFunction(func: () => void): Notification {
    this.closeFunction = func;
    return this;
  }

  setAutohide(delay: number): Notification {
    this.autohide = true;
    this.delay = delay;
    return this;
  }

  addHeader(header: string, icon?: string): Notification {
    this.header = header;
    if (icon) {
      this.headerIcon = icon;
    }
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
    this.notifications = this.notifications.filter(t => t !== n);
  }

  clearAll(): void {
    this.notifications = [];
  }

  clearId(id: number): void {
    this.notifications = this.notifications.filter(t => t.id !== id);
  }

  clearPersistent(): void {
    this.notifications = this.notifications.filter(t => t.autohide === true);
  }

  isTemplate(n: Notification): boolean {
    return n.message instanceof TemplateRef;
  }

  getClasses(level: number): string {
    switch (level) {
      case 0:
        return '';
      case 1:
        return 'bg-success text-light';
      case 2:
        return 'bg-danger text-light';
    }
  }
}
