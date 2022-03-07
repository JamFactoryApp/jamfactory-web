import {Component, ElementRef, HostListener, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {JamsessionStore} from '../../core/stores/jamsession.store';
import {FormControl} from '@angular/forms';
import {QueueStore} from '../../core/stores/queue.store';
import {QueueSong, SpotifySearchRequestBody} from '@jamfactoryapp/jamfactory-types';
import {QueueService} from '../../core/services/queue.service';
import {SpotifyHttpService} from '../../core/http/spotify.http.service';
import {SearchStore} from '../../core/stores/search.store';
import {MenuStore} from '../../core/stores/menu.store';
import {ViewStore} from '../../core/stores/view.store';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {

  @ViewChild('search') search: ElementRef;

  public searchField = new FormControl('');
  public searchTimeout: number;

  public menuStatus: boolean;
  public searchViewBar: boolean;

  constructor(
    public jamStore: JamsessionStore,
    private spotifyService: SpotifyHttpService,
    public searchStore: SearchStore,
    public menuStore: MenuStore,
    public searchViewStore: ViewStore
  ) {
  }

  // Close Search when clicking outsite of search
  @HostListener('document:click', ['$event'])
  clickout(event): void {
    this.searchViewStore.statusSearchBar = this.search.nativeElement.contains(event.target);
  }

  ngOnInit(): void {
    this.menuStore.$status.subscribe(value => {
      this.menuStatus = value;
    });

    this.searchViewStore.$view.subscribe(value => {
      this.searchViewBar = value.searchBarViewToggle;
    });

    this.searchViewStore.$view.subscribe(value => {
      if (value.searchResultViewToggle === false && this.searchViewBar === false) {
        this.searchField.reset();
      }
    });
  }

  searchEvent(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.searchTracks(), 100);
  }

  searchTracks(): void {
    if (this.searchField.value === '') {
      this.searchStore.searchString = '';
      this.searchStore.search = undefined;
      this.searchViewStore.statusSearchBar = false;
      this.searchViewStore.statusSearchBox = false;
      return;
    }
    this.searchStore.searchString = this.searchField.value;
    const body: SpotifySearchRequestBody = {
      text: this.searchField.value,
      type:  this.searchStore.searchType
    };

    this.spotifyService.putSearch(body).subscribe(value => {
      this.searchStore.search = value;
    });
    this.searchViewStore.statusSearchBar = true;
    this.searchViewStore.statusSearchBox = true;
  }

  toggleMenu(): void {
    setTimeout(() => {
      this.menuStore.status = !this.menuStatus;
      this.searchViewStore.statusSearchBar = false;
      this.searchViewStore.statusSearchBox = false;
    }, 10);
  }

}
