import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {NotificationService} from './notification.service';
import {Modal, ModalService} from './modal.service';
import {Router} from '@angular/router';
import {JamsessionHttpService} from '../http/jamsession.http.service';

@Injectable({
  providedIn: 'root'
})

export class ErrorService {

  constructor(private notifications: NotificationService, private modal: ModalService, private router: Router, private jamService: JamsessionHttpService) {
  }

  handle(error: HttpErrorResponse, caught: Observable<any>): Observable<any> {

    const errorMessage = error.error.replace('\n', '');
    console.log(errorMessage);
    switch (errorMessage) {
      case 'wrong password':
        // Error handed in JamSession component
        return throwError(() => error);
      case 'already member':
        this.handleAlreadyHostError();
        return throwError(() => error);

    }

    // Default behaviour: Throw error
    this.router.navigate(['jam'], { queryParams: {error: error.error.replace('\n', '')}});
    return throwError(() => error);
  }


  handleAlreadyHostError(): void {
    const modal: Modal = {
      header: 'Already Host',
      message: 'You are already a host of a JamSession. Do you want to leave your current one and create a new?',
      buttons: [{text: 'Ok', level: 1}, {text: 'Cancel', level: 2}],
      placeholder: '',
      withInput: false,
      label: '',
      callback: (btn: string, _: string) => {
        if (btn === 'Ok') {
          this.jamService.leaveJamSession().subscribe(res => {
            this.router.navigate(['jam', 'create']);
          });
        } else {
          this.router.navigate(['jam', 'ABCDE']);
        }
      }
    };
    this.modal.add(modal);
  }
}
