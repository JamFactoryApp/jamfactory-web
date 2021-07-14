import {Component, OnInit} from '@angular/core';
import {QueueStore} from '../../../core/stores/queue.store';
import {AuthStore} from '../../../core/stores/auth.store';


@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss']
})
export class QueueComponent implements OnInit {

  constructor(
    public queueStore: QueueStore,
    public authStore: AuthStore
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
