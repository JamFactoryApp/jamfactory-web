import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Router} from '@angular/router';

import {
  LoginResponseBody,
  AuthCurrentResponseBody,
  JamAuthStatus,
  LogoutResponseBody
} from '@jamfactoryapp/jamfactory-types';
import {catchError} from 'rxjs/operators';
import {ErrorService} from '../errors/error.service';

@Injectable({
  providedIn: 'root'
})

export class AuthHttpService {

  private httpOptions = {
    withCredentials: true,
  };



  constructor(private http: HttpClient, private router: Router, private errorService: ErrorService) { }

  getCurrent(): Observable<JamAuthStatus> {
    return this.http
      .get<AuthCurrentResponseBody>('auth/current', this.httpOptions)
      .pipe(catchError(this.errorService.handle));
  }

  getLogout(): Observable<LogoutResponseBody> {
    return this.http
      .get<LogoutResponseBody>('auth/logout', this.httpOptions)
      .pipe(catchError(this.errorService.handle));
}

  getLogin(): Observable<LoginResponseBody> {
    return this.http
      .get<LoginResponseBody>('auth/login', this.httpOptions)
      .pipe(catchError(this.errorService.handle));
  }
}
