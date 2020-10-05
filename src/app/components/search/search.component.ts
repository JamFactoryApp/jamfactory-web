import {Component, Input, OnInit} from '@angular/core';
import {SpotifyService} from '../../services/spotify.service';
import {FormControl} from '@angular/forms';
import PutSpotifySearchRequest = JamFactoryApi.PutSpotifySearchRequest;
import SearchResult = Zmb3SpotifyApi.SearchResult;
import SongWithoutId = JamFactoryApi.SongWithoutId;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Input()
  queue: SongWithoutId[];

  searchField = new FormControl('');
  searchResults: SearchResult;

  constructor(
    private spotifyService: SpotifyService
  ) {
  }

  ngOnInit(): void {
  }

  search(): void {
    if (this.searchField.value === '') {
      this.searchResults = undefined;
      return;
    }

    const body: PutSpotifySearchRequest = {
      text: this.searchField.value,
      type: 'track'
    };

    this.spotifyService.putSearch(body).subscribe(value => {
      this.searchResults = value;
    });
  }
}
