import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {NotificationService} from '../../core/services/notification.service';
import {ColorService} from '../../core/services/color.service';
import {WebsocketService} from '../../core/services/websocket.service';
import {JamsessionHttpService} from '../../core/http/jamsession.http.service';
import {Router} from '@angular/router';
import {
  JamPlaybackBody,
  JamSessionSetting,
  JamUser,
  SetPlaybackRequestBody,
  SpotifyDevices
} from '@jamfactoryapp/jamfactory-types';
import {JamsessionStore} from '../../core/stores/jamsession.store';
import {UserStore} from '../../core/stores/user.store';
import {PermissionsService} from '../../core/services/permissions.service';
import {SpotifyHttpService} from '../../core/http/spotify.http.service';
import {ViewStore} from '../../core/stores/view.store';
import {FormControl} from '@angular/forms';
import {Modal, ModalService} from '../../core/services/modal.service';
import {MemberStore} from '../../core/stores/member.store';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public queueViewStatus: boolean;
  public currentUser: JamUser;
  public devices: SpotifyDevices;
  public playback: JamPlaybackBody;

  public passwordField = new FormControl('');
  public hasPassword = false;
  public copyIcon = 'content_copy';
  public nameField = new FormControl('');

  public sidebarViewObject = {viewNotify: false, viewSetting: false, viewCustom: false};

  constructor(
    public colorService: ColorService,
    public notificationService: NotificationService,
    private websocketService: WebsocketService,
    private jamService: JamsessionHttpService,
    private router: Router,
    public jamStore: JamsessionStore,
    private authStore: UserStore,
    public permissions: PermissionsService,
    private spotifyService: SpotifyHttpService,
    private viewStore: ViewStore,
    public membersStore: MemberStore,
    private eRef: ElementRef,
    private modal: ModalService
  ) {
  }

  // Close Search when clicking outsite of search
  @HostListener('document:click', ['$event'])
  clickout(event): void {
    if (this.viewStore.view.menu) {
      if (!this.eRef.nativeElement.contains(event.target)) {
        this.viewStore.menu = false;
        this.copyIcon = 'content_copy';
        this.resetViews();
      }
    }
  }

  ngOnInit(): void {
    this.authStore.$currentUser.subscribe(value => {
      this.currentUser = value;
      setTimeout(() => {
        this.getDevices();
      }, 500);
    });

    this.jamStore.$jamSession.subscribe(value => {
      if (value) {
        this.nameField.patchValue(value.name);
      }
    });

    this.jamStore.$playback.subscribe(value => {
      this.playback = value;
    });

    this.viewStore.$view.subscribe(value => {
      this.queueViewStatus = value.cardMode;
    });
  }

  leave(): void {
    this.colorService.clearImgStore();
    this.websocketService.close();
    this.jamService.leaveJamSession().subscribe(value => {
      if (value.success) {
        this.router.navigate(['']);
      }
    });
  }

  getDevices(): void {
    if (this.permissions.hasPermission(this.permissions.Host)) {
      this.spotifyService.getDevices().subscribe(value => {
        this.devices = value;
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

    document.getElementById('deviceSelectDropdown').removeAttribute('open');
  }

  toggleMenu(): void {
    this.viewStore.menu = !this.viewStore.view.menu;
  }

  getUserName(JamSessionName: string): string {
    return JamSessionName?.split('\'')[0];
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(window.location.host + window.location.pathname).then(() =>
      this.copyIcon = 'done'
    );
  }

  switchQueueView(status: boolean): void {
    this.viewStore.cardMode = status;
  }

  saveSettings(): void {
    const body: JamSessionSetting = {
      name: this.nameField.value
    };
    if (this.passwordField.value !== '') {
      body.password = this.passwordField.value;
    }
    this.jamService.putJamsession(body).subscribe(value => {
      this.jamStore.jamSession = value;
      if (this.passwordField.value !== '') {
        this.hasPassword = true;
      }
    });
  }

  toggleNotification(): void {
    setTimeout(() => {
      this.sidebarViewObject.viewNotify = !this.sidebarViewObject.viewNotify;
    }, 10);
  }

  toggleSettings(): void {
    setTimeout(() => {
      this.sidebarViewObject.viewSetting = !this.sidebarViewObject.viewSetting;
    }, 10);
  }

  toggleCustom(): void {
    setTimeout(() => {
      this.sidebarViewObject.viewCustom = !this.sidebarViewObject.viewCustom;
    }, 10);
  }

  resetViews() {
    setTimeout(() => {
      Object.keys(this.sidebarViewObject).forEach(v => this.sidebarViewObject[v] = false)
    }, 300);
  }

  changeTheme(type): void {
    setTimeout(() => {
      let color = '';
      switch (type) {
        case 0:
          color = '236, 154, 41';
          break;
        case 1:
          color = '101, 155, 94';
          break;
        case 2:
          color = '81, 113, 165';
          break;
      }
      document.documentElement.style.setProperty('--dominant-color', color);
    }, 10);
  }
}
