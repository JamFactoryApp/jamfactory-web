/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import {UrlInterceptor} from './url.interceptor';
import {OptionsInterceptor} from './options.interceptor';
import {HeaderInterceptor} from './header.interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: UrlInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: OptionsInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
];
