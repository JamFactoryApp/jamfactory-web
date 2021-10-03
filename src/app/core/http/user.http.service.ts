import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

import {
  DeleteUserResponseBody,
  GetUserResponseBody,
  JamSuccessConfirmation,
  JamUser,
  SetUserResponseBody
} from '@jamfactoryapp/jamfactory-types';
import {catchError} from 'rxjs/operators';
import {ErrorService} from '../errors/error.service';

@Injectable({
  providedIn: 'root'
})

export class UserHttpService {

  private httpOptions = {
    withCredentials: true,
  };


  constructor(private http: HttpClient, private router: Router, private errorService: ErrorService) {
  }

  getCurrentUser(): Observable<JamUser> {
    return this.http
      .get<GetUserResponseBody>('me', this.httpOptions)
      .pipe(catchError(this.errorService.handle));
  }

  setCurrentUser(): Observable<JamUser> {
    return this.http
      .put<SetUserResponseBody>('me', this.httpOptions)
      .pipe(catchError(this.errorService.handle));
  }

  deleteCurrentUser(): Observable<JamSuccessConfirmation> {
    return this.http
      .delete<DeleteUserResponseBody>('me', this.httpOptions)
      .pipe(catchError(this.errorService.handle));
  }
}
