import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  selectedRole: 'ATTENDEE' | 'ORGANIZER' = 'ATTENDEE';

  constructor(private router: Router) {}

  selectRole(role: 'ATTENDEE' | 'ORGANIZER') {
    this.selectedRole = role;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  submitForm() {
    // later: connect backend API
    console.log('Signup submitted');
  }
}
