import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {AuthHttpService} from '../../core/http/auth.http.service';
import {JamsessionHttpService} from '../../core/http/jamsession.http.service';
import {QueueHttpService} from '../../core/http/queue.http.service';
import {SpotifyHttpService} from '../../core/http/spotify.http.service';
import {WebsocketService} from '../../core/socket/websocket.service';
import {
  GetJamSessionResponseBody,
  GetPlaybackResponseBody,
  QueueSong,
  AuthCurrentResponseBody,
  VoteRequestBody,
  AddCollectionRequestBody,
  SocketQueueMessage,
  SocketPlaybackMessage,
  SocketCloseMessage
} from 'jamfactory-types';


@Component({
  selector: 'app-jam-session',
  templateUrl: './jamsession.component.html',
  styleUrls: ['./jamsession.component.scss']
})
export class JamsessionComponent implements OnInit, OnDestroy {
  jamSession: GetJamSessionResponseBody;
  current: AuthCurrentResponseBody;
  playback: GetPlaybackResponseBody;
  queue: QueueSong[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthHttpService,
    private jamsessionService: JamsessionHttpService,
    private queueService: QueueHttpService,
    private spotifyService: SpotifyHttpService,
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
            const queuePayload: SocketQueueMessage = value.message as SocketQueueMessage;
            this.updateQueueFromSocket(queuePayload.queue);
            break;
          case 'playback':
            const playbackPayload: SocketPlaybackMessage = value.message as SocketPlaybackMessage;
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

  setQueueHeight(): object {
    const viewHeight = document.documentElement.clientHeight;

    const footerHeight = document.getElementById('playback').offsetHeight;
    const headerHeight = document.getElementById('header').offsetHeight;
    const searchHeight = document.getElementById('search').offsetHeight;

    const styles = {
      height: (viewHeight - footerHeight - headerHeight - searchHeight - 10) + 'px',
      top: headerHeight + 'px',
    };

    return styles;
  }

  getQueue(): QueueSong[] {
    return this.queue;
  }


  updateQueueFromSocket(list: QueueSong[]): void {
    this.queue = list.map((q) => {

      const song: QueueSong = {
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

  vote = (body: VoteRequestBody) => {
    this.queueService.putQueueVote(body).subscribe((response) => {

      this.queue = response.queue;

    });
  }

  addCollection = (body: AddCollectionRequestBody) => {
    this.queueService.putQueueCollection(body).subscribe((response) => {

      this.queue = response.queue;

    });
  }

  ngOnDestroy(): void {
    this.websocketService.close();
  }
}
