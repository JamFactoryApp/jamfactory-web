import {Component, Input} from '@angular/core';
import {QueueSong, VoteRequestBody} from '@jamfactoryapp/jamfactory-types';
import {UtilService} from '../../../core/services/util.service';
import TrackObjectFull = SpotifyApi.TrackObjectFull;
import {QueueService} from '../../../core/services/queue.service';
import {AudioPlayerService} from "../../../core/services/audio-player.service";
import {ViewStore} from "../../../core/stores/view.store";

@Component({
  selector: 'app-search-song',
  templateUrl: './search-song.component.html',
  styleUrls: ['./search-song.component.scss']
})
export class SearchSongComponent {

  @Input()
  songInfo: QueueSong;

  @Input()
  isVoted: boolean;

  constructor(
    public utils: UtilService,
    private queueService: QueueService,
    public audioPlayerService: AudioPlayerService,
    public viewStore: ViewStore) {
  }

  vote(track: TrackObjectFull): void {
    const body: VoteRequestBody = {
      track: track.id
    };
    this.queueService.vote(body);
  }

}
