import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

interface Event {
    id: number;
    name: string;
    description: string;
    venue: string;
    venue_address?: string;
    date_time: string;
    category_name?: string;
    organizer_name?: string;
    ticket_price: number;
    capacity: number;
    tickets_booked?: number;
    image_url?: string;
}

@Component({
    selector: 'app-public-event',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './public-event.component.html',
    styleUrls: ['./public-event.component.css']
})
export class PublicEventComponent implements OnInit {
    event: Event | null = null;
    loading = true;
    error = '';

    private apiUrl = '/api';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        const eventId = this.route.snapshot.paramMap.get('id');
        if (eventId) {
            this.loadEvent(+eventId);
        } else {
            this.error = 'Invalid event ID';
            this.loading = false;
        }
    }

    loadEvent(eventId: number): void {
        this.http.get<Event>(`${this.apiUrl}/events/public/${eventId}`).subscribe({
            next: (event) => {
                this.event = event;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading event:', err);
                this.error = 'Event not found or not available';
                this.loading = false;
            }
        });
    }

    get availableSeats(): number {
        if (!this.event) return 0;
        return this.event.capacity - (this.event.tickets_booked || 0);
    }

    get isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    bookNow(): void {
        if (!this.event) return;

        if (this.isLoggedIn) {
            // User is logged in, go to ticket booking page
            this.router.navigate(['/events', this.event.id, 'book']);
        } else {
            // User not logged in, redirect to login with return URL
            this.router.navigate(['/login'], {
                queryParams: { returnUrl: `/events/${this.event.id}/book` }
            });
        }
    }

    goHome(): void {
        this.router.navigate(['/']);
    }
}

