import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import GetQueueResponseBody = JamFactoryApi.GetQueueResponseBody;
import VoteRequestBody = JamFactoryApi.VoteRequestBody;
import VoteQueueResponseBody = JamFactoryApi.VoteQueueResponseBody;
import AddPlaylistRequestBody = JamFactoryApi.AddPlaylistRequestBody;
import PlaylistQueueResponseBody = JamFactoryApi.PlaylistQueueResponseBody;

@Injectable({
  providedIn: 'root'
})
export class QueueServiceService {
  private httpOptions = {
    withCredentials: true
  };
  private apiUrl = environment.JAMFACTORY_API_URL + '/queue';

  constructor(
    private http: HttpClient
  ) {
  }

  getQueue(): Observable<GetQueueResponseBody> {
    return this.http.get<GetQueueResponseBody>(this.apiUrl, this.httpOptions);
  }

  putQueueVote(body: VoteRequestBody): Observable<VoteQueueResponseBody> {
    return this.http.put<VoteQueueResponseBody>(this.apiUrl + '/vote', body, this.httpOptions);
  }

  putQueuePlaylist(body: AddPlaylistRequestBody): Observable<PlaylistQueueResponseBody> {
    return this.http.put<PlaylistQueueResponseBody>(this.apiUrl + '/playlist', body, this.httpOptions);
  }
}
