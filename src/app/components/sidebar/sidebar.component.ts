import {Component, OnInit} from '@angular/core';
import {Notification, NotificationService} from '../../core/services/notification.service';
import {ColorService} from '../../core/services/color.service';
import {WebsocketService} from '../../core/services/websocket.service';
import {JamsessionHttpService} from '../../core/http/jamsession.http.service';
import {Router} from '@angular/router';
import {SetPlaybackRequestBody} from '@jamfactoryapp/jamfactory-types';
import {JamsessionStore} from '../../core/stores/jamsession.store';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(
    public colorService: ColorService,
    private notificationService: NotificationService,
    private websocketService: WebsocketService,
    private jamService: JamsessionHttpService,
    private router: Router,
    public jamStore: JamsessionStore,
  ) {
  }

  ngOnInit(): void {
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

  selectDevice(deviceid: string): void {
    const body: SetPlaybackRequestBody = {
      device_id: deviceid
    };
    this.jamService.putPlayback(body).subscribe((value) => {
      this.jamStore.playback = value;
    });
  }

}
