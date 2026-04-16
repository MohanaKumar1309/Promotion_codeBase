import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../shared/services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      const requiredRole = route.data['role'];
      const userRole = this.authService.getUserRole();

      if (requiredRole && userRole !== requiredRole) {
        this.router.navigate(['/login']);
        return false;
      }

      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
