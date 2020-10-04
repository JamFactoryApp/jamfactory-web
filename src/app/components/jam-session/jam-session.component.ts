import { Component, OnInit } from '@angular/core';
import JamResponse = JamFactoryApi.JamResponse;
import SongWithoutId = JamFactoryApi.SongWithoutId;
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {JamsessionService} from '../../services/jamsession.service';
import {QueueServiceService} from '../../services/queue-service.service';
import {SpotifyServiceService} from '../../services/spotify-service.service';
import * as io from 'socket.io-client';
import GetQueueResponse = JamFactoryApi.GetQueueResponse;
import GetJamPlaybackResponse = JamFactoryApi.GetJamPlaybackResponse;
import PlaybackBody = JamFactoryApi.PlaybackBody;

@Component({
  selector: 'app-jam-session',
  templateUrl: './jam-session.component.html',
  styleUrls: ['./jam-session.component.scss']
})
export class JamSessionComponent implements OnInit {

  constructor( private router: Router,
               private fb: FormBuilder,
               private authService: AuthService,
               private jamsessionService: JamsessionService,
               private queueService: QueueServiceService,
               private spotifyService: SpotifyServiceService) { }

  jamSession: JamResponse;
  playback: PlaybackBody;
  queue: SongWithoutId[] = [];
  socket: SocketIOClient.Socket;

  ngOnInit(): void {
    this.jamsessionService.getJamsession().subscribe(value => {
      this.jamSession = value;
    });
    this.jamsessionService.getPlayback().subscribe(value => {
      this.playback = value;
    })
    this.queueService.getQueue().subscribe(value => {
      this.queue = value.queue;
    });
    this.connectSocket();
  }

  connectSocket(): void {
    this.socket = io.connect('http://localhost:3000');
    this.socket.on('queue', (msg: GetQueueResponse) => {
      this.queue = msg.queue;
    });
    this.socket.on('playback', (msg: GetJamPlaybackResponse) => {
      this.playback = msg;
      console.log(msg)
    });
    this.socket.on('close', (msg: any) => {
    });
  }

  closeSocket(): void {
    this.socket.close();
  }





}
