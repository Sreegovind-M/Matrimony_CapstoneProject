import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizerGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): boolean {
    const user = this.authService.getCurrentUser();
    const role = user?.role?.toUpperCase();

    console.log('OrganizerGuard - User:', user);
    console.log('OrganizerGuard - Role:', role);

    if (role === 'ORGANIZER') {
      return true;
    }

    console.log('OrganizerGuard - Access denied, redirecting to unauthorized');
    this.router.navigate(['/unauthorized']);
    return false;
  }
}

