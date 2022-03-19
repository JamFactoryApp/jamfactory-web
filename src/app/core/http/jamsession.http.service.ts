import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

import {
  CreateJamSessionResponseBody, GetJamSessionMembersResponseBody,
  GetJamSessionResponseBody,
  GetPlaybackResponseBody, GetPlayResponseBody,
  JamLabelBody,
  JamPlaybackBody, JamPlaySongBody,
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
import {ErrorService} from '../services/error.service';
import {catchError} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class JamsessionHttpService {

  constructor(private http: HttpClient, private router: Router, private errorService: ErrorService) {
  }

  getJamsession(): Observable<JamSessionDetails> {
    return this.http.get<GetJamSessionResponseBody>('jam').pipe(catchError( (err, caught) =>  this.errorService.handle(err, caught)));
  }

  putJamsession(body: SetJamSessionRequestBody): Observable<JamSessionDetails> {
    return this.http.put<SetJamSessionResponseBody>('jam', body).pipe(catchError((err, caught) => this.errorService.handle(err, caught)));
  }

  getPlayback(): Observable<JamPlaybackBody> {
    return this.http.get<GetPlaybackResponseBody>('jam/playback').pipe(catchError((err, caught) => this.errorService.handle(err, caught)));
  }

  putPlayback(body: SetPlaybackRequestBody): Observable<JamPlaybackBody> {
    return this.http.put<SetPlaybackResponseBody>('jam/playback', body).pipe(catchError((err, caught) => this.errorService.handle(err, caught)));
  }

  getMembers(): Observable<GetJamSessionMembersResponseBody> {
    return this.http.get<GetJamSessionMembersResponseBody>('jam/members').pipe(catchError((err, caught) => this.errorService.handle(err, caught)));
  }

  setMembers(body: SetJamSessionMembersRequestBody): Observable<GetJamSessionMembersResponseBody> {
    return this.http.put<SetJamSessionMembersResponseBody>('jam/members', body).pipe(catchError((err, caught) => this.errorService.handle(err, caught)));
  }

  createJamSession(): Observable<JamLabelBody> {
    return this.http.get<CreateJamSessionResponseBody>('jam/create').pipe(catchError((err, caught) => this.errorService.handle(err, caught)));
  }

  joinJamSession(body: JoinRequestBody): Observable<JamLabelBody> {
    return this.http.put<JoinResponseBody>('jam/join', body).pipe(catchError((err, caught) => this.errorService.handle(err, caught)));
  }

  leaveJamSession(): Observable<JamSuccessConfirmation> {
    return this.http.get<LeaveJamSessionResponseBody>('jam/leave').pipe(catchError((err, caught) => this.errorService.handle(err, caught)));
  }

  playSong(body: JamPlaySongBody): Observable<JamSuccessConfirmation> {
    return this.http.put<GetPlayResponseBody>('jam/play', body).pipe(catchError((err, caught) => this.errorService.handle(err, caught)));
  }
}
