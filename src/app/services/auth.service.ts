import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {LoginResponseBody, AuthCurrentResponseBody } from 'jamfactory-types';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpOptions = {
    withCredentials: true
  };
  private apiUrl = environment.JAMFACTORY_API_URL + '/api/v1/auth';

  constructor(private http: HttpClient) {
  }

  getCurrent(): Observable<AuthCurrentResponseBody> {
    return this.http.get<AuthCurrentResponseBody>(this.apiUrl + '/current', this.httpOptions);
  }

  getLogout(): void {
    this.http.get(this.apiUrl + '/logout', this.httpOptions).subscribe();
  }

  getLogin(): Observable<LoginResponseBody> {
    return this.http.get<LoginResponseBody>(this.apiUrl + '/login', this.httpOptions);
  }
}
