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
  private currentHostSubject: BehaviorSubject<JamMember> = new BehaviorSubject<JamMember>(undefined);

  constructor(private userStore: UserStore, private notifications: NotificationService) {
  }

  get members(): JamMember[] {
    return this.membersSubject.value;
  }

  set members(members: JamMember[]) {
    /*Check if joined member is new or already was in the JamSession*/
    if (this.membersSubject.value.length !== 0) {
      const newMembers = members.filter(member => {
        let isNewMember = true;
        this.membersSubject.value.forEach(m => {
          if (m.identifier === member.identifier) {
            isNewMember = false;
          }
        });
        if (member.permissions.includes('Host')) {
          isNewMember = false;
        }
        return isNewMember;
      });

      newMembers.forEach(newMember => {
        this.notifications.show(new Notification(newMember.display_name + ' joined'));
      });
    }

    /*Set sorted members*/
    this.membersSubject.next(this.sortMembers(members));

    if (this.userStore.currentUser) {
      const currentMemberArr = members.filter(m => m.identifier === this.userStore.currentUser.identifier);
      if (currentMemberArr.length === 1) {
        this.currentMemberSubject.next(currentMemberArr[0]);
      }
    }
    const currentHostArr = members.filter(m => m.permissions.includes('Host'));
    if (currentHostArr.length >= 1) {
      this.currentHostSubject.next(currentHostArr[0]);
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

  get currentHost(): JamMember {
    return this.currentHostSubject.value;
  }

  get $currentHost(): Observable<JamMember> {
    return new Observable(fn => this.currentHostSubject.subscribe(fn));
  }


  private sortMembers(members: JamMember[]): JamMember[] {
    return members.sort((a, b) =>
      a.display_name.localeCompare(b.display_name) || <any>a.permissions.includes('Admin') - <any>b.permissions.includes('Admin')
    ).filter(
      member => !member.permissions.includes('Host')
    );
  }

}
