import {AfterContentInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthHttpService} from '../../core/http/auth.http.service';
import {JamsessionHttpService} from '../../core/http/jamsession.http.service';
import {Router} from '@angular/router';
import {JamPlaybackBody, JamPlaySongBody, JamUser, SetPlaybackRequestBody, SpotifyDevices} from '@jamfactoryapp/jamfactory-types';
import {QueueStore} from '../../core/stores/queue.store';
import {JamsessionStore} from '../../core/stores/jamsession.store';
import {SpotifyHttpService} from '../../core/http/spotify.http.service';
import {Notification, NotificationService} from '../../core/services/notification.service';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {ColorService, SongColor} from '../../core/services/color.service';
import {UtilService} from '../../core/services/util.service';
import {PermissionsService} from '../../core/services/permissions.service';
import {FormControl} from '@angular/forms';
import {MenuStore} from '../../core/stores/menu.store';

@Component({
  selector: 'app-playback-controller',
  templateUrl: './playback-controller.component.html',
  styleUrls: ['./playback-controller.component.scss']
})
export class PlaybackControllerComponent implements OnInit, AfterContentInit {

  @ViewChild('cover') cover: ElementRef;

  @ViewChild('deviceTooltip', {static: false}) deviceTooltip: NgbTooltip;
  public currentUser: JamUser;
  public playback: JamPlaybackBody;
  public progressms: number;
  public intervallId: number;
  public devices: SpotifyDevices;
  public showVolume: boolean;
  public item = false;
  private showedNoPlaybackNotification = false;
  private timeout: number;
  public currentVolume: FormControl = new FormControl(0);
  public songColor: SongColor = {
    vibrant: [231, 231, 231],
    muted: [0, 0, 0],
  };
  public songProgress = 0;
  public durationRest = 0;
  public playStatus = false;

  public menuStatus: boolean;

  constructor(
    private authService: AuthHttpService,
    private jamService: JamsessionHttpService,
    private spotifyService: SpotifyHttpService,
    private router: Router,
    private queueStore: QueueStore,
    public jamStore: JamsessionStore,
    public permissions: PermissionsService,
    public utils: UtilService,
    public notificationService: NotificationService,
    public colorService: ColorService,
    public menuStore: MenuStore,
  ) {
  }

  ngOnInit(): void {

    this.menuStore.$status.subscribe(value => {
      this.menuStatus = value;
    });

    this.jamStore.$playback.subscribe(value => {
      const lastPlayback = this.playback;

      this.playback = value;
      this.progressms = this.playback?.playback?.progress_ms;
      this.item = this.playback !== undefined && this.playback?.playback?.item !== null;

      if (value !== undefined) {
        if (value.playback.item === null) {
          this.resetPlaybackProgress();
        }
      }

      if (lastPlayback?.playback?.item === null && value?.playback?.item !== null) {
        this.playStatus = this.playback.playback.is_playing;
        this.getProgressForContainer();
        this.getRestDuration();
      }

      if ((lastPlayback?.playback?.item?.name !== value?.playback?.item?.name) ||
        (lastPlayback?.playback?.is_playing !== value?.playback?.is_playing) ||
        (Math.abs(value?.playback?.progress_ms - lastPlayback?.playback?.progress_ms)) >= 10000 ||
        this.playStatus !== value?.playback?.is_playing) {
        this.playStatus = this.playback?.playback?.is_playing;
        setTimeout(() => {
          this.getProgressForContainer();
          this.getRestDuration();
        }, 500);
      }

      if (this.playback?.device_id) {
        this.notificationService.clearId(1);
      }

      this.currentVolume.patchValue(this.playback?.playback.device.volume_percent);

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

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.getProgressForContainer();
      this.getRestDuration();
    }, 500);
  }

  checkNotifications(): void {
    if (this.permissions.hasPermission(this.permissions.Host) && !this.playback?.device_id && !this.showedNoPlaybackNotification) {
      this.showedNoPlaybackNotification = true;
      this.notificationService.show(new Notification('Open Spotify on your preferred device and select it below').setLevel(2).addHeader('No playback device found', 'speaker_group').setId(1));
    }
  }

  onVolumeChange(): void {
    const body: SetPlaybackRequestBody = {
      volume: this.currentVolume.value
    };
    this.jamService.putPlayback(body).subscribe((value) => {
      this.jamStore.playback = value;
    });
  }

  onSkip(): void {
    if (this.queueStore.queue.tracks.length !== 0) {
      const body: JamPlaySongBody = {
        track: this.queueStore.queue.tracks[0].spotifyTrackFull.id,
        remove: true
      };
      this.jamService.playSong(body).subscribe((value) => {
      });
    }
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

  getImgColor(): void {
    this.songColor = this.colorService.getImgColor(this.cover.nativeElement);
  }

  /*This sucks balls, but is the best solution that actually works*/
  getProgressForContainer(): void {
    this.songProgress = Number(((this.progressms * 100) / this.playback?.playback?.item?.duration_ms).toFixed(2));
    document.getElementById('progress-bar').style.transition = '0.5s linear';
    setTimeout(() => {
      document.getElementById('progress-bar').style.transition = this.durationRest + 's linear';
      if (this.playStatus) {
        document.getElementById('progress-bar').style.backgroundPosition = 'right 100% bottom 100%';
      }
    }, 1000);
  }

  getRestDuration(): void {
    this.durationRest = (this.playback?.playback?.item?.duration_ms - this.progressms) / 1000;
  }

  resetPlaybackProgress(): void {
    document.getElementById('progress-bar').style.transition = '0.5s linear';
    document.getElementById('progress-bar').style.backgroundPosition = 'right bottom';
    this.songColor = {vibrant: [231, 231, 231], muted: [0, 0, 0]};
  }

  toggleMenu(): void {
    this.menuStore.status = !this.menuStatus;
  }

  getBestColor(): string {
    const bestColor = this.colorService.getBestSuitedColor(this.songColor.vibrant, this.songColor.muted, [42, 42, 52]);
    return this.colorService.vec3ToRGBAString(bestColor, 1);
  }

}
