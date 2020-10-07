import {Component, Input, OnInit, Output} from '@angular/core';
import {faMinus, faPlus} from '@fortawesome/free-solid-svg-icons';
import {QueueService} from '../../services/queue.service';
import SongWithoutId = JamFactoryApi.SongWithoutId;
import FullTrack = Zmb3SpotifyApi.FullTrack;
import PutQueueVoteRequest = JamFactoryApi.PutQueueVoteRequest;
import TrackObjectFull = SpotifyApi.TrackObjectFull;
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-queue-song',
  templateUrl: './queue-song.component.html',
  styleUrls: ['./queue-song.component.scss']
})
export class QueueSongComponent implements OnInit {
  faPlus = faPlus;
  faMinus = faMinus;

  @Input()
  item: FullTrack | TrackObjectFull;

  @Input()
  queue: SongWithoutId[];

  @Input()
  voteMethod: (PutQueueVoteRequest) => void;

  constructor(
    private queueService: QueueService
  ) {
  }

  ngOnInit(): void {
  }

  voted(track: FullTrack | TrackObjectFull): boolean {
    if (this.queue === undefined) {
      return false;
    }

    if (this.queue.length == 0) {
      return false;
    }

    for (let i = 0; i < this.queue.length; i++) {
      if (track.id === this.queue[i].spotifyTrackFull.id && this.queue[i].voted) {
        return true;
      }
    }
    return false;
  }

  vote(track: FullTrack | TrackObjectFull): void {
    const body: PutQueueVoteRequest = {
      track: track.id
    };
    this.voteMethod(body);
  }
}
