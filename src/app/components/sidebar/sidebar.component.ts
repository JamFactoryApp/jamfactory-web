import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {NotificationService} from '../../core/services/notification.service';
import {ColorService} from '../../core/services/color.service';
import {WebsocketService} from '../../core/services/websocket.service';
import {JamsessionHttpService} from '../../core/http/jamsession.http.service';
import {Router} from '@angular/router';
import {JamPlaybackBody, JamSessionSetting, JamUser, SetPlaybackRequestBody, SpotifyDevices} from '@jamfactoryapp/jamfactory-types';
import {JamsessionStore} from '../../core/stores/jamsession.store';
import {MenuStore} from '../../core/stores/menu.store';
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

  public menuStatus: boolean;
  public queueViewStatus: boolean;
  public currentUser: JamUser;
  public devices: SpotifyDevices;
  public playback: JamPlaybackBody;

  public passwordField = new FormControl('');
  public hasPassword: boolean = false;
  public nameField = new FormControl('');

  constructor(
    public colorService: ColorService,
    public notificationService: NotificationService,
    private websocketService: WebsocketService,
    private jamService: JamsessionHttpService,
    private router: Router,
    public jamStore: JamsessionStore,
    public menuStore: MenuStore,
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
    if (this.menuStatus) {
      if (!this.eRef.nativeElement.contains(event.target)) {
        this.menuStore.status = false;
      }
    }
  }

  ngOnInit(): void {
    this.menuStore.$status.subscribe(value => {
      this.menuStatus = value;
    });

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
        this.router.navigate(['jam']);
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

    document.querySelector('details').removeAttribute('open');
  }

  toggleMenu(): void {
    this.menuStore.status = !this.menuStatus;
  }

  getUserName(JamSessionName: string): string {
    return JamSessionName?.split('\'')[0];
  }

  copyToClipboard(): void {
    const range = document.createRange();
    range.selectNode(document.getElementById('sidebar-jamlabel-text'));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
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

  addModal(): void {
    const modal: Modal = {
      header: 'Password',
      message: 'This JamSession requires a password to enter',
      buttonText: 'Enter',
      placeholder: '',
      withInput: true,
      level: 0,
      label: 'Password',
      callback: this.modalCallback
    };
    this.modal.add(modal);
  }

  modalCallback(input: string): void {
    console.log(input);
  }
}
