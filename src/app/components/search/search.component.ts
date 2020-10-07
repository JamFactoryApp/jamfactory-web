import {Component, Input, OnInit} from '@angular/core';
import {SpotifyService} from '../../services/spotify.service';
import {FormControl} from '@angular/forms';
import PutSpotifySearchRequest = JamFactoryApi.PutSpotifySearchRequest;
import SearchResult = Zmb3SpotifyApi.SearchResult;
import SongWithoutId = JamFactoryApi.SongWithoutId;
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import GetAuthCurrentResponse = JamFactoryApi.GetAuthCurrentResponse;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Input()
  queue: SongWithoutId[];

  @Input()
  current: GetAuthCurrentResponse;

  @Input()
  voteMethod: (PutQueueVoteRequest) => void;

  searchField = new FormControl('');
  searchResults: SearchResult;

  faSearch = faSearch;

  searchTimeout: number;

  constructor(
    private spotifyService: SpotifyService,
  ) {
  }

  ngOnInit(): void {
  }

  searchEvent(): void {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => this.search(), 100);
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
      value.tracks.items = value.tracks.items.sort((a, b) => b.popularity - a.popularity);
      this.searchResults = value;
    });
  }
}
