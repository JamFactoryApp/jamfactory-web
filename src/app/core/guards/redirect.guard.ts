import {Component, Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';

@Component({
  template: ''
})
@Injectable({
  providedIn: 'root'
})
// tslint:disable-next-line:component-class-suffix
export class RedirectGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (route.data.externalUrl) {
      window.location.href = route.data.externalUrl;
      return true;
    }
    return false;
  }
}

