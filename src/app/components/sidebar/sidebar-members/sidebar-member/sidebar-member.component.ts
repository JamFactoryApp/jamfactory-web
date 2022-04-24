import {Component, Input, OnInit} from '@angular/core';
import {JamMember} from "@jamfactoryapp/jamfactory-types";
import {MemberService} from "../../../../core/services/member.service";

@Component({
  selector: 'app-sidebar-member',
  templateUrl: './sidebar-member.component.html',
  styleUrls: ['./sidebar-member.component.scss']
})
export class SidebarMemberComponent {

  @Input()
  memberInfo: JamMember;

  public menuToggle = false;

  constructor(public memberService: MemberService) {
  }

  toggleMenu(): void {
    this.menuToggle = !this.menuToggle;
  }

  makeAdmin(): void {
    this.memberService.makeMemberAdmin(this.memberInfo.identifier);
  }

  removeAdmin(): void {
    this.memberService.removeMemberAdmin(this.memberInfo.identifier);
  }

  removeMember(): void {
    this.memberService.removeMember(this.memberInfo.identifier);
  }

}
