import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {JamsessionService} from '../../services/jamsession.service';
import {QueueService} from '../../services/queue.service';
import {SpotifyService} from '../../services/spotify.service';
import {WebsocketService} from '../../services/websocket.service';
import {catchError, map, tap} from 'rxjs/operators';
import JamResponse = JamFactoryApi.JamResponse;
import PlaybackBody = JamFactoryApi.PlaybackBody;
import SongWithoutId = JamFactoryApi.SongWithoutId;
import GetAuthCurrentResponse = JamFactoryApi.GetAuthCurrentResponse;
import PutQueueVoteRequest = JamFactoryApi.PutQueueVoteRequest;
import AddCollectionRequestBody = JamFactoryApi.AddCollectionRequestBody;

@Component({
  selector: 'app-jam-session',
  templateUrl: './jam-session.component.html',
  styleUrls: ['./jam-session.component.scss']
})
export class JamSessionComponent implements OnInit {
  jamSession: JamResponse;
  current: GetAuthCurrentResponse;
  playback: PlaybackBody;
  queue: SongWithoutId[] = [];
  liveData$;

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
  }

  ngOnInit(): void {
    this.jamsessionService.getJamsession().subscribe(value => {
      this.jamSession = value;
    }, error => {
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

    this.websocketService.connect();
    this.liveData$ = this.websocketService.messages$.pipe(
      map(rows => rows.toString()),
      catchError(error => {
        throw error;
      }),
      tap({
        next: t => console.log(t),
        error: error => console.log('[Live component] Error:', error),
        complete: () => console.log('[Live component] Connection Closed')
      })
    );
  }

  // connectSocket(): void {
  // this.socket = io.connect(environment.JAMFACTORY_API_URL);
  // this.socket.on('queue', (msg: GetQueueResponse) => {
  //   this.updateQueueFromSocket(msg.queue);
  // });
  // this.socket.on('playback', (msg: GetJamPlaybackResponse) => {
  //   this.playback = msg;
  // });
  // this.socket.on('close', (msg: any) => {
  //   console.log(msg);
  // });
  // }

  getQueue(): SongWithoutId[] {
    return this.queue;
  }

  updateQueueFromSocket(list: SongWithoutId[]): void {
    console.log('Socket: ', list);
    console.log('QueueB: ', this.getQueue());
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
    console.log('Queue: ', this.getQueue());
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
}
