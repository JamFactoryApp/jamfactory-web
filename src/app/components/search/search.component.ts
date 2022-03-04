import {Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren} from '@angular/core';
import {SpotifyHttpService} from '../../core/http/spotify.http.service';
import {QueueSong} from '@jamfactoryapp/jamfactory-types';
import {QueueService} from '../../core/services/queue.service';
import {QueueStore} from '../../core/stores/queue.store';
import {JamsessionStore} from '../../core/stores/jamsession.store';
import {PermissionsService} from '../../core/services/permissions.service';
import {SearchStore} from '../../core/stores/search.store';
import {ViewStore} from '../../core/stores/view.store';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {

  @ViewChildren('SearchSong', {read: ElementRef}) searchSongs: QueryList<ElementRef>;
  searchType = 'track';
  searchResultsTracks: QueueSong[] = [];
  searchResultsPlaylists: SpotifyApi.PlaylistObjectSimplified[] = [];
  searchResultsAlbums: SpotifyApi.AlbumObjectSimplified[] = [];
  searchCount = 8;
  searchShift = 0;
  emptySearch: boolean;

  constructor(
    private spotifyService: SpotifyHttpService,
    private elementRef: ElementRef,
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
    this.viewStore.statusSearchBox = this.eRef.nativeElement.contains(event.target);
    if (!this.eRef.nativeElement.contains(event.target)) {
      console.log('OUTSIDE RESULT');
    }
  }

  ngOnInit(): void {
    this.queueStore.$queue.subscribe(_ => {
      this.searchResultsTracks = this.queueService.updateQueueFromSocket(this.searchResultsTracks);
    });

    this.searchStore.$search.subscribe(value => {

      if (value !== undefined) {
        this.emptySearch = false;
        this.searchResultsPlaylists = [];
        value.tracks.items = value.tracks.items.sort((a, b) => b.popularity - a.popularity);
        this.searchResultsTracks = this.queueService.updateQueueFromSocket(value.tracks.items.map(track => {
          return {spotifyTrackFull: track, voted: false, votes: 0} as QueueSong;
        }));
      } else {
        this.emptySearch = true;
      }
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

  showLess(): void {
    setTimeout(() => {
      if (this.searchShift === 0) {
        this.searchShift = 0;
      } else {
        this.searchShift -= this.searchCount;
      }
    }, 10);
  }
}
