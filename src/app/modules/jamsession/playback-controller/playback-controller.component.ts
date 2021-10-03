import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthHttpService} from '../../../core/http/auth.http.service';
import {JamsessionHttpService} from '../../../core/http/jamsession.http.service';
import {Router} from '@angular/router';
import {JamPlaybackBody, JamRightHost, JamUser, SetPlaybackRequestBody, SpotifyDevices} from '@jamfactoryapp/jamfactory-types';
import {QueueStore} from '../../../core/stores/queue.store';
import {JamsessionStore} from '../../../core/stores/jamsession.store';
import {UserStore} from '../../../core/stores/user.store';
import {SpotifyHttpService} from '../../../core/http/spotify.http.service';
import {Notification, NotificationService} from '../../../core/services/notification.service';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {ColorService} from '../../../core/services/color.service';
import {WebsocketService} from '../../../core/socket/websocket.service';
import {UtilService} from '../../../core/services/util.service';


@Component({
  selector: 'app-playback-controller',
  templateUrl: './playback-controller.component.html',
  styleUrls: ['./playback-controller.component.scss']
})
export class PlaybackControllerComponent implements OnInit {
  Math = Math;

  @ViewChild('deviceTooltip', {static: false}) deviceTooltip: NgbTooltip;
  public currentUser: JamUser;
  public playback: JamPlaybackBody;
  public progressms: number;
  public intervallId: number;
  public devices: SpotifyDevices;
  public item = false;
  private showedNoPlaybackNotification = false;
  private timeout: number;

  readonly JamRightHost = JamRightHost;

  constructor(
    private authService: AuthHttpService,
    private jamService: JamsessionHttpService,
    private spotifyService: SpotifyHttpService,
    private router: Router,
    private queueStore: QueueStore,
    public jamStore: JamsessionStore,
    public utils: UtilService,
    private authStore: UserStore,
    private notificationService: NotificationService,
    private websocketService: WebsocketService,
    private colorService: ColorService) {
  }

  ngOnInit(): void {

    this.authStore.$currentUser.subscribe(value => {
      this.currentUser = value;
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
    if (this.jamStore.currentMember.rights.includes(JamRightHost) && !this.playback?.device_id && !this.showedNoPlaybackNotification) {
      this.showedNoPlaybackNotification = true;
      this.notificationService.show(new Notification('Open Spotify on your preferred device and select it below').setLevel(2).addHeader('No playback device found', 'speaker_group').setId(1));
    }
  }

  leave(): void {
    this.colorService.clearImgStore();
    clearTimeout(this.timeout);
    this.websocketService.close();
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
    if (this.jamStore.currentMember.rights.includes(JamRightHost)) {
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
