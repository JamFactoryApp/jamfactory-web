import {Injectable} from '@angular/core';

export class Modal {
  header: string;
  message: string;
  withInput: boolean;
  label: string;
  placeholder: string;
  level: number;
  buttonText: string;
  callback: (input: string) => void;
  constructor(
  ) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modals: Modal[] = [];

  add(m: Modal): void {
    this.modals.push(m);
  }

  remove(m: Modal): void {
    this.modals = this.modals.filter(t => t !== m);
  }

  clearAll(): void {
    this.modals = [];
  }

  getClasses(level: number): string {
    switch (level) {
      case 0:
        return 'button-blue';
      case 1:
        return 'button-green';
      case 2:
        return 'button-orange';
    }
  }

}
