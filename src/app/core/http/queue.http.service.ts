import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  AddCollectionRequestBody,
  AddCollectionResponseBody,
  DeleteSongRequestBody,
  DeleteSongResponseBody,
  GetQueueResponseBody,
  JamQueue,
  VoteRequestBody,
  VoteResponseBody
} from '@jamfactoryapp/jamfactory-types';
import {catchError} from 'rxjs/operators';
import {ErrorService} from '../errors/error.service';


@Injectable({
  providedIn: 'root'
})
export class QueueHttpService {

  constructor(private http: HttpClient, private errorService: ErrorService) {
  }

  getQueue(): Observable<JamQueue> {
    return this.http.get<GetQueueResponseBody>('queue').pipe(catchError(this.errorService.handle));
  }

  putQueueVote(body: VoteRequestBody): Observable<JamQueue> {
    return this.http.put<VoteResponseBody>('queue/vote', body).pipe(catchError(this.errorService.handle));
  }

  deleteQueueTrack(body: DeleteSongRequestBody): Observable<DeleteSongResponseBody> {
    return this.http.request<DeleteSongResponseBody>('DELETE', 'queue/delete', {body}).pipe(catchError(this.errorService.handle));
  }

  putQueueCollection(body: AddCollectionRequestBody): Observable<JamQueue> {
    return this.http.put<AddCollectionResponseBody>('queue/collection', body).pipe(catchError(this.errorService.handle));
  }
}
