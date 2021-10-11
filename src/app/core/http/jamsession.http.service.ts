import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

import {
  CreateJamSessionResponseBody, GetJamSessionMembersResponseBody,
  GetJamSessionResponseBody,
  GetPlaybackResponseBody,
  JamLabelBody,
  JamPlaybackBody,
  JamSessionDetails,
  JamSuccessConfirmation,
  JoinRequestBody,
  JoinResponseBody,
  LeaveJamSessionResponseBody, SetJamSessionMembersRequestBody, SetJamSessionMembersResponseBody,
  SetJamSessionRequestBody,
  SetJamSessionResponseBody,
  SetPlaybackRequestBody,
  SetPlaybackResponseBody
} from '@jamfactoryapp/jamfactory-types';
import {Router} from '@angular/router';
import {ErrorService} from '../errors/error.service';
import {catchError} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class JamsessionHttpService {

  constructor(private http: HttpClient, private router: Router, private errorService: ErrorService) {
  }

  getJamsession(): Observable<JamSessionDetails> {
    return this.http.get<GetJamSessionResponseBody>('jam').pipe(catchError(this.errorService.handle));
  }

  putJamsession(body: SetJamSessionRequestBody): Observable<JamSessionDetails> {
    return this.http.put<SetJamSessionResponseBody>('jam', body).pipe(catchError(this.errorService.handle));
  }

  getPlayback(): Observable<JamPlaybackBody> {
    return this.http.get<GetPlaybackResponseBody>('jam/playback').pipe(catchError(this.errorService.handle));
  }

  putPlayback(body: SetPlaybackRequestBody): Observable<JamPlaybackBody> {
    return this.http.put<SetPlaybackResponseBody>('jam/playback', body).pipe(catchError(this.errorService.handle));
  }

  getMembers(): Observable<GetJamSessionMembersResponseBody> {
    return this.http.get<GetJamSessionMembersResponseBody>('jam/members').pipe(catchError(this.errorService.handle));
  }

  setMembers(body: SetJamSessionMembersRequestBody): Observable<GetJamSessionMembersResponseBody> {
    return this.http.put<SetJamSessionMembersResponseBody>('jam/members', body).pipe(catchError(this.errorService.handle));
  }

  createJamSession(): Observable<JamLabelBody> {
    return this.http.get<CreateJamSessionResponseBody>('jam/create').pipe(catchError(this.errorService.handle));
  }

  joinJamSession(body: JoinRequestBody): Observable<JamLabelBody> {
    return this.http.put<JoinResponseBody>('jam/join', body).pipe(catchError(this.errorService.handle));
  }

  leaveJamSession(): Observable<JamSuccessConfirmation> {
    return this.http.get<LeaveJamSessionResponseBody>('jam/leave').pipe(catchError(this.errorService.handle));
  }
}
