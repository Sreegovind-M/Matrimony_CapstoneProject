import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from '../../../core/models/booking.model';

@Component({
    selector: 'app-my-bookings',
    standalone: true,
    imports: [CommonModule, RouterModule, NavbarComponent],
    templateUrl: './my-bookings.component.html',
    styleUrl: './my-bookings.component.css'
})
export class MyBookingsComponent implements OnInit {
    bookings: Booking[] = [];
    loading = true;
    error = '';

    constructor(private bookingService: BookingService) { }

    ngOnInit(): void {
        this.loadBookings();
    }

    loadBookings(): void {
        this.loading = true;
        this.error = '';

        this.bookingService.getAllBookings().subscribe({
            next: (bookings) => {
                this.bookings = bookings;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load bookings';
                this.loading = false;
            }
        });
    }

    getStatusClass(status: string | undefined): string {
        switch (status?.toLowerCase()) {
            case 'confirmed':
                return 'status--confirmed';
            case 'pending':
                return 'status--pending';
            case 'cancelled':
                return 'status--cancelled';
            default:
                return '';
        }
    }

    formatDate(dateStr: string | undefined): string {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
