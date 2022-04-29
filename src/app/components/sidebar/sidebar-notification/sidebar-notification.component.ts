import {Component} from '@angular/core';
import {NotificationService} from "../../../core/services/notification.service";
import {ViewStore} from "../../../core/stores/view.store";

@Component({
  selector: 'app-sidebar-notification',
  templateUrl: './sidebar-notification.component.html',
  styleUrls: ['./sidebar-notification.component.scss']
})
export class SidebarNotificationComponent {

  constructor(
    public notificationService: NotificationService,
    public viewStore: ViewStore
  ) {
  }

  resetViews() {
    setTimeout(() => this.viewStore.menuSub = '', 10);
  }

}
