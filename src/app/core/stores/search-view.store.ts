import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchViewStore {

  private searchViewToggle: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  get status(): boolean {
    return this.searchViewToggle.value;
  }

  set status(value: boolean) {
    this.searchViewToggle.next(value);
  }

  get $status(): Observable<boolean> {
    return new Observable(fn => this.searchViewToggle.subscribe(fn));
  }
}
