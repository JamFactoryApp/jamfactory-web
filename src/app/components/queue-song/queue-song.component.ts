import {Component, Input} from '@angular/core';
import {QueueSong} from '@jamfactoryapp/jamfactory-types';


@Component({
  selector: 'app-queue-song',
  templateUrl: './queue-song.component.html',
  styleUrls: ['./queue-song.component.scss']
})

export class QueueSongComponent  {

  @Input()
  track: QueueSong;

  @Input()
  queueView: boolean;

  @Input()
  index: number;

  constructor() {
  }


}
