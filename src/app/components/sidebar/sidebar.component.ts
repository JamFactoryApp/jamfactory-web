import {Component, OnInit} from '@angular/core';
import {Notification, NotificationService} from '../../core/services/notification.service';
import {ColorService} from '../../core/services/color.service';
import {WebsocketService} from '../../core/services/websocket.service';
import {JamsessionHttpService} from '../../core/http/jamsession.http.service';
import {Router} from '@angular/router';
import {JamPlaybackBody, JamUser, SetPlaybackRequestBody, SpotifyDevices} from '@jamfactoryapp/jamfactory-types';
import {JamsessionStore} from '../../core/stores/jamsession.store';
import {MenuStore} from '../../core/stores/menu.store';
import {UserStore} from '../../core/stores/user.store';
import {PermissionsService} from '../../core/services/permissions.service';
import {SpotifyHttpService} from '../../core/http/spotify.http.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuStatus: boolean;
  public currentUser: JamUser;
  public devices: SpotifyDevices;
  public playback: JamPlaybackBody;

  constructor(
    public colorService: ColorService,
    private notificationService: NotificationService,
    private websocketService: WebsocketService,
    private jamService: JamsessionHttpService,
    private router: Router,
    public jamStore: JamsessionStore,
    public menuStore: MenuStore,
    private authStore: UserStore,
    public permissions: PermissionsService,
    private spotifyService: SpotifyHttpService,
  ) {
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

    this.jamStore.$playback.subscribe(value => {
      this.playback = value;
    });
  }

  leave(): void {
    this.colorService.clearImgStore();
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
  }

  toggleMenu(): void {
    this.menuStore.status = !this.menuStatus;
  }

  getUserName(JamSessionName: string): string {
    const nameArray = JamSessionName.split('\'');
    return nameArray[0];
  }

}
