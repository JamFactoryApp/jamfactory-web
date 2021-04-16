import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
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
} from '@jamfactoryapp/jamfactory-types';
import {QueueStore} from '../../../core/stores/queue.store';
import {JamsessionStore} from '../../../core/stores/jamsession.store';
import {AuthStore} from '../../../core/stores/auth.store';
import {SpotifyHttpService} from '../../../core/http/spotify.http.service';
import {NotificationService, Notification} from '../../../core/services/notification.service';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {ColorService} from '../../../core/services/color.service';


@Component({
  selector: 'app-playback-controller',
  templateUrl: './playback-controller.component.html',
  styleUrls: ['./playback-controller.component.scss']
})
export class PlaybackControllerComponent implements OnInit {
  Math = Math;

  @ViewChild('deviceTooltip', {static: false}) deviceTooltip: NgbTooltip;

  constructor(
    private authService: AuthHttpService,
    private jamService: JamsessionHttpService,
    private spotifyService: SpotifyHttpService,
    private router: Router,
    private queueStore: QueueStore,
    private jamStore: JamsessionStore,
    private authStore: AuthStore,
    private notificationService: NotificationService,
    private colorService: ColorService) {
  }

  public current: JamAuthStatus;
  public playback: JamPlaybackBody;
  public progressms: number;
  public intervallId: number;
  public devices: SpotifyDevices;
  private showedNoPlaybackNotification = false;
  private timeout: number;
  public item = false;

  ngOnInit(): void {

    this.authStore.$authStatus.subscribe(value => {
      this.current = value;
      this.getDevices();
    });

    this.jamStore.$playback.subscribe(value => {
      this.playback = value;
      this.progressms = this.playback?.playback?.progress_ms;
      this.item = this.playback !== undefined && this.playback?.playback?.item !== null;

      if (this.playback?.device_id) {
        this.notificationService.clearId(1);
      }


      if (this.playback?.playback?.is_playing && this.progressms < this.playback.playback.item.duration_ms) {

        if (this.intervallId === undefined) {
          this.intervallId = setInterval(() => this.progressms += 1000, 1000);
        }
      } else {
        clearInterval(this.intervallId);
        this.intervallId = undefined;
      }
    });

    this.timeout = setTimeout(() => {
      this.checkNotifications();
    }, 1000);
  }

  checkNotifications(): void {
    if (this.authStore.authStatus.user === 'Host' && !this.playback?.device_id && !this.showedNoPlaybackNotification) {
      this.showedNoPlaybackNotification = true;
      this.notificationService.show(new Notification('Open Spotify on your preferred device and select it below').setLevel(2).addHeader('No playback device found', 'speaker_group').setId(1));
    }
  }

  getTime(milliseconds: number): string {
    const minutes = Math.floor(milliseconds / (60 * 1000));
    const seconds = Math.floor(milliseconds / 1000) - minutes * 60;
    return this.str_pad_left(minutes, '0', 2) + ':' + this.str_pad_left(seconds, '0', 2);
  }

  getProgressAsString(current: number, duration: number): string {
    return ((current / duration) * 100) + '%';
  }

  str_pad_left(time: number, pad: string, length: number): string {
    return (new Array(length + 1).join(pad) + time).slice(-length);
  }

  leave(): void {
    this.colorService.clearImgStore();
    clearTimeout(this.timeout);
    this.jamService.leaveJamSession().subscribe(value => {
      if (value.success) {
        this.notificationService.show(
          new Notification('Successfully quit the JamSession')
            .addHeader('JamSession quit', 'exit_to_app')
            .setAutohide(5000));
        this.router.navigate(['./']);
      }
    });
  }

  getDevices(): void {
    if (this.current.user === 'Host') {
      this.spotifyService.getDevices().subscribe(value1 => {
        this.devices = value1;
      });
    }
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
        this.jamService.getPlayback().subscribe((value) => {
          value.playback.progress_ms = this.progressms;
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
