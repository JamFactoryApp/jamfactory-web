import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DeleteSongRequestBody, QueueSong, SetJamSessionRequestBody, VoteRequestBody} from '@jamfactoryapp/jamfactory-types';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
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
export class QueueSongCardsComponent implements OnInit, AfterViewInit {

  @Input()
  track: QueueSong;

  @Input()
  index: number;

  @ViewChild('cover') cover: ElementRef;

  @ViewChild('tooltip') tooltip: NgbTooltip;

  @ViewChild('listAdditional') listAdditional: ElementRef;

  public host: boolean;
  public voted: boolean;
  public songColor: SongColor = {
    vibrant: [231, 231, 231],
    muted: [0, 0, 0],
  };
  public expandedView: boolean;
  public closedArrow: boolean;
  public expandElement: boolean;
  public showExpandedBorder: boolean;
  public showExpandedContent1: boolean;
  public showExpandedContent2: boolean;

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
    this.host = this.permissions.hasPermission(this.permissions.Host);
    this.voted = this.getVoted(this.track.spotifyTrackFull);
    this.expandedView = false;
    this.closedArrow = false;
    this.expandElement = false;
    this.showExpandedBorder = false;
    this.showExpandedContent1 = false;
    this.showExpandedContent2 = false;
  }

  ngAfterViewInit(): void {
    if (this.tooltip && !this.jamSessionStore.jamSession.active) {
      this.tooltip.open();
    }
  }

  getImgColor(): void {
    this.songColor = this.colorService.getImgColor(this.cover.nativeElement);
  }

  getVoted(track: TrackObjectFull): boolean {
    if (this.queueStore.queue.tracks === undefined) {
      return false;
    }

    if (this.queueStore.queue.tracks.length === 0) {
      return false;
    }

    for (const item of this.queueStore.queue.tracks) {
      if (track.id === item.spotifyTrackFull.id && item.voted) {
        return true;
      }
    }

    // for (let i = 0; i < this.queueStore.queue.tracks.length; i++) {
    //   if (track.id === this.queueStore.queue.tracks[i].spotifyTrackFull.id && this.queueStore.queue.tracks[i].voted) {
    //     return true;
    //   }
    // }

    for (const item of this.queueStore.queue.tracks) {
      if (track.id === item.spotifyTrackFull.id && item.voted) {
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

  getSongDuration(millisecond: number): string {
    const minutes = Math.floor(millisecond / 60000);
    const seconds = Number(((millisecond % 60000) / 1000).toFixed(0));
    return (
      seconds === 60 ?
        (minutes + 1) + ':00' :
        minutes + ':' + (seconds < 10 ? '0' : '') + seconds
    );
  }

  getReleaseDate(date: string): string {
    const dateArray = date.split('-');

    let month = '';
    switch (dateArray[2]) {
      case '01':
        month = 'January';
        break;
      case '02':
        month = 'February';
        break;
      case '03':
        month = 'March';
        break;
      case '04':
        month = 'April';
        break;
      case '05':
        month = 'May';
        break;
      case '06':
        month = 'June';
        break;
      case '07':
        month = 'July';
        break;
      case '08':
        month = 'August';
        break;
      case '09':
        month = 'September';
        break;
      case '10':
        month = 'October';
        break;
      case '11':
        month = 'November';
        break;
      case '12':
        month = 'December';
        break;

    }
    const day = dateArray[1];
    const year = dateArray[0];

    return month + ' ' + day + ', ' + year;
  }

  openExpandedView(): void {
    if (!this.expandedView) {
      this.closedArrow = true;
      this.expandElement = true;
      setTimeout(() => {
        this.showExpandedBorder = true;
      }, 100);
      this.showExpandedContent1 = true;
      setTimeout(() => {
        this.showExpandedContent2 = true;
      }, 300);
      this.expandedView = true;
    } else {
      this.showExpandedContent2 = false;
      window.setTimeout(() => {
        this.showExpandedContent1 = false;
        this.closedArrow = false;
        this.expandElement = false;
        window.setTimeout(() => {
          this.showExpandedBorder = false;
        }, 100);
      }, 300);
      this.expandedView = false;
    }
  }

}
