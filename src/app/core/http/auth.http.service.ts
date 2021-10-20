import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

import {LoginResponseBody, LogoutResponseBody} from '@jamfactoryapp/jamfactory-types';
import {catchError} from 'rxjs/operators';
import {ErrorService} from '../services/error.service';

@Injectable({
  providedIn: 'root'
})

export class AuthHttpService {

  private httpOptions = {
    withCredentials: true,
  };


  constructor(private http: HttpClient, private router: Router, private errorService: ErrorService) {
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
