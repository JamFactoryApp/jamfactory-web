import {Component, Input, OnInit, Output} from '@angular/core';
import {faHeart as iconVote} from '@fortawesome/free-solid-svg-icons';
import {faHeart as iconNVote} from '@fortawesome/free-regular-svg-icons';
import {QueueHttpService} from '../../../core/http/queue.http.service';
import {VoteRequestBody, QueueSong} from 'jamfactory-types';
import TrackObjectFull = SpotifyApi.TrackObjectFull;

@Component({
  selector: 'app-queue-song',
  templateUrl: './queue-song.component.html',
  styleUrls: ['./queue-song.component.scss']
})

export class QueueSongComponent implements OnInit {
  iconVote = iconVote;
  iconNVote = iconNVote;

  @Input()
  item: TrackObjectFull;

  @Input()
  queue: QueueSong[];

  @Input()
  songVotes: number;

  @Input()
  songVoted: boolean;

  @Input()
  pos: number;

  @Input()
  voteMethod: (PutQueueVoteRequest) => void;

  @Input()
  inQueue: boolean;

  constructor(
    private queueService: QueueHttpService
  ) {
  }

  ngOnInit(): void {
  }

  getArtist(item): string {
    const len = item.length;
    let artist: string = item[0].name;

    if (len > 1) {
      for (let i = 1; len > i; i++) {
        artist = artist + ', ' + item[i].name;
      }
    }
    return artist;
  }

  voted(track: TrackObjectFull): boolean {
    if (this.queue === undefined) {
      return false;
    }

    if (this.queue.length === 0) {
      return false;
    }

    for (let i = 0; i < this.queue.length; i++) {
      if (track.id === this.queue[i].spotifyTrackFull.id && this.queue[i].voted) {
        return true;
      }
    }
    return false;
  }

  vote(track: TrackObjectFull): void {
    const body: VoteRequestBody = {
      track: track.id
    };
    this.voteMethod(body);
  }
}
