import {Component, Input, OnInit} from '@angular/core';
import {QueueSong} from '@jamfactoryapp/jamfactory-types';
import {UtilService} from '../../core/services/util.service';

@Component({
  selector: 'app-search-song',
  templateUrl: './search-song.component.html',
  styleUrls: ['./search-song.component.scss']
})
export class SearchSongComponent implements OnInit {

  @Input()
  songInfo: QueueSong;

  @Input()
  isVoted: boolean;

  constructor(public utils: UtilService) { }

  ngOnInit(): void {
  }

}
