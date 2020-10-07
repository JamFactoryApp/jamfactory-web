import {Component, Input, OnInit, Output} from '@angular/core';
import SongWithoutId = JamFactoryApi.SongWithoutId;
import { EventEmitter } from '@angular/core';
import PutQueueVoteRequest = JamFactoryApi.PutQueueVoteRequest;

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss']
})
export class QueueComponent implements OnInit {
  @Input()
  songList: SongWithoutId[];

  @Input()
  voteMethod: (PutQueueVoteRequest) => void;

  constructor() {
  }

  ngOnInit(): void {

  }

}
