import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {QueueHttpService} from '../../core/http/queue.http.service';
import {DeleteSongRequestBody, QueueSong, SetJamSessionRequestBody, VoteRequestBody} from '@jamfactoryapp/jamfactory-types';
import {QueueService} from '../../core/services/queue.service';
import {QueueStore} from '../../core/stores/queue.store';
import {JamsessionHttpService} from '../../core/http/jamsession.http.service';
import {JamsessionStore} from '../../core/stores/jamsession.store';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import TrackObjectFull = SpotifyApi.TrackObjectFull;
import {UtilService} from '../../core/services/util.service';
import {PermissionsService} from '../../core/services/permissions.service';
import {ColorService, SongColor} from '../../core/services/color.service';



@Component({
  selector: 'app-queue-song',
  templateUrl: './queue-song.component.html',
  styleUrls: ['./queue-song.component.scss']
})

export class QueueSongComponent implements OnInit, AfterViewInit {

  @Input()
  track: QueueSong;

  @Input()
  index: number;

  @Input()
  inQueue: boolean;

  @Input()
  search: boolean;

  @ViewChild('cover') cover: ElementRef;

  @ViewChild('tooltip') tooltip: NgbTooltip;

  public host: boolean;
  public voted: boolean;
  public songColor: SongColor = {
    vibrant: [231, 231, 231],
    muted: [0, 0, 0],
  };

  constructor(
    private queueApi: QueueHttpService,
    private queueService: QueueService,
    private queueStore: QueueStore,
    public colorService: ColorService,
    private jamSessionService: JamsessionHttpService,
    public jamSessionStore: JamsessionStore,
    public utils: UtilService,
    public permissions: PermissionsService
  ) {
  }

  ngOnInit(): void {
    this.host = this.permissions.hasPermission(this.permissions.Host)
    this.voted = this.getVoted(this.track.spotifyTrackFull);
  }

  ngAfterViewInit(): void {
    if (this.tooltip && !this.jamSessionStore.jamSession.active) {
      this.tooltip.open();
    }
  }

  getImgColor(): void {
    if (!this.search) {
      this.songColor = this.colorService.getImgColor(this.cover.nativeElement);
    }
  }

  getVoted(track: TrackObjectFull): boolean {
    if (this.queueStore.queue.tracks === undefined) {
      return false;
    }

    if (this.queueStore.queue.tracks.length === 0) {
      return false;
    }

    for (let i = 0; i < this.queueStore.queue.tracks.length; i++) {
      if (track.id === this.queueStore.queue.tracks[i].spotifyTrackFull.id && this.queueStore.queue.tracks[i].voted) {
        return true;
      }
    }
    return false;
  }

  vote(track: TrackObjectFull): void {
    const body: VoteRequestBody = {
      track: track.id
    };
    this.queueService.vote(body);
  }

  delete(track: QueueSong): void {
    const body: DeleteSongRequestBody = {
      track: track.spotifyTrackFull.id
    };
    this.queueService.delete(body);
  }

  active(value: boolean): void {
    const body: SetJamSessionRequestBody = {
      active: value
    };
    this.jamSessionService.putJamsession(body).subscribe((jamSession) => {
      this.jamSessionStore.jamSession = jamSession;
    });
  }
}
