import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { getUserType } from './authManager';

@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url: string = state.url;
    return this.isUserAdmin(url);
  }

  isUserAdmin(url: string) {
    if ((getUserType() == 'ADMIN')) {
      return true;
    }

    this.authService.redirectUrl = url;
    this.router.navigate(['/pages/resources/index'], {queryParams: { returnUrl: url }} );
  }
  
}
