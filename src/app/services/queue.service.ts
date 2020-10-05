import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import GetQueueResponseBody = JamFactoryApi.GetQueueResponse;
import VoteRequestBody = JamFactoryApi.PutQueueVoteRequest;
import VoteQueueResponseBody = JamFactoryApi.PutQueueVoteResponse;
import AddPlaylistRequestBody = JamFactoryApi.PutQueuePlaylistRequest;
import PlaylistQueueResponseBody = JamFactoryApi.PutQueuePlaylistResponse;

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  private httpOptions = {
    withCredentials: true
  };
  private apiUrl = environment.JAMFACTORY_API_URL + '/api/v1/queue';

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
    return this.http.put<PlaylistQueueResponseBody>(this.apiUrl + '/collection', body, this.httpOptions);
  }
}
