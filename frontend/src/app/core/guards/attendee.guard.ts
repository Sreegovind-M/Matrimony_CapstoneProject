import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AttendeeGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): boolean {
    const user = this.authService.getCurrentUser();
    const role = user?.role?.toUpperCase();

    // Allow both ATTENDEE and ORGANIZER to access event pages
    if (role === 'ATTENDEE' || role === 'ORGANIZER') {
      return true;
    }

    console.log('AttendeeGuard - Access denied for role:', role);
    this.router.navigate(['/unauthorized']);
    return false;
  }
}

