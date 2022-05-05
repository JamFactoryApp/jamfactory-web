import {Injectable} from '@angular/core';

import {QueueHttpService} from '../http/queue.http.service';
import {QueueStore} from '../stores/queue.store';
import {MemberStore} from '../stores/member.store';

export const PermissionHost = 'Host';
export const PermissionGuest = 'Guest';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {


  constructor(private memberStore: MemberStore) {
  }

  hasPermission(permission: string): boolean {
    return this.memberStore.currentMember?.permissions.includes(PermissionHost)
  }

  get Host(): string {
    return PermissionHost;
  }

  get Guest(): string {
    return PermissionGuest;
  }
}


