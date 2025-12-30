import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser: User | null = null;

  login(role: User['role']) {
    // Backend auth is simplified in this project
    this.currentUser = {
      id: 1,
      role
    };
  }

  logout() {
    this.currentUser = null;
  }

  getRole(): User['role'] | null {
    return this.currentUser?.role || null;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
}
