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


@Injectable({
  providedIn: 'root'
})
export class SpotifyHttpService {

  constructor(private http: HttpClient, private errorService: ErrorService) {
  }

  getDevices(): Observable<UserDevicesResponseBody> {
    return this.http.get<UserDevicesResponseBody>('spotify/devices').pipe(catchError((err, caught) => this.errorService.handle(err, caught)));
  }

  getPlaylists(): Observable<UserPlaylistsResponseBody> {
    return this.http.get<UserPlaylistsResponseBody>('spotify/playlists').pipe(catchError((err, caught) => this.errorService.handle(err, caught)));
  }

  putSearch(body: SpotifySearchRequestBody): Observable<SpotifySearchResponseBody> {
    return this.http.put<SpotifySearchResponseBody>('spotify/search', body).pipe(catchError((err, caught) => this.errorService.handle(err, caught)));
  }
}
