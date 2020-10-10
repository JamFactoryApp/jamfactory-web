import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import CreateJamSessionResponseBody = JamFactoryApi.GetJamCreateResponse;
import LeaveJamSessionResponseBody = JamFactoryApi.GetJamLeaveResponse;
import GetPlaybackResponseBody = JamFactoryApi.GetJamPlaybackResponse;
import SetPlaybackResponseBody = JamFactoryApi.PutPlaybackResponseBody;
import SetPlayBackRequestBody = JamFactoryApi.PutJamPlaybackRequest;
import GetJamSessionResponseBody = JamFactoryApi.GetJamResponse;
import SetJamSessionResponseBody = JamFactoryApi.PutJamResponse;
import SetJamSessionRequestBody = JamFactoryApi.PutJamRequest;
import JoinResponseBody = JamFactoryApi.JoinResponseBody;
import JoinRequestBody = JamFactoryApi.PutJamJoinResponse;

@Injectable({
  providedIn: 'root'
})
export class JamsessionService {
  private httpOptions = {
    withCredentials: true
  };
  private apiUrl = 'http://' + environment.JAMFACTORY_API_URL + '/api/v1/jam';

  constructor(
    private http: HttpClient
  ) {
  }

  getJamsession(): Observable<GetJamSessionResponseBody> {
    return this.http.get<GetJamSessionResponseBody>(this.apiUrl, this.httpOptions);
  }

  putJamsession(body: SetJamSessionRequestBody): Observable<SetJamSessionResponseBody> {
    return this.http.put<SetJamSessionResponseBody>(this.apiUrl, body, this.httpOptions);
  }

  getPlayback(): Observable<GetPlaybackResponseBody> {
    return this.http.get<GetPlaybackResponseBody>(this.apiUrl + '/playback', this.httpOptions);
  }

  putPlayback(body: SetPlayBackRequestBody): Observable<SetPlaybackResponseBody> {
    return this.http.put<SetPlaybackResponseBody>(this.apiUrl + '/playback', body, this.httpOptions);
  }

  createJamsession(): Observable<CreateJamSessionResponseBody> {
    return this.http.get<CreateJamSessionResponseBody>(this.apiUrl + '/create', this.httpOptions);
  }

  joinJamSession(body: JoinRequestBody): Observable<JoinResponseBody> {
    return this.http.put<JoinResponseBody>(this.apiUrl + '/join', body, this.httpOptions);
  }

  leaveJamSession(): Observable<LeaveJamSessionResponseBody> {
    return this.http.get<LeaveJamSessionResponseBody>(this.apiUrl + '/leave', this.httpOptions);
  }
}
