import {Component, Input, OnInit, Output} from '@angular/core';
import {QueueSong} from 'jamfactory-types';


@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss']
})
export class QueueComponent implements OnInit {
  @Input()
  songList: QueueSong[];

  @Input()
  voteMethod: (PutQueueVoteRequest) => void;

  @Input()
  addMethod: (AddCollectionRequestBody) => void;

  constructor() {
  }

  ngOnInit(): void {
  }

}
