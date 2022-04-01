import {Component, Input, OnInit} from '@angular/core';
import {AddCollectionRequestBody, QueueSong, VoteRequestBody} from '@jamfactoryapp/jamfactory-types';
import {UtilService} from '../../../core/services/util.service';
import TrackObjectFull = SpotifyApi.TrackObjectFull;
import {QueueService} from '../../../core/services/queue.service';
import AlbumObjectSimplified = SpotifyApi.AlbumObjectSimplified;
import PlaylistObjectSimplified = SpotifyApi.PlaylistObjectSimplified;

@Component({
  selector: 'app-search-playlist',
  templateUrl: './search-playlist.component.html',
  styleUrls: ['./search-playlist.component.scss']
})
export class SearchPlaylistComponent implements OnInit {

  @Input()
  playlist: PlaylistObjectSimplified;

  public added = false;

  constructor(public utils: UtilService, private queueService: QueueService) { }

  ngOnInit(): void {
  }

  add(uri: string): void {
    if (!this.added) {
      this.added = true;
      const body: AddCollectionRequestBody = {
        type: 'playlist',
        collection: uri
      };
      this.queueService.addCollection(body);
    }
  }

}
