import {Component, Input, OnInit} from '@angular/core';
import {faPlay, faPause, faSignOutAlt, faCog} from '@fortawesome/free-solid-svg-icons';
import {AuthHttpService} from '../../../core/http/auth.http.service';
import {JamsessionHttpService} from '../../../core/http/jamsession.http.service';
import {Router} from '@angular/router';
import {SetPlaybackRequestBody, AuthCurrentResponseBody, GetPlaybackResponseBody, JamAuthStatus, JamPlaybackBody} from 'jamfactory-types';
import {QueueService} from '../../../core/services/queue.service';
import {QueueStore} from '../../../core/stores/queue.store';
import {JamsessionStore} from '../../../core/stores/jamsession.store';
import {AuthStore} from '../../../core/stores/auth.store';


@Component({
  selector: 'app-playback-controller',
  templateUrl: './playback-controller.component.html',
  styleUrls: ['./playback-controller.component.scss']
})
export class PlaybackControllerComponent implements OnInit {
  faPlay = faPlay;
  faPause = faPause;
  faSignOut = faSignOutAlt;
  faCog = faCog;

  Math = Math;

  constructor(
    private authService: AuthHttpService,
    private jamService: JamsessionHttpService,
    private router: Router,
    private queueStore: QueueStore,
    private jamStore: JamsessionStore,
    private authStore: AuthStore) {
  }

  public current: JamAuthStatus;
  public playback: JamPlaybackBody;

  public playing: boolean;

  ngOnInit(): void {
    this.authStore.$authStatus.subscribe(value => {
      this.current = value;
    });

    this.jamStore.$playback.subscribe(value => {
      this.playback = value;
      this.playing = this.playback?.playback?.item !== undefined;
    });
  }

  getTime(millisecons: number): string {
    const minutes = Math.floor(millisecons / (60 * 1000));
    const seconds = Math.floor(millisecons / 1000) - minutes * 60;
    return this.str_pad_left(minutes, '0', 2) + ':' + this.str_pad_left(seconds, '0', 2);

  }

  getProgressAsString(current: number, duration: number): string {
    return ((current / duration) * 100) + '%';
  }

  str_pad_left(time: number, pad: string, length: number): string {
    return (new Array(length + 1).join(pad) + time).slice(-length);
  }

  leave(): void {
    this.jamService.leaveJamSession().subscribe( value => {
      if (value.success) {
        this.router.navigate(['./']);
      }
    });
  }

  resumePlayback(): void {
    const body: SetPlaybackRequestBody = {
      playing: true
    };
    this.jamService.putPlayback(body).subscribe((value) => {
      this.jamStore.playback = value;
    });
  }

  pausePlayback(): void {
    const body: SetPlaybackRequestBody = {
      playing: false
    };
    this.jamService.putPlayback(body).subscribe((value) => {
      console.log(value);
      this.jamStore.playback = value;
    });
  }

  openSettings(): void {
    this.router.navigate(['/' + 'debug']);
  }
}
