import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  role: 'ATTENDEE' | 'ORGANIZER' | 'ADMIN' = 'ATTENDEE';
  email = '';
  password = '';
  isPasswordVisible = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    this.authService.login(this.role);

    if (this.role === 'ATTENDEE') {
      this.router.navigate(['/events']);
    } else if (this.role === 'ORGANIZER') {
      this.router.navigate(['/organizer/dashboard']);
    } else {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
