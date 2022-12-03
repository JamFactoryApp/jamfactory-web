import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {JamsessionStore} from '../../core/stores/jamsession.store';
import {FormControl} from '@angular/forms';
import {SpotifySearchRequestBody} from '@jamfactoryapp/jamfactory-types';
import {SpotifyHttpService} from '../../core/http/spotify.http.service';
import {SearchStore} from '../../core/stores/search.store';
import {ViewStore} from '../../core/stores/view.store';
import {ColorService} from "../../core/services/color.service";

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {

  @ViewChild('search') search: ElementRef;

  public searchField = new FormControl('');
  public searchTimeout: number;
  public colorAccent: string;

  constructor(
    public jamStore: JamsessionStore,
    private spotifyService: SpotifyHttpService,
    public searchStore: SearchStore,
    public searchViewStore: ViewStore,
    public colorService: ColorService
  ) {
  }

  // Close Search when clicking outsite of search
  @HostListener('document:click', ['$event'])
  clickout(event): void {
    this.searchViewStore.statusSearchBar = this.search.nativeElement.contains(event.target);
  }

  ngOnInit(): void {

    this.searchViewStore.$view.subscribe(value => {
      if (value.searchResultViewToggle === false && value.searchBarViewToggle === false) {
        this.searchField.reset();
        this.searchStore.searchString = '';
      }
    });

    this.colorService.$color.subscribe(value => {
      this.colorAccent = value;
    })
  }

  searchEvent(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = window.setTimeout(() => this.searchTracks(), 100);
  }

  searchTracks(): void {
    if (this.searchField.value === '') {
      setTimeout(() => {
        this.searchStore.searchString = '';
        this.searchViewStore.statusSearchBar = false;
        this.searchViewStore.statusSearchBox = false;
      }, 20);
      return;
    }
    if ( this.searchStore.searchType !== 'personal') {
      this.searchStore.searchString = this.searchField.value;
      const body: SpotifySearchRequestBody = {
        text: this.searchField.value,
        type: this.searchStore.searchType
      };
      this.spotifyService.putSearch(body).subscribe(value => {
        this.searchStore.search = value;
      });
    }
    this.searchViewStore.statusSearchBar = true;
    this.searchViewStore.statusSearchBox = true;
  }

  toggleMenu(): void {
    setTimeout(() => {
      this.searchViewStore.menu = !this.searchViewStore.view.menu;
      this.searchViewStore.statusSearchBar = false;
      this.searchViewStore.statusSearchBox = false;
    }, 10);
  }

  clearSearch(): void {
    setTimeout(() => {
    this.searchStore.searchString = '';
    this.searchViewStore.statusSearchBar = false;
    this.searchViewStore.statusSearchBox = false;
    }, 20);
  }

  getQRCode(): string {
    return 'https://' + window.location.host + window.location.pathname;
  }

}
