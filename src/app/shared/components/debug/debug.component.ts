import {Component, OnInit} from '@angular/core';
import {AuthHttpService} from '../../../core/http/auth.http.service';
import {Router} from '@angular/router';
import {JamsessionHttpService} from '../../../core/http/jamsession.http.service';
import {QueueHttpService} from '../../../core/http/queue.http.service';
import {SpotifyHttpService} from '../../../core/http/spotify.http.service';
import {FormBuilder} from '@angular/forms';
import {WebsocketService} from '../../../core/socket/websocket.service';
import * as JamFactoryApi from '@jamfactoryapp/jamfactory-types';
import {JamIpVoting, JamSessionVoting} from '@jamfactoryapp/jamfactory-types';

@Component({
  selector: 'app-landing-page',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit {
  authCurrent: JamFactoryApi.AuthCurrentResponseBody;

  jam: JamFactoryApi.GetJamSessionResponseBody;
  jamPut: JamFactoryApi.CreateJamSessionResponseBody;
  jamPlayback: JamFactoryApi.GetPlaybackResponseBody;
  jamPlaybackPut: JamFactoryApi.GetPlaybackRequestBody;
  jamCreate: JamFactoryApi.CreateJamSessionResponseBody;
  jamJoin: JamFactoryApi.JoinResponseBody;
  jamLeave: JamFactoryApi.LeaveJamSessionResponseBody;

  queue: JamFactoryApi.GetQueueResponseBody;
  queueVotePut: JamFactoryApi.VoteResponseBody;
  queuePlaylistPut: JamFactoryApi.AddCollectionResponseBody;

  spotifyDevices: JamFactoryApi.UserDevicesResponseBody;
  spotifyPlaylists: JamFactoryApi.UserPlaylistsResponseBody;
  spotifySearch: JamFactoryApi.SpotifySearchResponseBody;

  socketPlaybackMsg;
  socketQueueMsg;
  socketCloseMsg;

  hideSocketEvents = true;

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
    collection: [''],
    type: ['']
  });

  putSpotifySearchForm = this.fb.group({
    text: [''],
    type: ['']
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthHttpService,
    private jamsessionService: JamsessionHttpService,
    private queueService: QueueHttpService,
    private spotifyService: SpotifyHttpService,
    private websocketService: WebsocketService
  ) {
  }

  ngOnInit(): void {
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
      voting_type: this.putJamForm.value['ip_voting'] ? 'session_voting' : 'ip_voting'
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
    this.queueService.putQueueCollection({
      collection: this.putQueuePlaylistForm.value['collection'],
      type: this.putQueuePlaylistForm.value['type']
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

  connectSocket(): void {
    this.websocketService.connect();
    this.websocketService.socket.asObservable().subscribe(
      value => {
        switch (value.event) {
          case 'queue':
            this.socketQueueMsg = value;
            break;
          case 'playback':
            this.socketPlaybackMsg = value;
            break;
          case 'close':
            this.socketCloseMsg = value;
            break;
          default:
            console.error('unknown event');
        }
      },
      error => console.error(error),
      () => console.log('closed')
    );
  }

  disconnectSocket(): void {
    this.websocketService.close();
  }

  socketDefined(): boolean {
    return this.websocketService.socket !== undefined;
  }

  socketConnected(): boolean {
    return this.websocketService.connected();
  }
}
