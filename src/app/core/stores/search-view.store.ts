import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchViewStore {

  private searchBarViewToggle: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private searchResultViewToggle: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  get statusSearchBar(): boolean {
    return this.searchBarViewToggle.value;
  }

  set statusSearchBar(value: boolean) {
    this.searchBarViewToggle.next(value);
  }

  get $statusSearchBar(): Observable<boolean> {
    return new Observable(fn => this.searchBarViewToggle.subscribe(fn));
  }

  get statusSearchBox(): boolean {
    return this.searchResultViewToggle.value;
  }

  set statusSearchBox(value: boolean) {
    this.searchResultViewToggle.next(value);
  }

  get $statusSearchBox(): Observable<boolean> {
    return new Observable(fn => this.searchResultViewToggle.subscribe(fn));
  }
}
