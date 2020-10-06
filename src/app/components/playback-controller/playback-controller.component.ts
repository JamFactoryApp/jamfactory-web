import {Component, Input, OnInit} from '@angular/core';
import PlaybackBody = JamFactoryApi.PlaybackBody;
import {faPlay, faPause, faStepForward, faStepBackward, faSignOutAlt, faCog} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../../services/auth.service';
import GetAuthCurrentResponse = JamFactoryApi.GetAuthCurrentResponse;
import {JamsessionService} from '../../services/jamsession.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-playback-controller',
  templateUrl: './playback-controller.component.html',
  styleUrls: ['./playback-controller.component.scss']
})
export class PlaybackControllerComponent implements OnInit {
  @Input()
  playback: PlaybackBody;

  @Input()
  current: GetAuthCurrentResponse;

  faPlay = faPlay;
  faPause = faPause;
  faSignOut = faSignOutAlt;
  faCog = faCog;

  Math = Math;

  constructor(private authService: AuthService, private jamService: JamsessionService, private router: Router) {
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
        this.router.navigate(['/']);
      }
    });
  }

  resumePlayback(): void {

  }

  pausePlayback(): void {

  }
}
