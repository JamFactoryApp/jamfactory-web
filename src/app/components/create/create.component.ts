import {Component, OnInit} from '@angular/core';
import {JamsessionHttpService} from '../../core/http/jamsession.http.service';
import {Router} from '@angular/router';
import {ModalService} from '../../core/services/modal.service';
import {UserStore} from '../../core/stores/user.store';
import {UserHttpService} from '../../core/http/user.http.service';
import {createAlreadyMemberModal} from '../../core/static/modals';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  constructor(
    private jamSessionService: JamsessionHttpService,
    private router: Router,
    private modal: ModalService,
    private userStore: UserStore,
    private userService: UserHttpService
  ) {
    this.userService.getCurrentUser().subscribe(value => userStore.currentUser = value);
  }

  ngOnInit(): void {
    // Let's try to create a new JamSession for the current user
    this.jamSessionService.createJamSession().subscribe(jamSession => {
      // Successfully created a new JamSession. Redirect to the JamSession component
      this.router.navigate(['jam', jamSession.label]).then();
    }, error => {
      // Could not create a new JamSession
      if (error.error === 'already member') {
        // The user is already host or member of another JamSession.
        // Create already member modal, asking the user to leave
        this.modal.add(createAlreadyMemberModal(this));
      } else {
        // Unspecified error occurred. Redirect to landing-page with the error in the url
        this.router.navigate(['jam'], {queryParams: {error: error.error}});
      }
    });
  }


}
