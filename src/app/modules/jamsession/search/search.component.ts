import {Component, HostListener, Input, OnInit, ElementRef, ViewChildren, QueryList, ViewChild} from '@angular/core';
import {SpotifyHttpService} from '../../../core/http/spotify.http.service';
import {FormControl} from '@angular/forms';
import {faSearch, faArrowRight} from '@fortawesome/free-solid-svg-icons';

import {
  SpotifySearchRequestBody,
  SpotifySearchResponseBody,
  QueueSong,
  AuthCurrentResponseBody
} from 'jamfactory-types';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(
    private spotifyService: SpotifyHttpService,
    private elementRef: ElementRef
  ) {
  }
  @Input()
  queue: QueueSong[];

  @Input()
  current: AuthCurrentResponseBody;

  @Input()
  voteMethod: (PutQueueVoteRequest) => void;

  @Input()
  addMethod: (AddCollectionRequestBody) => void;

  @ViewChildren('SearchSong', {read: ElementRef}) searchSongs: QueryList<ElementRef>;

  searchField = new FormControl('');
  searchResults: SpotifySearchResponseBody;
  searchCount = 1;
  searchShift = 0;

  faSearch = faSearch;
  faArrowRight = faArrowRight;

  searchTimeout: number;

  @HostListener('document:click', ['$event'])
  handlerFunctionClick(e: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(e.target)) {
      this.searchField.patchValue('');
      this.search();
    }
  }

  @HostListener('window:resize', ['$event'])
  handlerFunctionResize = (e: MouseEvent) => {
    this.setSearchCount();
  }

  ngOnInit(): void {
  }

  searchEvent(): void {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => this.search(), 100);
  }

  setSearchCount(): void {
    if (!this.searchSongs.first) {
      this.searchCount = 1;
    } else {
      const itemHeight = this.searchSongs.first.nativeElement.offsetHeight;
      const height = window.innerHeight;
      this.searchCount = Math.ceil(((height - 150) * 0.65) / itemHeight);
    }

  }

  search(): void {
    this.searchShift = 0;
    if (this.searchField.value === '') {
      this.searchResults = undefined;
      return;
    }

    const body: SpotifySearchRequestBody = {
      text: this.searchField.value,
      type: 'track'
    };

    this.spotifyService.putSearch(body).subscribe(value => {
      value.tracks.items = value.tracks.items.sort((a, b) => b.popularity - a.popularity);
      this.searchResults = value;
      if (this.searchCount === 1 ) {
        window.requestAnimationFrame(() => {this.setSearchCount(); });
      }
    });
  }

  showUserPlaylists(): void {
    this.searchShift = 0;
    this.spotifyService.getPlaylists().subscribe(value => {
      this.searchResults.tracks = undefined;
      this.searchResults.playlists = value.playlists;
    });
  }

  getSearchResultCount(): number {
    let x = 0;

    if (this.searchResults.tracks?.items) {
      x = this.searchResults.tracks.items.length;
    }

    if (this.searchResults.albums?.items) {
      x = this.searchResults.albums.items.length;
    }

    if (this.searchResults.playlists?.items) {
      x = this.searchResults.playlists.items.length;
    }

    return x;
  }

  showMore(): void {
    this.searchShift += this.searchCount;
    if (this.searchShift > this.getSearchResultCount()) {
      this.searchShift = 0;
    }
  }


}
