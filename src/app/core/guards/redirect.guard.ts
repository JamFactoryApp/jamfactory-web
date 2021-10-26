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
      let query = '?';
      route.queryParamMap.keys.forEach(key => {
        query += key + '=' + route.queryParamMap.get(key) + '&';
      });
      query = query.slice(0, query.length - 1);

      window.location.href = encodeURI(route.data.externalUrl + query);
      return true;
    }
    return false;
  }
}

