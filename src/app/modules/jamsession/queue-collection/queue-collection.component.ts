import {Component, Input, OnInit, Output} from '@angular/core';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {AddCollectionRequestBody} from 'jamfactory-types';
import PlaylistObjectSimplified = SpotifyApi.PlaylistObjectSimplified;
import AlbumObjectSimplified = SpotifyApi.AlbumObjectSimplified;
import {QueueService} from '../../../core/services/queue.service';



@Component({
  selector: 'app-queue-collection',
  templateUrl: './queue-collection.component.html',
  styleUrls: ['./queue-collection.component.scss']
})

export class QueueCollectionComponent implements OnInit {

  iconAdd = faPlus;

  inQueue = true;


  @Input()
  collection: PlaylistObjectSimplified | AlbumObjectSimplified;


  constructor(
    private queueService: QueueService
  ) {
  }

  ngOnInit(): void {
  }


  vote(collection: PlaylistObjectSimplified | AlbumObjectSimplified): void {
    let type = '';
    if (this.isPlaylist(collection)) {
      type = 'playlist';
    }

    if (this.isAlbum(collection)) {
      type = 'album';
    }

    const body: AddCollectionRequestBody = {
      collection: collection.id,
      type: 'playlist'
    };
    this.queueService.addCollection(body);
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

  isPlaylist(val): boolean { return val.constructor.name === 'PlaylistObjectSimplified'; }
  isAlbum(val): boolean { return val.constructor.name === 'AlbumObjectSimplified'; }
}
