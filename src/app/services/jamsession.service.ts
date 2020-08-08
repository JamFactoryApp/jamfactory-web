import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import CreateJamSessionResponseBody = JamFactoryApi.CreateJamSessionResponseBody;
import LeaveJamSessionResponseBody = JamFactoryApi.LeaveJamSessionResponseBody;
import GetPlaybackResponseBody = JamFactoryApi.GetPlaybackResponseBody;
import SetPlaybackResponseBody = JamFactoryApi.SetPlaybackResponseBody;
import SetPlayBackRequestBody = JamFactoryApi.SetPlayBackRequestBody;

@Injectable({
  providedIn: 'root'
})
export class JamsessionService {
  private httpOptions = {};

  constructor(
    private http: HttpClient
  ) {
  }

  createJamsession(): Observable<CreateJamSessionResponseBody> {
    return this.http.get<CreateJamSessionResponseBody>('/api/v1/jam/create', this.httpOptions);
  }

  leaveJamSession(): Observable<LeaveJamSessionResponseBody> {
    return this.http.get<LeaveJamSessionResponseBody>('/api/v1/jam/leave', this.httpOptions);
  }

  getPlayback(): Observable<GetPlaybackResponseBody> {
    return this.http.get<GetPlaybackResponseBody>('/api/v1/jam/playback', this.httpOptions);
  }

  putPlayback(body: SetPlayBackRequestBody): Observable<SetPlaybackResponseBody> {
    return this.http.put<SetPlaybackResponseBody>('/api/v1/jam/playback', body, this.httpOptions);
  }
}
