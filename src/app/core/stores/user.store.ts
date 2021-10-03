import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {JamUser} from '@jamfactoryapp/jamfactory-types';

@Injectable({
  providedIn: 'root'
})
export class UserStore {

  private currentUserSubject: BehaviorSubject<JamUser> = new BehaviorSubject<JamUser>(undefined);
  public showedAuthSuccess = false;
  constructor() {
  }

  get currentUser(): JamUser {
    return this.currentUserSubject.value;
  }

  set currentUser(authStatus) {
    this.currentUserSubject.next(authStatus);
  }

  get $currentUser(): Observable<JamUser> {
    return new Observable(fn => this.currentUserSubject.subscribe(fn));
  }
}
