import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import LoginResponseBody = JamFactoryApi.GetAuthLoginResponse;
import StatusResponseBody = JamFactoryApi.GetAuthCurrentResponse;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpOptions = {
    withCredentials: true
  };
  private apiUrl = 'http://' + environment.JAMFACTORY_API_URL + '/api/v1/auth';

  constructor(private http: HttpClient) {
  }

  getCurrent(): Observable<StatusResponseBody> {
    return this.http.get<StatusResponseBody>(this.apiUrl + '/current', this.httpOptions);
  }

  getLogout(): void {
    this.http.get(this.apiUrl + '/logout', this.httpOptions).subscribe();
  }

  getLogin(): Observable<LoginResponseBody> {
    return this.http.get<LoginResponseBody>(this.apiUrl + '/login', this.httpOptions);
  }
}
