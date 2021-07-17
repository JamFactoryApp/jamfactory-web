import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {JamPlaybackBody, JamSessionDetails} from '@jamfactoryapp/jamfactory-types';

@Injectable({
  providedIn: 'root'
})
export class JamsessionStore {

  private jamsessionSubject: BehaviorSubject<JamSessionDetails> = new BehaviorSubject<JamSessionDetails>(undefined);
  private playbackSubject: BehaviorSubject<JamPlaybackBody> = new BehaviorSubject<JamPlaybackBody>(undefined);

  constructor() {
  }

  get jamsession(): JamSessionDetails {
    return this.jamsessionSubject.value;
  }

  set jamsession(jamsession: JamSessionDetails) {
    this.jamsessionSubject.next(jamsession);
  }

  get $jamsession(): Observable<JamSessionDetails> {
    return new Observable(fn => this.jamsessionSubject.subscribe(fn));
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
}
