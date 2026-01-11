import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  selectedRole: 'ATTENDEE' | 'ORGANIZER' = 'ATTENDEE';
  fullName = '';
  email = '';
  phone = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  selectRole(role: 'ATTENDEE' | 'ORGANIZER'): void {
    this.selectedRole = role;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  submitForm(): void {
    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validate inputs
    if (!this.fullName || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isLoading = true;

    this.authService.register({
      name: this.fullName,
      email: this.email,
      password: this.password,
      phone: this.phone,
      role: this.selectedRole
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.user) {
          this.successMessage = 'Account created successfully! Redirecting...';

          // Redirect based on role after a short delay
          setTimeout(() => {
            if (this.selectedRole === 'ORGANIZER') {
              // Organizers go to welcome/onboarding page
              this.router.navigate(['/organizer/welcome']);
            } else {
              // Attendees go directly to events page
              this.router.navigate(['/events']);
            }
          }, 1500);
        } else {
          this.errorMessage = response.message || 'Registration failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred. Please try again.';
        console.error('Registration error:', error);
      }
    });
  }
}
