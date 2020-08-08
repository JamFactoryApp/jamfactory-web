import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {JamsessionService} from '../../services/jamsession.service';
import LoginResponseBody = JamFactoryApi.LoginResponseBody;
import CreateJamSessionResponseBody = JamFactoryApi.CreateJamSessionResponseBody;
import LeaveJamSessionResponseBody = JamFactoryApi.LeaveJamSessionResponseBody;
import GetPlaybackResponseBody = JamFactoryApi.GetPlaybackResponseBody;
import SetPlaybackResponseBody = JamFactoryApi.SetPlaybackResponseBody;

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  playback: Zmb3SpotifyApi.PlayerState;
  image;
  playing;

  constructor(
    private router: Router,
    private authService: AuthService,
    private jamsessionService: JamsessionService
  ) {
  }

  ngOnInit(): void {
  }

  login(): void {
    this.authService.login().subscribe((data: LoginResponseBody) =>
      window.location.href = data.url
    );
  }

  createParty(): void {
    this.jamsessionService.createJamsession().subscribe((data: CreateJamSessionResponseBody) =>
      window.alert(data.label)
    );
  }

  leaveParty(): void {
    this.jamsessionService.leaveJamSession().subscribe((data: LeaveJamSessionResponseBody) =>
      window.alert(data.success)
    );
  }

  refresh(): void {
    this.jamsessionService.getPlayback().subscribe((data: GetPlaybackResponseBody) => {
      this.playback = data.playback;
      this.image = data.playback.Item.album.images[1].url;
    });
  }

  togglePause(): void {
    this.jamsessionService.putPlayback({playing: false}).subscribe((data: SetPlaybackResponseBody) => {
      this.playing = data.playback.is_playing;
    });
  }

  togglePlay(): void {
    this.jamsessionService.putPlayback({playing: true}).subscribe((data: SetPlaybackResponseBody) => {
      this.playing = data.playback.is_playing;
    });
  }
}
