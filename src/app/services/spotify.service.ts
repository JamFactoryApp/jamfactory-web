import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {
  UserDevicesResponseBody,
  UserPlaylistsResponseBody,
  SpotifySearchRequestBody,
  SpotifySearchResponseBody,
} from 'jamfactory-types';


@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private httpOptions = {
    withCredentials: true
  };
  private apiUrl = environment.JAMFACTORY_API_URL + '/api/v1/spotify';

  constructor(
    private http: HttpClient
  ) {
  }

  getDevices(): Observable<UserDevicesResponseBody> {
    return this.http.get<UserDevicesResponseBody>(this.apiUrl + '/devices', this.httpOptions);
  }

  getPlaylists(): Observable<UserPlaylistsResponseBody> {
    return this.http.get<UserPlaylistsResponseBody>(this.apiUrl + '/playlists', this.httpOptions);
  }

  putSearch(body: SpotifySearchRequestBody): Observable<SpotifySearchResponseBody> {
    return this.http.put<SpotifySearchResponseBody>(this.apiUrl + '/search', body, this.httpOptions);
  }
}
