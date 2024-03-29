import {Component, OnInit} from '@angular/core';
import {QueueStore} from '../../core/stores/queue.store';
import {UserStore} from '../../core/stores/user.store';
import {JamsessionStore} from '../../core/stores/jamsession.store';
import {PermissionsService} from '../../core/services/permissions.service';
import {ViewStore} from '../../core/stores/view.store';


@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss']
})
export class QueueComponent implements OnInit {
  public queueViewStatus: boolean;

  constructor(
    public queueStore: QueueStore,
    public authStore: UserStore,
    public jamStore: JamsessionStore,
    public permissions: PermissionsService,
    public viewStore: ViewStore,
  ) {
  }

  ngOnInit(): void {
    this.viewStore.$view.subscribe(value => {
      this.queueViewStatus = value.cardMode;
    });
  }

  public trackFunction(index, item): string {
    if (!item) {
      return null;
    }
    return item.id + '+' + item.votes + '+' + String(item.voted);
  }

}
