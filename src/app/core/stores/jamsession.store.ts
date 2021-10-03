import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {JamMember, JamPlaybackBody, JamSessionDetails} from '@jamfactoryapp/jamfactory-types';
import {UserStore} from './user.store';

@Injectable({
  providedIn: 'root'
})
export class JamsessionStore {

  private jamSessionSubject: BehaviorSubject<JamSessionDetails> = new BehaviorSubject<JamSessionDetails>(undefined);
  private playbackSubject: BehaviorSubject<JamPlaybackBody> = new BehaviorSubject<JamPlaybackBody>(undefined);
  private membersSubject: BehaviorSubject<JamMember[]> = new BehaviorSubject<JamMember[]>([]);
  private currentMemberSubject: BehaviorSubject<JamMember> = new BehaviorSubject<JamMember>(undefined);

  constructor(private userStore: UserStore) {
  }

  get jamSession(): JamSessionDetails {
    return this.jamSessionSubject.value;
  }

  set jamSession(jamSession: JamSessionDetails) {
    this.jamSessionSubject.next(jamSession);
  }

  get $jamSession(): Observable<JamSessionDetails> {
    return new Observable(fn => this.jamSessionSubject.subscribe(fn));
  }

  get playback(): JamPlaybackBody {
    return this.playbackSubject.value;
  }

  set playback(playback: JamPlaybackBody) {
    this.playbackSubject.next(playback);
  }

  get $playback(): Observable<JamPlaybackBody> {
    return new Observable(fn => this.playbackSubject.subscribe(fn));
  }

  get members(): JamMember[] {
    return this.membersSubject.value;
  }

  set members(members: JamMember[]) {
    this.membersSubject.next(members);
    const currentMemberArr = members.filter(m => m.identifier === this.userStore.currentUser.identifier)
    if (currentMemberArr.length === 1) {
      this.currentMemberSubject.next(currentMemberArr[0]);
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
