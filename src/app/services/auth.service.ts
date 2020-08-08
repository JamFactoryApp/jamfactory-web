import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import LoginResponseBody = JamFactoryApi.LoginResponseBody;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpOptions = {};

  constructor(private http: HttpClient) {
  }

  login(): Observable<LoginResponseBody> {
    return this.http.get<LoginResponseBody>('/api/v1/auth/login', this.httpOptions);
  }
}
