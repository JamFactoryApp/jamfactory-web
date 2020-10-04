import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {JamsessionService} from '../../services/jamsession.service';
import {FormBuilder, FormControl} from '@angular/forms';
import LabelBody = JamFactoryApi.LabelBody;

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingpageComponent implements OnInit {
  public userStatus: string;
  public userLabel: string;
  public userAuthorized: boolean;

  labelField = new FormControl('');

  constructor(
    private auth: AuthService,
    private jam: JamsessionService,
    private router: Router,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.auth.getCurrent().subscribe(value => {
      this.userStatus = value.user;
      this.userLabel = value.label;
      this.userAuthorized = value.authorized;
      this.checkForRedirect();
    });
  }

  login(): void {
    this.auth.getLogin().subscribe(value => {
      window.location.href = value.url;
    });
  }

  checkForRedirect(): void {
    if (this.userLabel) {
      this.router.navigate(['/' + this.userLabel]);
    }
  }

  create(): void {
    this.jam.createJamsession().subscribe(value => {
      this.router.navigate(['/' + value.label]);
    });
  }

  join(): void {
    const body: LabelBody = {
      label: this.labelField.value
    }

    this.jam.joinJamSession(body).subscribe(value => {
      this.router.navigate(['/' + value.label]);
    });
  }
}
