import {Injectable} from '@angular/core';
import {AddCollectionRequestBody, QueueSong, VoteRequestBody} from '@jamfactoryapp/jamfactory-types';

import {QueueHttpService} from '../http/queue.http.service';
import {QueueStore} from '../stores/queue.store';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  constructor(private queueStore: QueueStore, private queueApi: QueueHttpService) {
  }


  updateQueueFromSocket(list: QueueSong[]): QueueSong[] {
    return list.map((q) => {
      const song: QueueSong = {
        spotifyTrackFull: q.spotifyTrackFull,
        votes: 0,
        voted: false
      };

      this.queueStore.queue.tracks.forEach(value => {
        if (value.spotifyTrackFull.id === q.spotifyTrackFull.id) {
          song.votes = value.votes;
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

  delete(body: VoteRequestBody): void {
    this.queueApi.deleteQueueTrack(body).subscribe((response) => {
      this.queueStore.queue = response;
    });
  }

  addCollection(body: AddCollectionRequestBody): void {
    this.queueApi.putQueueCollection(body).subscribe((response) => {
      this.queueStore.queue = response;
    });
  }



}
