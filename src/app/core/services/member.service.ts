import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor() { }

  makeMemberAdmin(identifier: string): void {
    console.log(identifier);
  }

  removeMemberAdmin(identifier: string): void {
    console.log(identifier);
  }

  removeMember(identifier: string): void {
    console.log(identifier);
  }
}
