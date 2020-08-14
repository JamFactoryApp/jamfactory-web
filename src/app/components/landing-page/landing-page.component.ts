import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {JamsessionService} from '../../services/jamsession.service';
import {QueueServiceService} from '../../services/queue-service.service';
import {SpotifyServiceService} from '../../services/spotify-service.service';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  authCurrent: JamFactoryApi.StatusResponseBody;

  jam: JamFactoryApi.GetJamSessionResponseBody;
  jamPut: JamFactoryApi.CreateJamSessionResponseBody;
  jamPlayback: JamFactoryApi.GetPlaybackResponseBody;
  jamPlaybackPut: JamFactoryApi.SetPlaybackResponseBody;
  jamCreate: JamFactoryApi.CreateJamSessionResponseBody;
  jamJoin: JamFactoryApi.JoinResponseBody;
  jamLeave: JamFactoryApi.LeaveJamSessionResponseBody;

  queue: JamFactoryApi.GetQueueResponseBody;
  queueVotePut: JamFactoryApi.VoteQueueResponseBody;
  queuePlaylistPut: JamFactoryApi.PlaylistQueueResponseBody;

  spotifyDevices: JamFactoryApi.GetSpotifyDevicesResponseBody;
  spotifyPlaylists: JamFactoryApi.GetPlaylistsResponseBody;
  spotifySearch: JamFactoryApi.PutSearchResponseBody;

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
