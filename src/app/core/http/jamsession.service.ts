import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

import {
  CreateJamSessionResponseBody,
  LeaveJamSessionResponseBody,
  GetPlaybackResponseBody,
  SetPlaybackResponseBody,
  SetPlaybackRequestBody,
  GetJamSessionResponseBody,
  SetJamSessionResponseBody,
  SetJamSessionRequestBody,
  JoinResponseBody,
  JoinRequestBody, JamAuthStatus,
  JamSessionDetails, AuthCurrentResponseBody,
  JamPlaybackBody, JamLabelBody, JamSuccessConfirmation
} from 'jamfactory-types';
import {Router} from '@angular/router';
import {ErrorService} from '../errors/error.service';
import {catchError} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class JamsessionService {

  private httpOptions = {
    withCredentials: true
  };

  private apiUrl = environment.JAMFACTORY_API_URL + '/api/v1/jam';

  constructor(private http: HttpClient, private router: Router, private errorService: ErrorService) { }

  getJamsession(): Observable<JamSessionDetails> {
   return this.http
     .get<GetJamSessionResponseBody>(this.apiUrl, this.httpOptions)
     .pipe(catchError(this.errorService.handle));
  }

  putJamsession(body: SetJamSessionRequestBody): Observable<JamSessionDetails> {
    return this.http
      .put<SetJamSessionResponseBody>(this.apiUrl, body, this.httpOptions)
      .pipe(catchError(this.errorService.handle));
  }

  getPlayback(): Observable<JamPlaybackBody> {
    return this.http
      .get<GetPlaybackResponseBody>(this.apiUrl + '/playback', this.httpOptions)
      .pipe(catchError(this.errorService.handle));
  }

  putPlayback(body: SetPlaybackRequestBody): Observable<JamPlaybackBody> {
    return this.http
      .put<SetPlaybackResponseBody>(this.apiUrl + '/playback', body, this.httpOptions)
      .pipe(catchError(this.errorService.handle));
  }

  createJamsession(): Observable<JamLabelBody> {
    return this.http
      .get<CreateJamSessionResponseBody>(this.apiUrl + '/create', this.httpOptions)
      .pipe(catchError(this.errorService.handle));
  }

  joinJamSession(body: JoinRequestBody): Observable<JamLabelBody> {
    return this.http
      .put<JoinResponseBody>(this.apiUrl + '/join', body, this.httpOptions)
      .pipe(catchError(this.errorService.handle));
  }

  leaveJamSession(): Observable<JamSuccessConfirmation> {
    return this.http
      .get<LeaveJamSessionResponseBody>(this.apiUrl + '/leave', this.httpOptions)
      .pipe(catchError(this.errorService.handle));
  }
}
