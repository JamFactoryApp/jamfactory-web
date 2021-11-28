import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {
  SpotifySearchRequestBody,
  SpotifySearchResponseBody,
  UserDevicesResponseBody,
  UserPlaylistsResponseBody,
} from '@jamfactoryapp/jamfactory-types';
import {catchError} from 'rxjs/operators';
import {ErrorService} from '../services/error.service';
import {EMPTY} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SpotifyHttpService {

  // search: Observable<SpotifySearchResponseBody> = EMPTY;
  // search: Observable<SpotifySearchResponseBody>;
  // private tSearch = new BehaviorSubject<SpotifySearchResponseBody>({ artists: null, albums: null, playlists: null, tracks: null});
  private tSearch = new BehaviorSubject<SpotifySearchResponseBody>(EMPTY as SpotifySearchResponseBody);
  readonly search = this.tSearch.asObservable();

  // search = new BehaviorSubject([]);
  // private uTodos: BehaviorSubject<any> = new BehaviorSubject(EMPTY);
  // public readonly search: Observable<SpotifySearchResponseBody> = this.uTodos.asObservable();

  constructor(private http: HttpClient, private errorService: ErrorService) {
  }

  getDevices(): Observable<UserDevicesResponseBody> {
    return this.http.get<UserDevicesResponseBody>('spotify/devices').pipe(catchError(this.errorService.handle));
  }

  getPlaylists(): Observable<UserPlaylistsResponseBody> {
    return this.http.get<UserPlaylistsResponseBody>('spotify/playlists').pipe(catchError(this.errorService.handle));
  }

  // putSearch(body: SpotifySearchRequestBody): Observable<SpotifySearchResponseBody> {
  //   return this.http.put<SpotifySearchResponseBody>('spotify/search', body).pipe(catchError(this.errorService.handle));
  // }

  putSearch(body: SpotifySearchRequestBody): void {
    // console.log('PUT CALL');
    this.http.put<SpotifySearchResponseBody>('spotify/search', body).pipe(catchError(this.errorService.handle))
      .subscribe(value => {
        this.tSearch.next(value);
      });
    // this.tSearch.next(this.http.put<SpotifySearchResponseBody>('spotify/search', body).pipe(catchError(this.errorService.handle)));
    // this.search.next(this.http.put<SpotifySearchResponseBody>('spotify/search', body).pipe(catchError(this.errorService.handle)));
    // this.search.next() = this.http.put<SpotifySearchResponseBody>('spotify/search', body).pipe(catchError(this.errorService.handle));
  }

  getSearch(): Observable<SpotifySearchResponseBody> {
    // console.log('GET CALL');
    return this.search;
  }
}
