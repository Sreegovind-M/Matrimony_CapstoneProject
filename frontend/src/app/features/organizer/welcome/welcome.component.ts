import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-welcome',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
    userName = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        const user = this.authService.getCurrentUser();
        this.userName = user?.name || 'Organizer';
    }

    createFirstEvent(): void {
        this.router.navigate(['/organizer/create-event']);
    }

    exploreDashboard(): void {
        this.router.navigate(['/organizer/dashboard']);
    }
}
