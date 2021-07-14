import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ErrorService {

  constructor() {
  }

  handle(error: HttpErrorResponse, caught: Observable<any>): Observable<any> {
    return throwError(error);
  }
}
