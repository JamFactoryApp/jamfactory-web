import {Modal} from '../services/modal.service';

export function createAlreadyMemberModal(ctx: any): Modal {
  // Create modal asking the user to leave his current JamSession and create a new one.
  const modal: Modal = {
    header: 'Already Member',
    message: 'You are already a member of a JamSession. Do you want to leave your current one and create a new?',
    buttons: [{text: 'Ok', level: 1}, {text: 'Cancel', level: 2}],
    placeholder: '',
    withInput: false,
    label: '',
    callback: (btn: string, _: string) => {
      if (btn === 'Ok') {
        // User want to leave his current JamSession
        ctx.jamSessionService.leaveJamSession().subscribe(leaveSuccess => {
          // Successfully left the JamSession. Let's create a new one
          ctx.jamSessionService.createJamSession().subscribe(jamSession => {
            // Successfully created a new JamSession. Redirect to the JamSession component
            ctx.router.navigate([jamSession.label]);
          }, error => {
            ctx.router.navigate([''], {queryParams: {error: error.error, label: this.route.snapshot.params.jamlabel}});
          });
        });
      } else {
        // Cancel the action and redirect to users current JamSession
        ctx.router.navigate([ctx.userStore.currentUser.joined_label]).then(nav => {
        });
      }
    }
  };
  return modal;
}

export function createJoinModal(ctx: any): Modal {
  const modal: Modal = {
    header: 'Password',
    message: 'This JamSession requires a password to enter',
    buttons: [{text: 'Enter', level: 0}],
    placeholder: '',
    withInput: true,
    label: 'Password',
    callback: (btn: string, password: string) => ctx.joinWithPassword(password)
  };
  return modal;
}

export function createCloseModal(ctx: any, reason: string): Modal {
  const modal: Modal = {
    header: 'JamSession closed',
    message: 'Your JamSession was closed ' + reason,
    buttons: [{text: 'Leave', level: 0}],
    placeholder: '',
    withInput: false,
    label: '',
    callback: (btn: string, _: string) => ctx.router.navigate([''])
  };
  return modal;
}
