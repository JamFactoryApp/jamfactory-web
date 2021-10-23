import {Component, Input, OnInit} from '@angular/core';
import {AddCollectionRequestBody} from '@jamfactoryapp/jamfactory-types';
import {QueueService} from '../../core/services/queue.service';
import PlaylistObjectSimplified = SpotifyApi.PlaylistObjectSimplified;
import AlbumObjectSimplified = SpotifyApi.AlbumObjectSimplified;
import {UtilService} from '../../core/services/util.service';


@Component({
  selector: 'app-queue-collection',
  templateUrl: './queue-collection.component.html',
  styleUrls: ['./queue-collection.component.scss']
})

export class QueueCollectionComponent implements OnInit {

  inQueue = true;


  @Input()
  collection: PlaylistObjectSimplified | AlbumObjectSimplified;


  constructor(
    private queueService: QueueService,
    public utils: UtilService
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

  isPlaylist(val): boolean {
    return val.constructor.name === 'PlaylistObjectSimplified';
  }

  isAlbum(val): boolean {
    return val.constructor.name === 'AlbumObjectSimplified';
  }
}
