import {Component, Input} from '@angular/core';
import {AddCollectionRequestBody, QueueSong, VoteRequestBody} from '@jamfactoryapp/jamfactory-types';
import {UtilService} from '../../../core/services/util.service';
import TrackObjectFull = SpotifyApi.TrackObjectFull;
import {QueueService} from '../../../core/services/queue.service';
import AlbumObjectSimplified = SpotifyApi.AlbumObjectSimplified;

@Component({
  selector: 'app-search-album',
  templateUrl: './search-album.component.html',
  styleUrls: ['./search-album.component.scss']
})
export class SearchAlbumComponent  {

  @Input()
  album: AlbumObjectSimplified;

  public added = false;

  constructor(public utils: UtilService, private queueService: QueueService) { }



  add(uri: string): void {
    if (!this.added) {
      this.added = true;
      const body: AddCollectionRequestBody = {
        type: 'album',
        collection: uri
      };
      this.queueService.addCollection(body);
    }
  }

}
