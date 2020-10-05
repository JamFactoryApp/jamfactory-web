import {Component, Input, OnInit} from '@angular/core';
import PlaybackBody = JamFactoryApi.PlaybackBody;
import {faPlay, faPause, faStepForward, faStepBackward} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-playback-controller',
  templateUrl: './playback-controller.component.html',
  styleUrls: ['./playback-controller.component.scss']
})
export class PlaybackControllerComponent implements OnInit {
  @Input()
  playback: PlaybackBody;

  faPlay = faPlay;
  faPause = faPause;
  faStepForward = faStepForward;
  faStepBackward = faStepBackward;

  constructor() {
  }

  ngOnInit(): void {
  }
}
