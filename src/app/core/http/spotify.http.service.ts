import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {
  UserDevicesResponseBody,
  UserPlaylistsResponseBody,
  SpotifySearchRequestBody,
  SpotifySearchResponseBody,
} from 'jamfactory-types';
import {catchError} from 'rxjs/operators';
import {ErrorService} from '../errors/error.service';


@Injectable({
  providedIn: 'root'
})
export class SpotifyHttpService {

  constructor(private http: HttpClient, private errorService: ErrorService) { }

  getDevices(): Observable<UserDevicesResponseBody> {
    return this.http.get<UserDevicesResponseBody>('spotify/devices').pipe(catchError(this.errorService.handle));
  }

  getPlaylists(): Observable<UserPlaylistsResponseBody> {
    return this.http.get<UserPlaylistsResponseBody>('spotify/playlists').pipe(catchError(this.errorService.handle));
  }

  putSearch(body: SpotifySearchRequestBody): Observable<SpotifySearchResponseBody> {
    return this.http.put<SpotifySearchResponseBody>('spotify/search', body).pipe(catchError(this.errorService.handle));
  }
}
