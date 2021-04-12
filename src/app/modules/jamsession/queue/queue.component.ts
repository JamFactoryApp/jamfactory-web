import {Component, Input, OnInit, Output} from '@angular/core';
import {QueueSong} from 'jamfactory-types';
import {QueueStore} from '../../../core/stores/queue.store';


@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss']
})
export class QueueComponent implements OnInit {

  constructor(
    public queueStore: QueueStore
  ) {
  }

  ngOnInit(): void {
  }

  public trackFunction(index, item): any[] {
    if (!item) {
      return null;
    }
    return item.id;
  }

}
