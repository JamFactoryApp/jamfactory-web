import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import CreateJamSessionResponseBody = JamFactoryApi.CreateJamSessionResponseBody;
import LeaveJamSessionResponseBody = JamFactoryApi.LeaveJamSessionResponseBody;
import GetPlaybackResponseBody = JamFactoryApi.GetPlaybackResponseBody;
import SetPlaybackResponseBody = JamFactoryApi.SetPlaybackResponseBody;
import SetPlayBackRequestBody = JamFactoryApi.SetPlayBackRequestBody;
import GetJamSessionResponseBody = JamFactoryApi.GetJamSessionResponseBody;
import SetJamSessionResponseBody = JamFactoryApi.SetJamSessionResponseBody;
import SetJamSessionRequestBody = JamFactoryApi.SetJamSessionRequestBody;
import JoinResponseBody = JamFactoryApi.JoinResponseBody;
import JoinRequestBody = JamFactoryApi.JoinRequestBody;

@Injectable({
  providedIn: 'root'
})
export class JamsessionService {
  private httpOptions = {
    withCredentials: true
  };
  private apiUrl = environment.JAMFACTORY_API_URL + '/jam';

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
