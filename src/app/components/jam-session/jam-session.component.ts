import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {JamsessionService} from '../../services/jamsession.service';
import {QueueService} from '../../services/queue.service';
import {SpotifyService} from '../../services/spotify.service';
import {WebsocketService} from '../../services/websocket.service';
import JamResponse = JamFactoryApi.JamResponse;
import PlaybackBody = JamFactoryApi.PlaybackBody;
import SongWithoutId = JamFactoryApi.SongWithoutId;
import GetAuthCurrentResponse = JamFactoryApi.GetAuthCurrentResponse;
import PutQueueVoteRequest = JamFactoryApi.PutQueueVoteRequest;
import AddCollectionRequestBody = JamFactoryApi.AddCollectionRequestBody;
import GetQueueResponse = JamFactoryApi.GetQueueResponse;
import GetJamPlaybackResponse = JamFactoryApi.GetJamPlaybackResponse;

@Component({
  selector: 'app-jam-session',
  templateUrl: './jam-session.component.html',
  styleUrls: ['./jam-session.component.scss']
})
export class JamSessionComponent implements OnInit, OnDestroy {
  jamSession: JamResponse;
  current: GetAuthCurrentResponse;
  playback: PlaybackBody;
  queue: SongWithoutId[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private jamsessionService: JamsessionService,
    private queueService: QueueService,
    private spotifyService: SpotifyService,
    private websocketService: WebsocketService
  ) {
    this.websocketService.connect();
  }

  ngOnInit(): void {
    this.jamsessionService.getJamsession().subscribe(value => {
      this.jamSession = value;
    }, _ => {
      this.jamsessionService.leaveJamSession().subscribe(() => {
      });
      this.router.navigate(['/']);
    });
    this.jamsessionService.getPlayback().subscribe(value => {
      this.playback = value;
    });
    this.authService.getCurrent().subscribe(value => {
      this.current = value;
    });
    this.queueService.getQueue().subscribe(value => {
      this.queue = value.queue;
    });
    this.websocketService.socket.asObservable().subscribe(
      value => {
        switch (value.event) {
          case 'queue':
            const queuePayload: GetQueueResponse = value.message;
            this.updateQueueFromSocket(queuePayload.queue);
            break;
          case 'playback':
            const playbackPayload: GetJamPlaybackResponse = value.message;
            this.playback = playbackPayload;
            break;
          case 'close':
            console.error(value.message);
            break;
          default:
            console.error('unknown event');
        }
      },
      error => console.error(error),
      () => console.log('closed')
    );
  }

  setQueueHeight() {
    const viewHeight = document.documentElement.clientHeight;

    const footerHeight = document.getElementById('playback').offsetHeight;
    const headerHeight = document.getElementById('header').offsetHeight;
    const searchHeight = document.getElementById('search').offsetHeight;

    let styles = {
      'height': (viewHeight - footerHeight - headerHeight - searchHeight - 10) + 'px',
      'top': headerHeight + 'px',
    };

    return styles;
  }

  getQueue(): SongWithoutId[] {
    return this.queue;
  }


  updateQueueFromSocket(list: SongWithoutId[]): void {
    this.queue = list.map((q) => {

      const song: SongWithoutId = {
        spotifyTrackFull: q.spotifyTrackFull,
        votes: q.votes,
        voted: false
      };

      this.getQueue().forEach(value => {
        if (value.spotifyTrackFull.id === q.spotifyTrackFull.id) {
          song.voted = value.voted;
        }
      });
      return song;
    });
  }

  vote = (body: PutQueueVoteRequest) => {
    this.queueService.putQueueVote(body).subscribe((response) => {

      this.queue = response.queue;

    });
  };

  addCollection = (body: AddCollectionRequestBody) => {
    this.queueService.putQueueCollection(body).subscribe((response) => {

      this.queue = response.queue;

    });
  };

  ngOnDestroy(): void {
    this.websocketService.close();
  }
}
