import {Component, OnInit} from '@angular/core';
import {AuthHttpService} from '../../core/http/auth.http.service';
import {Router} from '@angular/router';
import {JamsessionHttpService} from '../../core/http/jamsession.http.service';
import {AuthStoreService} from '../../core/stores/auth.store.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {

  constructor(
    private auth: AuthHttpService,
    private jam: JamsessionHttpService,
    private router: Router,
    private authStore: AuthStoreService
  ) {
    this.auth.getCurrent().subscribe(value => authStore.authStatus = value);
  }

  ngOnInit(): void {
    this.authStore.authStatusObs.subscribe(() => {
      this.checkForRedirect();
    });
  }

  checkForRedirect(): void {
    if (this.authStore.authStatus.label) {

      this.jam.getJamsession().subscribe(value => {
        this.router.navigate(['/' + this.authStore.authStatus.label]);
      });
    }
  }
}
