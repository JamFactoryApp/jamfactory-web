import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import UserDevicesResponse = SpotifyApi.UserDevicesResponse;
import GetPlaylistsResponseBody = JamFactoryApi.GetSpotifyPlaylistsResponse;
import PutSpotifySearchRequest = JamFactoryApi.PutSpotifySearchRequest;
import PutSpotifySearchResponse = JamFactoryApi.PutSpotifySearchResponse;

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private httpOptions = {
    withCredentials: true
  };
  private apiUrl = 'http://' + environment.JAMFACTORY_API_URL + '/api/v1/spotify';

  constructor(
    private http: HttpClient
  ) {
  }

  getDevices(): Observable<UserDevicesResponse> {
    return this.http.get<UserDevicesResponse>(this.apiUrl + '/devices', this.httpOptions);
  }

  getPlaylists(): Observable<GetPlaylistsResponseBody> {
    return this.http.get<GetPlaylistsResponseBody>(this.apiUrl + '/playlists', this.httpOptions);
  }

  putSearch(body: PutSpotifySearchRequest): Observable<PutSpotifySearchResponse> {
    return this.http.put<PutSpotifySearchResponse>(this.apiUrl + '/search', body, this.httpOptions);
  }
}
