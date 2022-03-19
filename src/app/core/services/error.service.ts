import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ErrorService {

  constructor() {
  }

  handle(caughtError: HttpErrorResponse, caught: Observable<any>): Observable<any> {
    return throwError(() => {
      const error: HttpErrorResponse = new HttpErrorResponse(
        {
          error: caughtError.error.replace('\n', ''),
          headers: caughtError.headers,
          status: caughtError.status,
          statusText: caughtError.statusText
        });
      return error;
    });
  }
}
