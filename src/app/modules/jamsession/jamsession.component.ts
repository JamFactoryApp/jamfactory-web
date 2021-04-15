import {Component, OnInit, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
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
  SocketCloseMessage, JoinRequestBody
} from 'jamfactory-types';
import {JamsessionStore} from '../../core/stores/jamsession.store';
import {QueueStore} from '../../core/stores/queue.store';
import {QueueService} from '../../core/services/queue.service';
import {AuthStore} from '../../core/stores/auth.store';
import {NotificationService, Notification} from '../../core/services/notification.service';


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
    private jamStore: JamsessionStore,
    private queueStore: QueueStore,
    private queueService: QueueService,
    private queueApi: QueueHttpService,
    private spotifyService: SpotifyHttpService,
    private websocketService: WebsocketService,
    private authStore: AuthStore,
    public notificationService: NotificationService
  ) {
    this.websocketService.connect();
    this.authService.getCurrent().subscribe(value => authStore.authStatus = value);
  }

  ngOnInit(): void {
    // Check if the user already joined the jam session
    this.jamsessionService.getJamsession().subscribe(
      jamsession => {
        this.jamStore.jamsession = jamsession;
        this.getData();
      },
      () => {
        // Try to join the JamSession
        const body: JoinRequestBody = {
          label: this.route.snapshot.params.jamlabel
        };
        this.jamsessionService.joinJamSession(body).subscribe(() => {
          this.jamsessionService.getJamsession().subscribe(
            jamsession => {
              this.jamStore.jamsession = jamsession;
              this.getData();
            },
            () => this.leaveOnError());
        }, () => this.leaveOnError());
      });
  }

  leaveOnError(): void {
    this.notificationService.show(new Notification('JamSession not found').addHeader('Not found', 'error_outline').setAutohide(5000).setLevel(2));
    this.router.navigate(['/']);
  }

  getData(): void {

    this.jamsessionService.getPlayback().subscribe(
      playback => this.jamStore.playback = playback);

    this.queueApi.getQueue().subscribe(
      queue => this.queueStore.queue = queue);

    this.websocketService.socket.asObservable().subscribe(
      message => this.websocketHandler(message),
      error => console.error(error),
      () => console.log('closed'));

  }

  websocketHandler(wsMessage): void {
    switch (wsMessage.event) {
      case 'queue':
        const queuePayload: SocketQueueMessage = wsMessage.message as SocketQueueMessage;
        this.queueStore.queue.tracks = this.queueService.updateQueueFromSocket(queuePayload.tracks);
        break;
      case 'playback':
        const playbackPayload: SocketPlaybackMessage = wsMessage.message as SocketPlaybackMessage;
        this.jamStore.playback = playbackPayload;
        break;
      case 'close':
        switch (wsMessage.message) {
          case 'host':
            this.notificationService.show(new Notification('Your JamSession was closed by the host').setLevel(2).addHeader('JamSession closed', 'exit_to_app').addCloseFunction(() => {
              this.router.navigate(['/']);
            }));
            break;
          case  'inactivity':
            this.notificationService.show(new Notification('Your JamSession was closed due to inactivity').setLevel(2).addHeader('JamSession closed', 'exit_to_app').addCloseFunction(() => {
              this.router.navigate(['/']);
            }));
            break;
        }
        break;
      default:
        console.error('unknown event');
    }
  }

  ngOnDestroy(): void {
    this.websocketService.close();
  }
}
