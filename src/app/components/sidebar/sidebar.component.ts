import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {NotificationService} from '../../core/services/notification.service';
import {ColorService} from '../../core/services/color.service';
import {WebsocketService} from '../../core/services/websocket.service';
import {JamsessionHttpService} from '../../core/http/jamsession.http.service';
import {Router} from '@angular/router';
import {
  JamPlaybackBody,
  JamUser,
  SetPlaybackRequestBody,
  SpotifyDevices
} from '@jamfactoryapp/jamfactory-types';
import {JamsessionStore} from '../../core/stores/jamsession.store';
import {UserStore} from '../../core/stores/user.store';
import {PermissionsService} from '../../core/services/permissions.service';
import {SpotifyHttpService} from '../../core/http/spotify.http.service';
import {ViewStore} from '../../core/stores/view.store';
import {ModalService} from '../../core/services/modal.service';
import {MemberStore} from '../../core/stores/member.store';
import {LocalstorageService} from "../../core/services/localstorage.service";

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

  public copyIcon = 'content_copy';

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
    public viewStore: ViewStore,
    public membersStore: MemberStore,
    private eRef: ElementRef,
    private modal: ModalService,
    private localstorageService: LocalstorageService
  ) {
  }

  // Close Search when clicking outsite of search
  @HostListener('document:click', ['$event'])
  clickout(event): void {
    if (this.viewStore.view.menu) {
      if (!this.eRef.nativeElement.contains(event.target)) {
        this.viewStore.menu = false;
        this.copyIcon = 'content_copy';
        this.resetViewsClosingMenu();
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
    this.resetViewsClosingMenu();
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
    this.localstorageService.setItem("ViewStatus", String(status));
    this.viewStore.cardMode = status;
  }

  toggleNotification(): void {
    setTimeout(() => {
      this.viewStore.menuSub = 'notification';
    }, 10);
  }

  toggleSettings(): void {
    setTimeout(() => {
      this.viewStore.menuSub = 'settings';
    }, 10);
  }

  toggleCustom(): void {
    setTimeout(() => {
      this.viewStore.menuSub = 'custom';
    }, 10);
  }

  toggleMember(): void {
    setTimeout(() => {
      this.viewStore.menuSub = 'member';
    }, 10);
  }

  resetViewsClosingMenu() {
    setTimeout(() => {
      this.viewStore.menuSub = '';
    }, 300);
  }
}
