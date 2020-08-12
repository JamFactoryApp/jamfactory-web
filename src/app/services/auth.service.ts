import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import LoginResponseBody = JamFactoryApi.LoginResponseBody;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpOptions = {
    withCredentials: true
  }

  constructor(private http: HttpClient) {
  }

  login(): Observable<LoginResponseBody> {
    return this.http.get<LoginResponseBody>(environment.JAMFACTORY_API_URL + '/auth/login', this.httpOptions);
  }
}
