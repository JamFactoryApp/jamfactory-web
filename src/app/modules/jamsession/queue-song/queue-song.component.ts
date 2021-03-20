import {Component, Input, OnInit, Output} from '@angular/core';
import {faHeart as iconVote} from '@fortawesome/free-solid-svg-icons';
import {faHeart as iconNVote} from '@fortawesome/free-regular-svg-icons';
import {QueueHttpService} from '../../../core/http/queue.http.service';
import {VoteRequestBody, QueueSong} from 'jamfactory-types';
import TrackObjectFull = SpotifyApi.TrackObjectFull;
import {QueueService} from '../../../core/services/queue.service';
import {QueueStore} from '../../../core/stores/queue.store';

@Component({
  selector: 'app-queue-song',
  templateUrl: './queue-song.component.html',
  styleUrls: ['./queue-song.component.scss']
})

export class QueueSongComponent implements OnInit {
  iconVote = iconVote;
  iconNVote = iconNVote;

  @Input()
  track: QueueSong;

  @Input()
  index: number;

  @Input()
  inQueue: boolean;

  constructor(
    private queueApi: QueueHttpService,
    private queueService: QueueService,
    private queueStore: QueueStore
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
    if (this.queueStore.queue.tracks === undefined) {
      return false;
    }

    if (this.queueStore.queue.tracks.length === 0) {
      return false;
    }

    for (let i = 0; i < this.queueStore.queue.tracks.length; i++) {
      if (track.id === this.queueStore.queue.tracks[i].spotifyTrackFull.id && this.queueStore.queue.tracks[i].voted) {
        return true;
      }
    }
    return false;
  }

  vote(track: TrackObjectFull): void {
    const body: VoteRequestBody = {
      track: track.id
    };
    this.queueService.vote(body);
  }
}
