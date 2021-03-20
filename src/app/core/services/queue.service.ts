import { Injectable } from '@angular/core';
import {AddCollectionRequestBody, QueueSong, VoteRequestBody} from 'jamfactory-types';

import {QueueHttpService} from '../http/queue.http.service';
import {QueueStore} from '../stores/queue.store';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  constructor(private queueStore: QueueStore, private queueApi: QueueHttpService) { }


  updateQueueFromSocket(list: QueueSong[]): void {
    this.queueStore.queue.tracks = list.map((q) => {

      const song: QueueSong = {
        spotifyTrackFull: q.spotifyTrackFull,
        votes: q.votes,
        voted: false
      };

      this.queueStore.queue.tracks.forEach(value => {
        if (value.spotifyTrackFull.id === q.spotifyTrackFull.id) {
          song.voted = value.voted;
        }
      });
      return song;
    });
  }

  vote(body: VoteRequestBody): void {
    this.queueApi.putQueueVote(body).subscribe((response) => {
      this.queueStore.queue = response;
    });
  }

  addCollection(body: AddCollectionRequestBody): void {
    this.queueApi.putQueueCollection(body).subscribe((response) => {
      this.queueStore.queue = response;
    });
  }

}
