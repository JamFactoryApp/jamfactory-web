import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';

import {
  LoginResponseBody,
  AuthCurrentResponseBody,
  JamAuthStatus,
  LogoutResponseBody
} from 'jamfactory-types';
import {catchError} from 'rxjs/operators';
import {ErrorService} from '../errors/error.service';

@Injectable({
  providedIn: 'root'
})

export class AuthHttpService {

  private httpOptions = {
    withCredentials: true,
  };

  private apiUrl = environment.JAMFACTORY_API_URL + '/api/v1/auth';

  constructor(private http: HttpClient, private router: Router, private errorService: ErrorService) { }

  getCurrent(): Observable<JamAuthStatus> {
    return this.http
      .get<AuthCurrentResponseBody>(this.apiUrl + '/current', this.httpOptions)
      .pipe(catchError(this.errorService.handle));
  }

  getLogout(): Observable<LogoutResponseBody> {
    return this.http
      .get<LogoutResponseBody>(this.apiUrl + '/logout', this.httpOptions)
      .pipe(catchError(this.errorService.handle));
}

  getLogin(): Observable<LoginResponseBody> {
    return this.http
      .get<LoginResponseBody>(this.apiUrl + '/login', this.httpOptions)
      .pipe(catchError(this.errorService.handle));
  }
}
