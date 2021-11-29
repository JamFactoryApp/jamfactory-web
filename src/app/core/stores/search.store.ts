import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {
  SpotifySearchRequestBody,
  SpotifySearchResponseBody,
  UserDevicesResponseBody,
  UserPlaylistsResponseBody,
} from '@jamfactoryapp/jamfactory-types';

@Injectable({
  providedIn: 'root'
})
export class SearchStore {

  private searchSubject: BehaviorSubject<SpotifySearchResponseBody> = new BehaviorSubject<SpotifySearchResponseBody>(undefined);

  constructor() {
  }

  get search(): SpotifySearchResponseBody {
    return this.searchSubject.value;
  }

  set search(search: SpotifySearchResponseBody) {
    this.searchSubject.next(search);
  }

  get $search(): Observable<SpotifySearchResponseBody> {
    return new Observable(fn => this.searchSubject.subscribe(fn));
  }
}
