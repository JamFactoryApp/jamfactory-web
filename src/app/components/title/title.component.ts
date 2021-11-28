import {Component, OnInit} from '@angular/core';
import {JamsessionStore} from '../../core/stores/jamsession.store';
import {FormControl} from '@angular/forms';
import {QueueStore} from '../../core/stores/queue.store';
import {QueueSong, SpotifySearchRequestBody} from '@jamfactoryapp/jamfactory-types';
import {QueueService} from '../../core/services/queue.service';
import {SpotifyHttpService} from '../../core/http/spotify.http.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {

  searchField = new FormControl('');
  searchType = '';
  searchShift = 0;
  searchResultsTracks: QueueSong[] = [];
  searchTimeout: number;

  constructor(public jamStore: JamsessionStore, private spotifyService: SpotifyHttpService) {
  }

  ngOnInit(): void {
  }

  searchEvent(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.searchTracks(), 100);
  }

  searchTracks(): void {
    this.searchType = 'track';
    this.searchShift = 0;
    if (this.searchField.value === '') {
      this.searchResultsTracks = [];
      this.searchType = '';
      return;
    }

    const body: SpotifySearchRequestBody = {
      text: this.searchField.value,
      type: this.searchType
    };

    this.spotifyService.putSearch(body);

    // this.spotifyService.getSearch().subscribe(value => {
    //   console.log(value);
    // });
  }

}
