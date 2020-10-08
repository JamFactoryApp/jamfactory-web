import {Component, HostListener, Input, OnInit, ElementRef, ViewChildren, QueryList, ViewChild} from '@angular/core';
import {SpotifyService} from '../../services/spotify.service';
import {FormControl} from '@angular/forms';
import PutSpotifySearchRequest = JamFactoryApi.PutSpotifySearchRequest;
import SearchResult = Zmb3SpotifyApi.SearchResult;
import SongWithoutId = JamFactoryApi.SongWithoutId;
import {faSearch, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import GetAuthCurrentResponse = JamFactoryApi.GetAuthCurrentResponse;
import {QueueSongComponent} from '../queue-song/queue-song.component';
import PlaylistObjectSimplified = SpotifyApi.PlaylistObjectSimplified;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(
    private spotifyService: SpotifyService,
    private elementRef: ElementRef
  ) {
  }
  @Input()
  queue: SongWithoutId[];

  @Input()
  current: GetAuthCurrentResponse;

  @Input()
  voteMethod: (PutQueueVoteRequest) => void;

  @Input()
  addMethod: (AddCollectionRequestBody) => void;

  @ViewChildren('SearchSong', {read: ElementRef}) searchSongs: QueryList<ElementRef>;

  searchField = new FormControl('');
  searchResults: SearchResult;
  searchCount = 1;

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
      if (this.searchCount === 1 ) {
        window.requestAnimationFrame(() => {this.setSearchCount(); });
      }
    });
  }

  showUserPlaylists(): void {
    this.spotifyService.getPlaylists().subscribe(value => {
      this.searchResults.tracks = undefined;
      this.searchResults.playlists = value.playlists;
      console.log(this.searchResults.playlists);
    });
  }


}
