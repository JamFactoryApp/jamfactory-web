import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {
  GetQueueResponseBody,
  VoteRequestBody,
  VoteResponseBody,
  AddCollectionRequestBody,
  AddCollectionResponseBody,
} from 'jamfactory-types';


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

  putQueueVote(body: VoteRequestBody): Observable<VoteResponseBody> {
    return this.http.put<VoteResponseBody>(this.apiUrl + '/vote', body, this.httpOptions);
  }

  putQueueCollection(body: AddCollectionRequestBody): Observable<AddCollectionResponseBody> {
    return this.http.put<AddCollectionResponseBody>(this.apiUrl + '/collection', body, this.httpOptions);
  }
}
