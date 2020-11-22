import {Component, Input, OnInit} from '@angular/core';
import {faPlay, faPause, faSignOutAlt, faCog} from '@fortawesome/free-solid-svg-icons';
import {AuthHttpService} from '../../../core/http/auth.http.service';
import {JamsessionHttpService} from '../../../core/http/jamsession.http.service';
import {Router} from '@angular/router';
import {SetPlaybackRequestBody, AuthCurrentResponseBody, GetPlaybackResponseBody} from 'jamfactory-types';


@Component({
  selector: 'app-playback-controller',
  templateUrl: './playback-controller.component.html',
  styleUrls: ['./playback-controller.component.scss']
})
export class PlaybackControllerComponent implements OnInit {
  @Input()
  playback: GetPlaybackResponseBody;

  @Input()
  current: AuthCurrentResponseBody;

  faPlay = faPlay;
  faPause = faPause;
  faSignOut = faSignOutAlt;
  faCog = faCog;

  Math = Math;

  constructor(private authService: AuthHttpService, private jamService: JamsessionHttpService, private router: Router) {
  }


  ngOnInit(): void {
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
      this.playback = value;
    });
  }

  pausePlayback(): void {
    const body: SetPlaybackRequestBody = {
      playing: false
    };
    this.jamService.putPlayback(body).subscribe((value) => {
      this.playback = value;
    });
  }

  openSettings(): void {
    this.router.navigate(['/' + 'debug']);
  }
}
