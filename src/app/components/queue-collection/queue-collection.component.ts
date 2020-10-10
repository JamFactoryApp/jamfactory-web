import {Component, Input, OnInit, Output} from '@angular/core';
import {faMinus, faPlus} from '@fortawesome/free-solid-svg-icons';
import {QueueService} from '../../services/queue.service';
import SongWithoutId = JamFactoryApi.SongWithoutId;
import FullTrack = Zmb3SpotifyApi.FullTrack;
import AddCollectionRequest = JamFactoryApi.AddCollectionRequestBody;
import TrackObjectFull = SpotifyApi.TrackObjectFull;
import { EventEmitter } from '@angular/core';
import PlaylistObjectSimplified = SpotifyApi.PlaylistObjectSimplified;
import AlbumObjectSimplified = SpotifyApi.AlbumObjectSimplified;

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

  @Input()
  addMethod: (PutPlay) => void;


  constructor() {
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

    const body: AddCollectionRequest = {
      collection: collection.id,
      type: 'playlist'
    };
    this.addMethod(body);
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
