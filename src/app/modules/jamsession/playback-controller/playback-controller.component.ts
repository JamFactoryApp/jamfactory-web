import {Component, Input, OnInit} from '@angular/core';
import {AuthHttpService} from '../../../core/http/auth.http.service';
import {JamsessionHttpService} from '../../../core/http/jamsession.http.service';
import {Router} from '@angular/router';
import {
  SetPlaybackRequestBody,
  AuthCurrentResponseBody,
  GetPlaybackResponseBody,
  JamAuthStatus,
  JamPlaybackBody,
  SpotifyDevices
} from 'jamfactory-types';
import {QueueService} from '../../../core/services/queue.service';
import {QueueStore} from '../../../core/stores/queue.store';
import {JamsessionStore} from '../../../core/stores/jamsession.store';
import {AuthStore} from '../../../core/stores/auth.store';
import {SpotifyHttpService} from '../../../core/http/spotify.http.service';


@Component({
  selector: 'app-playback-controller',
  templateUrl: './playback-controller.component.html',
  styleUrls: ['./playback-controller.component.scss']
})
export class PlaybackControllerComponent implements OnInit {
  Math = Math;

  constructor(
    private authService: AuthHttpService,
    private jamService: JamsessionHttpService,
    private spotifyService: SpotifyHttpService,
    private router: Router,
    private queueStore: QueueStore,
    private jamStore: JamsessionStore,
    private authStore: AuthStore) {
  }

  public current: JamAuthStatus;
  public playback: JamPlaybackBody;
  public progressms: number;
  public intervallId: number;
  public devices: SpotifyDevices;

  public item = false;
  
  ngOnInit(): void {
    this.authStore.$authStatus.subscribe(value => {
      this.current = value;
      if (this.current.user === 'Host') {
        this.spotifyService.getDevices().subscribe(value1 => {
          this.devices = value1;
        });
      }
    });

    this.jamStore.$playback.subscribe(value => {
      this.playback = value;
      this.progressms = this.playback?.playback?.progress_ms;
      this.item = this.playback !== undefined && this.playback?.playback?.item !== null;
      if (this.playback?.playback?.is_playing && this.progressms < this.playback.playback.item.duration_ms) {

        if (this.intervallId === undefined) {
          this.intervallId = setInterval(() => this.progressms += 1000, 1000);
        }
      } else {
        clearInterval(this.intervallId);
        this.intervallId = undefined;
      }
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

  selectDevice(deviceid: string): void {
    const body: SetPlaybackRequestBody = {
      device_id: deviceid
    };
    this.jamService.putPlayback(body).subscribe((value) => {
      this.jamStore.playback = value;
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
    this.jamService.putPlayback(body).subscribe(() => {
      this.playback.playback.is_playing = false;
      setTimeout(() => {
        this.jamService.getPlayback().subscribe( (value) => {
          this.jamStore.playback = value;
        });
      }, 250);
    });
    clearInterval(this.intervallId);
    this.intervallId = undefined;
  }

  openSettings(): void {
    this.router.navigate(['/' + 'debug']);
  }
}
