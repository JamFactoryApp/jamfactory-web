import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {SpotifyHttpService} from '../../core/http/spotify.http.service';
import {QueueSong, SpotifySearchRequestBody} from '@jamfactoryapp/jamfactory-types';
import {QueueService} from '../../core/services/queue.service';
import {QueueStore} from '../../core/stores/queue.store';
import {JamsessionStore} from '../../core/stores/jamsession.store';
import {PermissionsService} from '../../core/services/permissions.service';
import {SearchStore} from '../../core/stores/search.store';
import {ViewStore} from '../../core/stores/view.store';
import SearchResponse = SpotifyApi.SearchResponse;


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {

  @ViewChild('Dropdown', {read: ElementRef, static: false}) dropdownMenu: ElementRef;
  searchResultsTracks: QueueSong[] = [];
  searchResultsPlaylists: SpotifyApi.PlaylistObjectSimplified[] = [];
  searchResultsAlbums: SpotifyApi.AlbumObjectSimplified[] = [];
  searchCount = 8;
  searchShift = 0;
  emptySearch: boolean;

  constructor(
    private spotifyService: SpotifyHttpService,
    private queueService: QueueService,
    private queueStore: QueueStore,
    public searchStore: SearchStore,
    public jamStore: JamsessionStore,
    public permissions: PermissionsService,
    private eRef: ElementRef,
    public viewStore: ViewStore
  ) {
  }

  // Close Search when clicking outsite of div
  @HostListener('document:click', ['$event'])
  clickout(event): void {
    this.viewStore.statusSearchBox = this.eRef.nativeElement.contains(event.target) || this.dropdownMenu?.nativeElement.contains(event.target);
    console.log('OUTSIDE RESULT:', !(this.eRef.nativeElement.contains(event.target) || this.dropdownMenu?.nativeElement.contains(event.target)));
  }

  ngOnInit(): void {
    this.queueStore.$queue.subscribe(_ => {
      this.searchResultsTracks = this.queueService.updateQueueFromSocket(this.searchResultsTracks);
    });

    this.searchStore.$search.subscribe(value => {

      if (value !== undefined) {
        this.updateResults(value);
      } else {
        this.emptySearch = true;
        console.log('EMPTY SEARCH')
      }
    });
  }

  updateResults(searchResults: SearchResponse): void {
    if (this.searchStore.searchType === 'personal') {
      this.spotifyService.getPlaylists().subscribe(value => {
        this.searchResultsPlaylists = value.playlists.items;
        this.emptySearch = false;
        this.searchResultsTracks = [];
        this.searchResultsAlbums = [];
      });
      return;
    }
    this.emptySearch = false;
    switch (this.searchStore.searchType) {
      case 'track':
        searchResults.tracks.items = searchResults.tracks.items.sort((a, b) => b.popularity - a.popularity);
        this.searchResultsPlaylists = [];
        this.searchResultsAlbums = [];
        this.searchResultsTracks = this.queueService.updateQueueFromSocket(searchResults.tracks.items.map(track => {
          return {spotifyTrackFull: track, voted: false, votes: 0} as QueueSong;
        }));
        break;
      case 'album':
        this.searchResultsPlaylists = [];
        this.searchResultsTracks = [];
        this.searchResultsAlbums = searchResults.albums.items;
        break;
      case 'playlist':
        this.searchResultsTracks = [];
        this.searchResultsAlbums = [];
        this.searchResultsPlaylists = searchResults.playlists.items;
        break;
    }
  }

  getSearchResultCount(): number {
    let x = 0;
    if (this.searchStore.searchType === 'track') {
      x = this.searchResultsTracks.length;
    }
    if (this.searchStore.searchType === 'album ') {
      x = this.searchResultsAlbums.length;
    }
    if (this.searchStore.searchType === 'playlist' || this.searchStore.searchType === 'personal') {
      x = this.searchResultsPlaylists.length;
    }
    return x;
  }

  showMore(): void {
    this.searchShift += this.searchCount;
    if (this.searchShift >= this.getSearchResultCount()) {
      this.searchShift = 0;
    }
  }

  showLess(): void {
    setTimeout(() => {
      if (this.searchShift === 0) {
        this.searchShift = 0;
      } else {
        this.searchShift -= this.searchCount;
      }
    }, 10);
  }

  setMode(mode: string): void {
    this.viewStore.statusSearchBar = true;
    this.viewStore.statusSearchBox = true;
    this.searchStore.searchType = mode;
    if (mode !== 'personal') {
      const body: SpotifySearchRequestBody = {
        text: this.searchStore.searchString,
        type: this.searchStore.searchType
      };

      this.spotifyService.putSearch(body).subscribe(value => {
        this.searchStore.search = value;
      });
    } else {
      this.spotifyService.getPlaylists().subscribe(value => {
        this.searchResultsPlaylists = value.playlists.items;
        this.emptySearch = false;
        this.searchResultsTracks = [];
        this.searchResultsAlbums = [];
      });
    }
  }
}
