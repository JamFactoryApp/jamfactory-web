import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {JamMember, JamPlaybackBody, JamSessionDetails} from '@jamfactoryapp/jamfactory-types';
import {UserStore} from './user.store';

@Injectable({
  providedIn: 'root'
})
export class MemberStore {

  private membersSubject: BehaviorSubject<JamMember[]> = new BehaviorSubject<JamMember[]>([]);
  private currentMemberSubject: BehaviorSubject<JamMember> = new BehaviorSubject<JamMember>(undefined);
  private isHostSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(undefined);

  constructor(private userStore: UserStore) {
  }

  get members(): JamMember[] {
    return this.membersSubject.value;
  }

  set members(members: JamMember[]) {
    this.membersSubject.next(members);

    if (this.userStore.currentUser) {
      const currentMemberArr = members.filter(m => m.identifier === this.userStore.currentUser.identifier);

      if (currentMemberArr.length === 1) {

        this.currentMemberSubject.next(currentMemberArr[0]);

      }
    }
  }

  get $members(): Observable<JamMember[]> {
    return new Observable(fn => this.membersSubject.subscribe(fn));
  }

  get currentMember(): JamMember {
    return this.currentMemberSubject.value;
  }

  get $currentMember(): Observable<JamMember> {
    return new Observable(fn => this.currentMemberSubject.subscribe(fn));
  }

}
