import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export class ViewSettings {
  cardMode: boolean;
  searchBarViewToggle: boolean;
  searchResultViewToggle: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ViewStore {

  defaultView: ViewSettings = {
    cardMode: false,
    searchBarViewToggle: false,
    searchResultViewToggle: false
  };

  private viewSubject: BehaviorSubject<ViewSettings> = new BehaviorSubject<ViewSettings>(this.defaultView);

  constructor() {
  }

  get view(): ViewSettings {
    return this.viewSubject.value;
  }

  get $view(): Observable<ViewSettings> {
    return new Observable(fn => this.viewSubject.subscribe(fn));
  }

  set statusSearchBar(value: boolean) {
    const v = this.viewSubject.value;
    v.searchBarViewToggle = value;
    this.viewSubject.next(v);
  }

  set statusSearchBox(value: boolean) {
    const v = this.viewSubject.value;
    v.searchResultViewToggle = value;
    this.viewSubject.next(v);
  }

  set cardMode(value: boolean) {
    const v = this.viewSubject.value;
    v.cardMode = value;
    this.viewSubject.next(v);
  }
}
