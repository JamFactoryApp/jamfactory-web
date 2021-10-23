import {Component, OnInit} from '@angular/core';
import {QueueStore} from '../../core/stores/queue.store';
import {UserStore} from '../../core/stores/user.store';
import {JamsessionStore} from '../../core/stores/jamsession.store';
import {PermissionsService} from '../../core/services/permissions.service';


@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss']
})
export class QueueComponent implements OnInit {
  readonly JamRightHost = 'Host';
  constructor(
    public queueStore: QueueStore,
    public authStore: UserStore,
    public jamStore: JamsessionStore,
    public permissions: PermissionsService
  ) {
  }

  ngOnInit(): void {
  }

  public trackFunction(index, item): string {
    if (!item) {
      return null;
    }
    return item.id;
  }

}
