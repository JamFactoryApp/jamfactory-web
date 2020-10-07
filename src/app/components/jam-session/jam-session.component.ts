import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {JamsessionService} from '../../services/jamsession.service';
import {QueueService} from '../../services/queue.service';
import {SpotifyService} from '../../services/spotify.service';
import * as io from 'socket.io-client';
import {environment} from '../../../environments/environment';
import JamResponse = JamFactoryApi.JamResponse;
import PlaybackBody = JamFactoryApi.PlaybackBody;
import SongWithoutId = JamFactoryApi.SongWithoutId;
import GetQueueResponse = JamFactoryApi.GetQueueResponse;
import GetJamPlaybackResponse = JamFactoryApi.GetJamPlaybackResponse;
import GetAuthCurrentResponse = JamFactoryApi.GetAuthCurrentResponse;
import PutQueueVoteRequest = JamFactoryApi.PutQueueVoteRequest;

@Component({
  selector: 'app-jam-session',
  templateUrl: './jam-session.component.html',
  styleUrls: ['./jam-session.component.scss']
})
export class JamSessionComponent implements OnInit, OnDestroy{
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private jamsessionService: JamsessionService,
    private queueService: QueueService,
    private spotifyService: SpotifyService
  ) {
  }

  jamSession: JamResponse;
  current: GetAuthCurrentResponse;
  playback: PlaybackBody;
  queue: SongWithoutId[] = [];
  socket: SocketIOClient.Socket;

  ngOnInit(): void {
    this.jamsessionService.getJamsession().subscribe(value => {
      this.jamSession = value;
    });
    this.jamsessionService.getPlayback().subscribe(value => {
      this.playback = value;
    });
    this.authService.getCurrent().subscribe(value => {
      this.current = value;
    });
    this.queueService.getQueue().subscribe(value => {
      this.updateQueueFromSocket(value.queue);
    });
    this.connectSocket();
  }

  connectSocket(): void {
    this.socket = io.connect(environment.JAMFACTORY_API_URL);
    this.socket.on('queue', (msg: GetQueueResponse) => {
      this.queue = msg.queue;
      console.log(msg);
    });
    this.socket.on('playback', (msg: GetJamPlaybackResponse) => {
      this.playback = msg;
    });
    this.socket.on('close', (msg: any) => {
      console.log(msg);
    });
  }

  updateQueueFromSocket(queue: SongWithoutId[]): void {

    this.queue = queue.map( (q) => {
      let voted = false;
      this.queue.forEach( value => {
        if (value.spotifyTrackFull.uri === q.spotifyTrackFull.uri) {
          voted = value.voted;
        }
      });
      q.voted = voted;
      return q;
    });
  }

  vote(body: PutQueueVoteRequest): void {
    this.queueService.putQueueVote(body).subscribe(response => {
      this.queue = response.queue;
    });
  }


  ngOnDestroy(): void {
    this.closeSocket();
  }

  closeSocket(): void {
    this.socket.close();
  }


}
