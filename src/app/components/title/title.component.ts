import {Component, OnInit} from '@angular/core';
import {JamsessionStore} from '../../core/stores/jamsession.store';
import {FormControl} from '@angular/forms';
import {QueueStore} from '../../core/stores/queue.store';
import {QueueSong, SpotifySearchRequestBody} from '@jamfactoryapp/jamfactory-types';
import {QueueService} from '../../core/services/queue.service';
import {SpotifyHttpService} from '../../core/http/spotify.http.service';
import {SearchStore} from '../../core/stores/search.store';
import {MenuStore} from '../../core/stores/menu.store';
import {SearchViewStore} from '../../core/stores/search-view.store';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {

  public searchField = new FormControl('');
  public searchType = '';
  public searchTimeout: number;

  public menuStatus: boolean;

  constructor(
    public jamStore: JamsessionStore,
    private spotifyService: SpotifyHttpService,
    public searchStore: SearchStore,
    public menuStore: MenuStore,
    public searchViewStore: SearchViewStore
  ) {
  }

  ngOnInit(): void {
    this.menuStore.$status.subscribe(value => {
      this.menuStatus = value;
    });
  }

  searchEvent(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.searchTracks(), 100);
  }

  searchTracks(): void {
    this.searchType = 'track';
    if (this.searchField.value === '') {
      this.searchType = '';
      this.searchStore.search = undefined;
      this.searchViewStore.status = false;
      return;
    }

    const body: SpotifySearchRequestBody = {
      text: this.searchField.value,
      type: this.searchType
    };

    this.spotifyService.putSearch(body).subscribe(value => {
      this.searchStore.search = value;
    });
    this.searchViewStore.status = true;
  }

  toggleMenu(): void {
    this.menuStore.status = !this.menuStatus;
    this.searchViewStore.status = false;
  }

}
