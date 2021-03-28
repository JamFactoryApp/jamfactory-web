import {Component, Input, OnInit} from '@angular/core';
import {JamAuthStatus, JoinRequestBody} from 'jamfactory-types';
import {FormControl} from '@angular/forms';
import {AuthHttpService} from '../../../core/http/auth.http.service';
import {JamsessionHttpService} from '../../../core/http/jamsession.http.service';
import {Router} from '@angular/router';
import {AuthStore} from '../../../core/stores/auth.store';

@Component({
  selector: 'app-initiation',
  templateUrl: './initiation.component.html',
  styleUrls: ['./initiation.component.scss']
})
export class InitiationComponent implements OnInit {
  labelField = new FormControl('');
  wrong = false;

  constructor(
    private authService: AuthHttpService,
    private jamsessionService: JamsessionHttpService,
    private router: Router,
    public authStore: AuthStore
  ) { }

  ngOnInit(): void {
  }

  login(): void {
    this.authService.getLogin().subscribe(value => {
      this.wrong = false;
      window.location.href = value.url;
    }, error => {
      this.wrong = true;
    });
  }

  create(): void {
    this.jamsessionService.createJamsession().subscribe(value => {
      this.router.navigate(['/jam/' + value.label]);
    });
  }

  join(): void {
    const body: JoinRequestBody = {
      label: this.labelField.value
    };
    this.jamsessionService.joinJamSession(body).subscribe(value => {
      this.router.navigate(['/jam/' + value.label]);
    }, error1 => {
      this.wrong = true;
    });
  }

}
