import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {JamsessionService} from '../../services/jamsession.service';
import {QueueServiceService} from '../../services/queue-service.service';
import {SpotifyServiceService} from '../../services/spotify-service.service';
import {FormBuilder} from '@angular/forms';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-landing-page',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit {
  authCurrent: JamFactoryApi.GetAuthCurrentResponse;

  jam: JamFactoryApi.GetJamResponse;
  jamPut: JamFactoryApi.GetJamCreateResponse;
  jamPlayback: JamFactoryApi.GetJamPlaybackResponse;
  jamPlaybackPut: JamFactoryApi.PutPlaybackResponseBody;
  jamCreate: JamFactoryApi.GetJamCreateResponse;
  jamJoin: JamFactoryApi.PutJamJoinResponse;
  jamLeave: JamFactoryApi.GetJamLeaveResponse;

  queue: JamFactoryApi.GetQueueResponse;
  queueVotePut: JamFactoryApi.PutQueueVoteResponse;
  queuePlaylistPut: JamFactoryApi.PutQueuePlaylistResponse;

  spotifyDevices: JamFactoryApi.GetSpotifyDevicesResponse;
  spotifyPlaylists: JamFactoryApi.GetSpotifyPlaylistsResponse;
  spotifySearch: JamFactoryApi.PutSpotifySearchResponse;

  putJamForm = this.fb.group({
    name: [''],
    active: [''],
    ip_voting: ['']
  });

  putJamPlaybackForm = this.fb.group({
    playing: [''],
    device_id: ['']
  });

  putJamJoinForm = this.fb.group({
    label: ['']
  });

  putQueueVoteForm = this.fb.group({
    track: ['']
  });

  putQueuePlaylistForm = this.fb.group({
    playlist: ['']
  });

  putSpotifySearchForm = this.fb.group({
    text: [''],
    type: ['']
  });

  socket: SocketIOClient.Socket;
  socketFlag = true;
  socketPlaybackMsg : string;
  socketQueueMsg: string;
  socketCloseMsg: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private jamsessionService: JamsessionService,
    private queueService: QueueServiceService,
    private spotifyService: SpotifyServiceService
  ) {
  }

  ngOnInit(): void {
  }

  connectSocket(): void {
    this.socket = io.connect('http://localhost:3000');
    this.socket.on('queue', (msg: any) => {
      this.socketQueueMsg = msg;
    });
    this.socket.on('playback', (msg: any) => {
      this.socketPlaybackMsg = msg;
    });
    this.socket.on('close', (msg: any) => {
      this.socketCloseMsg = msg;
    });
  }

  disconnectSocket(): void {
    this.socket.close();
  }

  getAuthCurrent(): void {
    this.authService.getCurrent().subscribe(data => this.authCurrent = data);
  }

  getAuthLogin(): void {
    this.authService.getLogin().subscribe(data => window.location.href = data.url);
  }

  getAuthLogout(): void {
    this.authService.getLogout();
  }

  getJam(): void {
    this.jamsessionService.getJamsession().subscribe(data => this.jam = data);
  }

  putJam(): void {
    this.jamsessionService.putJamsession({
      name: this.putJamForm.value['name'],
      active: this.putJamForm.value['active'],
      ip_voting: this.putJamForm.value['ip_voting']
    }).subscribe(data => this.jamPut = data);
  }

  getJamPlayback(): void {
    this.jamsessionService.getPlayback().subscribe(data => this.jamPlayback = data);
  }

  putJamPlayback(): void {
    this.jamsessionService.putPlayback({
      playing: this.putJamPlaybackForm.value['playback'],
      device_id: this.putJamPlaybackForm.value['playback']
    }).subscribe(data => this.jamPlaybackPut = data);
  }

  getJamCreate(): void {
    this.jamsessionService.createJamsession().subscribe(data => this.jamCreate = data);
  }

  putJamJoin(): void {
    this.jamsessionService.joinJamSession({
      label: this.putJamJoinForm.value['label']
    }).subscribe(data => this.jamJoin = data);
  }

  getJamLeave(): void {
    this.jamsessionService.leaveJamSession().subscribe(data => this.jamLeave = data);
  }

  getQueue(): void {
    this.queueService.getQueue().subscribe(data => this.queue = data);
  }

  putQueueVote(): void {
    this.queueService.putQueueVote({
      track: this.putQueueVoteForm.value['track']
    }).subscribe(data => this.queueVotePut = data);
  }

  putQueuePlaylist(): void {
    this.queueService.putQueuePlaylist({
      playlist: this.putQueuePlaylistForm.value['playlist']
    }).subscribe(data => this.queuePlaylistPut = data);
  }

  getSpotifyDevices(): void {
    this.spotifyService.getDevices().subscribe(data => this.spotifyDevices = data);
  }

  getSpotifyPlaylists(): void {
    this.spotifyService.getPlaylists().subscribe(data => this.spotifyPlaylists = data);
  }

  putSpotifySearch(): void {
    this.spotifyService.putSearch({
      text: this.putSpotifySearchForm.value['text'],
      type: this.putSpotifySearchForm.value['type']
    }).subscribe(data => this.spotifySearch = data);
  }
}