import {Component} from '@angular/core';
import {ViewStore} from "../../../core/stores/view.store";
import {MemberStore} from "../../../core/stores/member.store";
import {JamMember} from "@jamfactoryapp/jamfactory-types";

@Component({
  selector: 'app-sidebar-members',
  templateUrl: './sidebar-members.component.html',
  styleUrls: ['./sidebar-members.component.scss']
})
export class SidebarMembersComponent {

  constructor(
    public viewStore: ViewStore,
    public memberStore: MemberStore
  ) {
  }

  resetViews() {
    setTimeout(() => this.viewStore.menuSub = '', 10);
  }

  sortMembers(members: JamMember[]): JamMember[] {
    return members.sort((a, b) =>
      a.display_name.localeCompare(b.display_name) || <any>a.permissions.includes('Admin') - <any>b.permissions.includes('Admin')
    ).filter(
      member => !member.permissions.includes('Host')
    );
  }

}
