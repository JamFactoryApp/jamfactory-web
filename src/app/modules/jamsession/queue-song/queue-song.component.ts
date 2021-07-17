import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {QueueHttpService} from '../../../core/http/queue.http.service';
import {DeleteSongRequestBody, QueueSong, SetJamSessionRequestBody, VoteRequestBody} from '@jamfactoryapp/jamfactory-types';
import {QueueService} from '../../../core/services/queue.service';
import {QueueStore} from '../../../core/stores/queue.store';
import {ColorService} from '../../../core/services/color.service';
import {JamsessionHttpService} from '../../../core/http/jamsession.http.service';
import {JamsessionStore} from '../../../core/stores/jamsession.store';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import TrackObjectFull = SpotifyApi.TrackObjectFull;

declare var ColorThief: any;

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
  host: boolean;


  @Input()
  search: boolean;

  @ViewChild('cover') cover: ElementRef;

  @ViewChild('tooltip') tooltip: NgbTooltip;

  VibrantColor;
  MutedColor;

  constructor(
    private queueApi: QueueHttpService,
    private queueService: QueueService,
    private queueStore: QueueStore,
    private jamSessionService: JamsessionHttpService,
    public jamSessionStore: JamsessionStore,
    private colorService: ColorService
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.tooltip && !this.jamSessionStore.jamsession.active) {
      this.tooltip.open();
    }
  }

  getArtist(item): string {
    const len = item.length;
    let artist: string = item[0].name;

    if (len > 1) {
      for (let i = 1; len > i; i++) {
        artist = artist + ', ' + item[i].name;
      }
    }
    return artist;
  }

  getImgColor(): void {
    let vibrant;
    let muted;

    const check = this.colorService.checkImgStore(this.cover.nativeElement.src);

    if (check === undefined) {
      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(this.cover.nativeElement, 5, 50);
      vibrant = palette[0];
      muted = this.colorService.highestDiff(palette, vibrant);

      this.colorService.addImgStore(vibrant, muted, this.cover.nativeElement.src);
    } else {
      vibrant = check[0];
      muted = check[1];
    }

    this.VibrantColor = 'rgba(' + vibrant[0] + ',' + vibrant[1] + ',' + vibrant[2] + ')';
    this.MutedColor = 'rgba(' + muted[0] + ',' + muted[1] + ',' + muted[2] + ')';

  }

  voted(track: TrackObjectFull): boolean {
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
      this.jamSessionStore.jamsession = jamSession;
    });
  }
}
