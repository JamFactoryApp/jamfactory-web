import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {JamMember} from '@jamfactoryapp/jamfactory-types';
import {UserStore} from './user.store';
import {Notification, NotificationService} from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class MemberStore {

  private membersSubject: BehaviorSubject<JamMember[]> = new BehaviorSubject<JamMember[]>([]);
  private currentMemberSubject: BehaviorSubject<JamMember> = new BehaviorSubject<JamMember>(undefined);
  private isHostSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(undefined);

  constructor(private userStore: UserStore, private notifications: NotificationService) {
  }

  get members(): JamMember[] {
    return this.membersSubject.value;
  }

  set members(members: JamMember[]) {
    if (this.membersSubject.value.length !== 0) {
      const newMembers = members.filter(member => {
        let isNewMember = true;
        this.membersSubject.value.forEach(m => {
          if (m.identifier === member.identifier) {
            isNewMember = false;
          }
        });
        return isNewMember;
      });

      newMembers.forEach(newMember => {
        this.notifications.show(new Notification(newMember.display_name + ' joined'));
      });

    }
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
