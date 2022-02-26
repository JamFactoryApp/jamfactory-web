import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {SpotifySearchResponseBody} from '@jamfactoryapp/jamfactory-types';

@Injectable({
  providedIn: 'root'
})
export class MenuStore {

  private menuToggle: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  get status(): boolean {
    return this.menuToggle.value;
  }

  set status(value: boolean) {
    this.menuToggle.next(value);
  }

  get $status(): Observable<boolean> {
    return new Observable(fn => this.menuToggle.subscribe(fn));
  }
}
