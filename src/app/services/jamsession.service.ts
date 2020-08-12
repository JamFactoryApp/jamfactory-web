import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import CreateJamSessionResponseBody = JamFactoryApi.CreateJamSessionResponseBody;
import LeaveJamSessionResponseBody = JamFactoryApi.LeaveJamSessionResponseBody;
import GetPlaybackResponseBody = JamFactoryApi.GetPlaybackResponseBody;
import SetPlaybackResponseBody = JamFactoryApi.SetPlaybackResponseBody;
import SetPlayBackRequestBody = JamFactoryApi.SetPlayBackRequestBody;

@Injectable({
  providedIn: 'root'
})
export class JamsessionService {
  private httpOptions = {
    withCredentials: true
  };

  constructor(
    private http: HttpClient
  ) {
  }

  createJamsession(): Observable<CreateJamSessionResponseBody> {
    return this.http.get<CreateJamSessionResponseBody>(environment.JAMFACTORY_API_URL + '/jam/create', this.httpOptions);
  }

  leaveJamSession(): Observable<LeaveJamSessionResponseBody> {
    return this.http.get<LeaveJamSessionResponseBody>(environment.JAMFACTORY_API_URL + '/jam/leave', this.httpOptions);
  }

  getPlayback(): Observable<GetPlaybackResponseBody> {
    return this.http.get<GetPlaybackResponseBody>(environment.JAMFACTORY_API_URL + '/jam/playback', this.httpOptions);
  }

  putPlayback(body: SetPlayBackRequestBody): Observable<SetPlaybackResponseBody> {
    return this.http.put<SetPlaybackResponseBody>(environment.JAMFACTORY_API_URL + '/jam/playback', body, this.httpOptions);
  }
}
