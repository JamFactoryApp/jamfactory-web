import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {JamAuthStatus} from '@jamfactoryapp/jamfactory-types';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {

  public showedAuthSuccess = false;
  private defaultStatus: JamAuthStatus = {
    label: '',
    user: 'New',
    authorized: false
  };
  private authStatusSubject: BehaviorSubject<JamAuthStatus> = new BehaviorSubject<JamAuthStatus>(this.defaultStatus);

  constructor() {
  }

  get authStatus(): JamAuthStatus {
    return this.authStatusSubject.value;
  }

  set authStatus(authStatus: JamAuthStatus) {
    this.authStatusSubject.next(authStatus);
  }

  get $authStatus(): Observable<JamAuthStatus> {
    return new Observable(fn => this.authStatusSubject.subscribe(fn));
  }
}
