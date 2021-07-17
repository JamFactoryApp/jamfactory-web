import {Component, HostBinding, OnInit} from '@angular/core';
import {NotificationService} from '../../../core/services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  @HostBinding('[class.ngb-toasts]') true;

  constructor(public notificationService: NotificationService) {
  }

  ngOnInit(): void {
  }

}
