import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
    imports: [CommonModule, FormsModule],
    templateUrl: './public-event.component.html',
    styleUrls: ['./public-event.component.css']
})
export class PublicEventComponent implements OnInit {
    event: Event | null = null;
    loading = true;
    error = '';

    // Booking form
    showBookingForm = false;
    bookingData = {
        name: '',
        email: '',
        phone: '',
        tickets: 1
    };
    bookingLoading = false;
    bookingSuccess = false;
    bookingError = '';
    confirmationCode = '';

    private apiUrl = 'http://localhost:3000/api';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient
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

    openBookingForm(): void {
        this.showBookingForm = true;
        this.bookingError = '';
    }

    closeBookingForm(): void {
        this.showBookingForm = false;
        this.bookingData = { name: '', email: '', phone: '', tickets: 1 };
        this.bookingError = '';
    }

    submitBooking(): void {
        if (!this.event) return;

        if (!this.bookingData.name || !this.bookingData.email) {
            this.bookingError = 'Please enter your name and email';
            return;
        }

        if (this.bookingData.tickets < 1 || this.bookingData.tickets > this.availableSeats) {
            this.bookingError = `Please select between 1 and ${this.availableSeats} tickets`;
            return;
        }

        this.bookingLoading = true;
        this.bookingError = '';

        const payload = {
            eventId: this.event.id,
            name: this.bookingData.name,
            email: this.bookingData.email,
            phone: this.bookingData.phone,
            tickets: this.bookingData.tickets
        };

        this.http.post<any>(`${this.apiUrl}/bookings/guest`, payload).subscribe({
            next: (response) => {
                this.bookingLoading = false;
                this.bookingSuccess = true;
                this.confirmationCode = response.confirmationCode;
                this.showBookingForm = false;

                // Update available seats
                if (this.event) {
                    this.event.tickets_booked = (this.event.tickets_booked || 0) + this.bookingData.tickets;
                }
            },
            error: (err) => {
                this.bookingLoading = false;
                this.bookingError = err.error?.message || 'Failed to complete booking. Please try again.';
            }
        });
    }

    goHome(): void {
        this.router.navigate(['/']);
    }
}
