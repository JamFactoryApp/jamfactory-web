import {Component, HostListener, Input, OnInit, ElementRef, ViewChildren, QueryList, ViewChild} from '@angular/core';
import {SpotifyHttpService} from '../../../core/http/spotify.http.service';
import {FormControl} from '@angular/forms';
import {faSearch, faArrowRight} from '@fortawesome/free-solid-svg-icons';

import {
  SpotifySearchRequestBody,
  SpotifySearchResponseBody,
  QueueSong,
  AuthCurrentResponseBody, JamAuthStatus
} from 'jamfactory-types';
import {QueueService} from '../../../core/services/queue.service';
import {QueueStore} from '../../../core/stores/queue.store';
import {AuthStore} from '../../../core/stores/auth.store';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {

  constructor(
    private spotifyService: SpotifyHttpService,
    private elementRef: ElementRef,
    private queueService: QueueService,
    private queueStore: QueueStore,
    private authStore: AuthStore
  ) {
  }

  public current: JamAuthStatus;

  @ViewChildren('SearchSong', {read: ElementRef}) searchSongs: QueryList<ElementRef>;

  searchField = new FormControl('');
  searchType = '';
  searchResultsTracks: QueueSong[] = [];
  searchResultsPlaylists: SpotifyApi.PlaylistObjectSimplified[] = [];
  searchResultsAlbums: SpotifyApi.AlbumObjectSimplified[] = [];
  searchCount = 1;
  searchShift = 0;

  faSearch = faSearch;
  faArrowRight = faArrowRight;

  searchTimeout: number;

  // Close Search when clicking outsite of div
  @HostListener('document:click', ['$event'])
  handlerFunctionClick(e: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(e.target)) {
      this.searchField.patchValue('');
      this.searchResultsTracks = [];
      this.searchResultsPlaylists = [];
      this.searchResultsAlbums = [];
      this.searchType = '';
    }
  }

  // Update search count on window resize
  @HostListener('window:resize', ['$event'])
  handlerFunctionResize(e: MouseEvent): void {
    this.setSearchCount();
}

  ngOnInit(): void {
    this.authStore.$authStatus.subscribe(value => {
      this.current = value;
    });
  }

  searchEvent(): void {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => this.searchTracks(), 100);
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
    this.spotifyService.putSearch(body).subscribe(value => {
      this.searchResultsPlaylists = [];
      value.tracks.items = value.tracks.items.sort((a, b) => b.popularity - a.popularity);
      this.searchResultsTracks = value.tracks.items.map(track => {return {spotifyTrackFull: track, voted: false, votes: 0} as QueueSong;
      });

      if (this.searchCount === 1 ) {
        window.requestAnimationFrame(() => {this.setSearchCount(); });
      }
    });
  }

  showUserPlaylists(): void {
    this.searchShift = 0;
    this.spotifyService.getPlaylists().subscribe(value => {
      this.searchType = 'playlist';
      this.searchResultsTracks = [];
      this.searchResultsPlaylists = value.playlists.items;
    });
  }

  getSearchResultCount(): number {
    let x = 0;
    if (this.searchType === 'track') {
      x = this.searchResultsTracks.length;
    }
    if (this.searchType === 'album ') {
      x = this.searchResultsAlbums.length;
    }
    if (this.searchType === 'playlist') {
      x = this.searchResultsPlaylists.length;
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
