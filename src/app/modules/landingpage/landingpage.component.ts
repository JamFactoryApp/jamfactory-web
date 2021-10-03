import {Component, OnInit} from '@angular/core';
import {AuthHttpService} from '../../core/http/auth.http.service';
import {Router} from '@angular/router';
import {JamsessionHttpService} from '../../core/http/jamsession.http.service';
import {UserStore} from '../../core/stores/user.store';
import {JamsessionStore} from '../../core/stores/jamsession.store';
import {Notification, NotificationService} from '../../core/services/notification.service';
import {UserHttpService} from '../../core/http/user.http.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {

  constructor(
    private user: UserHttpService,
    private jam: JamsessionHttpService,
    private router: Router,
    private userStore: UserStore,
    private jamStore: JamsessionStore,
    private notificationService: NotificationService
  ) {
    this.user.getCurrentUser().subscribe(value => {
      userStore.currentUser = value;
      if (value.spotify_authorized && value.joined_label === '' && !this.userStore.showedAuthSuccess) {
        this.notificationService.show(new Notification('You are authorized by Spotify').setLevel(1).addHeader('Spotify login success', 'verified_user').setAutohide(5000));
        this.userStore.showedAuthSuccess = true;
      }
    });
  }

  ngOnInit(): void {
    this.userStore.$currentUser.subscribe((value) => {
      this.checkForRedirect();
    });
    this.notificationService.clearPersistent();
  }

  checkForRedirect(): void {
    if (this.userStore.currentUser.joined_label) {

      this.jam.getJamsession().subscribe(value => {
        this.jamStore.jamSession = value;
        this.router.navigate(['/jam/' + this.userStore.currentUser.joined_label]);
      }, error => {
      });
    }
  }
}
