import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  role: 'ATTENDEE' | 'ORGANIZER' | 'ADMIN' | null = null;
  isMobileMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) {
    this.role = this.authService.getRole();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  logout(): void {
    this.closeMobileMenu();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToHome(): void {
    this.closeMobileMenu();
    if (this.role === 'ORGANIZER') {
      this.router.navigate(['/organizer/dashboard']);
    } else {
      this.router.navigate(['/events']);
    }
  }

  /**
   * IMPORTANT:
   * Automatically close mobile menu when switching to desktop
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }
}
