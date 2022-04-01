import { Component, ElementRef, Input, ViewChild} from '@angular/core';
import {DeleteSongRequestBody, QueueSong, SetJamSessionRequestBody, VoteRequestBody} from '@jamfactoryapp/jamfactory-types';
import {ColorService, SongColor} from '../../../core/services/color.service';
import {QueueHttpService} from '../../../core/http/queue.http.service';
import {QueueService} from '../../../core/services/queue.service';
import {QueueStore} from '../../../core/stores/queue.store';
import {JamsessionHttpService} from '../../../core/http/jamsession.http.service';
import {JamsessionStore} from '../../../core/stores/jamsession.store';
import {UtilService} from '../../../core/services/util.service';
import {PermissionsService} from '../../../core/services/permissions.service';
import TrackObjectFull = SpotifyApi.TrackObjectFull;

@Component({
  selector: 'app-queue-song-cards',
  templateUrl: './queue-song-cards.component.html',
  styleUrls: ['./queue-song-cards.component.scss']
})
export class QueueSongCardsComponent  {

  @Input()
  track: QueueSong;

  @Input()
  index: number;

  constructor(
    public utils: UtilService
  ) {
  }




}
