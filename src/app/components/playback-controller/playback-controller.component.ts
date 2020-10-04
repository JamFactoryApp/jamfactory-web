import {Component, Input, OnInit} from '@angular/core';
import PlaybackBody = JamFactoryApi.PlaybackBody;

@Component({
  selector: 'app-playback-controller',
  templateUrl: './playback-controller.component.html',
  styleUrls: ['./playback-controller.component.scss']
})
export class PlaybackControllerComponent implements OnInit {

  constructor() { }

  @Input()
  playback: PlaybackBody;

  ngOnInit(): void {
  }

}
