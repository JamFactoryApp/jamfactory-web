import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable()
export class UrlInterceptor implements HttpInterceptor {

  private apiUrl = environment.JAMFACTORY_API_URL + '/api/v1/';

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

    const urlReq = req.clone({
      url: this.apiUrl + req.url
    });

    return next.handle(urlReq);
  }
}
