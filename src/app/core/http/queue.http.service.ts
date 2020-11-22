import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {
  GetQueueResponseBody,
  VoteRequestBody,
  VoteResponseBody,
  AddCollectionRequestBody,
  AddCollectionResponseBody, JamSessionDetails,
  JamQueue, QueueSong, GetJamSessionResponseBody
} from 'jamfactory-types';
import {catchError} from 'rxjs/operators';
import {ErrorService} from '../errors/error.service';


@Injectable({
  providedIn: 'root'
})
export class QueueHttpService {

  private httpOptions = {
    withCredentials: true
  };

  // private queueSubject: BehaviorSubject<JamQueue> = new BehaviorSubject<JamQueue>({queue: []});
  private apiUrl = environment.JAMFACTORY_API_URL + '/api/v1/queue';

  constructor(private http: HttpClient, private errorService: ErrorService) { }

  getQueue(): Observable<JamQueue> {
    return this.http
      .get<GetQueueResponseBody>(this.apiUrl, this.httpOptions)
      .pipe(catchError(this.errorService.handle));
  }

  putQueueVote(body: VoteRequestBody): Observable<JamQueue> {
    return this.http
      .put<VoteResponseBody>(this.apiUrl + '/vote', body, this.httpOptions)
      .pipe(catchError(this.errorService.handle));
  }

  putQueueCollection(body: AddCollectionRequestBody): Observable<JamQueue> {
    return this.http
      .put<AddCollectionResponseBody>(this.apiUrl + '/collection', body, this.httpOptions)
      .pipe(catchError(this.errorService.handle));
  }
}
