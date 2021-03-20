import {Component, OnInit} from '@angular/core';
import {AuthHttpService} from '../../core/http/auth.http.service';
import {Router} from '@angular/router';
import {JamsessionHttpService} from '../../core/http/jamsession.http.service';
import {AuthStore} from '../../core/stores/auth.store';
import {JamsessionStore} from '../../core/stores/jamsession.store';

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
    private authStore: AuthStore,
    private jamStore: JamsessionStore
  ) {
    this.auth.getCurrent().subscribe(value => authStore.authStatus = value);
  }

  ngOnInit(): void {
    this.authStore.$authStatus.subscribe((value) => {
      this.checkForRedirect();
    });
  }

  checkForRedirect(): void {
    if (this.authStore.authStatus.label) {

      this.jam.getJamsession().subscribe(value => {
        this.jamStore.jamsession = value;
        this.router.navigate(['/jam/' + this.authStore.authStatus.label]);
      }, error => {});
    }
  }
}
