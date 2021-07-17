import {Component, OnInit} from '@angular/core';
import {JoinRequestBody} from '@jamfactoryapp/jamfactory-types';
import {FormControl} from '@angular/forms';
import {AuthHttpService} from '../../../core/http/auth.http.service';
import {JamsessionHttpService} from '../../../core/http/jamsession.http.service';
import {Router} from '@angular/router';
import {AuthStore} from '../../../core/stores/auth.store';
import {NotificationService} from '../../../core/services/notification.service';

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
    public authStore: AuthStore,
    private notificationService: NotificationService
  ) {
  }

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
      this.notificationService.clearAll();
      this.router.navigate(['/jam/' + value.label]);
    });
  }

  input(event: KeyboardEvent): void {
    this.wrong = false;
    if (this.labelField.value.length === 5 && event.key === 'Enter') {
      this.join();
    }
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
