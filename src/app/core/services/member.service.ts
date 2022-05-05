import {Injectable} from '@angular/core';
import {MemberStore} from "../stores/member.store";
import {JamsessionHttpService} from "../http/jamsession.http.service";
import {SetJamSessionMembersRequestBody} from "@jamfactoryapp/jamfactory-types";

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(
    public memberStore: MemberStore,
    public jamsessionService: JamsessionHttpService
  ) {
  }

  makeMemberAdmin(identifier: string): void {
    let members = this.memberStore.members;
    members.forEach((m) => {
      if (m.identifier == identifier) {
        if (!m.permissions.includes("Admin")) {
          m.permissions.push('Admin');
        }
      }
    });

    const body: SetJamSessionMembersRequestBody = {
      members: members
    };

    this.jamsessionService.setMembers(body).subscribe((member) => {
      this.memberStore.members = member.members;
    });
  }

  removeMemberAdmin(identifier: string): void {
    let members = this.memberStore.members;
    members.forEach((m) => {
      if (m.identifier == identifier) {
        if (m.permissions.includes("Admin")) {
          m.permissions.splice(m.permissions.indexOf("Admin"), 1);
        }
      }
    });

    const body: SetJamSessionMembersRequestBody = {
      members: members
    };

    this.jamsessionService.setMembers(body).subscribe((member) => {
      this.memberStore.members = member.members;
    });
  }

  removeMember(identifier: string): void {
    let members = this.memberStore.members;
    members.forEach((m, index, object) => {
      if (m.identifier == identifier) {
        object.splice(index, 1);
      }
    });

    const body: SetJamSessionMembersRequestBody = {
      members: members
    };

    this.jamsessionService.setMembers(body).subscribe((member) => {
      this.memberStore.members = member.members;
    });
  }
}
