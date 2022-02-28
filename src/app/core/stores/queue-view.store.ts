import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueueViewStore {

  private queueViewToggle: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  get status(): boolean {
    return this.queueViewToggle.value;
  }

  set status(value: boolean) {
    this.queueViewToggle.next(value);
  }

  get $status(): Observable<boolean> {
    return new Observable(fn => this.queueViewToggle.subscribe(fn));
  }
}
