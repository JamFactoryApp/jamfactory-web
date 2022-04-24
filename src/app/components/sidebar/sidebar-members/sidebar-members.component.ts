import {Component, OnInit} from '@angular/core';
import {ViewStore} from "../../../core/stores/view.store";
import {MemberStore} from "../../../core/stores/member.store";

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

  // ngOnInit(): void {
  // }

  resetViews() {
    setTimeout(() => this.viewStore.menuSub = '', 10);
  }

}
