import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  showPassword = false;
  errorMessage = '';
  isLoading = false;

  private returnUrl = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Get return URL from query params
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '';
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }

  login(): void {
    // Clear previous error
    this.errorMessage = '';

    // Validate inputs
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.user) {
          // Check if there's a return URL
          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            // Navigate based on user role from database
            const role = response.user.role;
            if (role === 'ATTENDEE') {
              this.router.navigate(['/events']);
            } else if (role === 'ORGANIZER') {
              this.router.navigate(['/organizer/dashboard']);
            } else if (role === 'ADMIN') {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.router.navigate(['/events']);
            }
          }
        } else {
          this.errorMessage = response.message || 'Login failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred. Please try again.';
        console.error('Login error:', error);
      }
    });
  }
}

