import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {AuthHttpService} from '../../core/http/auth.http.service';
import {JamsessionHttpService} from '../../core/http/jamsession.http.service';
import {QueueHttpService} from '../../core/http/queue.http.service';
import {SpotifyHttpService} from '../../core/http/spotify.http.service';
import {WebsocketService} from '../../core/services/websocket.service';
import {JamsessionStore} from '../../core/stores/jamsession.store';
import {QueueStore} from '../../core/stores/queue.store';
import {QueueService} from '../../core/services/queue.service';
import {UserStore} from '../../core/stores/user.store';
import {Notification, NotificationService} from '../../core/services/notification.service';
import {UserHttpService} from '../../core/http/user.http.service';

import {
  JoinRequestBody,
  SocketJamMessage,
  SocketMembersMessage,
  SocketPlaybackMessage,
  SocketQueueMessage
} from '@jamfactoryapp/jamfactory-types';
import {MemberStore} from '../../core/stores/member.store';
import {ViewStore} from '../../core/stores/view.store';
import {ModalService} from '../../core/services/modal.service';
import {createAlreadyMemberModal, createCloseModal, createJoinModal} from '../../core/static/modals';


@Component({
  selector: 'app-jam-session',
  templateUrl: './jamsession.component.html',
  styleUrls: ['./jamsession.component.scss']
})
export class JamsessionComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthHttpService,
    private userService: UserHttpService,
    private jamSessionService: JamsessionHttpService,
    private jamStore: JamsessionStore,
    private queueStore: QueueStore,
    private queueService: QueueService,
    private queueApi: QueueHttpService,
    private spotifyService: SpotifyHttpService,
    private websocketService: WebsocketService,
    private userStore: UserStore,
    private memberStore: MemberStore,
    public notificationService: NotificationService,
    public searchViewStore: ViewStore,
    private modal: ModalService
  ) {
    this.userService.getCurrentUser().subscribe(value => userStore.currentUser = value);
  }

  ngOnInit(): void {
    const label = this.route.snapshot.params.jamlabel;
    // Check if the user already joined the jam session specified in the url
    this.jamSessionService.getJamsession().subscribe(
      jamSession => {
        // User is already a member of a JamSession.
        // Compare url with response
        if (jamSession.label !== label) {
          // User wants to join a different JamSession
          this.modal.add(createAlreadyMemberModal(this));
        } else {
          // Correct JamSession. Load the Data.
          this.jamStore.jamSession = jamSession;
          this.getData();
        }
      },
      (error) => {
        // Try to join the JamSession
        this.joinWithPassword('');
      });
  }

  joinWithPassword(password: string): void {
    const body: JoinRequestBody = {
      label: this.route.snapshot.params.jamlabel,
      password
    };
    this.jamSessionService.joinJamSession(body).subscribe(() => {
      this.jamSessionService.getJamsession().subscribe(
        jamsession => {
          this.jamStore.jamSession = jamsession;
          this.getData();
        },
        (error) => this.handleJoinError(error));
    }, (error) => this.handleJoinError(error));
  }

  handleJoinError(error): void {
    if (error.error === 'wrong password\n') {
      this.modal.add(createJoinModal(this));
    } else {
      this.router.navigate([''], {queryParams: {error: error.error, label: this.route.snapshot.params.jamlabel}});
    }
  }

  getData(): void {
    setTimeout(() => {
      this.websocketService.connect((message) => this.websocketHandler(message));
    }, 2000);
    this.jamSessionService.getPlayback().subscribe(
      playback => this.jamStore.playback = playback);

    this.jamSessionService.getMembers().subscribe(
      members => this.memberStore.members = members.members);

    this.queueApi.getQueue().subscribe(
      queue => this.queueStore.queue = queue);

  }

  websocketHandler(wsMessage): void {
    switch (wsMessage.event) {
      case 'jam':
        const jamPayload: SocketJamMessage = wsMessage.message as SocketJamMessage;
        this.jamStore.jamSession = jamPayload;
        break;
      case 'queue':
        const queuePayload: SocketQueueMessage = wsMessage.message as SocketQueueMessage;
        this.queueStore.queue.tracks = this.queueService.updateQueueFromSocket(queuePayload.tracks);
        break;
      case 'playback':
        const playbackPayload: SocketPlaybackMessage = wsMessage.message as SocketPlaybackMessage;
        this.jamStore.playback = playbackPayload;
        break;
      case 'members':
        const membersPayload: SocketMembersMessage = wsMessage.message as SocketMembersMessage;
        this.memberStore.members = membersPayload.members;
        break;
      case 'close':
        switch (wsMessage.message) {
          case 'host':
            this.modal.add(createCloseModal(this, 'by the host'));
            break;
          case  'inactive':
            this.modal.add(createCloseModal(this, 'due to inactivity'));
            break;
          case 'warning':
            this.notificationService.show(new Notification('Inactivity warning').setLevel(2).setId(1));
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
