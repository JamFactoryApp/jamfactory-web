import {Component, Input, OnInit} from '@angular/core';
import {QueueSong, VoteRequestBody} from '@jamfactoryapp/jamfactory-types';
import {UtilService} from '../../core/services/util.service';
import TrackObjectFull = SpotifyApi.TrackObjectFull;
import {QueueService} from '../../core/services/queue.service';

@Component({
  selector: 'app-search-song',
  templateUrl: './search-song.component.html',
  styleUrls: ['./search-song.component.scss']
})
export class SearchSongComponent implements OnInit {

  @Input()
  songInfo: QueueSong;

  @Input()
  isVoted: boolean;

  constructor(public utils: UtilService, private queueService: QueueService) { }

  ngOnInit(): void {
  }

  vote(track: TrackObjectFull): void {
    const body: VoteRequestBody = {
      track: track.id
    };
    this.queueService.vote(body);
  }

}
