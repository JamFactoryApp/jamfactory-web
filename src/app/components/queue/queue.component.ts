import {Component, Input, OnInit} from '@angular/core';
import SongWithoutId = JamFactoryApi.SongWithoutId;

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss']
})
export class QueueComponent implements OnInit {
  @Input()
  songList: SongWithoutId[];

  constructor() {
  }

  ngOnInit(): void {
  }
}
