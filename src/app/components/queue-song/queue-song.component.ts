import {Component, Input, OnInit, Output, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {faHeart as iconVote} from '@fortawesome/free-solid-svg-icons';
import {faHeart as iconNVote} from '@fortawesome/free-regular-svg-icons';
import {QueueService} from '../../services/queue.service';
import SongWithoutId = JamFactoryApi.SongWithoutId;
import FullTrack = Zmb3SpotifyApi.FullTrack;
import PutQueueVoteRequest = JamFactoryApi.PutQueueVoteRequest;
import TrackObjectFull = SpotifyApi.TrackObjectFull;
import {EventEmitter} from '@angular/core';

declare var Vibrant: any;

@Component({
  selector: 'app-queue-song',
  templateUrl: './queue-song.component.html',
  styleUrls: ['./queue-song.component.scss']
})

export class QueueSongComponent implements OnInit {
  iconVote = iconVote;
  iconNVote = iconNVote;

  @ViewChild('cover') cover: ElementRef;

  ngAfterViewInit() {
    // this.logo = this.cover;
    // console.log(this.cover.nativeElement.src);

    this.getImgColor(this.cover.nativeElement.src);
  }

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

  constructor(
    private queueService: QueueService
  ) {
  }

  ngOnInit(): void {
    // console.log(this.logo);
    // this.getImgColor(this.cover.nativeElement);
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

  getImgColor(img) {
    // console.log(img);
    // const url = document.getElementById('img');
    // console.log(url);
    // // const img = document.querySelector('img');

    Vibrant.from(img).getPalette().then((palette) => {
      // console.log(palette);
      // this.VibrantColor = palette.LightVibrant.hex;
      this.VibrantColor = 'rgba( 0, 0, 0 , 0.8)';
      this.MutedColor = palette.Vibrant.hex;

      console.log(palette.Vibrant.hex);
      console.log(palette.DarkVibrant.hex);
      console.log(palette.DarkMuted.hex);
      console.log(palette.LightVibrant.hex);
      console.log(palette.LightMuted.hex);
    });

    // Vibrant.from(url).getPalette((err, palette) => console.log(palette));
    // const v = new Vibrant(url);
    // this.color = v.getPalette();
    // console.log(color);
    // Vibrant.from(url).getPalette((err, palette) => console.log(palette));
    // this.color = 'yellow';

    //   const v = new Vibrant(url);
    //   const color = console.log(v.getPalette());
    // const img = document.getElementById('img').src;
    // Vibrant.from(img).getPalette().then((palette) => console.log(palette));

    // let styles = {
    //   'height': (viewHeight - footerHeight - headerHeight - searchHeight - 10) + 'px',
    // };

    // return styles;
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
