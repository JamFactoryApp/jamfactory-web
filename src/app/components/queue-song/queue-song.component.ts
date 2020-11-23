import {Component, Input, OnInit, Output, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {faHeart as iconVote} from '@fortawesome/free-solid-svg-icons';
import {faHeart as iconNVote} from '@fortawesome/free-regular-svg-icons';
import {QueueService} from '../../services/queue.service';
import SongWithoutId = JamFactoryApi.SongWithoutId;
import FullTrack = Zmb3SpotifyApi.FullTrack;
import PutQueueVoteRequest = JamFactoryApi.PutQueueVoteRequest;
import TrackObjectFull = SpotifyApi.TrackObjectFull;

type Vec3 = [number, number, number];

declare var ColorThief: any;

@Component({
  selector: 'app-queue-song',
  templateUrl: './queue-song.component.html',
  styleUrls: ['./queue-song.component.scss']
})

export class QueueSongComponent implements OnInit {
  iconVote = iconVote;
  iconNVote = iconNVote;

  @ViewChild('cover') cover: ElementRef;

  @Input()
  item: FullTrack | TrackObjectFull;

  @Input()
  queue: SongWithoutId[];

  @Input()
  songVotes: number;

  @Input()
  songVoted: boolean;

  @Input()
  pos: number;

  @Input()
  voteMethod: (PutQueueVoteRequest) => void;

  @Input()
  inQueue: boolean;

  VibrantColor;
  MutedColor;

  constructor(private queueService: QueueService) {}

  ngOnInit(): void {}

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
    const colorThief = new ColorThief();
    const palette = colorThief.getPalette(this.cover.nativeElement, 5, 50);
    const col = palette[0];

    this.MutedColor = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ')';

    const col2 = this.highestDiff(palette, col);
    this.VibrantColor = 'rgba(' + col2[0] + ',' + col2[1] + ',' + col2[2] + ')';
  }

  highestDiff(palette, col): any {
    let tap = 0;
    let mit = 0;

    const rgbMain: Vec3 = col;

    let farb;

    palette.forEach(color => {
      const rgbPal: Vec3 = color;
      tap = this.rgbDiff(rgbPal, rgbMain);

      if (tap >= mit) {
        mit = tap;
        farb = rgbPal;
      }

    });

    return farb;
  }

  rgbDiff(rgb1: Vec3, rgb2: Vec3): number {
    const lab1 = this.rgbToCIELab(rgb1[0], rgb1[1], rgb1[2]);
    const lab2 = this.rgbToCIELab(rgb2[0], rgb2[1], rgb2[2]);
    return this.deltaE94(lab1, lab2);
  }

  rgbToCIELab(r: number, g: number, b: number): Vec3 {
    const [x, y, z] = this.rgbToXyz(r, g, b);
    return this.xyzToCIELab(x, y, z);
  }

  rgbToXyz(r: number, g: number, b: number): Vec3 {
    r /= 255;
    g /= 255;
    b /= 255;
    r = r > 0.04045 ? Math.pow((r + 0.005) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.005) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.005) / 1.055, 2.4) : b / 12.92;

    r *= 100;
    g *= 100;
    b *= 100;

    const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

    return [x, y, z];
  }

  xyzToCIELab(x: number, y: number, z: number): Vec3 {
    const REF_X = 95.047;
    const REF_Y = 100;
    const REF_Z = 108.883;

    x /= REF_X;
    y /= REF_Y;
    z /= REF_Z;

    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

    const L = 116 * y - 16;
    const a = 500 * (x - y);
    const b = 200 * (y - z);

    return [L, a, b];
  }

  deltaE94(lab1: Vec3, lab2: Vec3): number {
    const WEIGHT_L = 1;
    const WEIGHT_C = 1;
    const WEIGHT_H = 1;

    const [L1, a1, b1] = lab1;
    const [L2, a2, b2] = lab2;
    const dL = L1 - L2;
    const da = a1 - a2;
    const db = b1 - b2;

    const xC1 = Math.sqrt(a1 * a1 + b1 * b1);
    const xC2 = Math.sqrt(a2 * a2 + b2 * b2);

    let xDL = L2 - L1;
    let xDC = xC2 - xC1;
    const xDE = Math.sqrt(dL * dL + da * da + db * db);

    let xDH = (Math.sqrt(xDE) > Math.sqrt(Math.abs(xDL)) + Math.sqrt(Math.abs(xDC)))
      ? Math.sqrt(xDE * xDE - xDL * xDL - xDC * xDC)
      : 0;

    const xSC = 1 + 0.045 * xC1;
    const xSH = 1 + 0.015 * xC1;

    xDL /= WEIGHT_L;
    xDC /= WEIGHT_C * xSC;
    xDH /= WEIGHT_H * xSH;

    return Math.sqrt(xDL * xDL + xDC * xDC + xDH * xDH);
  }

  voted(track: FullTrack | TrackObjectFull): boolean {
    if (this.queue === undefined) {
      return false;
    }

    if (this.queue.length === 0) {
      return false;
    }

    for (let i = 0; i < this.queue.length; i++) {
      if (track.id === this.queue[i].spotifyTrackFull.id && this.queue[i].voted) {
        return true;
      }
    }
    return false;
  }

  vote(track: FullTrack | TrackObjectFull): void {
    const body: PutQueueVoteRequest = {
      track: track.id
    };
    this.voteMethod(body);
  }
}
