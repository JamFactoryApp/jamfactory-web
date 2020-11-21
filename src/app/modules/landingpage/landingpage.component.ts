import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/http/auth.service';
import {Router} from '@angular/router';
import {JamsessionService} from '../../core/http/jamsession.service';
import { FormControl} from '@angular/forms';
import {JoinRequestBody, JamAuthStatus} from 'jamfactory-types';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {

  public authStatus: JamAuthStatus = this.auth.defaultStatus;

  labelField = new FormControl('');
  wrong = false;

  constructor(
    private auth: AuthService,
    private jam: JamsessionService,
    private router: Router
  ) {
    this.auth.getCurrent().subscribe(value => this.authStatus = value);
  }

  ngOnInit(): void {
    this.auth.getCurrent().subscribe(value => {
      this.authStatus = value;
      this.checkForRedirect();
    });
  }

  login(): void {
    this.auth.getLogin().subscribe(value => {
      this.wrong = false;
      window.location.href = value.url;
    }, error => {
      this.wrong = true;
    });
  }

  checkForRedirect(): void {
    if (this.authStatus.label) {

      this.jam.getJamsession().subscribe(value => {
        this.router.navigate(['/' + this.authStatus.label]);
      });
    }
  }

  create(): void {
    this.jam.createJamsession().subscribe(value => {
      this.router.navigate(['/' + value.label]);
    });
  }

  join(): void {
    const body: JoinRequestBody = {
      label: this.labelField.value
    };
    this.jam.joinJamSession(body).subscribe(value => {
      this.router.navigate(['/' + value.label]);
    }, error1 => {
      this.wrong = true;
    });
  }

}
