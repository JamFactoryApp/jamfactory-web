import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {JamAuthStatus, JamQueue} from 'jamfactory-types';

@Injectable({
  providedIn: 'root'
})
export class QueueStore {

  private queueSubject: BehaviorSubject<JamQueue> = new BehaviorSubject<JamQueue>({tracks: []});

  constructor() { }

  get queue(): JamQueue {
    return this.queueSubject.value;
  }

  set queue(queue: JamQueue) {
    this.queueSubject.next(queue);
  }

  get $queue(): Observable<JamQueue> {
    return new Observable(fn => this.queueSubject.subscribe(fn));
  }
}
