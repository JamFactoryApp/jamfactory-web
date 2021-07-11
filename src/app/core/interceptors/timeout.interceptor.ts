import {Inject, Injectable, InjectionToken} from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';

import {Observable } from 'rxjs';
import { throwError } from 'rxjs';
import {catchError, timeout} from 'rxjs/operators';

const TIMEOUT = 5000;

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  constructor() {}



  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const timeoutValue = Number(req.headers.get('timeout') || TIMEOUT);
    return next.handle(req).pipe(
      timeout(timeoutValue),
      catchError(() => throwError(new HttpErrorResponse({error: 'timeout', status: 408, statusText: 'Request Timeout'}))));
  }
}
